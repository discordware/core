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
            clustering: this.options.clustering,
            sharding: this.options.sharding,
            stats: this.options.stats
        };
    }
}

module.exports = Configuration;