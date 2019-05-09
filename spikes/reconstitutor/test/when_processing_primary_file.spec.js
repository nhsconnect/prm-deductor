const primaryFileBuilder = require("../src/parsers/primaryFileParser");
const dataCollator = require('../src/dataCollator');
const given = require("./given");
const fs = require('fs');
jest.mock('fs');

describe('When processing primary file', () => {
    let primaryFile;

    beforeAll(async () => {
        let fullFilePath = 'parentFolder/0F28A313-EEDB-413E-9D41-BED8213DCB95';
        fs.readFileSync = (filePath) => { 
            if (filePath === fullFilePath) {
                return given.primaryFileContent;
            }
        };
;
        primaryFile = await primaryFileBuilder.parse(fullFilePath);
        primaryFile = await dataCollator.appendDataToStandardAttachments(primaryFile);
    })

    test("the standard files should also have their data", async () => {
        let standardAttachments = primaryFile.attachments.filter(file => file.largeAttachment === false);
        standardAttachments.forEach(attachment => {
            expect(attachment.data).not.toBeUndefined();
        });
    });

    test("the first attachment should have the expected data", async () => {
        let standardAttachments = primaryFile.attachments.filter(file => file.largeAttachment === false);
        expect(standardAttachments[0].data).toBe('2Zp8aeOjOf5EW4A+flpBXBueVnj08I8y66O3uoAW+huk2ak/4d/cKJ2XSnPKfwHFdVvQAF4GAA==');
    });

    test("the second attachment should have the expected data", async () => {
        let standardAttachments = primaryFile.attachments.filter(file => file.largeAttachment === false);
        expect(standardAttachments[1].data).toBe('8TW8CYaLmjADP/kYvf/4+e2ZnjXleZ/+6vG//H+uHzTqR863AA==');
    });
    
    test("the standard files should also have their encoding", async () => {
        let standardAttachments = primaryFile.attachments.filter(file => file.largeAttachment === false);
        standardAttachments.forEach(attachment => {
            expect(attachment.encoding).not.toBeUndefined();
        });
    });

    test("the first attachment should have the expected encoding", async () => {
        let standardAttachments = primaryFile.attachments.filter(file => file.largeAttachment === false);
        expect(standardAttachments[0].encoding).toBe('base64');
    });

    test("the second attachment should have the expected encoding", async () => {
        let standardAttachments = primaryFile.attachments.filter(file => file.largeAttachment === false);
        expect(standardAttachments[1].encoding).toBe('magicBeans');
    });

});