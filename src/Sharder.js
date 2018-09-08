// Modules
const Alerts = require('./modules/Alerts');
const Clustering = require('./modules/Clustering');
const Communication = require('./modules/Communication');
const Logger = require('./modules/Logger');
const Registry = require('./modules/Registry');
const Sharding = require('./modules/Sharding');
const Stats = require('./modules/Stats');

// Transports & Destinations
const Console = require('./transports/Console');
const Discord = require('./destinations/Discord');

class Sharder {
    constructor(instanceID, options, modules) {
        this.modules = modules;
        this.options = options;
        this.instanceID = instanceID || 'Aplha';
    }

    create() {
        this.logger = this.modules.logger || new Logger();
        this.alerts = this.modules.alerts || new Alerts();
        this.registry = this.modules.registry || new Registry();
        this.communication = this.modules.communication || new Communication(this.logger, this.registry);
        this.sharding = this.modules.sharding || new Sharding(this.options.sharding, this.logger, this.options.token, this.instanceID);
        this.clustering = this.modules.clustering || new Clustering(this.options.clustering, this.communication, this.sharding, this.logger, this.registry);
        this.stats = this.modules.stats || new Stats(this.options.stats, this.communication, this.logger);
    }

    async init() {
        if (!this.clustering.isMaster) return;

        this.logger.registerTransport(new Console(this.options.logger));
        this.alerts.registerDestination(new Discord(this.options.token, this.instanceID, this.options.alerts));

        await this.logger.init();
        await this.alerts.init();
        await this.communication.init();
        await this.sharding.init();
        await this.clustering.init();
    }
}

module.exports = Sharder;