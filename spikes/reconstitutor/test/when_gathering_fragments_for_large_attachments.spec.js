const given = require("./givenAlt");
const fragmentCollator = require("../src/fragmentCollator");

describe('When gathering fragments for large attachments', () => {
    jest.setTimeout(120000);
    let fragments;

    beforeAll(async () => {
        let fragmentLocation = "/Users/christiantaylor/Downloads/sandbox";
        let largeAttachmentId = 'E5EE718C-2577-401B-AFC3-CB651FD3011F';
        fragments = await fragmentCollator.getAllFragmentsForLargeAttachment(largeAttachmentId, fragmentLocation);
    })

    test("it should return 10 items", async () => {
        expect(fragments.length).toBe(10);
    });

    test("it should find all the fragment file paths", async () => {
        expect(fragments).toEqual([
            "/Users/christiantaylor/Downloads/sandbox/0Zl8WQLw-ibKwJY6r4e9FA==",
            "/Users/christiantaylor/Downloads/sandbox/hQzneCPeb2-WCsSXOhER5g==",
            "/Users/christiantaylor/Downloads/sandbox/gYQPLrMwNz2syD+HKBdTrQ==",
            "/Users/christiantaylor/Downloads/sandbox/Kk8g6iTMd-1YjeQng-ND0A==",
            "/Users/christiantaylor/Downloads/sandbox/YJIoVsTQmVTW40M4KqN-9g==",
            "/Users/christiantaylor/Downloads/sandbox/OpsPaItvPzPkKC+Yd7TfTw==",
            "/Users/christiantaylor/Downloads/sandbox/iEDGyws55z-7M15pfLIFPw==",
            "/Users/christiantaylor/Downloads/sandbox/F7si1Vvi+GxW-4zsJLDMgg==",
            "/Users/christiantaylor/Downloads/sandbox/kA8FktQM8iS3g4xVoU3JIA==",
            "/Users/christiantaylor/Downloads/sandbox/RZh541hsaR0S1Ht3plRtTA=="
        ]);
    });

});