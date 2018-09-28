declare module 'eris-sharder' {
    import { EventEmitter } from 'events';

    export class Alerts {

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

    export interface ILogger {

    }

    export interface IQueue {

    }

    export interface IRegistry {

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
        get isMaster(): boolean;
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

    }

    export class Registry implements IRegistry {
        constructor();
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

    export class Stats implements IStats{
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

    type ClusteringOptions = {

    }

    type Config = {
        clustering: ClusteringOptions,
        sharding: ShardingOptions,
        stats: StatsOptions
    }

    type InstanceOptions = {

    }

    type LoggerOptions = {

    }

    type Modules = {
        logger?: Logger,
        communication?: Communication,
        clustering?: Clustering,
        sharding?: Sharding,
        stats?: Stats
    }

    type SharderOptions = {
        token: string,
        sharding: ShardingOptions,
        clustering: ClusteringOptions,
        stats?: StatsOptions,
        logger?: LoggerOptions
    }

    type ShardingOptions = {

    }

    type StatsOptions = {

    }

    type TransportOptions = {

    }

    interface Json {
        [x: string]: string | number | boolean | Date | Json | JsonArray;
    }

    interface JsonArray extends Array<string | number | boolean | Date | Json | JsonArray> { }
}