const main = require("../src/main");
const given = require("./given");

describe('When retrieving master file', () => {
    let fragment;

    beforeAll(async () => {
        let content = given.fragmentContent;

        fragment = await main.retrieve_master_file(content);
    })

    test("it should contain the message completed element", async () => {
        expect(fragment.content).toContain('<RCMR_IN030000UK06');
    });

    test("it should contain the ehr extract element", async () => {
        expect(fragment.content).toContain('<EhrExtract');
    });

    test("it should contain a manifest element", async () => {
        expect(fragment.content).toContain("<eb:Manifest");
    });

    test("it should have a name", async () => {
        expect(fragment.name).toBe('Part_82_12073865.1555409597528');
    });

    test("it should have 6 files", async () => {
        expect(fragment.files.length).toBe(6);
    });

    test("it should have a file called `72FA3D52-D2B2-4197-87F4-238E9C6E4AA7_Customizing a Project Plan 2013.mpp`", async () => {
        let file = {
            name: '72FA3D52-D2B2-4197-87F4-238E9C6E4AA7_Customizing a Project Plan 2013.mpp'
        };
        expect(fragment.files).toContainEqual(file);
    });

    test("it should have a file called `857419DE-7512-4619-A567-067CF9959EF1_EmisWeb.Hl7`", async () => {
        let file = {
            name: '857419DE-7512-4619-A567-067CF9959EF1_EmisWeb.Hl7'
        };
        expect(fragment.files).toContainEqual(file);
    });

    test("it should have a file called `D61AC635-4750-4118-B461-33ACC1D79478_5_06MB CommonwealthClub.ppt`", async () => {
        let file = {
            name: 'D61AC635-4750-4118-B461-33ACC1D79478_5_06MB CommonwealthClub.ppt'
        };
        expect(fragment.files).toContainEqual(file);
    });

    test("it should have a file called `3D085A2B-E00F-44F8-AA85-6699D2D4B259_(Encoded Compressed=No Length=42810092) 2003-16.tif`", async () => {
        let file = {
            name: '3D085A2B-E00F-44F8-AA85-6699D2D4B259_(Encoded Compressed=No Length=42810092) 2003-16.tif'
        };
        expect(fragment.files).toContainEqual(file);
    });

    test("it should have a file called `0D23CC94-15A3-4407-9DA8-5EF57B48581D_(Encoded Compressed=Yes Length=57347648) RAW_NIKON_D800_14bit_FX_LOSSLESS.NEF`", async () => {
        let file = {
            name: '0D23CC94-15A3-4407-9DA8-5EF57B48581D_(Encoded Compressed=Yes Length=57347648) RAW_NIKON_D800_14bit_FX_LOSSLESS.NEF'
        };
        expect(fragment.files).toContainEqual(file);
    });

    test("it should have a file called `1E49E84D-B29B-466B-93A5-432459CA549B_Treadmill Running 300fps.avi`", async () => {
        let file = {
            name: '1E49E84D-B29B-466B-93A5-432459CA549B_Treadmill Running 300fps.avi'
        };
        expect(fragment.files).toContainEqual(file);
    });
});