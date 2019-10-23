import { IJob, IJSON, IQueue } from '../typings/index';

/**
 *
 *
 * @class Queue
 */
export class Queue implements IQueue {
    private queues: {[name: string]: Array<IJob<IJSON>>};

    /**
     * Creates an instance of Queue.
     * @memberof Queue
     */
    constructor() {
        this.queues = {};
    }

    /**
     *
     *
     * @returns
     * @memberof Queue
     */
    public init() {
        return Promise.resolve();
    }

    /**
     *
     *
     * @param {*} queue
     * @param {*} job
     * @param {*} callback
     * @memberof Queue
     */
    public schedule<T extends IJSON>(queue: string, job: T, callback: (data: T, cb: (err: boolean) => void) => void) {
        if (!this.queues[queue]) this.queues[queue] = [];

        this.enqueue<T>(queue, { data: job, callback });
    }

    public enqueue<T extends IJSON>(queue: string, job: IJob<T>) {
        if (this.queues[queue].length === 0) {
            this.queues[queue].push(job);

            this.process(queue);
        } else {
            this.queues[queue].push(job);
        }
    }

    public process(queue: string) {
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

export default Queue;
