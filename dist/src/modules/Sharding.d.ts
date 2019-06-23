import { IShardConfig, ISharding, IShardingOptions } from '../typings';
/**
 *
 *
 * @class Sharding
 */
export declare class Sharding implements ISharding {
    token: string;
    private firstShardID;
    private lastShardID;
    private maxShards;
    private registry;
    private logger;
    private instanceID;
    private alerts;
    /**
     * Creates an instance of Sharding.
     * @param {*} options
     * @param {*} token
     * @param {*} instanceID
     * @param {*} registry
     * @param {*} logger
     * @param {*} alerts
     * @memberof Sharding
     */
    constructor(options: IShardingOptions, token: any, instanceID: any, registry: any, logger: any, alerts: any);
    /**
     *
     *
     * @returns
     * @memberof Sharding
     */
    init(): Promise<void>;
    getShardConfig(): {
        firstShardID: number;
        lastShardID: number;
        shards: number;
    };
    chunk(array: number[], n: number): number[][];
    /**
     *
     *
     * @param {*} clusterCount
     * @memberof Sharding
     */
    shard(clusterCount: number): Promise<void>;
    /**
     *
     *
     * @param {*} firstShardID
     * @param {*} lastShardID
     * @param {*} maxShards
     * @memberof Sharding
     */
    updateShardCount(firstShardID: number, lastShardID: number, maxShards: number): Promise<void>;
    setConfig(clusterID: number, config: IShardConfig): Promise<void>;
    /**
     *
     *
     * @param {*} cluster
     * @returns
     * @memberof Sharding
     */
    getConfig(cluster: number): Promise<IShardConfig>;
}
export default Sharding;
