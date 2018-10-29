// Modules
const Alerts = require('./modules/Alerts');
const Clustering = require('./modules/Clustering');
const Communication = require('./modules/Communication');
const Configuration = require('./modules/Configuration');
const Logger = require('./modules/Logger');
const Queue = require('./modules/Queue');
const Registry = require('./modules/Registry');
const Sharding = require('./modules/Sharding');
const Stats = require('./modules/Stats');

// Default transport
const Console = require('./transports/Console');


/**
 * Represents the main Sharder class
 * 
 * @prop {String} instanceID The instance ID
 * @prop {Object} modules Custom moduled
 * @prop {Alerts} modules.alerts Custom alert module
 * @prop {Clustering} modules.clustering Custom clustering module
 * @prop {Communication} modules.communication Custom communication module
 * @prop {Configuration} modules.configuration Custom configuration module
 * @prop {Logger} modules.logger Custom logger module
 * @prop {Queue} modules.queue Custom queue module
 * @prop {Registry} modules.registry Custom registry module
 * @prop {Sharding} modules.sharding Custom sharding module
 * @prop {Stats} modules.stats Custom stats module
 * @class Sharder
 */
class Sharder {

    /**
     *Creates an instance of Sharder.

     * @arg {String} instanceID The unique instanceID of the current sharder
     * @arg {Object} options Options to pass on to modules
     * @arg {String?} [options.token] Bot token
     * @arg {Object} [modules] Custom modules
     * @arg {Alerts?} [modules.alerts] Custom alert module
     * @arg {Clustering?} [modules.clustering] Custom clustering module
     * @arg {Communication?} [modules.communication] Custom communication module
     * @arg {Configuration?} [modules.configuration] Custom configuration module
     * @arg {Logger?} [modules.logger] Custom logger module
     * @arg {Queue?} [modules.queue] Custom queue module
     * @arg {Registry?} [modules.registry] Custom registry module
     * @arg {Sharding?} [modules.sharding] Custom sharding module
     * @arg {Stats?} [modules.stats] Custom stats module
     * @memberof Sharder
     */
    constructor(instanceID, options, modules) {
        this.instanceID = instanceID;
        this.modules = modules || {};

        if (!instanceID) {
            throw new Error('instanceID not provided');
        }

        this.config = modules.Configuration || new Configuration(instanceID, options);
    }


    /**
     * Create a new instance
     * 
     * @returns {Promise<void>} Resolves when config is fetched and modules are created
     * @memberof Sharder
     */
    async create() {
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
     * @returns {Promise<void>} Resolves when the instance is fully initiated
     * @memberof Sharder
     */
    async init() {
        if (!this.clustering.isMaster) return;

        this.logger.registerTransport('console', new Console(this.options.logger));

        await this.logger.init();
        await this.alerts.init();
        await this.registry.init();
        await this.communication.init();
        await this.sharding.init();

        // TODO: register own address
        await this.registry.registerInstance(this.instanceID, this.options.instanceOptions);

        this.clustering.init();

        return Promise.resolve();
    }


    /**
     * Reshard the clusters managed by the current instance
     * 
     * @param {*} firstShardID The first shard ID of the new set
     * @param {*} lastShardID The last shard ID of the new set
     * @param {*} maxShards The total amount of shards for the bot
     * @return {void}
     * @memberof Sharder
     */
    reshard(firstShardID, lastShardID, maxShards) {
        this.sharding.updateShardCount(firstShardID, lastShardID, maxShards);

        this.clustering.reshard();
    }


    /**
     * Update local instance's configuration
     * 
     * @param {Object} config New instance configuration
     * @return {void}
     * @memberof Sharder
     */
    async updateConfig(config) {
        await this.registry.deleteInstance(this.instanceID);

        this.registry.registerInstance(this.instanceID, config);
    }


    /**
     *  Connect to a new peer instance
     * 
     * @param {String} instanceID The registered instanceID of the new peer
     * @return {void}
     * @memberof Sharder
     */
    async addPeer(instanceID) {
        let peer = await this.registry.getInstance(instanceID);

        this.communication.connectToPeer(peer);
    }


    /**
     *  Fetch updated peer instance configuration
     * 
     * @param {String} instanceID The registered instanceID of the updated peer
     * @return {void}
     * @memberof Sharder
     */
    async peerUpdate(instanceID) {
        let peer = await this.registry.getInstance(instanceID);

        this.communication.updateConnection(peer);
    }
}

module.exports = Sharder;