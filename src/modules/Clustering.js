const master = require('cluster');

class Clustering {
    constructor(options, instanceID, communication, sharding, registry, logger, alerts, queue) {
        this.options = options;
        this.instanceID = instanceID;
        this.communication = communication;
        this.sharding = sharding;
        this.registry = registry;
        this.logger = logger;
        this.alerts = alerts;
        this.queue = queue;
    }

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

    async init() {
        const numClusters = this.options.clusters || require('os').cpus().length;

        master.on('exit', (...args) => {
            this.onExit(...args);
        });

        await this.sharding.shard(numClusters);

        this.startCluster(1, numClusters + 1);
    }

    async startCluster(clusterID, total) {
        if (clusterID === total) {
            this.logger.log({
                src: 'Clustering',
                msg: 'Started clusters'
            });

            this.connectCluster(1, total);
        } else {
            let clusterConfig = await this.sharding.getConfig(clusterID);

            if (!clusterConfig) return this.logger.error({
                src: 'Clustering',
                msg: `Unable to fetch cluster config for cluster ${clusterID}`
            });

            let { firstShardID, lastShardID, maxShards, instanceID, token } = clusterConfig;

            let env = {
                TOKEN: token,
                FIRST_SHARD_ID: firstShardID,
                LAST_SHARD_ID: lastShardID,
                MAX_SHARDS: maxShards,
                INSTANCE_ID: instanceID,
                CLUSTER_ID: clusterID
            };

            let worker = master.fork(Object.assign({}, this.options.env, env));

            this.registry.registerCluster(this.instanceID, clusterID, {
                firstShardID,
                lastShardID,
                maxShards,
                instanceID
            });

            this.registry.registerWorker(this.instanceID, worker.id, clusterID);

            process.nextTick(() => {
                this.startCluster(clusterID + 1, total);
            });
        }
    }

    connectCluster(clusterID, total) {
        if (clusterID === total) {

        } else {
            this.communication.send(this.instanceID, clusterID, 'connect', {});

            // TODO: Add Queue
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

        let { firstShardID, lastShardID, maxShards, instanceID } = config;

        let env = {
            TOKEN: this.sharding.token,
            FIRST_SHARD_ID: firstShardID,
            LAST_SHARD_ID: lastShardID,
            MAX_SHARDS: maxShards,
            INSTANCE_ID: instanceID,
            CLUSTER_ID: clusterID
        };

        let worker = master.fork(Object.assign(this.options.env, env));

        this.registry.deleteCluster(this.instanceID, clusterID);

        this.registry.registerCluster(this.instanceID, clusterID, {
            firstShardID,
            lastShardID,
            maxShards,
            instanceID
        });

        this.registry.deleteWorker(this.instanceID, workerID);
        this.registry.registerWorker(this.instanceID, workerID, clusterID);

        this.alerts.alert({
            title: 'Cluster Restart',
            msg: `Cluster ${clusterID} restarted!`,
            date: new Date(),
            type: 'cluster'
        });

        this.logger.log({
            src: 'Clustering',
            msg: `Restarted cluster ${clusterID}`
        });
    }

    onExit(worker, code) {

        // TODO: add restart queueing
        this.restartCluster(worker.id, code);
    }
}

module.exports = Clustering;