const Sharder = require('../index');
const master = require('cluster');

if (master.isMaster) {
    let sharder = new Sharder('jet', {
        token: 'asdf',
        sharding: {
            firstShardID: 0,
            shards: 160
        }
    });

    sharder.create().then(() => {
        sharder.init().then(() => {
        });
    });
} else {
    process.on('message', (msg) => {
        let firstShardID = process.env.FIRST_SHARD_ID;
        let lastShardID = process.env.LAST_SHARD_ID;
        console.log(`Cluster ${process.env.CLUSTER_ID} | Shards ${firstShardID} - ${lastShardID} | Total: ${lastShardID - firstShardID + 1}`);
        process.send({
            event: 'cluster.connected',
            data: {
                clusterID: process.env.CLUSTER_ID
            }
        });
    });
}