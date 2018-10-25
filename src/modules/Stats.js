
/**
 *
 *
 * @class Stats
 */
class Stats {

    /**
     *Creates an instance of Stats.
     * @param {Object} options Stats options
     * @param {Communication} communication Communication modu;e
     * @param {Logger} logger Logger module
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
     * Initiate the Stats module
     *
     * @returns {Promise<void>} Resolves once the Stats module is initiated
     * @memberof Stats
     */
    init() {
        return Promise.resolve();
    }

    /**
     * Add a new metric to track
     *
     * @param {String} name Name of the metric
     * @param {String} method The method through which the metric is collected
     * @param {String} type The aggregation type
     * @returns {void}
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
     * Disable a metric
     *
     * @param {String} name Name of the metric to disable
     * @returns {void}
     * @memberof Stats
     */
    disableMetric(name) {
        this.metrics[name].enabled = false;
    }
}

module.exports = Stats;