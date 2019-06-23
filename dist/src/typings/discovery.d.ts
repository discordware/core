import { IJSON } from './index';
export interface IDiscovery {
    init(): Promise<void>;
    on(event: 'discoveredMaster', listener: (master: IJSON) => void): any;
}
