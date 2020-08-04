import { DataGenerator } from "../generator";

describe('data-generator',() => {
    // test("should parse schema",() => {
    //     // primitive type checks with static and faker versions
    //     expect(DataGenerator.generateData("Hello")).toBe("Hello");
    //     expect(DataGenerator.generateData("{{name.firstName}}")).not.toBe("{{name.firstName}}");

    //     // object schema test
    //     expect(DataGenerator.generateData({
    //         name: "My name",
    //         place: {
    //             city: "Samsun"
    //         }
    //     })).toEqual({
    //         name: "My name"
    //     });
    // });
    test.todo("should generate empty,single and n items of data");
    test.todo("should generate data with expected types");
    test.todo("should throw error on exception");
});