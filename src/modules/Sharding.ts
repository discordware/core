import { IAlerts, ILogger, IRegistry, IShardConfig, ISharding, IShardingOptions } from '../typings';

/**
 *
 *
 * @class Sharding
 */
export default class Sharding implements ISharding {
    public token: string;
    private firstShardID: number;
    private lastShardID: number;
    private maxShards: number;
    private registry: IRegistry;
    private logger: ILogger;
    private instanceID: string;
    private alerts: IAlerts;

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
    constructor(options: IShardingOptions, token, instanceID, registry, logger, alerts) {
        this.firstShardID = options.firstShardID || 0;
        this.lastShardID = options.lastShardID || options.shards - 1;
        this.maxShards = options.shards;
        this.token = token;
        this.registry = registry;
        this.logger = logger;
        this.instanceID = instanceID;
        this.alerts = alerts;
    }

    /**
     *
     *
     * @returns
     * @memberof Sharding
     */
    public init() {
        return Promise.resolve();
    }

    public chunk(array: number[], n: number): number[][] {

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

    /**
     *
     *
     * @param {*} clusterCount
     * @memberof Sharding
     */
    public shard(clusterCount: number): Promise<void> {
        let shards = [];

        for (let i = this.firstShardID; i <= this.lastShardID; i++) {
            shards.push(i);
        }

        let chunked = this.chunk(shards, clusterCount);

        chunked.forEach((chunk, clusterID) => {
            this.setConfig(clusterID, {
                firstShardID: Math.min(...chunk),
                lastShardID: Math.max(...chunk),
                maxShards: this.maxShards,
            });
        });

        return Promise.resolve();
    }

    /**
     *
     *
     * @param {*} firstShardID
     * @param {*} lastShardID
     * @param {*} maxShards
     * @memberof Sharding
     */
    public updateShardCount(firstShardID: number, lastShardID: number, maxShards: number) {
        this.firstShardID = firstShardID;
        this.lastShardID = lastShardID;
        this.maxShards = maxShards;
        return Promise.resolve();
    }

    public setConfig(clusterID: number, config: IShardConfig): Promise<void> {
        return this.registry.registerShardConfig(this.instanceID, clusterID, config);
    }

    /**
     *
     *
     * @param {*} cluster
     * @returns
     * @memberof Sharding
     */
    public async getConfig(cluster: number): Promise<IShardConfig> {
        return Promise.resolve(await this.registry.getShardConfig(this.instanceID, cluster));
    }
}
