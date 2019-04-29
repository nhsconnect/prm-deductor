const main = require("../src/main");
const given = require("./given");

describe('When retrieving master file', () => {
    let fragment;
    let expectedFile1, expectedFile2, expectedFile3, expectedFile4, expectedFile5, expectedFile6;

    beforeAll(async () => {
        setupExpectedFiles();

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

    test(`the files collection should contain ${expectedFile1}`, async () => {
        expect(fragment.files).toContainEqual(expectedFile1);
    });

    test(`the files collection should contain ${expectedFile2}`, async () => {
        expect(fragment.files).toContainEqual(expectedFile2);
    });

    test(`the files collection should contain ${expectedFile3}`, async () => {
        expect(fragment.files).toContainEqual(expectedFile3);
    });

    test(`the files collection should contain ${expectedFile4}`, async () => {
        expect(fragment.files).toContainEqual(expectedFile4);
    });

    test(`the files collection should contain ${expectedFile5}`, async () => {
        expect(fragment.files).toContainEqual(expectedFile5);
    });

    test(`the files collection should contain ${expectedFile6}`, async () => {
        expect(fragment.files).toContainEqual(expectedFile6);
    });

    function setupExpectedFiles() {
        expectedFile1 = {
            name: '72FA3D52-D2B2-4197-87F4-238E9C6E4AA7_Customizing a Project Plan 2013.mpp',
            contentType: 'application/octet-stream',
            largeAttachment: false,
            fileLength: 72580
        };
        expectedFile2 = {
            name: '857419DE-7512-4619-A567-067CF9959EF1_EmisWeb.Hl7',
            contentType: 'text/xml',
            largeAttachment: false,
            fileLength: 723420
        };
        expectedFile3 = {
            name: 'D61AC635-4750-4118-B461-33ACC1D79478_5_06MB CommonwealthClub.ppt',
            contentType: 'application/octet-stream',
            largeAttachment: true,
            fileLength: 6274944
        };
        expectedFile4 = {
            name: '3D085A2B-E00F-44F8-AA85-6699D2D4B259_(Encoded Compressed=No Length=42810092) 2003-16.tif',
            contentType: 'image/tiff',
            largeAttachment: true,
            fileLength: 42810092
        };
        expectedFile5 = {
            name: '0D23CC94-15A3-4407-9DA8-5EF57B48581D_(Encoded Compressed=Yes Length=57347648) RAW_NIKON_D800_14bit_FX_LOSSLESS.NEF',
            contentType: 'application/octet-stream',
            largeAttachment: true,
            fileLength: 57347648
        };
        expectedFile6 = {
            name: '1E49E84D-B29B-466B-93A5-432459CA549B_Treadmill Running 300fps.avi',
            contentType: 'application/octet-stream',
            largeAttachment: true,
            fileLength: 159620384
        };
    }
});