import { IClusterConfig, IInstanceConfig, IRegistry, IShardConfig } from '../typings';
/**
 * Registry to store all instance metadata
 *
 * @class Registry
 */
export default class Registry implements IRegistry {
    private instances;
    private clusters;
    private workers;
    private shards;
    /**
     * Creates an instance of Registry.
     * @memberof Registry
     */
    constructor();
    /**
     * Initiate the Registry module
     *
     * @returns {Promise<void>} Resolves once the Registry has been initiated
     * @memberof Registry
     */
    init(): Promise<void>;
    /**
     * Register an instance
     *
     * @param {String} instanceID InstanceID of the instance being registered
     * @param {Object} config Instance configuration
     * @returns {Promise<void>} Resolves once the instance has been registered
     * @memberof Registry
     */
    registerInstance(instanceID: string, config: IInstanceConfig): Promise<void>;
    /**
     * Fetch an instance configuration
     *
     * @param {String} instanceID InstanceID of the instance fetching configuration for
     * @returns {Promise<Object>} Resolves with the instance configuration
     * @memberof Registry
     */
    getInstance(instanceID: string): Promise<IInstanceConfig>;
    /**
     * Get all registered instances
     *
     * @returns {Promise<Object[]>} Resolves with the configuration of all registered instances
     * @memberof Registry
     */
    getInstances(): Promise<{
        [instanceID: string]: IInstanceConfig;
    }>;
    /**
     * Delete an instance from the registry
     *
     * @param {String} instanceID InstanceID of the instance to delete
     * @returns {Promise<void>} Resolves once the instance has been deleted from registry
     * @memberof Registry
     */
    deleteInstance(instanceID: string): Promise<void>;
    /**
     * Register a cluster configuration
     *
     * @param {String} instanceID InstanceID of the instance the cluster is part of
     * @param {Number} clusterID ClusterID to register the configuration as
     * @param {Object} config The cluster configuration
     * @returns {Promise<void>} Resolves once the cluster has been registered
     * @memberof Registry
     */
    registerCluster(instanceID: string, clusterID: number, config: IClusterConfig): Promise<void>;
    /**
     * Fetch a cluster configuration
     *
     * @param {String} instanceID InstanceID of the instance the cluster is part of
     * @param {Number} clusterID ClusterID to fetch the configuration for
     * @returns {Promise<Object>} Resolves with the configuration of specified cluster
     * @memberof Registry
     */
    getCluster(instanceID: string, clusterID: number): Promise<IClusterConfig>;
    /**
     * Fetch all cluster configurations for a specified instance
     *
     * @param {String} instanceID InstanceID of the instance the cluster is part of
     * @returns {Promise<Object[]>} Resolves with all cluster configurations
     * @memberof Registry
     */
    getClusters(instanceID: string): Promise<{
        [clusterID: number]: IClusterConfig;
    }>;
    /**
     * Delete a cluster configuration
     *
     * @param {String} instanceID InstanceID of the instance the cluster is part of
     * @param {Number} clusterID ClusterID to delete
     * @returns {Promise<void>} Resolves once cluster has been deleted from registry
     * @memberof Registry
     */
    deleteCluster(instanceID: string, clusterID: number): Promise<void>;
    /**
     * Register a worker configuration
     *
     * @param {String} instanceID Instance the cluster is part of
     * @param {Number} workerID WorkerID to register the configuration as
     * @param {Number} clusterID ClusterID the worker serves
     * @returns {Promise<void>} Resolves once the configuration has been registered
     * @memberof Registry
     */
    registerWorker(instanceID: string, workerID: number, clusterID: number): Promise<void>;
    /**
     * Fetch a worker configuration
     *
     * @param {String} instanceID Instance the worker is part of
     * @param {Number} workerID WorkerID to fetch configuration for
     * @returns {Promise<Object>} Resolves with the worker configuration
     * @memberof Registry
     */
    getWorker(instanceID: string, workerID: number): Promise<number>;
    /**
     * Fetch all worker configurations part of the specified instance
     *
     * @param {String} instanceID Instance the workers are part of
     * @returns {Promise<Object[]>} Resolves with all worker configurations
     * @memberof Registry
     */
    getWorkers(instanceID: string): Promise<number[]>;
    /**
     * Delete a worker configuration
     *
     * @param {String} instanceID Instance the worker is controlled by
     * @param {Number} workerID WorkerID of the worker
     * @returns {Promise<void>} Resolves once the worker configuration has been deleted
     * @memberof Registry
     */
    deleteWorker(instanceID: string, workerID: number): Promise<void>;
    /**
     * Register a ShardConfig
     *
     * @param {String} instanceID Instance the cluster is part of
     * @param {Number} clusterID ClusterID the ShardConfig is for
     * @param {Object} config Shard configuration
     * @returns {Promise<void>} Resolves once the ShardConfig has been registered
     * @memberof Registry
     */
    registerShardConfig(instanceID: string, clusterID: number, config: IShardConfig): Promise<void>;
    /**
     * Fetch a ShardConfig
     *
     * @param {String} instanceID Instance the cluster is part of
     * @param {Number} clusterID ClusterID of the cluster fetching ShardConfig for
     * @returns {Promise<Object>} Resolves with the ShardConfig
     * @memberof Registry
     */
    getShardConfig(instanceID: string, clusterID: number): Promise<IShardConfig>;
    /**
     * Delete a ShardConfig from registry
     *
     * @param {*} instanceID Instance the cluster is part of
     * @param {*} clusterID Cluster the ShardConfig is for
     * @returns {Promise<void>} Resolves once ShardConfig has been deleted
     * @memberof Registry
     */
    deleteShardConfig(instanceID: string, clusterID: number): Promise<void>;
}
