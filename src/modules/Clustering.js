const master = require('cluster');

class Clustering {
    constructor(options, communication, sharding) {
        this.options = options;
        this.communication = communication;
        this.sharding = sharding;
    }

    get isMaster() {
        return master.isMaster;
    }

    init() {
        
    }
}

module.exports = Clustering;