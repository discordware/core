"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 *
 * @class Configuration
 * @interface
 */
class Configuration {
    /**
     * Creates an instance of Configuration.
     * @param {String} instanceID ID of the local instance
     * @param {Object} options Configuration options
     * @memberof Configuration
     */
    constructor(instanceID, options) {
        this.instanceID = instanceID;
        this.options = options;
    }
    /**
     * Initiate the configuration module
     *
     * @returns {Promise<void>} Resolves once the configuration module is initiated
     * @memberof Configuration
     */
    init() {
        return Promise.resolve();
    }
    /**
     * Fetches the configuration for the instance
     *
     * @returns {Promise<Object>} Resolves once the configuration has been fetched
     * @memberof Configuration
     */
    getConfig() {
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
exports.default = Configuration;
