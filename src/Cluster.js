class Cluster {
    constructor() {
        
    } 

    async init() {
        await this.base.init();

        return Promise.resolve();
    }
}

module.exports = Cluster;