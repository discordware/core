const master = require('cluster');

class Clustering {
    constructor(options, communication, sharding, logger, registry) {
        this.options = options;
        this.communication = communication;
        this.sharding = sharding;
        this.logger = logger;
        this.registry = registry;
    }

    get isMaster() {
        return master.isMaster;
    }

    init() {
        
    }
}

module.exports = Clustering;