class Registry {
    constructor() {
        this._clusters = {};
        this._instances = {};
        this._workers = {};
        this._shards = {};
    }

    init() {
        return Promise.resolve();
    }

    registerInstance(instanceID, config) {
        this._instances[instanceID] = config;
        this._clusters[instanceID] = {};
        this._workers[instanceID] = {};
        this._shards[instanceID] = {};
        return Promise.resolve();
    }

    getInstance(instanceID) {
        if (!this._instances[instanceID]) return Promise.reject(new Error(`No registered instance with ID ${instanceID}.`));
        return Promise.resolve(this._instances[instanceID]);
    }

    getInstances() {
        return Promise.resolve(Object.values(this._instances));
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
        if (!this._clusters[instanceID][clusterID]) return Promise.reject(new Error(`No registered cluster with ID ${clusterID}.`));
        return Promise.resolve(this._clusters[instanceID][clusterID]);
    }

    getClusters(instanceID) {
        return Promise.resolve(Object.values(this._clusters[instanceID]));
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
        if (!this._workers[instanceID][workerID]) return Promise.reject(new Error(`No registered worker with ID ${workerID}.`));
        return Promise.resolve(this._workers[instanceID][workerID]);
    }

    getWorkers(instanceID) {
        return Promise.resolve(Object.values(this._workers[instanceID]));
    }

    deleteWorker(instanceID, workerID) {
        delete this._workers[instanceID][workerID];
        return Promise.resolve();
    }

    registerShardConfig(instanceID, clusterID, config) {
        this._shards[instanceID][clusterID] = config;
    }

    getShardConfig(instanceID, clusterID) {
        if (!this._shards[instanceID][clusterID]) return Promise.reject(new Error(`No registered shardConfig for cluster ${clusterID}.`));
        return Promise.resolve(this._shards[instanceID][clusterID]);
    }

    deleteShardConfig(instanceID, clusterID) {
        delete this._shards[instanceID][clusterID];
        return Promise.resolve();
    }
}

module.exports = Registry;