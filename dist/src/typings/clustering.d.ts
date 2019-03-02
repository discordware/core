export interface IClusteringOptions {
    clusters: number;
    env: {
        [key: string]: string | number;
    };
}
export interface IClustering {
    readonly isMaster: boolean;
    init(): Promise<void>;
}
export interface ICallbacks {
    connect: {
        [key: number]: (err: boolean) => void;
    };
    restart: {
        [key: number]: (err: boolean) => void;
    };
}
