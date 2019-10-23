"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const master = require("cluster");
/**
 *
 *
 * @class Clustering
 * @interface
 */
class Clustering {
    /**
     * Creates an instance of Clustering.
     * @param {Object} options Clustering options
     * @param {String} instanceID ID of the instance
     * @param {Communication} communication Communication module
     * @param {Sharding} sharding Sharding module
     * @param {Registry} registry Registry module
     * @param {Logger} logger Logger module
     * @param {Alerts} alerts Alerts module
     * @param {Queue} queue Queue module
     * @memberof Clustering
     */
    constructor(options, instanceID, communication, sharding, registry, logger, alerts, queue) {
        this.options = options || {};
        this.instanceID = instanceID;
        this.communication = communication;
        this.sharding = sharding;
        this.registry = registry;
        this.logger = logger;
        this.alerts = alerts;
        this.queue = queue;
        this.callbacks = {
            connect: {},
            restart: {},
        };
    }
    /**
     *
     *
     * @readonly
     * @memberof Clustering
     */
    get isMaster() {
        return master.isMaster;
    }
    /**
     * Initiate the clustering module
     * @returns {void}
     * @memberof Clustering
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            let numClusters = this.options.clusters || require('os').cpus().length;
            if (numClusters > this.sharding.getShardConfig().shards) {
                numClusters = this.sharding.getShardConfig().shards;
            }
            this.logger.info({
                msg: `Starting with ${numClusters} clusters`,
                src: 'Clustering',
            });
            master.on('exit', (worker, code) => {
                this.onExit(worker, code);
            });
            this.communication.on('cluster.connected', msg => {
                let data = msg.data;
                let connectCallback = this.callbacks.connect[data.clusterID];
                let restartCallback = this.callbacks.restart[data.clusterID];
                connectCallback(false);
                if (restartCallback) {
                    restartCallback(false);
                }
                this.alerts.alert({
                    date: new Date(),
                    msg: `Cluster ${data.clusterID}`,
                    title: 'Cluster Ready',
                    type: 'cluster',
                });
                this.logger.log({
                    msg: `Cluster ${data.clusterID} ready`,
                    src: 'Clustering',
                });
                delete this.callbacks.connect[data.clusterID];
                if (restartCallback) {
                    delete this.callbacks.restart[data.clusterID];
                }
            });
            yield this.sharding.shard(numClusters);
            this.startCluster(0, numClusters);
        });
    }
    fetchClusterID(workerID) {
        return __awaiter(this, void 0, void 0, function* () {
            let clusterID;
            try {
                clusterID = yield this.registry.getWorker(this.instanceID, workerID);
            }
            catch (err) {
                this.logger.error({
                    msg: err,
                    src: 'Registry',
                });
            }
            return clusterID;
        });
    }
    fetchConfig(clusterID) {
        return __awaiter(this, void 0, void 0, function* () {
            let clusterConfig;
            try {
                clusterConfig = yield this.registry.getCluster(this.instanceID, clusterID);
            }
            catch (err) {
                this.logger.error({
                    msg: err,
                    src: 'Clustering',
                });
                try {
                    clusterConfig = yield this.sharding.getConfig(clusterID);
                }
                catch (err1) {
                    this.logger.error({
                        msg: err1,
                        src: 'Clustering',
                    });
                    this.alerts.alert({
                        date: new Date(),
                        msg: `Failed to fetch config for cluster ${this.instanceID}`,
                        title: 'Clustering Error',
                        type: 'cluster',
                    });
                    return;
                }
            }
            let shardConfig;
            try {
                shardConfig = yield this.sharding.getConfig(clusterID);
            }
            catch (err) {
                this.logger.error({
                    msg: err,
                    src: 'Clustering',
                });
            }
            if (shardConfig)
                return Object.assign(clusterConfig, shardConfig);
            return clusterConfig;
        });
    }
    restart(start, end) {
        let clusters = [...Array(end - start).keys()].map(i => i + start);
        for (let cluster of clusters) {
            this.queue.schedule('clusters.restart', { event: 'restart', instanceID: this.instanceID, clusterID: cluster }, (data, cb) => {
                this.communication.send(data.instanceID.toString(), data.clusterID, data.event.toString(), {});
                this.callbacks.restart[data.clusterID.toString()] = cb;
                return true;
            });
        }
    }
    createCluster(clusterID, env, state) {
        let worker = master.fork(Object.assign({}, this.options.env, env));
        this.registry.registerCluster(this.instanceID, clusterID, Object.assign(state, { clusterID, workerID: worker.id }));
        this.registry.registerWorker(this.instanceID, worker.id, clusterID);
    }
    startCluster(clusterID, total) {
        return __awaiter(this, void 0, void 0, function* () {
            if (clusterID === total) {
                this.connectClusters(total);
            }
            else {
                let clusterConfig = yield this.sharding.getConfig(clusterID);
                if (!clusterConfig)
                    return this.logger.error({
                        msg: `Unable to fetch cluster config for cluster ${clusterID}`,
                        src: 'Clustering',
                    });
                let { firstShardID, lastShardID, maxShards } = clusterConfig;
                let env = {
                    CLUSTER_ID: clusterID,
                    FIRST_SHARD_ID: firstShardID,
                    INSTANCE_ID: this.instanceID,
                    LAST_SHARD_ID: lastShardID,
                    MAX_SHARDS: maxShards,
                    TOKEN: this.sharding.token,
                };
                this.createCluster(clusterID, env, {
                    firstShardID,
                    instanceID: this.instanceID,
                    lastShardID,
                    maxShards,
                });
                process.nextTick(() => {
                    this.startCluster(clusterID + 1, total);
                });
            }
        });
    }
    connectClusters(clusterCount) {
        let clusters = [...Array(clusterCount).keys()];
        for (let cluster of clusters) {
            this.queue.schedule('clusters.connect', { event: 'connect', instanceID: this.instanceID, clusterID: cluster }, (data, cb) => {
                this.communication.send(data.instanceID, data.clusterID, data.event, {});
                this.callbacks.connect[cluster] = cb;
            });
        }
    }
    restartCluster(workerID, code) {
        return __awaiter(this, void 0, void 0, function* () {
            let clusterID = yield this.fetchClusterID(workerID);
            if (!clusterID) {
                this.logger.error({
                    msg: `ClusterID not found for worker ${workerID}`,
                    src: 'Clustering',
                });
                this.alerts.alert({
                    date: new Date(),
                    msg: `ClusterID not found for worker ${workerID}`,
                    title: 'Clustering Error',
                    type: 'cluster',
                });
                return;
            }
            let config = yield this.fetchConfig(clusterID);
            if (!config)
                return;
            this.alerts.alert({
                date: new Date(),
                msg: `Shards ${config.firstShardID} - ${config.lastShardID}`,
                title: `Cluster ${clusterID} died with code ${code}. Restarting...`,
                type: 'cluster',
            });
            this.logger.warn({
                msg: `Cluster ${clusterID} died. Restarting...`,
                src: 'Clustering',
            });
            let { firstShardID, lastShardID, maxShards } = config;
            let env = {
                CLUSTER_ID: clusterID,
                FIRST_SHARD_ID: firstShardID,
                INSTANCE_ID: this.instanceID,
                LAST_SHARD_ID: lastShardID,
                MAX_SHARDS: maxShards,
                TOKEN: this.sharding.token,
            };
            this.registry.deleteCluster(this.instanceID, clusterID);
            this.registry.deleteWorker(this.instanceID, workerID);
            this.createCluster(clusterID, env, {
                firstShardID,
                instanceID: this.instanceID,
                lastShardID,
                maxShards,
            });
            this.queue.schedule('clusters.connect', { event: 'connect', instanceID: this.instanceID, clusterID }, (data, cb) => {
                this.communication.send(data.instanceID, data.clusterID, data.event, {});
                this.callbacks[clusterID] = cb;
            });
        });
    }
    onExit(worker, code) {
        this.restartCluster(worker.id, code);
    }
}
exports.Clustering = Clustering;
exports.default = Clustering;
