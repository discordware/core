import { IAlerts, IClustering, ICommunication, IConfig, IConfiguration, IInstanceConfig, ILogger, IModules, IQueue, IRegistry, ISharderOptions, ISharding, IStats } from './typings';

// Modules
import Alerts from './modules/Alerts';
import Clustering from './modules/Clustering';
import Communication from './modules/Communication';
import Configuration from './modules/Configuration';
import Logger from './modules/Logger';
import Queue from './modules/Queue';
import Registry from './modules/Registry';
import Sharding from './modules/Sharding';
import Stats from './modules/Stats';

// Default transport
import Console from './transports/Console';

/**
 * Main Sharder class
 */
export class Sharder {
    private instanceID: string;
    private modules: IModules;
    private config: IConfiguration;
    private options: IConfig;
    private logger: ILogger;
    private alerts: IAlerts;
    private registry: IRegistry;
    private queue: IQueue;
    private communication: ICommunication;
    private sharding: ISharding;
    private clustering: IClustering;
    private stats: IStats;

    /**
     * Creates an instance of Sharder.
     * @param instanceID The unique instanceID of the current sharder
     * @param options Options to pass on to modules
     * @param modules Custom modules to start with
     * @memberof Sharder
     */
    constructor(instanceID: string, options: ISharderOptions, modules: IModules) {
        this.instanceID = instanceID;
        this.modules = modules || {};

        if (!instanceID) {
            throw new Error('instanceID not provided');
        }

        this.config = this.modules.configuration || new Configuration(instanceID, options);
    }

    /**
     * Create a new instance
     *
     * @returns Resolves when config is fetched and modules are created
     * @memberof Sharder
     */
    public async create(): Promise<void> {
        await this.config.init();

        this.options = await this.config.getConfig();

        this.logger = this.modules.logger || new Logger();
        this.alerts = this.modules.alerts || new Alerts();
        this.registry = this.modules.registry || new Registry();
        this.queue = this.modules.queue || new Queue();
        this.communication = this.modules.communication || new Communication(this.options.communication, this.logger, this.registry);
        this.sharding = this.modules.sharding || new Sharding(this.options.sharding, this.options.token, this.instanceID, this.registry, this.logger, this.alerts);
        this.clustering = this.modules.clustering || new Clustering(this.options.clustering, this.instanceID, this.communication, this.sharding, this.registry, this.logger, this.alerts, this.queue);
        this.stats = this.modules.stats || new Stats(this.options.stats, this.communication, this.logger);

        return Promise.resolve();
    }

    /**
     *  Initiate the instance
     *
     * @returns Resolves when the instance is fully initiated
     * @memberof Sharder
     */
    public async init(): Promise<void> {
        if (!this.clustering.isMaster) return;

        this.logger.registerTransport('console', new Console(this.options.console));

        await this.logger.init();
        await this.alerts.init();
        await this.registry.init();
        await this.communication.init();
        await this.sharding.init();

        await this.registry.registerInstance(this.instanceID, this.options.instanceOptions);

        await this.clustering.init();

        this.stats.init();

        return Promise.resolve();
    }

    /**
     * Reshard the clusters managed by the current instance
     *
     * @param firstShardID The first shard ID of the new set
     * @param lastShardID The last shard ID of the new set
     * @param maxShards The total amount of shards for the bot
     * @return Resolves once resharding is complete
     * @memberof Sharder
     */
    public reshard(firstShardID: number, lastShardID: number, maxShards: number): Promise<void> {
        this.sharding.updateShardCount(firstShardID, lastShardID, maxShards);

        return Promise.resolve();
    }

    /**
     * Update local instance's configuration
     *
     * @param config New instance configuration
     * @return Resolves once instance config has been updated
     * @memberof Sharder
     */
    public async updateConfig(config: IInstanceConfig): Promise<void> {
        await this.registry.deleteInstance(this.instanceID);

        this.registry.registerInstance(this.instanceID, config);

        return Promise.resolve();
    }

    /**
     *  Connect to a new peer instance
     *
     * @param instanceID The registered instanceID of the new peer
     * @return Resolves once peer is added
     * @memberof Sharder
     */
    public async addPeer(instanceID: string): Promise<void> {
        let peer = await this.registry.getInstance(instanceID);

        this.communication.connectToPeer(peer);

        return Promise.resolve();
    }

    /**
     *  Fetch updated peer instance configuration
     *
     * @param instanceID The registered instanceID of the updated peer
     * @return Resolves once peer has been updated
     * @memberof Sharder
     */
    public async peerUpdate(instanceID: string): Promise<void> {
        let peer = await this.registry.getInstance(instanceID);

        this.communication.updateConnection(peer);

        return Promise.resolve();
    }
}

export default Sharder;
