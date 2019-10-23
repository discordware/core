"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const Communication_1 = require("./src/cluster/Communication");
const Discord_1 = require("./src/destinations/Discord");
const Alerts_1 = require("./src/modules/Alerts");
const Clustering_1 = require("./src/modules/Clustering");
const Communication_2 = require("./src/modules/Communication");
const Configuration_1 = require("./src/modules/Configuration");
const Console_1 = require("./src/transports/Console");
const Logger_1 = require("./src/modules/Logger");
const Queue_1 = require("./src/modules/Queue");
const Registry_1 = require("./src/modules/Registry");
const Sharder_1 = require("./src/Sharder");
const Sharding_1 = require("./src/modules/Sharding");
const Stats_1 = require("./src/modules/Stats");
__export(require("./src/Cluster"));
__export(require("./src/Sharder"));
exports.ClusterModules = {
    Communication: Communication_1.default,
};
exports.Destinations = {
    Discord: Discord_1.default,
};
exports.Modules = {
    Alerts: Alerts_1.default,
    Clustering: Clustering_1.default,
    Communication: Communication_2.default,
    Configuration: Configuration_1.default,
    Logger: Logger_1.default,
    Queue: Queue_1.default,
    Registry: Registry_1.default,
    Sharding: Sharding_1.default,
    Stats: Stats_1.default,
};
exports.Transports = {
    Console: Console_1.default,
};
exports.default = Sharder_1.default;
