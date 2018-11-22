const EventEmitter = require('events').EventEmitter;
const uuid = require('uuid/v1');
const cluster = require('cluster');


/**
 * Cluster-side communication module
 *
 * @class ClusterCommunication
 * @extends {EventEmitter}
 */
class ClusterCommunication extends EventEmitter {
    constructor(options) {
        super();
        this.options = options;
        this.reqTimeout = this.options.timeout || 5;
    }

    /**
     *  Initiate the Communication module
     *
     * @returns {Promise<void>} Resolves once the Communication module is fully initiated
     * @memberof ClusterCommunication
     */
    init() {
        return new Promise(res => {
            process.on('message', (msg) => {
                this.emit(msg.event, msg.data);
            });

            res();
        });
    }

    /**
     * Send an event
     *
     * @param {String} instanceID InstanceID of the instance the destination cluster is part of
     * @param {Number} clusterID The clusterID of the destination cluster
     * @param {String} event Name of the event
     * @param {*} data Event data 
     * @returns {void}
     * @memberof ClusterCommunication
     */
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

    /**
     * Send an event and wait for response
     *
     * @param {String} instanceID InstanceID of the instance the destination cluster is part of
     * @param {Number} clusterID The clusterID of the destination cluster
     * @param {String} event Name of the event
     * @param {*} data Event data 
     * @returns {Promise<Object | Error>} Resolves once the message has been sent
     * @memberof ClusterCommunication
     */
    awaitResponse(instanceID, clusterID, event, data) {
        return new Promise((res, rej) => {
            let payload = {
                event,
                data,
                id: uuid()
            };

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

                if (msg.err) {
                    return rej(msg.message);
                }

                res(msg.data);
            });
        });
    }

    /**
     * Broadcast an event to all clusters part of the specified instance
     *
     * @param {String} instanceID InstanceID of the instance the destination cluster is part of
     * @param {String} event Name of the event
     * @param {*} data Event data 
     * @returns {void}
     * @memberof ClusterCommunication
     */
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

    /**
     * Broadcast an event to all clusters part of the specified instanceand wait for a response
     *
     * @param {String} instanceID InstanceID of the instance the destination cluster is part of
     * @param {String} event Name of the event
     * @param {*} data Event data 
     * @returns {Promise<Array>} Resolves once all clusters have received the broadcast and responded
     * @memberof ClusterCommunication
     */
    awaitBroadcast(instanceID, event, data) {
        return new Promise((res, rej) => {
            let payload = {
                event,
                data,
                id: uuid()
            };

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

                res(msg.data);
            });
        });
    }
}

module.exports = ClusterCommunication;