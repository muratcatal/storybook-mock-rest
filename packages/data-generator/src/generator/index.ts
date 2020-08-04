import { arraySchemeGenerator } from "./array-scheme"
import { objectSchemeGenerator } from "./object-scheme";
import { simpleSchemeGenerator } from "./simple-scheme";
import { isEqualsEitherOf } from "@mock/utils";

class DataGenerator {
    private static getGenerator(value: any): { generator: (scheme: any) => any; isSimpleSchemeGenerator?: boolean } {
        return function () {
            if (Array.isArray(value)) {
                return { generator: arraySchemeGenerator };
            } else if (typeof value == "object") {
                return { generator: objectSchemeGenerator };
            } else if (isEqualsEitherOf(typeof value, "function", "symbol")) {
                throw Error(`${typeof value} not supported in JSON. Please check your JSON scheme`);
            } else {
                return { generator: simpleSchemeGenerator, isSimpleSchemeGenerator: true };
            }
        }()
    }

    public static generateData(value: any) {
        let continueToGenerate: (boolean | undefined) = false;
        let schemeValue = value;
        do {
            const { generator, isSimpleSchemeGenerator } = DataGenerator.getGenerator(schemeValue);

            continueToGenerate = isSimpleSchemeGenerator;

            if (isSimpleSchemeGenerator) {
                return generator(value);
            } else {
                schemeValue = generator(value);
            }
            if(!continueToGenerate){
                return schemeValue;
            }
        } while (continueToGenerate);

    }
}

export {
    DataGenerator
}