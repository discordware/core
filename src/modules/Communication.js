const EventEmitter = require('events').EventEmitter;

class Communication extends EventEmitter {
    constructor() {
        super();
    }

    init() {
        
    }

    send(instance, clusterID, event, data) {

    }

    awaitResponse(instance, clusterID, event, data) {

    }

    broadcast(instance, event, data) {

    }

    awaitBroadcast(instance, event, data) {

    }
}

module.exports = Communication;