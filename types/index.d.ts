declare module 'eris-sharder' {
    import { EventEmitter } from 'events';

    export class Sharder {
        constructor(modules: Modules, options: SharderOptions);
    }

    export class Logger {
        constructor();
        public transports: Transport[];
        public init(): Promise<[]>;
        public registerTransport(transport: Transport);
        public debug(data: );
    } 

    export class Communication extends EventEmitter {
        public init(): Promise<void>;
        public send(instance: string, clusterID: string, event: string, data: Json);
        public awaitResponse(instance: string, clusterID: string, event: string, data: Json): Promise<Json>;
        public broadcast(instance: string, event: string, data: Json);
        public awaitBroadcast(instance: string, event: string, data: Json): Promise<Json>;
    }

    export class Clustering {

    }

    export class Sharding {

    }

    export class Stats {

    }

    export class Transport {

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
        stats: StatsOptions
    }

    type ShardingOptions = {

    }

    type ClusteringOptions = {

    }

    type StatsOptions = {

    }

    interface Json {
        [x: string]: string|number|boolean|Date|Json|JsonArray;
    }

    interface JsonArray extends Array<string|number|boolean|Date|Json|JsonArray> { }
}