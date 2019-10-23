import { ICluster, IClusterCommunication, IClusterModules, IClusterOptions } from './typings';
/**
 * Helper class for dealing with Cluster side things
 */
export declare class Cluster implements ICluster {
    communication: IClusterCommunication;
    private options;
    private modules;
    /**
     * Creates an instance of Cluster.
     * @param options Cluster options
     * @param modules Custom cluster modules
     * @memberof Cluster
     */
    constructor(options: IClusterOptions, modules: IClusterModules);
    /**
     * Bot token
     *
     * @readonly
     * @memberof Cluster
     */
    readonly token: string;
    /**
     * First ShardID for current cluster
     *
     * @readonly
     * @memberof Cluster
     */
    readonly firstShardID: number;
    /**
     * Last ShardID for current cluster
     *
     * @readonly
     * @memberof Cluster
     */
    readonly lastShardID: number;
    /**
     * Total number of shards for the bot
     *
     * @readonly
     * @memberof Cluster
     */
    readonly maxShards: number;
    /**
     * ID of the instance this cluster is part of
     *
     * @readonly
     * @memberof Cluster
     */
    readonly instanceID: string;
    /**
     * The ClusterID of the current cluster
     *
     * @readonly
     * @memberof Cluster
     */
    readonly clusterID: number;
    /**
     * Initiate the Cluster
     *
     * @returns Resolves once all Cluster modules have been initiated
     * @memberof Cluster
     */
    init(): Promise<void>;
}
export default Cluster;
