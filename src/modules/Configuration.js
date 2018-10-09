class Configuration {
    constructor(instanceID, options) {
        this.instanceID = instanceID;
        this.options = options;
    }

    init() {
        return Promise.resolve();
    }

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