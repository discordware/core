const EventEmitter = require('events').EventEmitter;
const uuid = require('uuid/v1');
const cluster = require('cluster');

class ClusterCommunication extends EventEmitter {
    constructor(options) {
        super();
        this.options = options;
        this.reqTimeout = this.options.timeout || 5;
    }

    init() {
        return new Promise(res => {
            process.on('message', (msg) => {
                this.emit(msg.event, msg.data);
            });

            res();
        });
    }

    send(instanceID, clusterID, event, data) {
        let payload = {
            event,
            data
        };

        process.send({
            event: 'send',
            data: {
                instanceID,
                clusterID,
                payload
            }
        });
    }

    awaitResponse(instanceID, clusterID, event, data, callback) {
        return new Promise((res, rej) => {
            let payload = {
                event,
                data,
                id: uuid()
            };

            let err;

            process.send({
                event: 'awaitResponse',
                data: {
                    instanceID,
                    clusterID,
                    payload
                },
                resp: {
                    instanceID: process.env.INSTANCE_ID,
                    clusterID: process.env.CLUSTER_ID,
                    workerID: cluster.worker.id
                }
            });

            let timeout = setTimeout(() => {
                rej(new Error(`Request ${payload.id} timed out`));
            }, 1000 * this.reqTimeout);

            this.once(payload.id, msg => {
                clearTimeout(timeout);

                if (callback) {
                    if (msg.err) {
                        err = msg.message;
                    }

                    callback(err, msg.data);
                } else {
                    if (msg.err) {
                        return rej(msg.message);
                    }
                    
                    res(msg.data);
                }
            });
        });
    }

    broadcast(instanceID, event, data) {
        let payload = {
            event,
            data
        };

        process.send({
            event: 'broadcast',
            data: {
                instanceID,
                payload
            }
        });
    }

    awaitBroadcast(instanceID, event, data, callback) {
        return new Promise((res, rej) => {
            let payload = {
                event,
                data,
                id: uuid()
            };

            let err;

            process.send({
                event: 'awaitBroadcast',
                data: {
                    instanceID,
                    payload
                }
            });

            let timeout = setTimeout(() => {
                rej(new Error(`Request ${payload.id} timed out`));
            }, 1000 * this.reqTimeout);

            this.once(payload.id, msg => {
                clearTimeout(timeout);

                if (callback) {
                    callback(err, msg.data);
                } else {
                    res(msg.data);
                }
            });
        });
    }
}

module.exports = ClusterCommunication;