
/**
 *
 *
 * @class Alerts
 * @interface
 */
class Alerts {

    /**
     *Creates an instance of Alerts.

     * @memberof Alerts
     */
    constructor() {
        this.destinations = {};
        this.started = false;
    }

    /**
     * Initiate the Alert class
     *
     * @returns {Promise<void>} Resolves when thee Alert class is and all destinations are initiated
     * @memberof Alerts
     */
    init() {
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
    async registerDestination(destination) {
        if (!this.started) {
            this.destinations[destination.name] = destination;
        } else {
            if (typeof destination.init === 'function') {
                await destination.init();
            }
            
            this.destinations[destination.name] = destination;
        }
    }

    /**
     * Send a new alert
     *
     * @param {*} data The alert payload
     * @returns {void}
     * @memberof Alerts
     */
    alert(data) {
        Object.keys(this.destinations).forEach(key => {
            let destination = this.destinations[key];

            destination.alert(data);
        });
    }
}

module.exports = Alerts;