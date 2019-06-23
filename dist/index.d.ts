import ClusterCommunication from './src/cluster/Communication';
import DiscordDestination from './src/destinations/Discord';
import Alerts from './src/modules/Alerts';
import Clustering from './src/modules/Clustering';
import Communication from './src/modules/Communication';
import Configuration from './src/modules/Configuration';
import Console from './src/transports/Console';
import Logger from './src/modules/Logger';
import Queue from './src/modules/Queue';
import Registry from './src/modules/Registry';
import Sharder from './src/Sharder';
import Sharding from './src/modules/Sharding';
import Stats from './src/modules/Stats';
export * from './src/Cluster';
export * from './src/Sharder';
export declare const ClusterModules: {
    Communication: typeof ClusterCommunication;
};
export declare const Destinations: {
    Discord: typeof DiscordDestination;
};
export declare const Modules: {
    Alerts: typeof Alerts;
    Clustering: typeof Clustering;
    Communication: typeof Communication;
    Configuration: typeof Configuration;
    Logger: typeof Logger;
    Queue: typeof Queue;
    Registry: typeof Registry;
    Sharding: typeof Sharding;
    Stats: typeof Stats;
};
export declare const Transports: {
    Console: typeof Console;
};
export default Sharder;
