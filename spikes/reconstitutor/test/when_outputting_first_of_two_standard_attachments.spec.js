const attachmentFragmentBuilder = require("../src/building/attachmentFragmentBuilder");
const attachmentWriter = require("../src/attachmentWriter");
const streamerator = require('../src/streamerator');
jest.mock('../src/streamerator');
const fs = require('fs');
jest.mock('fs');
const given = require("./given");
const path = require('path');

describe('When processing the first of two standard attachments', () => {
    let someFolder, attachment, reader, result;

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
            id: 'Attachment1@e-mis.com/EMISWeb/GP2GP2.2A',
            name: '72FA3D52-D2B2-4197-87F4-238E9C6E4AA7_Customizing a Project Plan 2013.mpp',
            fullFilePath: 'parentFolder/0F28A313-EEDB-413E-9D41-BED8213DCB95'
        };

        fs.readFileSync = (filePath) => { 
            if (filePath === attachment.fullFilePath) {
                return given.primaryFileContentWithTwoStandardAttachments;
            }
            return '';
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

    test('it should write the expected fragment data', () => {
        expect(reader.push.mock.calls[0][0]).toBe('2Zp8aeOjOf5EW4A+flpBXBueVnj08I8y66O3uoAW+huk2ak/4d/cKJ2XSnPKfwHFdVvQAF4GAA==');
    });

});