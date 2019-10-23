import { IInstanceConfig, IModules, ISharderOptions } from './typings';
/**
 * Main Sharder class
 */
export declare class Sharder {
    private instanceID;
    private modules;
    private config;
    private options;
    private logger;
    private alerts;
    private registry;
    private queue;
    private communication;
    private sharding;
    private clustering;
    private stats;
    /**
     * Creates an instance of Sharder.
     * @param instanceID The unique instanceID of the current sharder
     * @param options Options to pass on to modules
     * @param modules Custom modules to start with
     * @memberof Sharder
     */
    constructor(instanceID: string, options: ISharderOptions, modules: IModules);
    /**
     * Create a new instance
     *
     * @returns Resolves when config is fetched and modules are created
     * @memberof Sharder
     */
    create(): Promise<void>;
    /**
     *  Initiate the instance
     *
     * @returns Resolves when the instance is fully initiated
     * @memberof Sharder
     */
    init(): Promise<void>;
    /**
     * Reshard the clusters managed by the current instance
     *
     * @param firstShardID The first shard ID of the new set
     * @param lastShardID The last shard ID of the new set
     * @param maxShards The total amount of shards for the bot
     * @return Resolves once resharding is complete
     * @memberof Sharder
     */
    reshard(firstShardID: number, lastShardID: number, maxShards: number): Promise<void>;
    /**
     * Update local instance's configuration
     *
     * @param config New instance configuration
     * @return Resolves once instance config has been updated
     * @memberof Sharder
     */
    updateConfig(config: IInstanceConfig): Promise<void>;
    /**
     *  Connect to a new peer instance
     *
     * @param instanceID The registered instanceID of the new peer
     * @return Resolves once peer is added
     * @memberof Sharder
     */
    addPeer(instanceID: string): Promise<void>;
    /**
     *  Fetch updated peer instance configuration
     *
     * @param instanceID The registered instanceID of the updated peer
     * @return Resolves once peer has been updated
     * @memberof Sharder
     */
    peerUpdate(instanceID: string): Promise<void>;
}
export default Sharder;
