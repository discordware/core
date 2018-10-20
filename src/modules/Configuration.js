
/**
 *
 *
 * @class Configuration
 * @interface
 */
class Configuration {

    /**
     *Creates an instance of Configuration.
     * @param {*} instanceID
     * @param {*} options
     * @memberof Configuration
     */
    constructor(instanceID, options) {
        this.instanceID = instanceID;
        this.options = options;
    }

    /**
     *
     *
     * @returns
     * @memberof Configuration
     */
    init() {
        return Promise.resolve();
    }

    /**
     *
     *
     * @returns
     * @memberof Configuration
     */
    getConfig() {
        return {
            token: this.options.token,
            instanceOptions: this.options.instanceOptions || {},
            clustering: this.options.clustering || {},
            sharding: this.options.sharding || {},
            stats: this.options.stats || {},
            communication: this.options.communication || {},
            logger: this.options.logger || {}
        };
    }
}

module.exports = Configuration;