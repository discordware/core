"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Modules
const Alerts_1 = require("./modules/Alerts");
const Clustering_1 = require("./modules/Clustering");
const Communication_1 = require("./modules/Communication");
const Configuration_1 = require("./modules/Configuration");
const Logger_1 = require("./modules/Logger");
const Queue_1 = require("./modules/Queue");
const Registry_1 = require("./modules/Registry");
const Sharding_1 = require("./modules/Sharding");
const Stats_1 = require("./modules/Stats");
// Default transport
const Console_1 = require("./transports/Console");
/**
 * Main Sharder class
 */
class Sharder {
    /**
     * Creates an instance of Sharder.
     * @param instanceID The unique instanceID of the current sharder
     * @param options Options to pass on to modules
     * @param modules Custom modules to start with
     * @memberof Sharder
     */
    constructor(instanceID, options, modules) {
        this.instanceID = instanceID;
        this.modules = modules || {};
        if (!instanceID) {
            throw new Error('instanceID not provided');
        }
        this.config = this.modules.configuration || new Configuration_1.default(instanceID, options);
    }
    /**
     * Create a new instance
     *
     * @returns Resolves when config is fetched and modules are created
     * @memberof Sharder
     */
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.config.init();
            this.options = yield this.config.getConfig();
            this.logger = this.modules.logger || new Logger_1.default();
            this.alerts = this.modules.alerts || new Alerts_1.default();
            this.registry = this.modules.registry || new Registry_1.default();
            this.queue = this.modules.queue || new Queue_1.default();
            this.communication = this.modules.communication || new Communication_1.default(this.options.communication, this.logger, this.registry);
            this.sharding = this.modules.sharding || new Sharding_1.default(this.options.sharding, this.options.token, this.instanceID, this.registry, this.logger, this.alerts);
            this.clustering = this.modules.clustering || new Clustering_1.default(this.options.clustering, this.instanceID, this.communication, this.sharding, this.registry, this.logger, this.alerts, this.queue);
            this.stats = this.modules.stats || new Stats_1.default(this.options.stats, this.communication, this.logger);
            return Promise.resolve();
        });
    }
    /**
     *  Initiate the instance
     *
     * @returns Resolves when the instance is fully initiated
     * @memberof Sharder
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.clustering.isMaster)
                return;
            this.logger.registerTransport('console', new Console_1.default(this.options.console));
            yield this.logger.init();
            yield this.alerts.init();
            yield this.registry.init();
            yield this.communication.init();
            yield this.sharding.init();
            yield this.registry.registerInstance(this.instanceID, this.options.instanceOptions);
            yield this.clustering.init();
            this.stats.init();
            return Promise.resolve();
        });
    }
    /**
     * Reshard the clusters managed by the current instance
     *
     * @param firstShardID The first shard ID of the new set
     * @param lastShardID The last shard ID of the new set
     * @param maxShards The total amount of shards for the bot
     * @return Resolves once resharding is complete
     * @memberof Sharder
     */
    reshard(firstShardID, lastShardID, maxShards) {
        this.sharding.updateShardCount(firstShardID, lastShardID, maxShards);
        return Promise.resolve();
    }
    /**
     * Update local instance's configuration
     *
     * @param config New instance configuration
     * @return Resolves once instance config has been updated
     * @memberof Sharder
     */
    updateConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.registry.deleteInstance(this.instanceID);
            this.registry.registerInstance(this.instanceID, config);
            return Promise.resolve();
        });
    }
    /**
     *  Connect to a new peer instance
     *
     * @param instanceID The registered instanceID of the new peer
     * @return Resolves once peer is added
     * @memberof Sharder
     */
    addPeer(instanceID) {
        return __awaiter(this, void 0, void 0, function* () {
            let peer = yield this.registry.getInstance(instanceID);
            this.communication.connectToPeer(peer);
            return Promise.resolve();
        });
    }
    /**
     *  Fetch updated peer instance configuration
     *
     * @param instanceID The registered instanceID of the updated peer
     * @return Resolves once peer has been updated
     * @memberof Sharder
     */
    peerUpdate(instanceID) {
        return __awaiter(this, void 0, void 0, function* () {
            let peer = yield this.registry.getInstance(instanceID);
            this.communication.updateConnection(peer);
            return Promise.resolve();
        });
    }
}
exports.Sharder = Sharder;
exports.default = Sharder;
