import { IConfiguration, ISharderOptions } from '../typings';
/**
 *
 *
 * @class Configuration
 * @interface
 */
export declare class Configuration implements IConfiguration {
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
        clustering: import("../typings").IClusteringOptions;
        communication: import("../typings").ICommunicationOptions;
        console: import("../typings").ITransportOptions;
        instanceOptions: import("../typings").IInstanceConfig;
        sharding: import("../typings").IShardingOptions;
        stats: import("../typings").IStatsOptions;
        token: string;
    }>;
}
export default Configuration;
