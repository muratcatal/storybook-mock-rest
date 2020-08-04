import { simpleSchemeGenerator } from "../simple-scheme";
import { DataGenerator } from "..";

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