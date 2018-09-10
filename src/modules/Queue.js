class Queue {
    constructor() {
        this._queues = {};
    }

    init() {
        return Promise.resolve();
    }

    schedule(queue, job, callback) {
        if (!this._queues[queue]) this._queues[queue] = [];

        this._enqueue(queue, { data: job, callback });
    }

    _enqueue(queue, job) {
        if (this.queue[queue].length === 0) {
            this._queues[queue].push(job);

            this._process(queue);
        } else {
            this._queues[queue].push(job);
        }
    }

    _process(queue) {
        let job = this._queues[queue][0];

        let callback = () => {
            this.queue.shift();

            if (this._queues[queue].length > 0) {
                this._process(queue);
            }
        };

        job.callback(job.data, callback);
    }
}

module.exports = Queue;