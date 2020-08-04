import { DataGenerator } from "..";
import { getRandomNumber } from "@mock/utils";

/**
 * [repeat(0),scheme]
 * [repeat(10,20),scheme]
 * [repeat(20),scheme]
 * @param scheme an array
 */
export const arraySchemeGenerator = (scheme: (string | any)[]): any[] => {
    if (scheme.length !== 2) {
        throw new Error("Array scheme should have repeat syntax in first item, and object/primitive item scheme in second item");
    }

    const repeatSyntax = scheme[0] as string;
    // if we do not have repeat syntax as first item, throw exception
    if (/repeat\(.\)/) {
        // if null, generate only 1 item
        const fallbackMin = 1;
        const repeatItemsSyntax = repeatSyntax.match(/\d+/g) ?? [fallbackMin];
        const repeatItems = getRandomNumber(Number(repeatItemsSyntax[0]), Number(repeatItemsSyntax[1]));
        // const min = Number.isNaN() || Number(repeatItemsSyntax[0]) === 0 ? fallbackMin : Math.abs(Number(repeatItemsSyntax[0]));
        // let max = Number.isNaN(Number(repeatItemsSyntax[1])) ? min + 1 : Math.abs(Number(repeatItemsSyntax[1]));
        // if (max < min) {
        //     max = min + 1;
        // }
        // const repeatItems = Math.floor(Math.random() * (max - min) + min);
        const snapshotScheme = scheme[1];
        let result = [];
        for (let i = 0; i < repeatItems; i++) {
            const item = DataGenerator.generateData(snapshotScheme);
            result.push(item);
        }
        return result;
    } else {
        throw new Error("Array scheme generator expects repeat syntax as first item repeat(n) or repeat(min,max)");
    }
};