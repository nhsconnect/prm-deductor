const fileRenamer = require('../src/common/fileRenamer');
const fs = require('fs');
jest.mock('fs');
const path = require('path');
const given = require('./given');

describe('When renaming all files in a folder', () => {
    let targetFolder, result;

    beforeAll(() => {
        jest.clearAllMocks();

        targetFolder = 'someFolder';

        fs.readdirSync = (folder) => {
            if (folder === targetFolder) {
                return [
                    'file1',
                    'file2',
                    'file3'
                ];
            }
        }

        fs.readFileSync = (filePath) => { 
            switch (path.basename(filePath)) {
                case 'file1':
                    return given.primaryFileContent;
                case 'file2':
                    return given.attachmentFileContent;
                case 'file3':
                    return given.fragmentContent(95, 'B48B8DC1-3C90-4817-8186-E2BA3B16E2EE', 1);
            }
        };

        fs.renameSync = jest.fn();

        result = fileRenamer.renameAllFilesInFolder(targetFolder);
    })

    test('it should rename 3 files', () => {
        expect(fs.renameSync.mock.calls.length).toBe(3);
    });

    test('it should rename the first file to its message Id', () => {
        let originalFullFilePath = path.join(targetFolder, 'file1');
        let renameFullFilePath = path.join(targetFolder, '0F28A313-EEDB-413E-9D41-BED8213DCB95');

        expect(fs.renameSync.mock.calls[0]).toEqual([
            originalFullFilePath,
            renameFullFilePath
        ]);
    });

    test('it should rename the second file to its message Id', () => {
        let originalFullFilePath = path.join(targetFolder, 'file2');
        let renameFullFilePath = path.join(targetFolder, 'E5EE718C-2577-401B-AFC3-CB651FD3011F');

        expect(fs.renameSync.mock.calls[1]).toEqual([
            originalFullFilePath,
            renameFullFilePath
        ]);
    });

    test('it should rename the third file to its message Id', () => {
        let originalFullFilePath = path.join(targetFolder, 'file3');
        let renameFullFilePath = path.join(targetFolder, 'B48B8DC1-3C90-4817-8186-E2BA3B16E2EE');

        expect(fs.renameSync.mock.calls[2]).toEqual([
            originalFullFilePath,
            renameFullFilePath
        ]);
    });

    test('it should return a detailed report', () => {
        expect(result).toEqual({
            totalFilesRenamed: 3
        });
    });
});