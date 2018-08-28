const Clustering = require('./modules/Clustering');
const Communication = require('./modules/Communication');
const Logger = require('./modules/Logger');
const Sharding = require('./modules/Sharding');
const Stats = require('./modules/Stats');

class Sharder {
    constructor(modules, options) {
        // Modules
        this.clustering = modules.clustering || new Clustering();
        this.communication = modules.communication || new Communication();
        this.logger = modules.logger || new Logger();
        this.sharding = modules.sharding || new Sharding();
        this.stats = modules.stats || new Stats();

        // Options
        this.token = options.token;
    }

    init() {

    }
}

module.exports = Sharder;