import faker from "faker";
import { isEqualsEitherOf } from "@mock/utils";

const simpleSchemeGenerator = (scheme: any) => {
    const faked = faker.fake(scheme);
  
    /**
     * generated values are returned in string type.
     * find and cast them to their own types
     */
    if(isEqualsEitherOf(faked,"true","false",true,false)){
        //expected boolean
        return Boolean(faked);
    }
    else if(Number.isNaN(Number(faked))){
        // expected string
        return faked;
    }

    return Number(faked);
};

export {
    simpleSchemeGenerator
}