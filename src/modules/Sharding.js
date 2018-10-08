class Sharding {
    constructor(options, token, instanceID, registry, logger, alerts) {
        this.firstShardID = options.firstShardID || 0;
        this.lastShardID = options.lastShardID || options.shards - 1;
        this.maxShards = options.shards;
        this.token = token;
        this.registry = registry;
        this.logger = logger;
        this.instanceID = instanceID;
        this.alerts = alerts;
    }

    init() {
        return Promise.resolve();
    }

    chunk(array, n) {

        if (n < 2) return [array];

        let len = array.length;
        let out = [];
        let i = 0;
        let size;

        if (len % n === 0) {
            size = Math.floor(len / n);

            while (i < len) {
                out.push(array.slice(i, i += size));
            }
        } else {
            while (i < len) {
                size = Math.ceil((len - i) / n--);
                out.push(array.slice(i, i += size));
            }
        }

        return out;
    }

    shard(clusterCount) {
        let shards = [];

        for (let i = this.firstShardID; i <= this.lastShardID; i++) {
            shards.push(i);
        }

        let chunked = this.chunk(shards, clusterCount);

        chunked.forEach((chunk, clusterID) => {
            this.setConfig(clusterID, {
                firstShardID: Math.min(...chunk),
                lastShardID: Math.max(...chunk),
                maxShards: this.maxShards
            });
        });
    }

    updateShardCount(firstShardID, lastShardID, maxShards) {
        this.firstShardID = firstShardID;
        this.lastShardID = lastShardID;
        this.maxShards = maxShards;
    }

    setConfig(clusterID, config) {
        return this.registry.registerShardConfig(this.instanceID, clusterID, config);
    }

    getConfig(cluster) {
        return this.registry.getShardConfig(this.instanceID, cluster);
    }
}

module.exports = Sharding;