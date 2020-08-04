export interface IDataGeneratorSchema {
    dataAmount: {
        min: number;
        max?: number;
    };
    dataSchema: Object;
}

// export type DataGeneratorResult<T> = T extends string ? string : T extends number ? number : T extends [] ? [] : object;