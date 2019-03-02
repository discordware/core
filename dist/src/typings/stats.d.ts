export interface IStatsOptions {
    interval: number;
}
export declare enum StatType {
    SUM = 0,
    AVERAGE = 1
}
export interface IStats {
    init(): any;
    addMetric(name: string, method: string, type: StatType): any;
    disableMetric(name: string): any;
}
