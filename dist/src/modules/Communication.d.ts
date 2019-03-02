/// <reference types="node" />
import { EventEmitter } from 'events';
import { ICommunication, ICommunicationOptions, IJSON, ILogger, IRegistry } from '../typings';
/**
 *
 *
 * @class Communication
 * @extends {EventEmitter}
 * @interface
 */
export default class Communication extends EventEmitter implements ICommunication {
    private options;
    private logger;
    private registry;
    private reqTimeout;
    /**
     * Creates an instance of Communication.
     * @param {Object} options Communication options
     * @param {Logger} logger Logger module
     * @param {Registry} registry Registry module
     * @memberof Communication
     */
    constructor(options: ICommunicationOptions, logger: ILogger, registry: IRegistry);
    /**
     *  Initiate the Communication module
     *
     * @returns {Promise<void>} Resolves once the Communication module is fully initiated
     * @memberof Communication
     */
    init(): Promise<void>;
    /**
     * Connect to a peer instance
     * @returns {void}
     * @memberof Communication
     */
    connectToPeer(): Promise<void>;
    /**
     * Update connection to peer instance
     * @returns {void}
     * @memberof Communication
     */
    updateConnection(): Promise<void>;
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
    send(instanceID: string, clusterID: number, event: string, data: IJSON): Promise<void>;
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
    awaitResponse(instanceID: string, clusterID: number, event: string, data: IJSON): Promise<IJSON>;
    /**
     * Broadcast an event to all clusters part of the specified instance
     *
     * @param {String} instanceID InstanceID of the instance the destination cluster is part of
     * @param {String} event Name of the event
     * @param {*} data Event data
     * @returns {Promise<Array>} Resolves once all clusters have received the broadcast
     * @memberof Communication
     */
    broadcast(instanceID: string, event: string, data: IJSON): Promise<void[]>;
    /**
     * Broadcast an event to all clusters part of the specified instanceand wait for a response
     *
     * @param {String} instanceID InstanceID of the instance the destination cluster is part of
     * @param {String} event Name of the event
     * @param {*} data Event data
     * @returns {Promise<Array>} Resolves once all clusters have received the broadcast and responded
     * @memberof Communication
     */
    awaitBroadcast(instanceID: any, event: any, data: any): Promise<IJSON[]>;
}
