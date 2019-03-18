import { IConfiguration, ISharderOptions } from '../typings';
/**
 *
 *
 * @class Configuration
 * @interface
 */
export default class Configuration implements IConfiguration {
    private instanceID;
    private options;
    /**
     * Creates an instance of Configuration.
     * @param {String} instanceID ID of the local instance
     * @param {Object} options Configuration options
     * @memberof Configuration
     */
    constructor(instanceID: string, options: ISharderOptions);
    /**
     * Initiate the configuration module
     *
     * @returns {Promise<void>} Resolves once the configuration module is initiated
     * @memberof Configuration
     */
    init(): Promise<void>;
    /**
     * Fetches the configuration for the instance
     *
     * @returns {Promise<Object>} Resolves once the configuration has been fetched
     * @memberof Configuration
     */
    getConfig(): Promise<{
        token: string;
        instanceOptions: import("../typings").IInstanceConfig;
        clustering: import("../typings").IClusteringOptions;
        sharding: import("../typings").IShardingOptions;
        stats: import("../typings").IStatsOptions;
        communication: import("../typings").ICommunicationOptions;
        console: import("../typings").ITransportOptions;
    }>;
}
