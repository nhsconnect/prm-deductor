const attachmentFragmentBuilder = require("../../src/building/attachmentFragmentBuilder");
const attachmentWriter = require("../../src/common/attachmentWriter");
const streamerator = require('../../src/common/streamerator');
jest.mock('../../src/common/streamerator');
const fs = require('fs');
jest.mock('fs');
const given = require("../given");
const path = require('path');

describe('When processing a large attachment where not all the fragment files exist', () => {
    let someFolder, attachment, reader;

    beforeAll(() => {
        jest.clearAllMocks();
        
        someFolder = 'outputFolder';

        reader = {
            read: jest.fn(() => {}),
            pipe: jest.fn(() => {}),
            push: jest.fn(() => {})
        };

        streamerator.createReadStream = jest.fn(() => {
            return reader;
        });

        streamerator.createWriteStream = jest.fn();

        attachment = { 
            id: 'E5EE718C-2577-401B-AFC3-CB651FD3011F',
            name: '3D085A2B-E00F-44F8-AA85-6699D2D4B259_(Encoded Compressed=No Length=42810092) 2003-16.tif',
            fullFilePath: 'parentFolder/E5EE718C-2577-401B-AFC3-CB651FD3011F',
            largeAttachment: true
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
        attachment.fragments = fragments;

        result = attachmentWriter.writeFileTo(attachment, someFolder);
    })

    test('it should not create a read stream', () => {
        expect(streamerator.createReadStream.mock.calls.length).toBe(0);
    });

    test('it should not create a write stream', () => {
        expect(streamerator.createWriteStream.mock.calls.length).toBe(0);
    });

    test('it should not create the read write pipe', () => {
        expect(reader.pipe.mock.calls.length).toBe(0);
    });

    test('it should not write out any data', () => {
        expect(reader.push.mock.calls.length).toBe(0);
    });

    test('it should not write out any data', () => {
        expect(result).toEqual({
            totalFragmentsWritten: 0
        });
    });
});