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
const Communication_1 = require("./cluster/Communication");
/**
 * Helper class for dealing with Cluster side things
 */
class Cluster {
    /**
     * Creates an instance of Cluster.
     * @param options Cluster options
     * @param modules Custom cluster modules
     * @memberof Cluster
     */
    constructor(options, modules) {
        this.options = options;
        this.modules = modules;
    }
    /**
     * Bot token
     *
     * @readonly
     * @memberof Cluster
     */
    get token() {
        return process.env.TOKEN;
    }
    /**
     * First ShardID for current cluster
     *
     * @readonly
     * @memberof Cluster
     */
    get firstShardID() {
        return parseInt(process.env.FIRST_SHARD_ID, 10);
    }
    /**
     * Last ShardID for current cluster
     *
     * @readonly
     * @memberof Cluster
     */
    get lastShardID() {
        return parseInt(process.env.LAST_SHARD_ID, 10);
    }
    /**
     * Total number of shards for the bot
     *
     * @readonly
     * @memberof Cluster
     */
    get maxShards() {
        return parseInt(process.env.MAX_SHARDS, 10);
    }
    /**
     * ID of the instance this cluster is part of
     *
     * @readonly
     * @memberof Cluster
     */
    get instanceID() {
        return process.env.INSTANCE_ID;
    }
    /**
     * The ClusterID of the current cluster
     *
     * @readonly
     * @memberof Cluster
     */
    get clusterID() {
        return parseInt(process.env.CLUSTER_ID, 10);
    }
    /**
     * Initiate the Cluster
     *
     * @returns Resolves once all Cluster modules have been initiated
     * @memberof Cluster
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.communication = this.modules.communication || new Communication_1.default(this.options.communication);
            yield this.communication.init();
            return Promise.resolve();
        });
    }
}
exports.Cluster = Cluster;
exports.default = Cluster;
