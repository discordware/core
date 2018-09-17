declare module 'eris-sharder' {
    import { EventEmitter } from 'events';

    export class Alerts {

    }

    export class Clustering {
        constructor(options: ClusteringOptions, communication: Communication, sharding: Sharding, logger: Logger);
        public options: ClusteringOptions;
        public communication: Communication;
        public sharding: Sharding;
        public logger: Logger;
        get isMaster(): boolean;
        public init();
    }

    export class Configuration {
        constructor(instanceID: string, options?: SharderOptions);
        init(): Promise<void>;
        getConfig(): Promise<Config>;
    }

    export class Communication extends EventEmitter {
        constructor(logger: Logger);
        public logger: Logger;
        public init(): Promise<void>;
        public send(instance: string, clusterID: string, event: string, data: Json);
        public awaitResponse(instance: string, clusterID: string, event: string, data: Json): Promise<Json>;
        public broadcast(instance: string, event: string, data: Json);
        public awaitBroadcast(instance: string, event: string, data: Json): Promise<Json>;
    }

    export class Logger {
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

    export class Queue {

    }

    export class Registry {
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

    export class Sharding {
        constructor(options: ShardingOptions, token: string, logger: Logger);
        public options: ShardingOptions;
        public token: string;
        public logger: Logger;
        public init();
    }

    export class Stats {
        constructor(options: StatsOptions, communication: Communication, logger: Logger);
        public options: StatsOptions;
        public communication: Communication;
        public logger: Logger;
        public init();
    }

    export class Transport {
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
        [x: string]: string|number|boolean|Date|Json|JsonArray;
    }

    interface JsonArray extends Array<string|number|boolean|Date|Json|JsonArray> { }
}