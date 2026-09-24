import { UniFiClient } from 'unifi-api-ts';
import { resolvePort } from './config.js';
// Builds a ready-to-use UniFiClient for whichever connection method is configured:
//
// - userpass: unifi-api-ts's own cookie-session login against the console, plus the CSRF-token and MFA
//   handling the library is missing (see below). Works on UniFi OS consoles and legacy self-hosted controllers.
// - networkApiKey: a long-lived key created in the Network application under Integrations, sent as an
//   X-API-KEY header straight to the console. UniFi OS consoles only.
// - siteManagerApiKey: a key created at unifi.ui.com, sent as an X-API-KEY header to Ubiquiti's Site Manager
//   cloud connector (api.ui.com), which relays each request to the console. No local network access needed.
//
// All three reach the same legacy /api/s/{site}/... endpoints, so every action works the same regardless
// of method. The two key-based methods are stateless: no login call, no session to expire, and no
// X-Csrf-Token on state-changing requests (that's only required for cookie sessions).
const SITE_MANAGER_BASE_URL = 'https://api.ui.com';
// unifi-api-ts's HTTPClient declares this field `private` in its own types, but doesn't actually
// enforce that at runtime — casting through `unknown` is how we reach the real axios instance.
function getAxiosClient(unifi) {
    return unifi.getHttpClient().client;
}
// Error thrown by unifi-api-ts's HTTPClient carries the HTTP status (401, 408, ...) as `statusCode`.
function getStatusCode(error) {
    const statusCode = error?.statusCode;
    return typeof statusCode === 'number' ? statusCode : undefined;
}
// UniFi OS consoles (UDM/UDR/UDM Pro/Cloud Gateway, anything running UniFi OS rather than a standalone
// UniFi Network Controller) reject every state-changing request (POST/PUT/DELETE) with "Access forbidden"
// unless it carries an X-Csrf-Token header, echoed back from an earlier response. unifi-api-ts's HTTP
// client never reads or resends that header, so we reach into the axios instance it wraps internally and
// handle it ourselves: capture the token from every response, and attach it to every outgoing request.
function attachCsrfTokenHandling(unifi) {
    let csrfToken;
    const axiosClient = getAxiosClient(unifi);
    axiosClient.interceptors.request.use((config) => {
        if (csrfToken) {
            config.headers = { ...config.headers, 'X-Csrf-Token': csrfToken };
        }
        return config;
    });
    axiosClient.interceptors.response.use((response) => {
        const token = response.headers?.['x-csrf-token'];
        if (token) {
            csrfToken = token;
        }
        return response;
    });
}
// Both key-based methods authenticate every request with the same header; only the key and the host differ.
function attachApiKey(unifi, apiKey) {
    getAxiosClient(unifi).interceptors.request.use((config) => {
        config.headers = { ...config.headers, 'X-API-KEY': apiKey };
        return config;
    });
}
// True when unifi.login() failed because the account has multi-factor authentication (2FA/TOTP) turned
// on. Confirmed against real UniFi OS behavior (not guessed): a login attempt with no/invalid token gets
// rejected with HTTP 499 and a body of the form {meta: {msg: "api.err.Ubic2faTokenRequired"}} — unifi-api-ts's
// HTTPClient surfaces that meta.msg text as the thrown error's message, so we can match on it here.
function isMfaRequiredError(error) {
    const message = error instanceof Error ? error.message : String(error);
    return /ubic2fatokenrequired|2fa|mfa/i.test(message);
}
// unifi-api-ts has no concept of MFA at all — its login() always POSTs just {username, password}, with
// no field for a TOTP code and no handling of the 499 challenge above. This replays that same login POST
// by hand, through the same axios instance (so it shares its cookie jar and the CSRF interceptor already
// attached by attachCsrfTokenHandling), but with the extra `token` field UniFi OS expects for the second,
// MFA-completing attempt. On success it hand-writes the library's internal session state to "authenticated"
// (see SessionManagerLike above) so every later action/inventory call just works through the normal API.
async function completeMfaLogin(unifi, username, password, mfaToken) {
    // Throws on any non-2xx response (axios's default), e.g. a wrong/expired code — that rejection
    // propagates straight up to connectToUnifi()'s catch block, same as any other login failure.
    await getAxiosClient(unifi).post('/api/auth/login', {
        username,
        password,
        token: mfaToken,
        remember: false,
        strict: true,
    });
    const sessionManager = unifi.getSessionManager();
    sessionManager.sessionInfo = {
        isAuthenticated: true,
        loginTime: new Date(),
        lastActivity: new Date(),
        username,
    };
}
async function connectWithUserPass(config, secrets) {
    const unifi = new UniFiClient({
        baseUrl: `https://${config.host}:${resolvePort(config)}`,
        username: config.username,
        password: secrets.password,
        site: config.site || 'default',
        verifySsl: config.verifySsl,
    });
    attachCsrfTokenHandling(unifi);
    try {
        await unifi.login();
    }
    catch (error) {
        if (!isMfaRequiredError(error)) {
            throw error;
        }
        // Plain login was rejected specifically because this account needs an MFA code. If one was
        // supplied, replay the login with it attached; otherwise fail with a message that tells the
        // user exactly what to do, instead of surfacing the console's raw "Ubic2faTokenRequired".
        if (!secrets.mfaToken) {
            throw new Error('This account requires a multi-factor authentication code. Enter the current 6-digit code ' +
                'from your authenticator app in the "MFA / TOTP Code" config field and save the connection.', { cause: error });
        }
        await completeMfaLogin(unifi, config.username, secrets.password, secrets.mfaToken);
    }
    return unifi;
}
// Shared by both key-based methods. There's no login step to tell us whether the key is good, so this makes
// one real request up front: a bad or revoked key, an offline console, or a site name that doesn't exist
// fails here with a readable message, instead of on the first button press.
async function connectWithApiKey(baseUrl, apiKey, config, describeError) {
    const unifi = new UniFiClient({
        baseUrl,
        // unifi-api-ts's constructor refuses to build a client without these, but they're only ever read by
        // login(), which the key-based methods never call. Placeholders keep the validation happy.
        username: 'api-key',
        password: 'api-key',
        site: config.site || 'default',
        verifySsl: config.verifySsl,
    });
    attachApiKey(unifi, apiKey);
    try {
        await unifi.listDevices();
    }
    catch (error) {
        const friendly = describeError(getStatusCode(error));
        if (friendly) {
            throw new Error(friendly, { cause: error });
        }
        throw error;
    }
    return unifi;
}
export async function createUnifiClient(config, secrets) {
    // unifi-api-ts turns off TLS verification by setting NODE_TLS_REJECT_UNAUTHORIZED=0 for the whole process
    // when verifySsl is false, and never turns it back on. Clear it first so switching methods (or ticking
    // "Verify SSL Certificate") in the same Companion session actually takes effect.
    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    // Connections configured before the connection-method dropdown existed have no authMethod; upgrades.ts
    // fills it in, but fall back here too so a missing value never means "no way to connect".
    const authMethod = config.authMethod ?? 'userpass';
    switch (authMethod) {
        case 'userpass':
            return connectWithUserPass(config, secrets);
        case 'networkApiKey': {
            const apiKey = secrets.apiKey?.trim();
            if (!apiKey) {
                throw new Error('No Network API key configured. Create one in the UniFi Network application under Integrations.');
            }
            if (config.consoleType === 'selfHosted') {
                throw new Error('Network API keys only work on UniFi OS consoles, not self-hosted Network Controllers. Switch the ' +
                    'connection method to Username / Password, or the Console Type to UniFi OS Console.');
            }
            // Network API keys only work on UniFi OS consoles, where the Network application lives behind
            // /proxy/network. Baking that into the base URL means the library's first attempt at each /api/s/...
            // path is already the right one (its own fallback would otherwise try the bare path first).
            return connectWithApiKey(`https://${config.host}:${resolvePort(config)}/proxy/network`, apiKey, config, (status) => {
                if (status === 401 || status === 403) {
                    return 'The console rejected the Network API key. Check it was copied in full and has not been revoked.';
                }
                return undefined;
            });
        }
        case 'siteManagerApiKey': {
            const consoleId = config.consoleId?.trim();
            const apiKey = secrets.siteManagerApiKey?.trim();
            if (!consoleId) {
                throw new Error('No Console ID configured. Copy it from the unifi.ui.com address bar for your console.');
            }
            if (!apiKey) {
                throw new Error('No Site Manager API key configured. Create one at unifi.ui.com under API.');
            }
            // The Site Manager connector relays everything under .../network/ to that console's Network
            // application, the same way /proxy/network does locally. api.ui.com has a real public certificate,
            // so verification is always on here regardless of the local "Verify SSL" checkbox.
            return connectWithApiKey(`${SITE_MANAGER_BASE_URL}/v1/connector/consoles/${encodeURIComponent(consoleId)}/network`, apiKey, { ...config, verifySsl: true }, (status) => {
                if (status === 401 || status === 403) {
                    return ('Site Manager rejected the API key. Check it is a Site Manager key from unifi.ui.com (not a ' +
                        'Network API key from the console) and that its owner has access to this console.');
                }
                if (status === 404) {
                    return 'Site Manager could not find that console or site. Check the Console ID and Site name.';
                }
                // Site Manager answers 408 when it can't reach the console itself.
                if (status === 408) {
                    return 'The console did not respond through Site Manager. It may be offline, or running firmware older than 5.0.3.';
                }
                return undefined;
            });
        }
    }
}
//# sourceMappingURL=connection.js.map