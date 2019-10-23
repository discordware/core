import { IClusterCommunication, IClusterCommunicationOptions } from './communication';

export interface IClusterOptions {
    communication?: IClusterCommunicationOptions;
}

export interface IClusterModules {
    communication?: IClusterCommunication;
}

export interface ICluster {
    readonly token: string;
    readonly firstShardID: number;
    readonly lastShardID: number;
    readonly maxShards: number;
    readonly instanceID: string;
    readonly clusterID: number;
    communication: IClusterCommunication;
    init(): Promise<void>;
}
