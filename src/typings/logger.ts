import { IJSONObject } from './common';

export interface ITransportOptions {
    debug: boolean;
    error: boolean;
    info: boolean;
    log: boolean;
    warn: boolean;
}

export interface ILog extends IJSONObject {
    src: string;
    msg: string;
}

export interface ITransport {
    name: string;
    init(): Promise<void>;
    debug(data: ILog);
    error(data: ILog);
    info(data: ILog);
    log(data: ILog);
    warn(data: ILog);
}

export interface ILogger {
    init(): Promise<void[]>;
    registerTransport(name: string, transport: ITransport): Promise<void>;
    debug(data: ILog);
    error(data: ILog);
    info(data: ILog);
    log(data: ILog);
    warn(data: ILog);
}
