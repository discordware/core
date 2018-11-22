const Communication = require('./cluster/Communication');

/**
 * Helper class for dealing with Cluster side things
 *
 * @class Cluster
 */
class Cluster {

    /**
     *Creates an instance of Cluster.
     * @param {Object} options Cluster options
     * @param {Object} modules Custom cluster modules
     * @memberof Cluster
     */
    constructor(options, modules) {
        this.options = options;
        this.modules = modules;
    }

    /**
     * Bot token
     *
     * @readonly
     * @memberof Cluster
     */
    get token() {
        return process.env.TOKEN;
    }

    /**
     * First ShardID for current cluster
     *
     * @readonly
     * @memberof Cluster
     */
    get firstShardID() {
        return process.env.FIRST_SHARD_ID;
    }

    /**
     * Last ShardID for current cluster
     *
     * @readonly
     * @memberof Cluster
     */
    get lastShardID() {
        return process.env.LAST_SHARD_ID;
    }

    /**
     * Total number of shards for the bot
     *
     * @readonly
     * @memberof Cluster
     */
    get maxShards() {
        return process.env.MAX_SHARDS;
    }

    /**
     * ID of the instance this cluster is part of
     *
     * @readonly
     * @memberof Cluster
     */
    get instanceID() {
        return process.env.INSTANCE_ID;
    }

    /**
     * The ClusterID of the current cluster
     *
     * @readonly
     * @memberof Cluster
     */
    get clusterID() {
        return process.env.CLUSTER_ID;
    }

    /**
     * Initiate the Cluster
     *
     * @returns {Promise<void>} Resolves once all Cluster modules have been initiated
     * @memberof Cluster
     */
    async init() {
        this.communication = this.modules.communication || new Communication(this.options.communication);

        await this.communication.init();

        return Promise.resolve();
    }
}

module.exports = Cluster;