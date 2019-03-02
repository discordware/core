import * as cluster from 'cluster';
import { EventEmitter } from 'events';
import uuid from 'uuid/v1';
import { IClusterCommunication, IClusterCommunicationOptions, IJSON } from '../typings';

/**
 * Cluster-side communication module
 */
export default class ClusterCommunication extends EventEmitter implements IClusterCommunication {
    private options: IClusterCommunicationOptions;
    private reqTimeout: number;


    /**
     * Creates an instance of ClusterCommunication.
     * @param options Options for the cluster communication module
     * @memberof ClusterCommunication
     */
    constructor(options: IClusterCommunicationOptions) {
        super();
        this.options = options;
        this.reqTimeout = this.options.timeout || 5;
    }

    /**
     *  Initiate the Communication module
     *
     * @returns Resolves once the Communication module is fully initiated
     * @memberof ClusterCommunication
     */
    public init(): Promise<void> {
        process.on('message', (msg) => {
            this.emit(msg.event, msg.data);
        });

        return Promise.resolve();
    }

    /**
     * Send an event
     *
     * @param instanceID InstanceID of the instance the destination cluster is part of
     * @param clusterID The clusterID of the destination cluster
     * @param event Name of the event
     * @param data Event data
     * @returns Resolves once the event and payload have been sent
     * @memberof ClusterCommunication
     */
    public send(instanceID: string, clusterID: number, event: string, data: IJSON): Promise<void> {
        let payload = {
            event,
            data,
        };

        process.send({
            event: 'send',
            data: {
                instanceID,
                clusterID,
                payload,
            },
        });

        return Promise.resolve();
    }

    /**
     * Send an event and wait for response
     *
     * @param instanceID InstanceID of the instance the destination cluster is part of
     * @param clusterID The clusterID of the destination cluster
     * @param event Name of the event
     * @param data Event data
     * @returns Resolves once the message has been sent
     * @memberof ClusterCommunication
     */
    public awaitResponse(instanceID: string, clusterID: number, event: string, data: IJSON): Promise<IJSON> {
        return new Promise((res, rej) => {
            let payload = {
                event,
                data,
                id: uuid(),
            };

            process.send({
                event: 'awaitResponse',
                data: {
                    instanceID,
                    clusterID,
                    payload,
                },
                resp: {
                    instanceID: process.env.INSTANCE_ID,
                    clusterID: process.env.CLUSTER_ID,
                    workerID: cluster.worker.id,
                },
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
     * @param instanceID InstanceID of the instance the destination cluster is part of
     * @param event Name of the event
     * @param data Event data
     * @returns Resolves once the event and data have been broadcasted
     * @memberof ClusterCommunication
     */
    public broadcast(instanceID: string, event: string, data: IJSON): Promise<void[]> {
        let payload = {
            event,
            data,
        };

        process.send({
            event: 'broadcast',
            data: {
                instanceID,
                payload,
            },
        });

        return Promise.resolve([]);
    }

    /**
     * Broadcast an event to all clusters part of the specified instance and wait for a response
     *
     * @param instanceID InstanceID of the instance the destination cluster is part of
     * @param event Name of the event
     * @param data Event data
     * @returns Resolves once all clusters have received the broadcast and responded
     * @memberof ClusterCommunication
     */
    public awaitBroadcast(instanceID: string, event: string, data: IJSON): Promise<IJSON[]> {
        return new Promise((res, rej) => {
            let payload = {
                event,
                data,
                id: uuid(),
            };

            process.send({
                event: 'awaitBroadcast',
                data: {
                    instanceID,
                    payload,
                },
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
