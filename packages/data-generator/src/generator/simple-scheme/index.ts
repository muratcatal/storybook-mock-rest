import faker from "faker";
import { isEqualsEitherOf } from "@mock/utils";

/**
 * Generates dynamic/static value for given input.
 * Input can be any primitive value, or a dynamic content that generates value
 * @param scheme any primitive type
 */
const simpleSchemeGenerator = (scheme: any) => {
    const faked = faker.fake(scheme);

    /**
     * generated values are returned in string type.
     * find and cast them to their own types
     */
    if (isEqualsEitherOf(faked, "true", "false", true, false)) {
        //expected boolean
        return Boolean(faked);
    }
    else if (Number.isNaN(Number(faked))) {
        // expected string
        return faked;
    }

    return Number(faked);
};

export {
    simpleSchemeGenerator
}