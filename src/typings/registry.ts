import { IJSON } from './common';

export interface IShardConfig {
    firstShardID: number;
    lastShardID: number;
    maxShards: number;
}

export interface IClusterConfig extends IShardConfig {
    instanceID: string;
    workerID: number;
}

export interface IInstanceConfig {
    name: string;
    address: string;
}

export interface IRegistry {
    init(): Promise<void>;
    registerInstance(instanceID: string, config: IInstanceConfig): Promise<void>;
    getInstances(): Promise<{ [instanceID: string]: IInstanceConfig }>;
    getInstance(instanceID: string): Promise<IInstanceConfig>;
    deleteInstance(instanceID: string): Promise<void>;
    registerCluster(instanceID: string, clusterID: number, config: IClusterConfig);
    getCluster(instanceID: string, clusterID: number): Promise<IClusterConfig>;
    getClusters(instanceID: string): Promise<{ [clusterID: number]: IClusterConfig }>;
    deleteCluster(instanceID: string, clusterID: number): Promise<void>;
    registerWorker(instanceID: string, workerID: number, clusterID: number): Promise<void>;
    getWorker(instanceID: string, workerID: number): Promise<number>;
    getWorkers(instanceID: string): Promise<{ [workerID: number]: number }>;
    deleteWorker(instanceID: string, workerID: number): Promise<void>;
    registerShardConfig(instanceID: string, clusterID: number, config: IShardConfig);
    getShardConfig(instanceID: string, clusterID: number): Promise<IShardConfig>;
    deleteShardConfig(instanceID: string, clusterID: number): Promise<void>;
}
