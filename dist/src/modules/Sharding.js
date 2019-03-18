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
/**
 *
 *
 * @class Sharding
 */
class Sharding {
    /**
     * Creates an instance of Sharding.
     * @param {*} options
     * @param {*} token
     * @param {*} instanceID
     * @param {*} registry
     * @param {*} logger
     * @param {*} alerts
     * @memberof Sharding
     */
    constructor(options, token, instanceID, registry, logger, alerts) {
        this.firstShardID = options.firstShardID || 0;
        this.lastShardID = options.lastShardID || options.shards - 1;
        this.maxShards = options.shards;
        this.token = token;
        this.registry = registry;
        this.logger = logger;
        this.instanceID = instanceID;
        this.alerts = alerts;
    }
    /**
     *
     *
     * @returns
     * @memberof Sharding
     */
    init() {
        return Promise.resolve();
    }
    chunk(array, n) {
        if (n < 2)
            return [array];
        let len = array.length;
        let out = [];
        let i = 0;
        let size;
        if (len % n === 0) {
            size = Math.floor(len / n);
            while (i < len) {
                out.push(array.slice(i, i += size));
            }
        }
        else {
            while (i < len) {
                size = Math.ceil((len - i) / n--);
                out.push(array.slice(i, i += size));
            }
        }
        return out;
    }
    /**
     *
     *
     * @param {*} clusterCount
     * @memberof Sharding
     */
    shard(clusterCount) {
        let shards = [];
        for (let i = this.firstShardID; i <= this.lastShardID; i++) {
            shards.push(i);
        }
        let chunked = this.chunk(shards, clusterCount);
        chunked.forEach((chunk, clusterID) => {
            this.setConfig(clusterID, {
                firstShardID: Math.min(...chunk),
                lastShardID: Math.max(...chunk),
                maxShards: this.maxShards,
            });
        });
        return Promise.resolve();
    }
    /**
     *
     *
     * @param {*} firstShardID
     * @param {*} lastShardID
     * @param {*} maxShards
     * @memberof Sharding
     */
    updateShardCount(firstShardID, lastShardID, maxShards) {
        this.firstShardID = firstShardID;
        this.lastShardID = lastShardID;
        this.maxShards = maxShards;
        return Promise.resolve();
    }
    setConfig(clusterID, config) {
        return this.registry.registerShardConfig(this.instanceID, clusterID, config);
    }
    /**
     *
     *
     * @param {*} cluster
     * @returns
     * @memberof Sharding
     */
    getConfig(cluster) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(yield this.registry.getShardConfig(this.instanceID, cluster));
        });
    }
}
exports.default = Sharding;
