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