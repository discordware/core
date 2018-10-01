class Registry {
    constructor() {
        this._clusters = {};
        this._instances = {};
        this._workers = {};
    }

    registerInstance(instanceID, config) {
        this._instances[instanceID] = config;
        return Promise.resolve();
    }

    getInstance(instanceID) {
        return Promise.resolve(this._instances[instanceID]);
    }

    deleteInstance(instanceID) {
        delete this._instances[instanceID];
        return Promise.resolve();
    }

    registerCluster(instanceID, clusterID, config) {
        this._clusters[instanceID][clusterID] = config;
        return Promise.resolve();
    }

    getCluster(instanceID, clusterID) {
        return Promise.resolve(this._clusters[instanceID][clusterID]);
    }

    deleteCluster(instanceID, clusterID) {
        delete this._clusters[instanceID][clusterID];
        return Promise.resolve();
    }

    registerWorker(instanceID, workerID, clusterID) {
        this._workers[instanceID][workerID] = clusterID;
        return Promise.resolve();
    }

    getWorker(instanceID, workerID) {
        return Promise.resolve(this._workers[instanceID][workerID]);
    }

    deleteWorker(instanceID, workerID) {
        delete this._workers[instanceID][workerID];
        return Promise.resolve();
    }
}

module.exports = Registry;