import * as master from 'cluster';
import { EventEmitter } from 'events';
import uuid from 'uuid/v1';
import { ICommunication, ICommunicationOptions, IJSON, ILogger, IRegistry } from '../typings';

/**
 *
 *
 * @class Communication
 * @extends {EventEmitter}
 * @interface
 */
export default class Communication extends EventEmitter implements ICommunication {
    private options: ICommunicationOptions;
    private logger: ILogger;
    private registry: IRegistry;
    private reqTimeout: number;

    /**
     * Creates an instance of Communication.
     * @param {Object} options Communication options
     * @param {Logger} logger Logger module
     * @param {Registry} registry Registry module
     * @memberof Communication
     */
    constructor(options: ICommunicationOptions, logger: ILogger, registry: IRegistry) {
        super();
        this.options = options;
        this.logger = logger;
        this.registry = registry;
        this.reqTimeout = this.options.timeout || 5;
    }

    /**
     *  Initiate the Communication module
     *
     * @returns {Promise<void>} Resolves once the Communication module is fully initiated
     * @memberof Communication
     */
    public init(): Promise<void> {
        return new Promise(res => {
            master.on('message', (worker, msg) => {
                this.emit(msg.event, msg.data, worker.id);
            });

            this.on('send', data => {
                this.send(data.instanceID, data.clusterID, data.payload.event, data.payload.data);
            });

            this.on('awaitResponse', (data) => {
                this.awaitResponse(data.instanceID, data.clusterID, data.payload.event, data.payload.data).then(response => {
                    this.send(data.resp.instanceID, data.resp.clusterID, data.payload.id, response);
                }).catch(err => {
                    this.logger.error({
                        src: 'Communication',
                        msg: err,
                    });

                    this.send(data.resp.instanceID, data.resp.clusterID, data.payload.id, { err: true, message: err.message });
                });
            });

            this.on('broadcast', data => {
                this.broadcast(data.instanceID, data.payload.event, data.payload.data);
            });

            this.on('awaitResponse', data => {
                this.awaitBroadcast(data.instanceID, data.payload.event, data.payload.data).then(responses => {
                    this.send(data.resp.instanceID, data.resp.clusterID, data.payload.id, responses);
                }).catch(err => {
                    this.logger.error({
                        src: 'Communication',
                        msg: err,
                    });

                    this.send(data.resp.instanceID, data.resp.clusterID, data.payload.id, { err: true, message: err.message });
                });
            });

            res();
        });
    }

    /**
     * Connect to a peer instance
     * @returns {void}
     * @memberof Communication
     */
    public connectToPeer() {
        this.logger.error({
            src: 'Communication',
            msg: 'Peer connections not supported. Different communication module required.',
        });

        return Promise.resolve();
    }

    /**
     * Update connection to peer instance
     * @returns {void}
     * @memberof Communication
     */
    public updateConnection() {
        this.logger.error({
            src: 'Communication',
            msg: 'Peer connections not supported. Different communication module required.',
        });

        return Promise.resolve();
    }

    /**
     * Send an event
     *
     * @param {String} instanceID InstanceID of the instance the destination cluster is part of
     * @param {Number} clusterID The clusterID of the destination cluster
     * @param {String} event Name of the event
     * @param {*} data Event data
     * @returns {Promise<void | Error>} Resolves once the message has been sent
     * @memberof Communication
     */
    public send(instanceID: string, clusterID: number, event: string, data: IJSON): Promise<void> {
        let payload = {
            event,
            data,
        };

        return this.registry.getCluster(instanceID, clusterID).then(cluster => {
            master.workers[cluster.workerID].send(payload, null, err => {
                if (err) return Promise.reject(err);
                return Promise.resolve();
            });
        }).catch(err => {
            return Promise.reject(err);
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
     * @memberof Communication
     */
    public awaitResponse(instanceID: string, clusterID: number, event: string, data: IJSON): Promise<IJSON> {
        return new Promise((res, rej) => {
            let payload = {
                event,
                data,
                id: uuid(),
            };

            let err;

            this.registry.getCluster(instanceID, clusterID).then(cluster => {
                master.workers[cluster.workerID].send(payload);

                let timeout = setTimeout(() => {
                    rej(new Error(`Request ${payload.id} timed out`));
                }, 1000 * this.reqTimeout);

                this.once(payload.id, msg => {
                    clearTimeout(timeout);

                    res(msg.data);
                });
            }).catch(error => {
                err = new Error(error.message);
                rej(err);
            });
        });
    }

    /**
     * Broadcast an event to all clusters part of the specified instance
     *
     * @param {String} instanceID InstanceID of the instance the destination cluster is part of
     * @param {String} event Name of the event
     * @param {*} data Event data
     * @returns {Promise<Array>} Resolves once all clusters have received the broadcast
     * @memberof Communication
     */
    public broadcast(instanceID: string, event: string, data: IJSON): Promise<void[]> {
        return this.registry.getClusters(instanceID).then(clusters => {
            return Promise.all(Object.keys(clusters).map(clusterID => {
                return this.send(instanceID, parseInt(clusterID, 10), event, data);
            }));
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    /**
     * Broadcast an event to all clusters part of the specified instanceand wait for a response
     *
     * @param {String} instanceID InstanceID of the instance the destination cluster is part of
     * @param {String} event Name of the event
     * @param {*} data Event data
     * @returns {Promise<Array>} Resolves once all clusters have received the broadcast and responded
     * @memberof Communication
     */
    public awaitBroadcast(instanceID, event, data): Promise<IJSON[]> {
        return this.registry.getClusters(instanceID).then(clusters => {
            return Promise.all(Object.keys(clusters).map(clusterID => {
                return this.awaitResponse(instanceID, parseInt(clusterID, 10), event, data);
            }));
        }).catch(err => {
            return Promise.reject(err);
        });
    }
}
