import { simpleSchemeGenerator } from "..";

describe('simple-scheme',() => {
    test("should generate data from faker",() => {
        // a non-faker string
        expect(simpleSchemeGenerator("hello")).toBe("hello");

        // faker string
        expect(simpleSchemeGenerator("{{name.firstName}}")).not.toBe("{{name.firstName}}");
        expect(simpleSchemeGenerator("{{random.arrayElement([1,2])}}")).toBeLessThanOrEqual(2);
        expect(simpleSchemeGenerator("{{random.arrayElement([true])}}")).toBe(true);
    });
});