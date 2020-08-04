import { simpleSchemeGenerator } from "../simple-scheme";
import { DataGenerator } from "..";

/**
 * Expects any valid JSON
 * {
 *  a: "a",
 *  b: {
 *    c: "c"
 *  }
 * }
 * @param scheme valid JSON
 */
export const objectSchemeGenerator = (scheme: Object) => {
    const keys = Object.keys(scheme);

    let newObject = {};
    keys.forEach(key => {
        const value = scheme[key];

        const generatedValue = DataGenerator.generateData(value);
        newObject[key] = generatedValue;
    });

    return newObject;
};