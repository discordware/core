import { ICommunication, ILogger, IStats, IStatsOptions, StatType } from '../typings';
/**
 *
 *
 * @class Stats
 */
export declare class Stats implements IStats {
    private options;
    private communication;
    private logger;
    private metrics;
    private collector;
    /**
     * Creates an instance of Stats.
     * @param {Object} options Stats options
     * @param {Communication} communication Communication modu;e
     * @param {Logger} logger Logger module
     * @memberof Stats
     */
    constructor(options: IStatsOptions, communication: ICommunication, logger: ILogger);
    /**
     * Initiate the Stats module
     *
     * @returns {Promise<void>} Resolves once the Stats module is initiated
     * @memberof Stats
     */
    init(): Promise<void>;
    /**
     * Add a new metric to track
     *
     * @param {String} name Name of the metric
     * @param {String} method The method through which the metric is collected
     * @param {String} type The aggregation type
     * @returns {void}
     * @memberof Stats
     */
    addMetric(name: string, method: string, type: StatType): void;
    /**
     * Disable a metric
     *
     * @param {String} name Name of the metric to disable
     * @returns {void}
     * @memberof Stats
     */
    disableMetric(name: string): void;
}
export default Stats;
