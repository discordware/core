// Modules
const Alerts = require('./modules/Alerts');
const Clustering = require('./modules/Clustering');
const Communication = require('./modules/Communication');
const Logger = require('./modules/Logger');
const Queue = require('./modules/Queue');
const Registry = require('./modules/Registry');
const Sharding = require('./modules/Sharding');
const Stats = require('./modules/Stats');


// Default transport
const Console = require('./transports/Console');

class Sharder {
    constructor(instanceID, options, modules) {
        this.modules = modules;
        this.options = options;
        this.instanceID = instanceID;

        if (!instanceID) {
            throw new Error('instanceID not provided');
        }
    }

    create() {
        this.logger = this.modules.logger || new Logger();
        this.alerts = this.modules.alerts || new Alerts();
        this.registry = this.modules.registry || new Registry();
        this.queue = this.modules.queue || new Queue();
        this.communication = this.modules.communication || new Communication(this.logger, this.registry);
        this.sharding = this.modules.sharding || new Sharding(this.options.sharding, this.logger, this.options.token, this.instanceID);
        this.clustering = this.modules.clustering || new Clustering(this.options.clustering, this.communication, this.sharding, this.registry, this.logger, this.alerts, this.queue);
        this.stats = this.modules.stats || new Stats(this.options.stats, this.communication, this.logger);
    }

    async init() {
        if (!this.clustering.isMaster) return;

        this.logger.registerTransport(new Console(this.options.logger));

        await this.logger.init();
        await this.alerts.init();
        await this.communication.init();
        await this.sharding.init();
        this.clustering.init();
    }
}

module.exports = Sharder;