const fragmentBuilder = require("../src/fragmentBuilder");
const given = require("./given");

describe('When retrieving a fragment', () => {
    let fragmentFile;

    beforeAll(async () => {
        let content = given.fragmentContent;
        fragmentFile = await fragmentBuilder.build(content);
    })

    test("it should contain a manifest element", async () => {
        expect(fragmentFile.content).toContain("<eb:Manifest");
    });

    test("it should have a name", async () => {
        expect(fragmentFile.name).toBe('Part_96_24463764.1555409629418');
    });

    test("it should only have 1 attachment", async () => {
        expect(fragmentFile.fragments.length).toBe(1);
    });

    test("it should have a fragment name", async () => {
        expect(fragmentFile.fragments).toContainEqual('3D085A2B-E00F-44F8-AA85-6699D2D4B259_(Encoded Compressed=No Length=42810092) 2003-16_1.tif');
    });

});