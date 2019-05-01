const masterFileBuilder = require("../src/masterFileBuilder");
const dataCollator = require('../src/dataCollator');
const given = require("./given");

describe('When processing master file', () => {
    let masterFile;

    beforeAll(async () => {
        let content = given.fragmentContent;
        masterFile = await masterFileBuilder.build(content);
        masterFile = await dataCollator.appendDataToStandardAttachments(masterFile);
    })

    test("the standard files should also have their data", async () => {
        let standardAttachments = masterFile.attachments.filter(file => file.largeAttachment === false);
        standardAttachments.forEach(attachment => {
            expect(attachment.data).not.toBeUndefined();
        });
    });

    test("the first attachment should have the expected data", async () => {
        let standardAttachments = masterFile.attachments.filter(file => file.largeAttachment === false);
        expect(standardAttachments[0].data).toBe('2Zp8aeOjOf5EW4A+flpBXBueVnj08I8y66O3uoAW+huk2ak/4d/cKJ2XSnPKfwHFdVvQAF4GAA==');
    });

    test("the second attachment should have the expected data", async () => {
        let standardAttachments = masterFile.attachments.filter(file => file.largeAttachment === false);
        expect(standardAttachments[1].data).toBe('8TW8CYaLmjADP/kYvf/4+e2ZnjXleZ/+6vG//H+uHzTqR863AA==');
    });
});