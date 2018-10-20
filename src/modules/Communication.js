const EventEmitter = require('events').EventEmitter;
const master = require('cluster');
const uuid = require('uuid/v1');

/**
 *
 *
 * @class Communication
 * @extends {EventEmitter}
 * @interface
 */
class Communication extends EventEmitter {

    /**
     *Creates an instance of Communication.
     * @param {*} options
     * @param {*} logger
     * @param {*} registry
     * @memberof Communication
     */
    constructor(options, logger, registry) {
        super();
        this.options = options;
        this.logger = logger;
        this.registry = registry;
        this.reqTimeout = this.options.timeout || 5;
    }

    /**
     *
     *
     * @returns
     * @memberof Communication
     */
    init() {
        return new Promise(res => {
            master.on('message', (worker, msg) => {
                this.emit(msg.event, msg.data);
            });

            res();
        });
    }

    /**
     *
     *
     * @memberof Communication
     */
    connectToPeer() {
        this.logger.error('Communication', 'Peer connections not supported. Different communication module required.');
    }

    /**
     *
     *
     * @memberof Communication
     */
    updateConnection() {
        this.logger.error('Communication', 'Peer connections not supported. Different communication module required.');
    }

    /**
     *
     *
     * @param {*} instanceID
     * @param {*} clusterID
     * @param {*} event
     * @param {*} data
     * @memberof Communication
     */
    send(instanceID, clusterID, event, data) {
        let payload = {
            event,
            data
        };

        this.registry.getCluster(instanceID, clusterID).then(cluster => {
            master.workers[cluster.workerID].send(payload, null, err => {
                if (err) return Promise.reject(err);
                return Promise.resolve();
            });
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    /**
     *
     *
     * @param {*} instanceID
     * @param {*} clusterID
     * @param {*} event
     * @param {*} data
     * @param {*} callback
     * @returns
     * @memberof Communication
     */
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
            }).catch(error => {
                err = new Error(error.message);
                if (callback) {
                    callback(err, null);
                } else {
                    rej(err);
                }
            });
        });
    }

    /**
     *
     *
     * @param {*} instanceID
     * @param {*} event
     * @param {*} data
     * @memberof Communication
     */
    broadcast(instanceID, event, data) {
        let payload = {
            event,
            data
        };
    }

    /**
     *
     *
     * @param {*} instanceID
     * @param {*} event
     * @param {*} data
     * @param {*} callback
     * @returns
     * @memberof Communication
     */
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