const master = require('cluster');


/**
 *
 *
 * @class Clustering
 * @interface
 */
class Clustering {

    /**
     *Creates an instance of Clustering.
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
        this.options = options;
        this.instanceID = instanceID;
        this.communication = communication;
        this.sharding = sharding;
        this.registry = registry;
        this.logger = logger;
        this.alerts = alerts;
        this.queue = queue;
        this.callbacks = {
            restart: {},
            connect: {}
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

    async fetchClusterID(workerID) {
        let clusterID;

        try {
            clusterID = await this.registry.getWorker(this.instanceID, workerID);
        } catch (err) {
            this.logger.error({
                src: 'Clustering',
                msg: err
            });
        }

        return clusterID;
    }

    async fetchConfig(clusterID) {
        let clusterConfig;

        try {
            clusterConfig = await this.registry.getCluster(this.instanceID, clusterID);
        } catch (err) {
            this.logger.error({
                src: 'Clustering',
                msg: err
            });

            try {
                clusterConfig = await this.sharding.getConfig(clusterID);
            } catch (err1) {
                this.logger.error({
                    src: 'Clustering',
                    msg: err1
                });

                this.alerts.alert({
                    title: 'Clustering Error',
                    msg: `Failed to fetch config for cluster ${this.instanceID}`,
                    date: new Date(),
                    type: 'cluster'
                });
                return;
            }
        }

        let shardConfig;

        try {
            shardConfig = await this.sharding.getConfig(clusterID);
        } catch (err) {
            this.logger.error({
                src: 'Clustering',
                msg: err
            });
        }

        if (shardConfig && shardConfig !== clusterConfig) return Object.assign(clusterConfig, shardConfig);
        return clusterConfig;
    }

    /**
     * Initiate the clustering module
     * @returns {void}
     * @memberof Clustering
     */
    async init() {
        const numClusters = this.options.clusters || require('os').cpus().length;

        this.logger.info({
            src: 'Clustering',
            msg: `Starting with ${numClusters} clusters`
        });

        master.on('exit', (...args) => {
            this.onExit(...args);
        });

        this.communication.on('cluster.connected', data => {
            let connectCallback = this.callbacks.connect[data.clusterID];
            let restartCallback = this.callbacks.restart[data.clusterID];

            connectCallback();

            if (restartCallback) {
                restartCallback();
            }

            this.alerts.alert({
                title: 'Cluster Ready',
                msg: `Cluster ${data.clusterID}`,
                date: new Date(),
                type: 'cluster'
            });

            this.logger.log({
                src: 'Clustering',
                msg: `Cluster ${data.clusterID} ready`
            });

            delete this.callbacks.connect[data.clusterID];

            if (restartCallback) {
                delete this.callbacks.restart[data.clusterID];
            }
        });

        await this.sharding.shard(numClusters);

        this.startCluster(0, numClusters);
    }

    /**
     *
     *
     * @memberof Clustering
     */
    reshard() {

    }

    restart(start, end) {
        let clusters = [...Array((end + 1) - start).values()];

        for (let cluster of clusters) {
            this.queue.schedule('clusters.restart', { event: 'restart', instanceID: this.instanceID, clusterID: cluster }, (data, cb) => {
                this.communication.send(data.instanceID, data.clusterID, data.event, {});
                this.callbacks.restart[data.clusterID] = cb;
            });
        }
    }

    createCluster(clusterID, env, state) {
        let worker = master.fork(Object.assign({}, this.options.env, env));

        this.registry.registerCluster(this.instanceID, clusterID, Object.assign(state, { clusterID, workerID: worker.id }));

        this.registry.registerWorker(this.instanceID, worker.id, clusterID);
    }

    async startCluster(clusterID, total) {
        if (clusterID === total) {
            this.logger.log({
                src: 'Clustering',
                msg: 'All clusters started'
            });

            this.connectClusters(total);
        } else {
            let clusterConfig = await this.sharding.getConfig(clusterID);

            if (!clusterConfig) return this.logger.error({
                src: 'Clustering',
                msg: `Unable to fetch cluster config for cluster ${clusterID}`
            });

            let { firstShardID, lastShardID, maxShards } = clusterConfig;

            let env = {
                TOKEN: this.sharding.token,
                FIRST_SHARD_ID: firstShardID,
                LAST_SHARD_ID: lastShardID,
                MAX_SHARDS: maxShards,
                INSTANCE_ID: this.instanceID,
                CLUSTER_ID: clusterID
            };

            this.createCluster(clusterID, env, {
                firstShardID,
                lastShardID,
                maxShards,
                instanceID: this.instanceID
            });

            process.nextTick(() => {
                this.startCluster(clusterID + 1, total);
            });
        }
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

    async restartCluster(workerID, code) {
        let clusterID = await this.fetchClusterID(workerID);

        if (!clusterID) {
            this.logger.error({
                src: 'Clustering',
                msg: `ClusterID not found for worker ${workerID}`
            });

            this.alerts.alert({
                title: 'Clustering Error',
                msg: `ClusterID not found for worker ${workerID}`,
                date: new Date(),
                type: 'cluster'
            });

            return;
        }

        let config = await this.fetchConfig(clusterID);

        if (!config) return;

        this.alerts.alert({
            title: `Cluster ${clusterID} died with code ${code}. Restarting...`,
            msg: `Shards ${config.firstShardID} - ${config.lastShardID}`,
            date: new Date(),
            type: 'cluster'
        });

        this.logger.warn({
            src: 'Clustering',
            msg: `Cluster ${clusterID} died. Restarting...`
        });

        let { firstShardID, lastShardID, maxShards } = config;

        let env = {
            TOKEN: this.sharding.token,
            FIRST_SHARD_ID: firstShardID,
            LAST_SHARD_ID: lastShardID,
            MAX_SHARDS: maxShards,
            INSTANCE_ID: this.instanceID,
            CLUSTER_ID: clusterID
        };

        this.registry.deleteCluster(this.instanceID, clusterID);
        this.registry.deleteWorker(this.instanceID, workerID);

        this.createCluster(clusterID, env, {
            firstShardID,
            lastShardID,
            maxShards,
            instanceID: this.instanceID
        });

        this.queue.schedule('clusters.connect', { event: 'connect', instanceID: this.instanceID, clusterID: clusterID }, (data, cb) => {
            this.communication.send(data.instanceID, data.clusterID, data.event, {});
            this.callbacks[clusterID] = cb;
        });
    }

    onExit(worker, code) {
        this.restartCluster(worker.id, code);
    }
}

module.exports = Clustering;