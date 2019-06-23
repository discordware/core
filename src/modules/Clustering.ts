import * as master from 'cluster';
import {
    IAlerts,
    ICallbacks,
    IClusterConfig,
    IClustering,
    IClusteringOptions,
    ICommunication,
    ILogger,
    IQueue,
    IRegistry,
    IShardConfig,
    ISharding,
} from '../typings';

/**
 *
 *
 * @class Clustering
 * @interface
 */
export class Clustering implements IClustering {
    private options: IClusteringOptions;
    private queue: IQueue;
    private instanceID: string;
    private communication: ICommunication;
    private sharding: ISharding;
    private registry: IRegistry;
    private logger: ILogger;
    private alerts: IAlerts;
    private callbacks: ICallbacks;

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
    constructor(options: IClusteringOptions, instanceID: string, communication: ICommunication, sharding: ISharding, registry: IRegistry, logger: ILogger, alerts: IAlerts, queue: IQueue) {
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
    public async init() {
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

        this.communication.on('cluster.connected', data => {
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

        await this.sharding.shard(numClusters);

        this.startCluster(0, numClusters);
    }

    private async fetchClusterID(workerID) {
        let clusterID;

        try {
            clusterID = await this.registry.getWorker(this.instanceID, workerID);
        } catch (err) {
            this.logger.error({
                msg: err,
                src: 'Clustering',
            });
        }

        return clusterID;
    }

    private async fetchConfig(clusterID) {
        let clusterConfig: IShardConfig;

        try {
            clusterConfig = await this.registry.getCluster(this.instanceID, clusterID);
        } catch (err) {
            this.logger.error({
                msg: err,
                src: 'Clustering',
            });

            try {
                clusterConfig = await this.sharding.getConfig(clusterID);
            } catch (err1) {
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
            shardConfig = await this.sharding.getConfig(clusterID);
        } catch (err) {
            this.logger.error({
                msg: err,
                src: 'Clustering',
            });
        }

        if (shardConfig) return Object.assign(clusterConfig, shardConfig);
        return clusterConfig;
    }

    private restart(start: number, end: number) {
        let clusters = [...Array(end - start).keys()].map(i => i + start);

        for (let cluster of clusters) {
            this.queue.schedule('clusters.restart', { event: 'restart', instanceID: this.instanceID, clusterID: cluster }, (data, cb) => {
                this.communication.send(data.instanceID.toString(), data.clusterID, data.event.toString(), {});
                this.callbacks.restart[data.clusterID.toString()] = cb;
                return true;
            });
        }
    }

    private createCluster(clusterID, env, state) {
        let worker = master.fork(Object.assign({}, this.options.env, env));

        this.registry.registerCluster(this.instanceID, clusterID, Object.assign(state, { clusterID, workerID: worker.id }));

        this.registry.registerWorker(this.instanceID, worker.id, clusterID);
    }

    private async startCluster(clusterID, total) {
        if (clusterID === total) {
            this.connectClusters(total);
        } else {
            let clusterConfig: IShardConfig = await this.sharding.getConfig(clusterID);

            if (!clusterConfig) return this.logger.error({
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
    }

    private connectClusters(clusterCount) {
        let clusters = [...Array(clusterCount).keys()];

        for (let cluster of clusters) {
            this.queue.schedule('clusters.connect', { event: 'connect', instanceID: this.instanceID, clusterID: cluster }, (data, cb) => {
                this.communication.send(data.instanceID, data.clusterID, data.event, {});
                this.callbacks.connect[cluster] = cb;
            });
        }
    }

    private async restartCluster(workerID, code) {
        let clusterID = await this.fetchClusterID(workerID);

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

        let config = await this.fetchConfig(clusterID);

        if (!config) return;

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

        this.queue.schedule<{event: string, instanceID: string, clusterID: number}>('clusters.connect', { event: 'connect', instanceID: this.instanceID, clusterID }, (data, cb) => {
            this.communication.send(data.instanceID, data.clusterID, data.event, {});
            this.callbacks[clusterID] = cb;
        });
    }

    private onExit(worker, code) {
        this.restartCluster(worker.id, code);
    }
}

export default Clustering;
