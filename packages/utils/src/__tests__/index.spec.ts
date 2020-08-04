import { isEqualsEitherOf, getRandomNumber } from "..";

describe('utils', () => {
    test("should given value equal any of param", () => {
        expect(isEqualsEitherOf("good", "today", "is", "a", "good", "day")).toBe(true);
        expect(isEqualsEitherOf("true", "true", "false", true, false)).toBe(true);
    });

    test("should not equal given value", () => {
        expect(isEqualsEitherOf("tomorrow", "today", "is", "a", "good", "day")).toBe(false);
    });

    /**
     * [min,max,expected]
     */
    test.each([
        [2, 10],
        [3, undefined],
        [4, undefined],
        [-5, undefined],
        [-6, -20],
        [1, 1],
    ])("should generate %s", (min, max) => {
        if (max) {
            expect(getRandomNumber(min, max)).toBeLessThanOrEqual(Math.abs(max as number));
        }
        expect(getRandomNumber(min, max)).toBeGreaterThanOrEqual(Math.abs(min));
    });

})