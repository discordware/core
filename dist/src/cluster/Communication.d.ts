/// <reference types="node" />
import { EventEmitter } from 'events';
import { IClusterCommunication, IClusterCommunicationOptions, IJSON, IReplyPayload } from '../typings';
/**
 * Cluster-side communication module
 */
export declare class ClusterCommunication extends EventEmitter implements IClusterCommunication {
    private options;
    private reqTimeout;
    /**
     * Creates an instance of ClusterCommunication.
     * @param options Options for the cluster communication module
     * @memberof ClusterCommunication
     */
    constructor(options: IClusterCommunicationOptions);
    /**
     *  Initiate the Communication module
     *
     * @returns Resolves once the Communication module is fully initiated
     * @memberof ClusterCommunication
     */
    init(): Promise<void>;
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
    send(instanceID: string, clusterID: number, event: string, data: IJSON): Promise<void>;
    reply(instanceID: string, msg: IReplyPayload, data: IJSON): Promise<void>;
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
    awaitResponse(instanceID: string, clusterID: number, event: string, data: IJSON): Promise<IJSON>;
    /**
     * Broadcast an event to all clusters part of the specified instance
     *
     * @param instanceID InstanceID of the instance the destination cluster is part of
     * @param event Name of the event
     * @param data Event data
     * @returns Resolves once the event and data have been broadcasted
     * @memberof ClusterCommunication
     */
    broadcast(instanceID: string, event: string, data: IJSON): Promise<void[]>;
    /**
     * Broadcast an event to all clusters part of the specified instance and wait for a response
     *
     * @param instanceID InstanceID of the instance the destination cluster is part of
     * @param event Name of the event
     * @param data Event data
     * @returns Resolves once all clusters have received the broadcast and responded
     * @memberof ClusterCommunication
     */
    awaitBroadcast(instanceID: string, event: string, data: IJSON): Promise<IJSON[]>;
}
export default ClusterCommunication;
