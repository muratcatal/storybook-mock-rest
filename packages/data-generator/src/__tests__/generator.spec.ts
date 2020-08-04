import { generateData } from "..";

describe('data-generator', () => {
    test("should parse schema", () => {
        const data = generateData({
            dataAmount: {
                min: 1
            },
            dataSchema: "hello"
        });
        expect(data).toBe("hello");
    });

    test("should have length 10 item", () => {
        const data = generateData({
            dataAmount: {
                min: 10
            },
            dataSchema: {
                a: "a"
            }
        });
        expect(data).toHaveLength(10);
    });
});