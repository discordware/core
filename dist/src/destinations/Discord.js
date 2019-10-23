"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eris = require("eris");
/**
 * Discord webhook destination for alerts
 */
class DiscordDestination {
    /**
     * Creates an instance of DiscordDestination.
     * @param token Discord bot token
     * @param instanceID Current instance ID
     * @param options Discord webhook options
     * @memberof DiscordDestination
     */
    constructor(token, instanceID, options) {
        this.token = token;
        this.instanceID = instanceID;
        this.options = options;
    }
    /**
     * Initialize the Discord destination
     *
     * @returns Resolves once Eris client is created
     * @memberof DiscordDestination
     */
    init() {
        this.eris = new eris.Client(this.token);
        return Promise.resolve();
    }
    /**
     * Send out an alert
     *
     * @param data Alert data
     * @returns Resolves once the alert has been sent
     * @memberof DiscordDestination
     */
    alert(data) {
        let { title, msg, date, type } = data;
        let config = this.options[type];
        if (!config)
            return;
        let { id, token } = config;
        if (!id || !token)
            return;
        this.eris.executeWebhook(id, token, {
            embeds: [
                {
                    description: msg,
                    footer: { text: this.instanceID },
                    timestamp: date.toString(),
                    title,
                },
            ],
        });
        return Promise.resolve();
    }
}
exports.DiscordDestination = DiscordDestination;
exports.default = DiscordDestination;
