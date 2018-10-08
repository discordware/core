class Queue {
    constructor() {
        this.queues = {};
    }

    init() {
        return Promise.resolve();
    }

    schedule(queue, job, callback) {
        if (!this.queues[queue]) this.queues[queue] = [];

        this.enqueue(queue, { data: job, callback });
    }

    enqueue(queue, job) {
        if (this.queues[queue].length === 0) {
            this.queues[queue].push(job);

            this.process(queue);
        } else {
            this.queues[queue].push(job);
        }
    }

    process(queue) {
        let job = this.queues[queue][0];

        let callback = (err) => {

            this.queues[queue].shift();

            if (err) {
                this.queues[queue].push(job);
            }

            if (this.queues[queue].length > 0) {
                this.process(queue);
            }
        };

        job.callback(job.data, callback);
    }
}

module.exports = Queue;