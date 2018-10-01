const master = require('cluster');

class Cluster {
    constructor(base) {
        this.base = base;
    } 

    static get isWorker() {
        return master.isWorker;
    }

    async init() {
        await this.base.init();

        return Promise.resolve();
    }
}

module.exports = Cluster;