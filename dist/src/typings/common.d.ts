export interface IJSONObject {
    [x: string]: string | number | boolean | Date | IJSONObject | IJSONArray;
}
export interface IJSONArray extends Array<string | number | boolean | Date | IJSON | IJSONArray> {
}
export declare type IJSON = IJSONObject | IJSONArray;
