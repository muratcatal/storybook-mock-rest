export interface IDataGeneratorSchema {
    dataAmount: number;
    dataSchema: Object;
}

// export type DataGeneratorResult<T> = T extends string ? string : T extends number ? number : T extends [] ? [] : object;