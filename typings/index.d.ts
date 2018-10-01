declare module 'eris-sharder' {
    import { EventEmitter } from 'events';

    export class Alerts {
        public init(): Promise<void>;
        public registerDestination(destination: IDestination);
        public alert(data: AlertData);
    }

    export interface IClustering {
        readonly isMaster: boolean;
        init(): Promise<void>;
    }

    export interface IConfiguration {
        init(): Promise<void>;
        getConfig(): Promise<Config>;
    }

    export interface ICommunication {
        init(): Promise<void>;
        send(instance: string, clusterID: string, event: string, data: Json);
        awaitResponse(instance: string, clusterID: string, event: string, data: Json): Promise<Json>;
        broadcast(instance: string, event: string, data: Json);
        awaitBroadcast(instance: string, event: string, data: Json): Promise<Json>;
    }

    export interface IDestination {
        init(): Promise<void>;
        alert(data: AlertData);
    }

    export interface ILogger {
        init(): Promise<[]>;
        registerTransport(transport: Transport);
        debug(data: Json);
        error(data: Json);
        info(data: Json);
        log(data: Json);
        warn(data: Json);
    }

    export interface IQueue {
        init(): Promise<void>;
        schedule(queue: string, job: Json, callback: (err?: boolean) => void);
    }

    export interface IRegistry {
        registerInstance(instanceID: string, config: Json): Promise<void>;
        getInstance(instanceID: string)
        deleteInstance(instanceID: string): Promise<void>;
        registerCluster(instanceID: string, clusterID: number, config: ClusterConfig);
        getCluster(instanceID: string, clusterID: number): Promise<ClusterConfig>;
        deleteCluster(instanceID: string, clusterID: number): Promise<void>;
        registerWorker(instanceID: string, workerID: number, clusterID: number): Promise<void>;
        getWorker(instanceID: string, workerID: number): Promise<number>;
        deleteWorker(instanceID: string, workerID: number): Promise<void>;
    }

    export interface ISharding {

    }

    export interface IStats {

    }

    export interface ITransport {

    }

    export class Clustering implements IClustering {
        constructor(options: ClusteringOptions, communication: Communication, sharding: Sharding, logger: Logger);
        public options: ClusteringOptions;
        public communication: Communication;
        public sharding: Sharding;
        public logger: Logger;
        public isMaster: boolean;
        public init(): Promise<void>;
    }

    export class Configuration implements IConfiguration {
        constructor(instanceID: string, options?: SharderOptions);
        init(): Promise<void>;
        getConfig(): Promise<Config>;
    }

    export class Communication extends EventEmitter implements ICommunication {
        constructor(logger: Logger);
        public logger: Logger;
        public init(): Promise<void>;
        public send(instance: string, clusterID: string, event: string, data: Json);
        public awaitResponse(instance: string, clusterID: string, event: string, data: Json): Promise<Json>;
        public broadcast(instance: string, event: string, data: Json);
        public awaitBroadcast(instance: string, event: string, data: Json): Promise<Json>;
    }

    export class Logger implements ILogger {
        constructor(options: LoggerOptions);
        public options: LoggerOptions;
        public transports: Transport[];
        public init(): Promise<[]>;
        public registerTransport(transport: Transport);
        public debug(data: Json);
        public error(data: Json);
        public info(data: Json);
        public log(data: Json);
        public warn(data: Json);
    }

    export class Queue implements IQueue {
        constructor()
        public init(): Promise<void>;
        public schedule(queue: string, job: Json, callback: (err?: boolean) => void);
        private enqueue(queeu: string, job: { data: Json, callback: (job: Json, callback: (err?: boolean) => void) => void });
        private process(queue);
    }

    export class Registry implements IRegistry {
        constructor();
        public registerInstance(instanceID: string, config: Json): Promise<void>;
        public getInstance(instanceID: string)
        public deleteInstance(instanceID: string): Promise<void>;
        public registerCluster(instanceID: string, clusterID: number, config: ClusterConfig);
        public getCluster(instanceID: string, clusterID: number): Promise<ClusterConfig>;
        public deleteCluster(instanceID: string, clusterID: number): Promise<void>;
        public registerWorker(instanceID: string, workerID: number, clusterID: number): Promise<void>;
        public getWorker(instanceID: string, workerID: number): Promise<number>;
        public deleteWorker(instanceID: string, workerID: number): Promise<void>;
    }

    export class Sharder {
        constructor(modules: Modules, options: SharderOptions);
        public modules: Modules;
        public config: Configuration;
        public communication: Communication;
        public logger: Logger;
        public queue: Queue;
        public registry: Registry;
        public sharding: Sharding;
        public stats: Stats;
        public create();
        public init: Promise<void>;
        public addInstace(instanceID: string, options: InstanceOptions);
        public updateInstance(instanceID, options: InstanceOptions);
    }

    export class Sharding implements ISharding {
        constructor(options: ShardingOptions, token: string, logger: Logger);
        public options: ShardingOptions;
        public token: string;
        public logger: Logger;
        public init();
    }

    export class Stats implements IStats {
        constructor(options: StatsOptions, communication: Communication, logger: Logger);
        public options: StatsOptions;
        public communication: Communication;
        public logger: Logger;
        public init();
    }

    export class Transport implements ITransport {
        constructor(options: TransportOptions);
        public options: TransportOptions;
        public init(): Promise<void>;
        public debug(data: Json);
        public error(data: Json);
        public info(data: Json);
        public log(data: Json);
        public warn(data: Json);
    }

    export type ClusteringOptions = {

    }

    export type ClusterConfig = {
        firstShardID: number,
        lastShardID: number,
        maxShards: number,
        instanceID: string,
        workerID: number
    }

    export type AlertData = {
        title: string,
        msg: string,
        date: Date,
        type: string
    }

    export type Config = {
        clustering: ClusteringOptions,
        sharding: ShardingOptions,
        stats: StatsOptions
    }

    export type InstanceOptions = {

    }

    export type LoggerOptions = {

    }

    export type Modules = {
        logger?: Logger,
        communication?: Communication,
        clustering?: Clustering,
        sharding?: Sharding,
        stats?: Stats
    }

    export type SharderOptions = {
        token: string,
        sharding: ShardingOptions,
        clustering: ClusteringOptions,
        stats?: StatsOptions,
        logger?: LoggerOptions
    }

    export type ShardingOptions = {

    }

    export type StatsOptions = {

    }

    export type TransportOptions = {

    }

    export interface Json {
        [x: string]: string | number | boolean | Date | Json | JsonArray;
    }

    export interface JsonArray extends Array<string | number | boolean | Date | Json | JsonArray> { }
}