import { IClusteringOptions, ICommunicationOptions, IInstanceConfig, IShardingOptions, IStatsOptions, ITransportOptions } from './index';
export interface IConfig {
    token: string;
    instanceOptions: IInstanceConfig;
    communication?: ICommunicationOptions;
    sharding?: IShardingOptions;
    clustering: IClusteringOptions;
    stats?: IStatsOptions;
    console?: ITransportOptions;
}
export interface IConfiguration {
    init(): Promise<void>;
    getConfig(): Promise<IConfig>;
}
