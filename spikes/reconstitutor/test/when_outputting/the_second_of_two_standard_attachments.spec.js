const attachmentFragmentBuilder = require("../../src/building/attachmentFragmentBuilder");
const attachmentWriter = require("../../src/common/attachmentWriter");
const streamerator = require('../../src/common/streamerator');
jest.mock('../../src/common/streamerator');
const fs = require('fs');
jest.mock('fs');
const given = require("../given");
const path = require('path');

describe('When processing the second of two standard attachments', () => {
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
            id: 'Attachment2@e-mis.com/EMISWeb/GP2GP2.2A',
            name: '857419DE-7512-4619-A567-067CF9959EF1_EmisWeb.Hl7',
            fullFilePath: 'parentFolder/0F28A313-EEDB-413E-9D41-BED8213DCB95',
            largeAttachment: false
        };
    
        fs.existsSync = (path) => {
            return true;
        }
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
        expect(reader.push.mock.calls.length).toBe(attachment.fragments.length + 1);
    });

    test('it should write the expected fragment data', () => {
        let encodedData = new Buffer('8TW8CYaLmjADP/kYvf/4+e2ZnjXleZ/+6vG//H+uHzTqR863AA==', 'base64');
        expect(reader.push.mock.calls[0][0]).toEqual(encodedData);
    });

});