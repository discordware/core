import { IJSON } from './common';
import { IInstanceConfig } from './registry';
export interface IClusterCommunicationOptions {
    timeout: number;
}
export interface ICommunicationOptions {
    timeout: number;
}
export interface IClusterConnected {
    clusterID: number;
}
export interface IClusterCommunication {
    init(): Promise<void>;
    send(instance: string, clusterID: number, event: string, data: IJSON): Promise<void>;
    awaitResponse(instance: string, clusterID: number, event: string, data: IJSON): Promise<IJSON>;
    broadcast(instance: string, event: string, data: IJSON): Promise<void[]>;
    awaitBroadcast(instance: string, event: string, data: IJSON): Promise<IJSON[]>;
    on(event: string, listener: (data: IJSON) => void): this;
    once(event: string, listener: (data: {
        event: string;
        data: IJSON;
    }) => void): this;
}
export interface ICommunication {
    init(): Promise<void>;
    connectToPeer(peer: IInstanceConfig): Promise<void>;
    updateConnection(peer: IInstanceConfig): Promise<void>;
    send(instance: string, clusterID: number, event: string, data: IJSON): Promise<void>;
    awaitResponse(instance: string, clusterID: number, event: string, data: IJSON): Promise<IJSON>;
    broadcast(instance: string, event: string, data: IJSON): Promise<void[]>;
    awaitBroadcast(instance: string, event: string, data: IJSON): Promise<IJSON[]>;
    on(event: string, listener: (data: IJSON) => void): this;
    on(event: 'cluster.connected', listener: (data: IClusterConnected) => void): this;
}
