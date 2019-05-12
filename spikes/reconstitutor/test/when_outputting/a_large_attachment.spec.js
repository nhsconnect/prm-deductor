const attachmentFragmentBuilder = require("../../src/building/attachmentFragmentBuilder");
const attachmentWriter = require("../../src/attachmentWriter");
const streamerator = require('../../src/streamerator');
jest.mock('../../src/streamerator');
const fs = require('fs');
jest.mock('fs');
const given = require("../given");
const path = require('path');

describe('When processing a large attachment', () => {
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
                case '8DB7B37C-6A26-4C37-A4C0-80F6B46F02AF':
                    return given.fragmentContent(102, '8DB7B37C-6A26-4C37-A4C0-80F6B46F02AF', 3);
                case 'FCFC4F78-8F60-4140-B0A7-0DE7BEC3AC30':
                    return given.fragmentContent(104, 'FCFC4F78-8F60-4140-B0A7-0DE7BEC3AC30', 4);
                case '0AEEDAAB-BB16-4343-BD37-256A56A27937':
                    return given.fragmentContent(105, '0AEEDAAB-BB16-4343-BD37-256A56A27937', 5);
                case '697AC0D7-C90B-4650-9C95-193219EE9992':
                    return given.fragmentContent(103, '697AC0D7-C90B-4650-9C95-193219EE9992', 6);
                case '5B9706C2-B6BB-4301-97CD-17AD8A429522':
                    return given.fragmentContent(108, '5B9706C2-B6BB-4301-97CD-17AD8A429522', 7);
                case 'EB0B839B-77C1-42A9-8A1C-6FFCB0A250C1':
                    return given.fragmentContent(109, 'EB0B839B-77C1-42A9-8A1C-6FFCB0A250C1', 8);
                case '23C41A31-DADB-45D3-BCA9-0EF4E4F4A779':
                    return given.fragmentContent(107, '23C41A31-DADB-45D3-BCA9-0EF4E4F4A779', 9);
            }
        };

        fragments = attachmentFragmentBuilder.buildFragmentsFor(attachment);
        attachment.fragments = fragments;

        result = attachmentWriter.writeFileTo(attachment, someFolder);
    })

    test('it should create a read stream', () => {
        expect(streamerator.createReadStream.mock.calls.length).toBe(1);
    });

    test('it should create a write stream', () => {
        expect(streamerator.createWriteStream.mock.calls.length).toBe(1);
    });

    test('it should create the read write pipe', () => {
        expect(reader.pipe.mock.calls.length).toBe(1);
    });

    test('it should create a write stream to the expected full file path', () => {
        let expectedFullFilePath = path.join(someFolder, attachment.name);
        expect(streamerator.createWriteStream.mock.calls[0][0]).toBe(expectedFullFilePath);
    });

    test('it should write for each fragment', () => {
        expect(reader.push.mock.calls.length).toBe(attachment.fragments.length);
    });
});