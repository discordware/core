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

export const ClusterModules = {
    Communication: ClusterCommunication,
};

export const Destinations = {
    Discord: DiscordDestination,
};

export const Modules = {
    Alerts,
    Clustering,
    Communication,
    Configuration,
    Logger,
    Queue,
    Registry,
    Sharding,
    Stats,
};

export const Transports = {
    Console,
};

export default Sharder;
