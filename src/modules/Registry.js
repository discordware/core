
/**
 *
 *
 * @class Registry
 */
class Registry {

    /**
     *Creates an instance of Registry.
     * @memberof Registry
     */
    constructor() {
        this._clusters = {};
        this._instances = {};
        this._workers = {};
        this._shards = {};
    }

    /**
     *
     *
     * @returns
     * @memberof Registry
     */
    init() {
        return Promise.resolve();
    }

    /**
     *
     *
     * @param {*} instanceID
     * @param {*} config
     * @returns
     * @memberof Registry
     */
    registerInstance(instanceID, config) {
        this._instances[instanceID] = config;
        this._clusters[instanceID] = {};
        this._workers[instanceID] = {};
        this._shards[instanceID] = {};
        return Promise.resolve();
    }

    /**
     *
     *
     * @param {*} instanceID
     * @returns
     * @memberof Registry
     */
    getInstance(instanceID) {
        if (!this._instances[instanceID]) return Promise.reject(new Error(`No registered instance with ID ${instanceID}.`));
        return Promise.resolve(this._instances[instanceID]);
    }

    /**
     *
     *
     * @returns
     * @memberof Registry
     */
    getInstances() {
        return Promise.resolve(Object.values(this._instances));
    }

    /**
     *
     *
     * @param {*} instanceID
     * @returns
     * @memberof Registry
     */
    deleteInstance(instanceID) {
        delete this._instances[instanceID];
        return Promise.resolve();
    }

    /**
     *
     *
     * @param {*} instanceID
     * @param {*} clusterID
     * @param {*} config
     * @returns
     * @memberof Registry
     */
    registerCluster(instanceID, clusterID, config) {
        this._clusters[instanceID][clusterID] = config;
        return Promise.resolve();
    }

    /**
     *
     *
     * @param {*} instanceID
     * @param {*} clusterID
     * @returns
     * @memberof Registry
     */
    getCluster(instanceID, clusterID) {
        if (!this._clusters[instanceID][clusterID]) return Promise.reject(new Error(`No registered cluster with ID ${clusterID}.`));
        return Promise.resolve(this._clusters[instanceID][clusterID]);
    }

    /**
     *
     *
     * @param {*} instanceID
     * @returns
     * @memberof Registry
     */
    getClusters(instanceID) {
        return Promise.resolve(Object.values(this._clusters[instanceID]));
    }

    /**
     *
     *
     * @param {*} instanceID
     * @param {*} clusterID
     * @returns
     * @memberof Registry
     */
    deleteCluster(instanceID, clusterID) {
        delete this._clusters[instanceID][clusterID];
        return Promise.resolve();
    }

    /**
     *
     *
     * @param {*} instanceID
     * @param {*} workerID
     * @param {*} clusterID
     * @returns
     * @memberof Registry
     */
    registerWorker(instanceID, workerID, clusterID) {
        this._workers[instanceID][workerID] = clusterID;
        return Promise.resolve();
    }

    /**
     *
     *
     * @param {*} instanceID
     * @param {*} workerID
     * @returns
     * @memberof Registry
     */
    getWorker(instanceID, workerID) {
        if (!this._workers[instanceID][workerID]) return Promise.reject(new Error(`No registered worker with ID ${workerID}.`));
        return Promise.resolve(this._workers[instanceID][workerID]);
    }

    /**
     *
     *
     * @param {*} instanceID
     * @returns
     * @memberof Registry
     */
    getWorkers(instanceID) {
        return Promise.resolve(Object.values(this._workers[instanceID]));
    }

    /**
     *
     *
     * @param {*} instanceID
     * @param {*} workerID
     * @returns
     * @memberof Registry
     */
    deleteWorker(instanceID, workerID) {
        delete this._workers[instanceID][workerID];
        return Promise.resolve();
    }

    /**
     *
     *
     * @param {*} instanceID
     * @param {*} clusterID
     * @param {*} config
     * @memberof Registry
     */
    registerShardConfig(instanceID, clusterID, config) {
        this._shards[instanceID][clusterID] = config;
    }

    /**
     *
     *
     * @param {*} instanceID
     * @param {*} clusterID
     * @returns
     * @memberof Registry
     */
    getShardConfig(instanceID, clusterID) {
        if (!this._shards[instanceID][clusterID]) return Promise.reject(new Error(`No registered shardConfig for cluster ${clusterID}.`));
        return Promise.resolve(this._shards[instanceID][clusterID]);
    }

    /**
     *
     *
     * @param {*} instanceID
     * @param {*} clusterID
     * @returns
     * @memberof Registry
     */
    deleteShardConfig(instanceID, clusterID) {
        delete this._shards[instanceID][clusterID];
        return Promise.resolve();
    }
}

module.exports = Registry;