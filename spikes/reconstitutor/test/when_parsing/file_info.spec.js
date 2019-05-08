const attachmentReferenceParser = require("../../src/parsers/attachmentReferenceParser");

describe('When parsing file info', () => {
    test(`and the file info is typical`, () => {
        let file = attachmentReferenceParser.parse(`<eb:Reference eb:id="_72FA3D52-D2B2-4197-87F4-238E9C6E4AA7" xlink:href="cid:Attachment1@e-mis.com/EMISWeb/GP2GP2.2A">
                                            <eb:Description xml:lang="en">Filename="72FA3D52-D2B2-4197-87F4-238E9C6E4AA7_Customizing a Project Plan 2013.mpp" ContentType=application/octet-stream Compressed=Yes LargeAttachment=No OriginalBase64=No Length=72580</eb:Description>
                                        </eb:Reference>`);

        expect(file).toEqual({
            name: '72FA3D52-D2B2-4197-87F4-238E9C6E4AA7_Customizing a Project Plan 2013.mpp',
            contentType: 'application/octet-stream',
            largeAttachment: false,
            fileLength: 72580,
            id: 'Attachment1@e-mis.com/EMISWeb/GP2GP2.2A'
        });
    });

    test(`and the file info contains meta data after the Length setting`, () => {
        let file = attachmentReferenceParser.parse(`<eb:Reference eb:id="_857419DE-7512-4619-A567-067CF9959EF1" xlink:href="cid:Attachment2@e-mis.com/EMISWeb/GP2GP2.2A">
                                            <eb:Description xml:lang="en">Filename="857419DE-7512-4619-A567-067CF9959EF1_EmisWeb.Hl7" ContentType=text/xml Compressed=Yes LargeAttachment=No OriginalBase64=No Length=723420 DomainData="X-GP2GP-Skeleton: Yes"</eb:Description>
                                        </eb:Reference>`);

        expect(file).toEqual({
            name: '857419DE-7512-4619-A567-067CF9959EF1_EmisWeb.Hl7',
            contentType: 'text/xml',
            largeAttachment: false,
            fileLength: 723420,
            id: 'Attachment2@e-mis.com/EMISWeb/GP2GP2.2A'
        });
    });

    test(`and filename contains meta data that might confuse our Length parsing`, () => {
        let file = attachmentReferenceParser.parse(`<eb:Reference eb:id="_3D085A2B-E00F-44F8-AA85-6699D2D4B259" xlink:href="mid:E5EE718C-2577-401B-AFC3-CB651FD3011F">
                                            <eb:Description xml:lang="en">Filename="3D085A2B-E00F-44F8-AA85-6699D2D4B259_(Encoded Compressed=No Length=42810092) 2003-16.tif" ContentType=image/tiff Compressed=No LargeAttachment=Yes OriginalBase64=No Length=42810092</eb:Description>
                                        </eb:Reference>`);
        expect(file).toEqual({
            name: '3D085A2B-E00F-44F8-AA85-6699D2D4B259_(Encoded Compressed=No Length=42810092) 2003-16.tif',
            contentType: 'image/tiff',
            largeAttachment: true,
            fileLength: 42810092,
            id: 'E5EE718C-2577-401B-AFC3-CB651FD3011F'
        });
    });
});