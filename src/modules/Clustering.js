const master = require('cluster');

class Clustering {
    constructor(options, communication, sharding, registry, logger, alerts) {
        this.options = options;
        this.communication = communication;
        this.sharding = sharding;
        this.registry = registry;
        this.logger = logger;
        this.alerts = alerts;
    }

    get isMaster() {
        return master.isMaster;
    }

    init() {
        const numClusters = this.options.clusters || require('os').cpus().length;

        master.on('exit', (...args) => {
            this.onExit(...args);
        }).on('disconnect', (...args) => {
            this.onDisconnect(...args);
        });

        this.startCluster(1, numClusters);
    }

    async startCluster(clusterID, total) {
        if (clusterID === total) {

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

            this.registry.register(clusterID, {
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

    async restartCluster(clusterID) {
        let clusterConfig;

        try {
            clusterConfig = await this.registry.get(clusterID);
        } catch (err) {
            this.logger.error({
                src: 'Clustering',
                msg: err
            });

            try {
                clusterConfig = await this.sharding.getConfig(clusterConfig);
            } catch (err1) {
                this.logger.error({
                    src: 'Clustering',
                    msg: err1
                });

                this.alerts.alert({
                    title: 'Clustering error',
                    msg: `Failed to fetch config for cluster ${this.sharding.instanceID}`,
                    date: new Date(),
                    type: 'cluster'
                });

                return;
            }
        }

        
    }

    onExit(worker, code, signal) {

    }

    onDisconnect(worker) {

    }
}

module.exports = Clustering;