import { objectSchemeGenerator } from "..";

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

describe('simple-scheme', () => {
    test("should generate static data from faker", () => {
        // simple static json
        expect(objectSchemeGenerator({
            a: "a"
        })).toMatchObject({
            a: "a"
        });

        // nested static json
        expect(objectSchemeGenerator({
            a: "a",
            b: {
                c: "c",
            }
        })).toMatchObject({
            a: "a",
            b: {
                c: "c"
            }
        });
        
        expect(objectSchemeGenerator({
            a: "a",
            b: {
                c: "c",
                d: {
                    e: "e"
                }
            },
            f: {
                g: {
                    h: "h"
                },
                i: "i"
            }
        })).toMatchObject({
            a: "a",
            b: {
                c: "c",
                d: {
                    e: "e"
                }
            },
            f: {
                g: {
                    h: "h"
                },
                i: "i"
            }
        });

    });

    test("should generate same value for wrong dynamic content syntax", () => {
        expect(objectSchemeGenerator({
            a: "{{a"
        })).toMatchObject({
            a: "{{a"
        });

        expect(objectSchemeGenerator({
            a: "a}}"
        })).toMatchObject({
            a: "a}}"
        });
    });

    test("should generate dynamic content", () => {
        expect(objectSchemeGenerator({
            a: "{{name.firstName}}"
        })).toMatchObject({
            a: "MockName"
        }); 

        expect(objectSchemeGenerator({
            a: "{{name.firstName}}",
            b: {
                c: "{{name.firstName}}",
                d: "d",
                e: {
                    f: "{{name.firstName}}",
                    g: "g"
                }
            }
        })).toMatchObject({
            a: "MockName",
            b: {
                c: "MockName",
                d: "d",
                e: {
                    f: "MockName",
                    g: "g"
                }
            }
        }); 
    })
});