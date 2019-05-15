const orchestrator = require("../src/orchestrator");
const fileRenamer = require('../src/common/fileRenamer');
jest.mock('../src/common/fileRenamer');
const primaryFileFinder = require('../src/common/primaryFileFinder');
jest.mock('../src/common/primaryFileFinder');
const attachmentWriter = require('../src/common/attachmentWriter');
jest.mock('../src/common/attachmentWriter');
const given = require('./given');
const fs = require('fs');
jest.mock('fs');
const path = require('path');

describe('When extracting all files in a folder', () => {
    let targetFolder, outputFolder, result;

    beforeAll(async () => {
        jest.clearAllMocks();
        
        targetFolder = 'someFolder';
        outputFolder = 'somewhereElseFolder';

        process.argv = [
            nodePath = 'somethingOrOther',
            targetFolder,
            outputFolder
        ];

        fileRenamer.renameAllFilesInFolder = jest.fn();
        primaryFileFinder.findAllPrimaryFilesInFolder = jest.fn((folder) => {
            if (folder === targetFolder) {
                return [
                    'someFolder/0F28A313-EEDB-413E-9D41-BED8213DCB95'
                ];
            } else {
                return [];
            }
        });
        attachmentWriter.writeFileTo = jest.fn();

        fs.existsSync = (path) => { 
            return true;
        };
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

        result = await orchestrator.processAllFiles();
    })

    test('it should rename all files in the target folder', () => {
        expect(fileRenamer.renameAllFilesInFolder.mock.calls.length).toBe(1);
    });

    test('it should search for primary files in target folder', () => {
        expect(primaryFileFinder.findAllPrimaryFilesInFolder.mock.calls.length).toBe(1);
    });

    test('it should write out 3 attachments', () => {
        expect(attachmentWriter.writeFileTo.mock.calls.length).toBe(3);
    });

    test('it should write out the first attachment to the output folder', () => {
        expect(attachmentWriter.writeFileTo.mock.calls[0][1]).toBe(outputFolder);
    });

    test('it should write out the second attachment to the output folder', () => {
        expect(attachmentWriter.writeFileTo.mock.calls[1][1]).toBe(outputFolder);
    });

    test('it should write out the third attachment to the output folder', () => {
        expect(attachmentWriter.writeFileTo.mock.calls[2][1]).toBe(outputFolder);
    });

    test('it should return a detailed report', () => {
        expect(result).toEqual({
            totalPrimaryFilesProcessed: 1,
            totalAttachmentsProcessed: 3
        });
    });
});