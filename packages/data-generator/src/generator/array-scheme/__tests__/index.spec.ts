import { arraySchemeGenerator } from "..";

const mockFirstName = "Hello"

jest.mock("faker", () => {
    const originalLib = jest.requireActual("faker");
    return {
        ...originalLib,
        fake: jest.fn((content: string) => {
            // check our syntax for dynamic content generation which is {{...}}
            if (content.startsWith("{{") && content.endsWith("}}")) {
                return "MockName"
            } else {
                return content;
            }
        })
    }
})

describe('array-scheme', () => {
    test.each([
        [["repeat(0)", { a: "a" }], 1, true],
        [["repeat(1)", { a: "a" }], 1, true],
        [["repeat(10)", { a: "a" }], 10, true],
        [["repeat(2,10)", { a: "a" }], [2, 10], true],
        [["repeat(5,3)", {
            a: "a", b: {
                c: "c"
            }
        }], 5, true],
        [["repeat(-2,-10)", { a: "a" }], [2, 10], true],
    ])("should generate %s items", (items, expectedNumberOfItems, isTestActive) => {
        if (isTestActive) {
            const length = arraySchemeGenerator(items).length;
            if (Array.isArray(expectedNumberOfItems)) {
                expect(length).toBeGreaterThanOrEqual(expectedNumberOfItems[0]);
                expect(length).toBeLessThanOrEqual(expectedNumberOfItems[1]);
            } else {
                expect(length).toBe(expectedNumberOfItems);
            }
        }
    });

    test("should throw error on misparameter", () => {
        expect(() => arraySchemeGenerator([])).toThrowError();
        expect(() => arraySchemeGenerator(["a"])).toThrowError();
        expect(() => arraySchemeGenerator(["repeat(1)"])).toThrowError();
    });
});