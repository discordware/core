const master = require('cluster');

class Clustering {
    constructor(options, communication, sharding, registry, logger, alerts, queue) {
        this.options = options;
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

    async fetchConfig(clusterID) {
        let clusterConfig;

        try {
            clusterConfig = await this.registry.get(`clusters.${this.sharding.instanceID}.${clusterID}`);
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
                    msg: `Failed to fetch config for cluster ${this.sharding.instanceID}`,
                    date: new Date(),
                    type: 'cluster'
                });
                return;
            }
        }

        let shardConfig;

        try {
            shardConfig = await this.sharding.getConfig(clusterID)
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

            let worker = master.fork(Object.assign(this.options.env, env));
            worker.id = clusterID;

            this.registry.set(`clusters.${this.sharding.instanceID}.${clusterID}`, {
                firstShardID,
                lastShardID,
                maxShards,
                instanceID,
                workerID: worker.id
            });

            process.nextTick(() => {
                this.startCluster(clusterID + 1, total);
            });
        }
    }

    connectCluster(clusterID, total) {
        if (clusterID === total) {

        } else {
            this.communication.send(this.sharding.instanceID, clusterID, 'connect', {});

            // TODO: Add Queue
        }
    }

    async restartCluster(clusterID, code) {
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
        worker.id = clusterID;

        this.registry.set(`clusters.${this.sharding.instanceID}.${clusterID}`, {
            firstShardID,
            lastShardID,
            maxShards,
            instanceID,
            workerID: worker.id
        });

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