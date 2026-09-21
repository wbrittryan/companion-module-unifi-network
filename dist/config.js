import { Regex } from '@companion-module/base';
export function GetConfigFields() {
    return [
        {
            type: 'textinput',
            id: 'host',
            label: 'Target IP',
            width: 8,
            regex: Regex.IP,
            tooltip: 'The IP address of your UniFi console',
        },
        {
            type: 'number',
            id: 'port',
            label: 'Target Port',
            width: 4,
            min: 1,
            max: 65535,
            default: 443,
            tooltip: 'For UniFi OS consoles, use 443. For self-hosted UniFi Network Controllers, use 8443.',
        },
        {
            type: 'textinput',
            id: 'username',
            label: 'Username',
            width: 6,
            tooltip: 'Recommend using a new local admin account with read/write access to UniFi Network.',
        },
        {
            type: 'secret-text',
            id: 'password',
            label: 'Password',
            width: 6,
        },
        {
            type: 'secret-text',
            id: 'mfaToken',
            label: 'MFA / TOTP Code (optional)',
            width: 6,
            tooltip: 'Only needed if the account above has multi-factor authentication (2FA/TOTP, e.g. an authenticator ' +
                'app) turned on — including Ubiquiti accounts used for remote/cloud management, since this module ' +
                "still authenticates against the console's local login endpoint. Enter the CURRENT 6-digit code " +
                'from your authenticator app and save. IMPORTANT: TOTP codes are single-use and expire after about ' +
                '30 seconds, so this is not a "set once" field — it only gets the module connected right now. Every ' +
                'future reconnect (Companion restart, network drop, editing this config again) needs a fresh code ' +
                'typed in here first, or the connection will fail until you do. If you can create a local admin ' +
                'account without MFA instead, that avoids this entirely and is the more reliable long-term setup. ' +
                'Leave this blank if the account has no MFA.',
            default: '',
        },
        {
            type: 'textinput',
            id: 'site',
            label: 'Site',
            width: 6,
            default: 'default',
            tooltip: 'Leave as "default" unless you know what you are doing.',
        },
        {
            type: 'checkbox',
            id: 'verifySsl',
            label: 'Verify SSL Certificate',
            width: 6,
            default: false,
            tooltip: 'Disable for consoles using a self-signed certificate',
        },
    ];
}
//# sourceMappingURL=config.js.map