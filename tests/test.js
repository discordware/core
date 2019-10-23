const { Sharder, Cluster } = require('../dist');
const master = require('cluster');
const Eris = require('eris');

require('dotenv').config();

if (master.isMaster) {
    let sharder = new Sharder('test', {
        token: process.env.TOKEN,
        sharding: {
            firstShardID: 0,
            shards: 2
        }
    });

    sharder.create().then(() => {
        sharder.init().then(() => {
        });
    });
} else {
    (async () => {
        const cluster = new Cluster();

        await cluster.init();

        cluster.communication.on('connect', async (msg) => {
            const firstShardID = parseInt(process.env.FIRST_SHARD_ID);
            const lastShardID = parseInt(process.env.LAST_SHARD_ID);
            const maxShards = parseInt(process.env.MAX_SHARDS);
            console.log(msg);

            console.log(`Cluster ${process.env.CLUSTER_ID} | Shards ${firstShardID} - ${lastShardID} | Total: ${lastShardID - firstShardID + 1}`);

            const bot = new Eris(process.env.TOKEN, {
                firstShardID,
                lastShardID,
                maxShards
            });

            bot.on('shardReady', () => {
                console.log('A shard readied');
            });

            bot.once('ready', () => {
                process.send({
                    event: 'cluster.connected',
                    data: {
                        clusterID: process.env.CLUSTER_ID
                    }
                });
            });

            try {
                await bot.connect();
            } catch (err) {
                console.log(err);
            }

            if (cluster.clusterID === 0) {
                setTimeout(() => {
                    cluster.communication.awaitResponse(cluster.instanceID, 1, 'hello', { ok: true });
                }, 1000 * 6);
            }
        });

        cluster.communication.on('hello', async msg => {
            console.log(msg);
        });
    })();
}