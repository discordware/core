const Communication = require('./cluster/Communication');

class Cluster {
    constructor(options, modules) {
        this.options = options;
        this.modules = modules;
    }

    get token() {
        return process.env.TOKEN;
    }

    get firstShardID() {
        return process.env.FIRST_SHARD_ID;
    }

    get lastShardID() {
        return process.env.LAST_SHARD_ID;
    }

    get maxShards() {
        return process.env.MAX_SHARDS;
    }

    get instanceID() {
        return process.env.INSTANCE_ID;
    }

    get clusterID() {
        return process.env.CLUSTER_ID;
    }

    async init() {
        this.communication = this.modules.communication || new Communication(this.options.communication);

        await this.communication.init();

        return Promise.resolve();
    }
}

module.exports = Cluster;