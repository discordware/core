import { ILog, ITransport, ITransportOptions } from '../typings';
export default class Console implements ITransport {
    name: string;
    private options;
    constructor(options: ITransportOptions);
    fixTime(time: any): string;
    getTime(): string;
    format(text: any, color: any): any;
    init(): Promise<void>;
    debug(data: ILog): void;
    error(data: ILog): void;
    info(data: ILog): void;
    log(data: ILog): void;
    warn(data: ILog): void;
}
