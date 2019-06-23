import { IAlertData, IDestination } from '../typings';
/**
 * Discord webhook destination for alerts
 */
export declare class DiscordDestination implements IDestination {
    private token;
    private instanceID;
    private options;
    private eris;
    /**
     * Creates an instance of DiscordDestination.
     * @param token Discord bot token
     * @param instanceID Current instance ID
     * @param options Discord webhook options
     * @memberof DiscordDestination
     */
    constructor(token: any, instanceID: any, options: any);
    /**
     * Initialize the Discord destination
     *
     * @returns Resolves once Eris client is created
     * @memberof DiscordDestination
     */
    init(): Promise<void>;
    /**
     * Send out an alert
     *
     * @param data Alert data
     * @returns Resolves once the alert has been sent
     * @memberof DiscordDestination
     */
    alert(data: IAlertData): Promise<void>;
}
export default DiscordDestination;
