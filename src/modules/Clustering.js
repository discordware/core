const master = require('cluster');

class Clustering {
    constructor(options, communication, sharding, logger) {
        this.options = options;
        this.communication = communication;
        this.sharding = sharding;
        this.logger = logger;
    }

    get isMaster() {
        return master.isMaster;
    }

    init() {
        
    }
}

module.exports = Clustering;