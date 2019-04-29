const fileParser = require("../src/fileParser");

describe('When parsing file info', () => {
    test(`and the file info is typical`, () => {
        let file = fileParser.parseFile(`<eb:Description xml:lang="en">Filename="72FA3D52-D2B2-4197-87F4-238E9C6E4AA7_Customizing a Project Plan 2013.mpp" ContentType=application/octet-stream Compressed=Yes LargeAttachment=No OriginalBase64=No Length=72580</eb:Description>`);
        expect(file).toEqual({
            name: '72FA3D52-D2B2-4197-87F4-238E9C6E4AA7_Customizing a Project Plan 2013.mpp',
            contentType: 'application/octet-stream',
            largeAttachment: false,
            fileLength: 72580
        });
    });

    test(`and the file info contains meta data after the Length setting`, () => {
        let file = fileParser.parseFile(`<eb:Description xml:lang="en">Filename="857419DE-7512-4619-A567-067CF9959EF1_EmisWeb.Hl7" ContentType=text/xml Compressed=Yes LargeAttachment=No OriginalBase64=No Length=723420 DomainData="X-GP2GP-Skeleton: Yes"</eb:Description>`);
        expect(file).toEqual({
            name: '857419DE-7512-4619-A567-067CF9959EF1_EmisWeb.Hl7',
            contentType: 'text/xml',
            largeAttachment: false,
            fileLength: 723420
        });
    });

    test(`and filename contains meta data that might confuse our Length parsing`, () => {
        let file = fileParser.parseFile(`<eb:Description xml:lang="en">Filename="3D085A2B-E00F-44F8-AA85-6699D2D4B259_(Encoded Compressed=No Length=42810092) 2003-16.tif" ContentType=image/tiff Compressed=No LargeAttachment=Yes OriginalBase64=No Length=42810092</eb:Description>`);
        expect(file).toEqual({
            name: '3D085A2B-E00F-44F8-AA85-6699D2D4B259_(Encoded Compressed=No Length=42810092) 2003-16.tif',
            contentType: 'image/tiff',
            largeAttachment: true,
            fileLength: 42810092
        });
    });
});