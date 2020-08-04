import { isEqualsEitherOf } from "..";

describe('utils',() => {
    test("should given value equal any of param",() => {
        expect(isEqualsEitherOf("good","today","is","a","good","day")).toBe(true);
        expect(isEqualsEitherOf("true","true","false",true,false)).toBe(true);
    });
    
    test("should not equal given value",() => {
        expect(isEqualsEitherOf("tomorrow","today","is","a","good","day")).toBe(false);
    });
})