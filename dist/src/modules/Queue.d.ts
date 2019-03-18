import { IJob, IJSON, IQueue } from '../typings/index';
/**
 *
 *
 * @class Queue
 */
export default class Queue implements IQueue {
    private queues;
    /**
     * Creates an instance of Queue.
     * @memberof Queue
     */
    constructor();
    /**
     *
     *
     * @returns
     * @memberof Queue
     */
    init(): Promise<void>;
    /**
     *
     *
     * @param {*} queue
     * @param {*} job
     * @param {*} callback
     * @memberof Queue
     */
    schedule<T extends IJSON>(queue: string, job: T, callback: (data: T, cb: (err: boolean) => void) => void): void;
    enqueue<T extends IJSON>(queue: string, job: IJob<T>): void;
    process(queue: string): void;
}
