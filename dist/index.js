"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sharder_1 = require("./src/Sharder");
Object.assign(Sharder_1.default, {
    Cluster: require('./src/Cluster'),
    ClusterModules: {
        Communication: require('./src/cluster/Communication'),
    },
    Modules: {
        Alerts: require('./src/modules/Alerts'),
        Clustering: require('./src/modules/Clustering'),
        Communication: require('./src/modules/Communication'),
        Configuration: require('./src/modules/Configuration'),
        Logger: require('./src/modules/Logger'),
        Queue: require('./src/modules/Queue'),
        Registry: require('./src/modules/Registry'),
        Sharding: require('./src/modules/Sharding'),
        Stats: require('./src/modules/Stats'),
    },
    Transports: {
        Console: require('./src/transports/Console'),
    },
    Destinations: {
        Discord: require('./src/destinations/Discord'),
    },
});
exports.default = Sharder_1.default;
