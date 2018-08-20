let EventEmitter = require('events');

class Queue extends EventEmitter {

    constructor() {
        super();
        this.queue = [];
    }

    executeQueue() {
        let item = this.queue[0];
        if (!item) return;
        this.emit('execute', item);
    }

    queueItem(item) {
        if (this.queue.length === 0) {
            this.queue.push(item);
            this.executeQueue();
        } else {
            this.queue.push(item);
        }
    }
}

module.exports = Queue;