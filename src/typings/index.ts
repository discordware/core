import * as alerts from './alerts';
import * as clustering from './clustering';
import * as communication from './communication';
import * as configuration from './configuration';
import * as logger from './logger';
import * as queue from './queue';
import * as registry from './registry';
import * as sharding from './sharding';
import * as stats from './stats';

export interface IModules {
    alerts?: alerts.IAlerts;
    registry?: registry.IRegistry;
    queue?: queue.IQueue;
    logger?: logger.ILogger;
    communication?: communication.ICommunication;
    clustering?: clustering.IClustering;
    sharding?: sharding.ISharding;
    stats?: stats.IStats;
    configuration?: configuration.IConfiguration;
}

export interface ISharderOptions {
    token: string;
    instanceOptions: registry.IInstanceConfig;
    communication?: communication.ICommunicationOptions;
    sharding?: sharding.IShardingOptions;
    clustering: clustering.IClusteringOptions;
    stats?: stats.IStatsOptions;
    console?: logger.ITransportOptions;
}

export * from './alerts';
export * from './cluster';
export * from './clustering';
export * from './common';
export * from './communication';
export * from './configuration';
export * from './discovery';
export * from './logger';
export * from './queue';
export * from './registry';
export * from './sharding';
export * from './stats';
