const EventEmitter = require('events').EventEmitter;
const master = require('cluster');
const uuid = require('uuid/v1');

class Communication extends EventEmitter {
    constructor(logger, registry) {
        super();
        this.logger = logger;
        this.registry = registry;
    }

    init() {
        return Promise.resolve();
    }

    send(instanceID, clusterID, event, data) {
        let payload = {
            event,
            data
        };
    }

    awaitResponse(instanceID, clusterID, event, data, callback) {
        return new Promise((res, rej) => {
            let payload = {
                event,
                data,
                id: uuid()
            };

            let err;

            this.registry.getCluster(instanceID, clusterID).then(cluster => {
                master.workers[cluster.workerID].send(payload);

                this.once(payload.id, msg => {
                    if (callback) {
                        callback(err, msg.data);
                    } else {
                        res(msg.data);
                    }
                });
            }).catch(() => {
                err = new Error('Unable to fetch workerID');
                if (callback) {
                    callback(err, null);
                } else {
                    rej(err);
                }
            });
        });
    }

    broadcast(instanceID, event, data) {
        let payload = {
            event,
            data
        };
    }

    awaitBroadcast(instanceID, event, data, callback) {
        return new Promise((res, rej) => {
            let payload = {
                event,
                data,
                id: uuid()
            };
        });
    }
}

module.exports = Communication;