import * as alerts from './alerts';
import * as clustering from './clustering';
import * as communication from './communication';
import * as configuration from './configuration';
import * as logger from './logger';
import * as queue from './queue';
import * as registry from './registry';
import * as sharding from './sharding';

export interface IModules {
    alerts?: alerts.IAlerts;
    registry?: registry.IRegistry;
    queue?: queue.IQueue;
    logger?: logger.ILogger;
    communication?: communication.ICommunication;
    clustering?: clustering.IClustering;
    sharding?: sharding.ISharding;
    configuration?: configuration.IConfiguration;
}

export interface ISharderOptions {
    token: string;
    instanceOptions: registry.IInstanceConfig;
    communication?: communication.ICommunicationOptions;
    sharding?: sharding.IShardingOptions;
    clustering: clustering.IClusteringOptions;
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
