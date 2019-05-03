const given = require("./givenAlt");
const fragmentCollator = require("../src/fragmentCollator");
const findInFiles = require('find-in-files');
jest.mock('find-in-files');

describe('When gathering fragments for large attachments', () => {
    jest.setTimeout(120000);
    let fragments;

    beforeAll(async () => {
        let fragmentLocation = "/Users/christiantaylor/Downloads/sandbox";
        let largeAttachmentId = 'E5EE718C-2577-401B-AFC3-CB651FD3011F';

        findInFiles.find = async function(searchTerm, folderPath) { 
            return new Promise((resolve, reject) => { 
                let foundItem = largeAttachmentFragmentFiles.find(item => item.messageId === searchTerm);
                let result = foundItem ? JSON.parse(`{ "${foundItem.fullFilePath}": { } }`) : {};
                resolve(result);
            });
        };

        fragments = await fragmentCollator.getAllFragmentsForLargeAttachment(largeAttachmentId, fragmentLocation);
    })

    test("it should return 10 items", async () => {
        expect(fragments.length).toBe(10);
    });

    test("it should find all the fragment file paths", async () => {
        expect(fragments).toEqual([
            { fullFilePath: "/Users/christiantaylor/Downloads/sandbox/0Zl8WQLw-ibKwJY6r4e9FA=="},
            { fullFilePath: "/Users/christiantaylor/Downloads/sandbox/hQzneCPeb2-WCsSXOhER5g=="},
            { fullFilePath: "/Users/christiantaylor/Downloads/sandbox/gYQPLrMwNz2syD+HKBdTrQ=="},
            { fullFilePath: "/Users/christiantaylor/Downloads/sandbox/Kk8g6iTMd-1YjeQng-ND0A=="},
            { fullFilePath: "/Users/christiantaylor/Downloads/sandbox/YJIoVsTQmVTW40M4KqN-9g=="},
            { fullFilePath: "/Users/christiantaylor/Downloads/sandbox/OpsPaItvPzPkKC+Yd7TfTw=="},
            { fullFilePath: "/Users/christiantaylor/Downloads/sandbox/iEDGyws55z-7M15pfLIFPw=="},
            { fullFilePath: "/Users/christiantaylor/Downloads/sandbox/F7si1Vvi+GxW-4zsJLDMgg=="},
            { fullFilePath: "/Users/christiantaylor/Downloads/sandbox/kA8FktQM8iS3g4xVoU3JIA=="},
            { fullFilePath: "/Users/christiantaylor/Downloads/sandbox/RZh541hsaR0S1Ht3plRtTA=="}
        ]);
    });

    let largeAttachmentFragmentFiles = [{
        fullFilePath: "/Users/christiantaylor/Downloads/sandbox/0Zl8WQLw-ibKwJY6r4e9FA==",
        messageId: "<message-id>E5EE718C-2577-401B-AFC3-CB651FD3011F</message-id>"
    },
    {
        fullFilePath: "/Users/christiantaylor/Downloads/sandbox/hQzneCPeb2-WCsSXOhER5g==",
        messageId: "<message-id>B48B8DC1-3C90-4817-8186-E2BA3B16E2EE</message-id>"
    },
    {
        fullFilePath: "/Users/christiantaylor/Downloads/sandbox/gYQPLrMwNz2syD+HKBdTrQ==",
        messageId: "<message-id>02D052E4-F8CC-4D2D-832A-E8F1EBB5F064</message-id>"
    },
    {
        fullFilePath: "/Users/christiantaylor/Downloads/sandbox/Kk8g6iTMd-1YjeQng-ND0A==",
        messageId: "<message-id>8DB7B37C-6A26-4C37-A4C0-80F6B46F02AF</message-id>"
    },
    {
        fullFilePath: "/Users/christiantaylor/Downloads/sandbox/YJIoVsTQmVTW40M4KqN-9g==",
        messageId: "<message-id>FCFC4F78-8F60-4140-B0A7-0DE7BEC3AC30</message-id>"
    },
    {
        fullFilePath: "/Users/christiantaylor/Downloads/sandbox/OpsPaItvPzPkKC+Yd7TfTw==",
        messageId: "<message-id>0AEEDAAB-BB16-4343-BD37-256A56A27937</message-id>"
    },
    {
        fullFilePath: "/Users/christiantaylor/Downloads/sandbox/iEDGyws55z-7M15pfLIFPw==",
        messageId: "<message-id>697AC0D7-C90B-4650-9C95-193219EE9992</message-id>"
    },
    {
        fullFilePath: "/Users/christiantaylor/Downloads/sandbox/F7si1Vvi+GxW-4zsJLDMgg==",
        messageId: "<message-id>5B9706C2-B6BB-4301-97CD-17AD8A429522</message-id>"
    },
    {
        fullFilePath: "/Users/christiantaylor/Downloads/sandbox/kA8FktQM8iS3g4xVoU3JIA==",
        messageId: "<message-id>EB0B839B-77C1-42A9-8A1C-6FFCB0A250C1</message-id>"
    },
    {
        fullFilePath: "/Users/christiantaylor/Downloads/sandbox/RZh541hsaR0S1Ht3plRtTA==",
        messageId: "<message-id>23C41A31-DADB-45D3-BCA9-0EF4E4F4A779</message-id>"
    }];
});