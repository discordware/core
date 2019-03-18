import { IAlerts, IDestination } from '../typings';
/**
 *
 *
 * @class Alerts
 * @interface
 */
export default class Alerts implements IAlerts {
    private destinations;
    private started;
    /**
     * Creates an instance of Alerts.
     *
     * @memberof Alerts
     */
    constructor();
    /**
     * Initiate the Alert class
     *
     * @returns {Promise<void>} Resolves when the Alert module and all destinations are initiated
     * @memberof Alerts
     */
    init(): Promise<void[]>;
    /**
     * Register a new alert destination
     *
     * @param {Destination} destination The Destination class to register
     * @return {void}
     * @memberof Alerts
     */
    registerDestination(name: string, destination: IDestination): Promise<void>;
    /**
     * Send a new alert
     *
     * @param data The alert payload
     * @returns Resolves once the alert has been sent
     * @memberof Alerts
     */
    alert(data: any): Promise<void>;
}
