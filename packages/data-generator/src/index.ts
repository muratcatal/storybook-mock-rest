import { IDataGeneratorSchema } from "./types";
import faker from "faker";
import { DataGenerator } from "./generator";
import { getRandomNumber } from "@mock/utils";

/**
 * generates random data using faker.js
 * @param data input for data generator
 */
export const generateData = (data: IDataGeneratorSchema) => {
  try {
    const { dataSchema, dataAmount } = data;
    const repeatItem = getRandomNumber(dataAmount.min, dataAmount.max);

    if (repeatItem === 1) {
      return DataGenerator.generateData(dataSchema);
    } else {
      let result = [];
      for (let i = 0; i < repeatItem; i++) {
        result.push(DataGenerator.generateData(dataSchema));
      }
      return result;
    }

  } catch (error) {
    throw error;
  }
}