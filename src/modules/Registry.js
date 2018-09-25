class Registry {
    constructor() {
        this._clusters = {};
        this._instances = {};
        this._workers = {};
    }

    registerInstance(instanceID, config) {
        this._instances[instanceID] = config;
    }

    getInstance(instanceID) {
        return Promise.resolve(this._instances[instanceID]);
    }

    deleteInstance(instanceID) {
        delete this._instances[instanceID];
    }

    registerCluster(instanceID, clusterID, config) {
        this._clusters[instanceID][clusterID] = config;
    }

    getCluster(instanceID, clusterID) {
        return Promise.resolve(this._clusters[instanceID][clusterID]);
    }

    deleteCluster(instanceID, clusterID) {
        delete this._clusters[instanceID][clusterID];
    }

    registerWorker(instanceID, workerID, clusterID) {
        this._workers[instanceID][workerID] = clusterID;
    }

    getWorker(instanceID, workerID) {
        return Promise.resolve(this._workers[instanceID][workerID]);
    }

    deleteWorker(instanceID, workerID) {
        delete this._workers[instanceID][workerID];
    }
}

module.exports = Registry;