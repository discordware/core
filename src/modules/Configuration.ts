import { IConfiguration, ISharderOptions } from '../typings';

/**
 *
 *
 * @class Configuration
 * @interface
 */
export default class Configuration implements IConfiguration {
    private instanceID: string;
    private options: ISharderOptions;

    /**
     * Creates an instance of Configuration.
     * @param {String} instanceID ID of the local instance
     * @param {Object} options Configuration options
     * @memberof Configuration
     */
    constructor(instanceID: string, options: ISharderOptions) {
        this.instanceID = instanceID;
        this.options = options;
    }

    /**
     * Initiate the configuration module
     *
     * @returns {Promise<void>} Resolves once the configuration module is initiated
     * @memberof Configuration
     */
    public init() {
        return Promise.resolve();
    }

    /**
     * Fetches the configuration for the instance
     *
     * @returns {Promise<Object>} Resolves once the configuration has been fetched
     * @memberof Configuration
     */
    public getConfig() {
        return Promise.resolve({
            token: this.options.token,
            instanceOptions: this.options.instanceOptions,
            clustering: this.options.clustering,
            sharding: this.options.sharding,
            stats: this.options.stats,
            communication: this.options.communication,
            console: this.options.console,
        });
    }
}
