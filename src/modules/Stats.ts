import { ICommunication, ILogger, IStats, IStatsOptions, StatType } from '../typings';

/**
 *
 *
 * @class Stats
 */
export default class Stats implements IStats {
    private options: IStatsOptions;
    private communication: ICommunication;
    private logger: ILogger;
    private metrics: { [name: string]: { method: string, type: StatType, enabled: boolean } };
    private collector: { [clusterID: number]: { [name: string]: number } };

    /**
     * Creates an instance of Stats.
     * @param {Object} options Stats options
     * @param {Communication} communication Communication modu;e
     * @param {Logger} logger Logger module
     * @memberof Stats
     */
    constructor(options: IStatsOptions, communication: ICommunication, logger: ILogger) {
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
    public init() {
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
    public addMetric(name: string, method: string, type: StatType) {
        this.metrics[name] = {
            method,
            type,
            enabled: true,
        };
    }

    /**
     * Disable a metric
     *
     * @param {String} name Name of the metric to disable
     * @returns {void}
     * @memberof Stats
     */
    public disableMetric(name: string) {
        this.metrics[name].enabled = false;
    }
}
