export interface IStatsOptions {
    interval: number;
}

export enum StatType {
    SUM,
    AVERAGE,
}

export interface IStats {
    init();
    addMetric(name: string, method: string, type: StatType);
    disableMetric(name: string);
}
