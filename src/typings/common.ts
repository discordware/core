export interface IJSONObject {
    [x: string]: string | number | boolean | IJSONObject | IJSONArray;
}

export interface IJSONArray extends Array<string | number | boolean | Date | IJSON | IJSONArray> { }

export type IJSON = IJSONObject | IJSONArray | string | number | boolean;
