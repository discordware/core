import { IJSON } from './common';
export interface IJob<T extends IJSON> {
    data: T;
    callback: (data: T, cb: (err: boolean) => void) => void;
}
export interface IQueue {
    init(): Promise<void>;
    schedule<T extends IJSON>(queue: string, job: T, callback: (data: T, cb: (err: boolean) => void) => void): any;
}
