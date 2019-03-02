import { IAlertData, IAlerts, IDestination } from '../typings';

/**
 * 
 *
 * @class Alerts
 * @interface
 */
export default class Alerts implements IAlerts {
    private destinations: { [name: string]: IDestination };
    private started: boolean;

    /**
     * Creates an instance of Alerts.
     *
     * @memberof Alerts
     */
    constructor() {
        this.destinations = {};
        this.started = false;
    }

    /**
     * Initiate the Alert class
     *
     * @returns {Promise<void>} Resolves when the Alert module and all destinations are initiated
     * @memberof Alerts
     */
    public init() {
        this.started = true;

        return Promise.all(Object.keys(this.destinations).map(key => {
            let destination = this.destinations[key];

            if (typeof destination.init === 'function') {
                return destination.init();
            } else {
                return Promise.resolve();
            }
        }));
    }

    /**
     * Register a new alert destination
     *
     * @param {Destination} destination The Destination class to register
     * @return {void}
     * @memberof Alerts
     */
    public async registerDestination(name: string, destination: IDestination) {
        if (!this.started) {
            this.destinations[name] = destination;
        } else {
            if (typeof destination.init === 'function') {
                await destination.init();
            }

            this.destinations[name] = destination;
        }
    }

    /**
     * Send a new alert
     *
     * @param data The alert payload
     * @returns Resolves once the alert has been sent
     * @memberof Alerts
     */
    public alert(data): Promise<void> {
        Object.keys(this.destinations).forEach(key => {
            let destination = this.destinations[key];

            destination.alert(data);
        });

        return Promise.resolve();
    }
}
