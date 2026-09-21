import { InstanceBase, InstanceStatus } from '@companion-module/base';
import { UniFiClient } from 'unifi-api-ts';
import { GetConfigFields } from './config.js';
import { UpdateVariableDefinitions } from './variables.js';
import { UpgradeScripts } from './upgrades.js';
import { UpdateActions } from './actions.js';
import { UpdateFeedbacks } from './feedbacks.js';
import { UpdatePresets } from './presets.js';
export { UpgradeScripts };
// UniFi OS consoles (UDM/UDR/UDM Pro/Cloud Gateway, anything running UniFi OS rather than a standalone
// UniFi Network Controller) reject every state-changing request (POST/PUT/DELETE) with "Access forbidden"
// unless it carries an X-Csrf-Token header, echoed back from an earlier response. unifi-api-ts's HTTP
// client never reads or resends that header, so we reach into the axios instance it wraps internally and
// handle it ourselves: capture the token from every response, and attach it to every outgoing request.
function attachCsrfTokenHandling(unifi) {
    let csrfToken;
    // unifi-api-ts's HTTPClient declares this field `private` in its own types, but doesn't actually
    // enforce that at runtime — casting through `unknown` is how we reach the real axios instance.
    const axiosClient = unifi.getHttpClient().client;
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
    const axiosClient = unifi.getHttpClient().client;
    // Throws on any non-2xx response (axios's default), e.g. a wrong/expired code — that rejection
    // propagates straight up to connectToUnifi()'s catch block, same as any other login failure.
    await axiosClient.post('/api/auth/login', {
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
export default class ModuleInstance extends InstanceBase {
    config; // Setup in init()
    secrets; // Setup in init()
    unifi;
    // Live inventory of what's on the console, refreshed on a timer once connected — lets actions
    // like "Utility: Send Device Command" offer a picker instead of a raw MAC address text field.
    devices = [];
    clients = [];
    inventoryTimer;
    constructor(internal) {
        super(internal);
    }
    async init(config, _isFirstInit, secrets) {
        this.config = config;
        this.secrets = secrets;
        await this.connectToUnifi();
        this.updateActions(); // export actions
        this.updateFeedbacks(); // export feedbacks
        this.updatePresets(); // export Presets
        this.updateVariableDefinitions(); // export variable definitions
    }
    // When module gets deleted
    async destroy() {
        this.log('debug', 'destroy');
        if (this.inventoryTimer) {
            clearInterval(this.inventoryTimer);
            this.inventoryTimer = undefined;
        }
    }
    // Pull the current device/client list from the console and rebuild action definitions so any
    // device/client picker dropdowns reflect it. Failures are logged, not thrown — a stale inventory
    // shouldn't take down the connection, and the picker fields fall back to free text either way.
    async refreshInventory() {
        const unifi = this.unifi;
        if (!unifi)
            return;
        try {
            const [devices, clients] = await Promise.all([unifi.listDevices(), unifi.listUsers()]);
            this.devices = devices;
            this.clients = clients;
            this.updateActions();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.log('warn', `Failed to refresh device/client inventory: ${message}`);
        }
    }
    async configUpdated(config, secrets) {
        this.config = config;
        this.secrets = secrets;
        await this.connectToUnifi();
    }
    // Connect to the UniFi Network application exposed by a UniFi console (tooling from unifi-api-ts)
    async connectToUnifi() {
        this.updateStatus(InstanceStatus.Connecting);
        if (this.inventoryTimer) {
            clearInterval(this.inventoryTimer);
            this.inventoryTimer = undefined;
        }
        try {
            this.unifi = new UniFiClient({
                baseUrl: `https://${this.config.host}:${this.config.port}`,
                username: this.config.username,
                password: this.secrets.password,
                site: this.config.site || 'default',
                verifySsl: this.config.verifySsl,
            });
            attachCsrfTokenHandling(this.unifi);
            try {
                await this.unifi.login();
            }
            catch (error) {
                if (!isMfaRequiredError(error)) {
                    throw error;
                }
                // Plain login was rejected specifically because this account needs an MFA code. If one was
                // supplied, replay the login with it attached; otherwise fail with a message that tells the
                // user exactly what to do, instead of surfacing the console's raw "Ubic2faTokenRequired".
                if (!this.secrets.mfaToken) {
                    throw new Error('This account requires a multi-factor authentication code. Enter the current 6-digit code ' +
                        'from your authenticator app in the "MFA / TOTP Code" config field and save the connection.', { cause: error });
                }
                await completeMfaLogin(this.unifi, this.config.username, this.secrets.password, this.secrets.mfaToken);
            }
            this.updateStatus(InstanceStatus.Ok);
            // Populate the picker dropdowns immediately, then keep them in sync every 60s. 60s is
            // conservative on purpose — polling faster risks tripping the console's own login/request
            // rate limiter, which happened earlier during unrelated rapid reconnect testing.
            await this.refreshInventory();
            this.inventoryTimer = setInterval(() => {
                void this.refreshInventory();
            }, 60_000);
        }
        catch (error) {
            this.unifi = undefined;
            this.log('error', `Failed to connect to UniFi console: ${error instanceof Error ? error.message : String(error)}`);
            this.updateStatus(InstanceStatus.ConnectionFailure, error instanceof Error ? error.message : String(error));
        }
    }
    // Return config fields for web config
    getConfigFields() {
        return GetConfigFields();
    }
    updateActions() {
        UpdateActions(this);
    }
    updateFeedbacks() {
        UpdateFeedbacks(this);
    }
    updatePresets() {
        UpdatePresets(this);
    }
    updateVariableDefinitions() {
        UpdateVariableDefinitions(this);
    }
}
//# sourceMappingURL=main.js.map