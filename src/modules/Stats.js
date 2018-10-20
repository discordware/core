
/**
 *
 *
 * @class Stats
 */
class Stats {

    /**
     *Creates an instance of Stats.
     * @param {*} options
     * @param {*} communication
     * @param {*} logger
     * @memberof Stats
     */
    constructor(options, communication, logger) {
        this.options = options;
        this.communication = communication;
        this.logger = logger;
        this.metrics = {};
        this.collector = {};
    }

    /**
     *
     *
     * @returns
     * @memberof Stats
     */
    init() {
        return Promise.resolve();
    }

    /**
     *
     *
     * @param {*} name
     * @param {*} method
     * @param {*} type
     * @memberof Stats
     */
    addMetric(name, method, type) {
        this.metrics[name] = {
            method,
            type,
            enabled: true
        };
    }

    /**
     *
     *
     * @param {*} name
     * @memberof Stats
     */
    disableMetric(name) {
        this.metrics[name].enabled = false;
    }
}

module.exports = Stats;