import { IAlerts, IClustering, IClusteringOptions, ICommunication, ILogger, IQueue, IRegistry, ISharding } from '../typings';
/**
 *
 *
 * @class Clustering
 * @interface
 */
export default class Clustering implements IClustering {
    private options;
    private queue;
    private instanceID;
    private communication;
    private sharding;
    private registry;
    private logger;
    private alerts;
    private callbacks;
    /**
     * Creates an instance of Clustering.
     * @param {Object} options Clustering options
     * @param {String} instanceID ID of the instance
     * @param {Communication} communication Communication module
     * @param {Sharding} sharding Sharding module
     * @param {Registry} registry Registry module
     * @param {Logger} logger Logger module
     * @param {Alerts} alerts Alerts module
     * @param {Queue} queue Queue module
     * @memberof Clustering
     */
    constructor(options: IClusteringOptions, instanceID: string, communication: ICommunication, sharding: ISharding, registry: IRegistry, logger: ILogger, alerts: IAlerts, queue: IQueue);
    /**
     *
     *
     * @readonly
     * @memberof Clustering
     */
    readonly isMaster: boolean;
    /**
     * Initiate the clustering module
     * @returns {void}
     * @memberof Clustering
     */
    init(): Promise<void>;
    private fetchClusterID;
    private fetchConfig;
    private restart;
    private createCluster;
    private startCluster;
    private connectClusters;
    private restartCluster;
    private onExit;
}
