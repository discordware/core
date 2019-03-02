export interface IAlertData {
    title: string;
    msg: string;
    date: Date;
    type: string;
}
export interface IDestination {
    init(): Promise<void>;
    alert(data: IAlertData): any;
}
export interface IDiscordDestinationOptions {
    [type: string]: {
        id: string;
        token: string;
    };
}
export interface IAlerts {
    init(): Promise<void[]>;
    registerDestination(name: string, destination: IDestination): any;
    alert(data: IAlertData): Promise<void>;
}
