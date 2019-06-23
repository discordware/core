import Communication from './cluster/Communication';
import { ICluster, IClusterCommunication, IClusterModules, IClusterOptions } from './typings';

/**
 * Helper class for dealing with Cluster side things
 */
export class Cluster implements ICluster {
    public communication: IClusterCommunication;
    private options: IClusterOptions;
    private modules: IClusterModules;

    /**
     * Creates an instance of Cluster.
     * @param options Cluster options
     * @param modules Custom cluster modules
     * @memberof Cluster
     */
    constructor(options: IClusterOptions, modules: IClusterModules) {
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
        return parseInt(process.env.FIRST_SHARD_ID, 10);
    }

    /**
     * Last ShardID for current cluster
     *
     * @readonly
     * @memberof Cluster
     */
    get lastShardID() {
        return parseInt(process.env.LAST_SHARD_ID, 10);
    }

    /**
     * Total number of shards for the bot
     *
     * @readonly
     * @memberof Cluster
     */
    get maxShards() {
        return parseInt(process.env.MAX_SHARDS, 10);
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
        return parseInt(process.env.CLUSTER_ID, 10);
    }

    /**
     * Initiate the Cluster
     *
     * @returns Resolves once all Cluster modules have been initiated
     * @memberof Cluster
     */
    public async init(): Promise<void> {
        this.communication = this.modules.communication || new Communication(this.options.communication);

        await this.communication.init();

        return Promise.resolve();
    }
}

export default Cluster;
