import { IDataGeneratorSchema } from "./types";
import faker from "faker";
import { DataGenerator } from "./generator";

/**
 * generates random data using faker.js
 * @param data input for data generator
 */
export const generateData = (data: IDataGeneratorSchema) => {
  try {
    const {dataSchema,dataAmount} = data;
    
    const keys = Object.keys(dataSchema);

    
    keys.forEach(key => {
        const value = dataSchema[key];
        DataGenerator.generateData(value);
    });

  } catch (error) {
    throw error;      
  }
}