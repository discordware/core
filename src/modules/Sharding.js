class Sharding {
    constructor(options, logger, token, instanceID) {
        this.options = options;
        this.token = token;
        this.logger = logger;
        this.instanceID = instanceID;
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