class Sharding {
    constructor(options, token, instanceID, logger, alerts) {
        this.options = options;
        this.token = token;
        this.logger = logger;
        this.instanceID = instanceID;
        this.alerts = alerts;
    }

    init() {
        return Promise.resolve();
    }

    shard(clusterCount) {
        
    }

    getConfig(cluster) {

    }
}

module.exports = Sharding;