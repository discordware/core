import * as eris from 'eris';
import { IDestination, IDiscordDestinationOptions, IAlertData } from '../typings';


/**
 * Discord webhook destination for alerts
 */
export default class DiscordDestination implements IDestination {
    private token: string;
    private instanceID: string;
    private options: IDiscordDestinationOptions;
    private eris: eris.Client;


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
    public init() {
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
    public alert(data: IAlertData): Promise<void> {
        let { title, msg, date, type } = data;
        let config = this.options[type];

        if (!config) return;

        let { id, token } = config;

        if (!id || !token) return;

        this.eris.executeWebhook(id, token, {
            embeds: [
                {
                    title,
                    description: msg,
                    footer: { text: this.instanceID },
                    timestamp: date.toString(),
                },
            ],
        });

        return Promise.resolve();
    }
}
