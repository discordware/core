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

    init() {
        this.logger = this.modules.logger || new Logger();
        this.communication = this.modules.communication || new Communication();
        this.clustering = this.modules.clustering || new Clustering();
        this.sharding = this.modules.sharding || new Sharding();
        this.stats = this.modules.stats || new Stats(this.communication);
    }
}

module.exports = Sharder;