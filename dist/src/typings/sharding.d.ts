import { IShardConfig } from './registry';
export interface IShardingOptions {
    firstShardID: number;
    lastShardID: number;
    shards: number;
}
export interface ISharding {
    token: string;
    init(): Promise<void>;
    shard(clusterCount: number): Promise<void>;
    getConfig(cluster: number): Promise<IShardConfig>;
    updateShardCount(firstShardID: number, lastShardID: number, maxShards: number): Promise<void>;
    getShardConfig(): IShardingOptions;
}
