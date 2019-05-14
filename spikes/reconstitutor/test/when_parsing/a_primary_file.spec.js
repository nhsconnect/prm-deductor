const primaryFileBuilder = require("../../src/parsing/primaryFileParser");
const given = require("../given");
const path = require('path');
const fs = require('fs');
jest.mock('fs');

describe('When parsing a primary file', () => {
    let primaryFile;

    beforeAll(() => {
        jest.clearAllMocks();
        
        fs.existsSync = (path) => {
            return true;
        }
        let fullFilePath = 'parentFolder/0F28A313-EEDB-413E-9D41-BED8213DCB95';
        fs.readFileSync = (filePath) => { 
            switch (path.basename(filePath)) {
                case '0F28A313-EEDB-413E-9D41-BED8213DCB95':
                    return given.primaryFileContent;
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

        primaryFile = primaryFileBuilder.parse(fullFilePath); //?
    });

    test("it should have an id", () => {
        expect(primaryFile.id).toBe('0F28A313-EEDB-413E-9D41-BED8213DCB95');
    });

    test("it should have the expected partName", () => {
        expect(primaryFile.name).toBe('Part_82_12073865.1555409597528');
    });

    test("it should have a fullFilePath", () => {
        expect(primaryFile.fullFilePath).toBe('parentFolder/0F28A313-EEDB-413E-9D41-BED8213DCB95');
    });

    test("it should contain the message completed element", () => {
        expect(primaryFile.content).toContain('<RCMR_IN030000UK06');
    });

    test("it should contain the ehr extract element", () => {
        expect(primaryFile.content).toContain('<EhrExtract');
    });

    test("it should contain a manifest element", () => {
        expect(primaryFile.content).toContain("<eb:Manifest");
    });

    test("it should have a name", () => {
        expect(primaryFile.name).toBe('Part_82_12073865.1555409597528');
    });

    test("it should have 3 files", () => {
        expect(primaryFile.attachments.length).toBe(3);
    });
    
    test("it should have 1 large attachment in the file collection", () => {
        let largeAttachments = primaryFile.attachments.filter(file => file.largeAttachment);
        expect(largeAttachments.length).toBe(1);
    });

    test("the large attachment should have a fragments collection", () => {
        let largeAttachments = primaryFile.attachments.filter(file => file.largeAttachment);
        expect(largeAttachments[0].fragments).not.toBeUndefined();
    });

    test("the large attachment fragments collection should be populated", () => {
        let largeAttachments = primaryFile.attachments.filter(file => file.largeAttachment);
        expect(largeAttachments[0].fragments.length).toBe(10);
    });

    test("it should have 2 standard attachments in the file collection", () => {
        let standardAttachments = primaryFile.attachments.filter(file => file.largeAttachment === false);
        expect(standardAttachments.length).toBe(2);
    });

    test("the standard attachments should have the same fullFilePath as the primary file", () => {
        let standardAttachments = primaryFile.attachments.filter(file => file.largeAttachment === false);
        standardAttachments.forEach(attachment => {
            expect(attachment.fullFilePath).toBe(primaryFile.fullFilePath);
        });
    });

    test("the first standard attachment should have a fragments collection", () => {
        let standardAttachments = primaryFile.attachments.filter(file => file.largeAttachment === false);
        expect(standardAttachments[0].id).toBe('Attachment1@e-mis.com/EMISWeb/GP2GP2.2A');
    });

    test("the first standard attachment should have a fragments collection", () => {
        let standardAttachments = primaryFile.attachments.filter(file => file.largeAttachment === false);
        expect(standardAttachments[0].fragments).not.toBeUndefined();
    });

    test(`the first standard attachment's fragments collection should be populated`, () => {
        let standardAttachments = primaryFile.attachments.filter(file => file.largeAttachment === false); 
        expect(standardAttachments[0].fragments.length).toBe(1);
    });

    test("the second standard attachment should have a fragments collection", () => {
        let standardAttachments = primaryFile.attachments.filter(file => file.largeAttachment === false);
        expect(standardAttachments[1].id).toBe('Attachment2@e-mis.com/EMISWeb/GP2GP2.2A');
    });

    test("the second standard attachment should have a fragments collection", () => {
        let standardAttachments = primaryFile.attachments.filter(file => file.largeAttachment === false);
        expect(standardAttachments[1].fragments).not.toBeUndefined();
    });

    test(`the second standard attachment's fragments collection should be populated`, () => {
        let standardAttachments = primaryFile.attachments.filter(file => file.largeAttachment === false);
        expect(standardAttachments[1].fragments.length).toBe(1);
    });
});