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
        this.logger = this.modules.logger || new Logger();
        this.communication = this.modules.communication || new Communication();
        this.sharding = this.modules.sharding || new Sharding(this.options.sharding);
        this.clustering = this.modules.clustering || new Clustering(this.options.clustering, this.communication, this.sharding);
        this.stats = this.modules.stats || new Stats(this.communication);

        await this.logger.init();
        await this.communication.init();
        await this.clustering.init();
        await this.sharding.init();
        await this.stats.init();
    }
}

module.exports = Sharder;