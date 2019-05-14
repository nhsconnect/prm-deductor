const attachmentFragmentBuilder = require("../../src/building/attachmentFragmentBuilder");
const given = require("../given");
const path = require('path');
const fs = require('fs');
jest.mock('fs');

describe('When parsing a large attachment and a fragment file is missing', () => {
    let attachment, fragments;

    beforeAll(() => {
        jest.clearAllMocks();

        attachment = { 
            id: 'E5EE718C-2577-401B-AFC3-CB651FD3011F',
            name: '3D085A2B-E00F-44F8-AA85-6699D2D4B259_(Encoded Compressed=No Length=42810092) 2003-16.tif',
            fullFilePath: 'parentFolder/E5EE718C-2577-401B-AFC3-CB651FD3011F'
        };

        fs.readFileSync = (filePath) => { 
            switch (path.basename(filePath)) {
                case 'E5EE718C-2577-401B-AFC3-CB651FD3011F':
                    return given.attachmentFileContent;
                case 'B48B8DC1-3C90-4817-8186-E2BA3B16E2EE':
                    return given.fragmentContent(95, 'B48B8DC1-3C90-4817-8186-E2BA3B16E2EE', 1);
                case '02D052E4-F8CC-4D2D-832A-E8F1EBB5F064':
                    return given.fragmentContent(96, '02D052E4-F8CC-4D2D-832A-E8F1EBB5F064', 2);
            }
        };

        fs.existsSync = (filePath) => {
            switch (path.basename(filePath)) {
                case 'E5EE718C-2577-401B-AFC3-CB651FD3011F':
                    return true;
                case 'B48B8DC1-3C90-4817-8186-E2BA3B16E2EE':
                    return true;
                case '02D052E4-F8CC-4D2D-832A-E8F1EBB5F064':
                    return true;
                case '8DB7B37C-6A26-4C37-A4C0-80F6B46F02AF':
                    return false;
            }
        }

        fragments = attachmentFragmentBuilder.buildFragmentsFor(attachment); 
    })
    
    test("none of the fragments should be collated", () => {
        expect(fragments.length).toBe(0);
    });
});