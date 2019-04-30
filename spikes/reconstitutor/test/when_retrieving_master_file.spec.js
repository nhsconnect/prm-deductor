const main = require("../src/main");
const given = require("./given");

describe('When retrieving master file', () => {
    let fragment;

    beforeAll(async () => {
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
    
    test("it should have 4 large attachments in the file collection", async () => {
        let largeAttachments = fragment.files.filter(file => file.largeAttachment);
        expect(largeAttachments.length).toBe(4);
    });

    test("it should have 2 standard attachments in the file collection", async () => {
        let standardAttachments = fragment.files.filter(file => file.largeAttachment === false);
        expect(standardAttachments.length).toBe(2);
    });

    test("the standard files should also have their data", async () => {
        let standardAttachments = fragment.files.filter(file => file.largeAttachment === false);
        standardAttachments.forEach(attachment => {
            expect(attachment.data).not.toBeUndefined();
        });
    });

    test("the first attachment should have the expected data", async () => {
        let standardAttachments = fragment.files.filter(file => file.largeAttachment === false);
        expect(standardAttachments[0].data).toBe('2Zp8aeOjOf5EW4A+flpBXBueVnj08I8y66O3uoAW+huk2ak/4d/cKJ2XSnPKfwHFdVvQAF4GAA==');
    });

    test("the second attachment should have the expected data", async () => {
        let standardAttachments = fragment.files.filter(file => file.largeAttachment === false);
        expect(standardAttachments[1].data).toBe('8TW8CYaLmjADP/kYvf/4+e2ZnjXleZ/+6vG//H+uHzTqR863AA==');
    });
});