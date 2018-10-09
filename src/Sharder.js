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

class Sharder {
    constructor(instanceID, options, modules = {}) {
        this.modules = modules;
        this.instanceID = instanceID;

        if (!instanceID) {
            throw new Error('instanceID not provided');
        }

        this.config = modules.Configuration || new Configuration(instanceID, options);
    }

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

    async updateConfig(config) {
        await this.registry.deleteInstance(this.instanceID);

        this.registry.registerInstance(this.instanceID, config);
    }

    async addPeer(instanceID) {
        let peer = await this.registry.getInstance(instanceID);

        this.communication.connectToPeer(peer);
    }

    async peerUpdate(instanceID) {
        let peer = await this.registry.getInstance(instanceID);

        this.communication.updateConnection(peer);
    }
}

module.exports = Sharder;