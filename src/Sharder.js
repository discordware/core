const Clustering = require('./modules/Clustering');
const Communication = require('./modules/Communication');
const Logger = require('./modules/Logger');
const Sharding = require('./modules/Sharding');
const Stats = require('./modules/Stats');

class Sharder {
    constructor(modules, options) {
        this.modules = modules;
        this.options = options;
    }

    async init() {
        this.logger = this.modules.logger || new Logger(this.options.logger);
        this.communication = this.modules.communication || new Communication(this.logger);
        this.sharding = this.modules.sharding || new Sharding(this.options.sharding, this.options.token, this.logger);
        this.clustering = this.modules.clustering || new Clustering(this.options.clustering, this.communication, this.sharding, this.logger);
        this.stats = this.modules.stats || new Stats(this.options.stats, this.communication, this.logger);

        if (!this.clustering.isMaster) return;

        await this.logger.init();
        await this.communication.init();
        await this.sharding.init();
        await this.clustering.init();
    }
}

module.exports = Sharder;