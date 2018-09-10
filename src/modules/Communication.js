const EventEmitter = require('events').EventEmitter;
const cluster = require('cluster');
const uuid = require('uuid/v1');

class Communication extends EventEmitter {
    constructor(logger, registry) {
        super();
        this.logger = logger;
        this.registry = registry;
    }

    init() {
        return Promise.resolve();
    }

    send(instance, clusterID, event, data) {
        let payload = {
            event,
            data
        };
    }

    awaitResponse(instance, clusterID, event, data, callback) {
        return new Promise((res, rej) => {
            let payload = {
                event,
                data,
                id: uuid()
            };
        });
    }

    broadcast(instance, event, data) {
        let payload = {
            event,
            data
        };
    }

    awaitBroadcast(instance, event, data, callback) {
        return new Promise((res, rej) => {
            let payload = {
                event,
                data,
                id: uuid()
            };
        });
    }
}

module.exports = Communication;