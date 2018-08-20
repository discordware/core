const EventEmitter = require('events');
class IPC extends EventEmitter {
    constructor() {
        super();
        this.events = new Map();

        process.on('message', msg => {
            let event = this.events.get(msg._eventName);
            if (event) {
                event.fn(msg);
            }
        });
    }

    register(event, callback) {
        this.events.set(event, { fn: callback });
    }

    unregister(name) {
        this.events.delete(name);
    }

    broadcast(name, message) {
        message._eventName = name;
        process.send({ name: 'broadcast', msg: message });
    }

    sendTo(cluster, name, message) {
        message._eventName = name;
        process.send({ name: 'send', cluster: cluster, msg: message });
    }

    fetchUser(id) {
        process.send({ name: 'fetchUser', id: id });

        return new Promise((resolve) => {
            const callback = (user) => {
                this.removeListener(id, callback);
                resolve(user);
            };

            this.on(id, callback);
        });
    }

    fetchGuild(id) {
        process.send({ name: 'fetchGuild', id: id });

        return new Promise((resolve) => {
            const callback = (guild) => {
                this.removeListener(id, callback);
                resolve(guild);
            };

            this.on(id, callback);
        });
    }

    fetchChannel(id) {
        process.send({ name: 'fetchChannel', id: id });

        return new Promise((resolve) => {
            const callback = (channel) => {
                this.removeListener(id, callback);
                resolve(channel);
            };

            this.on(id, callback);
        });
    }
}

module.exports = IPC;