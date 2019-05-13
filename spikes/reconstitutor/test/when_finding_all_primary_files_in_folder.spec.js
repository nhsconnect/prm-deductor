const primaryFileFinder = require('../src/common/primaryFileFinder');
const findInFiles = require('find-in-files');
jest.mock('find-in-files');

describe('When finding all primary files in a folder', async () => {
    let targetFolder, primaryFilesFound;

    beforeAll(async () => {
        targetFolder = 'someFolder';

        findInFiles.find = retrieveFile;
        primaryFilesFound = await primaryFileFinder.findAllPrimaryFilesInFolder(targetFolder);
    })

    test('it should find 1 file', () => {
        expect(primaryFilesFound.length).toBe(1);
    });

    test('it should find the expected file', () => {
        expect(primaryFilesFound[0]).toBe('someFolder/0F28A313-EEDB-413E-9D41-BED8213DCB95');
    });

    async function retrieveFile(searchTerm, folderPath) {
        return new Promise((resolve, reject) => { 
            let result = JSON.parse(`{ "someFolder/0F28A313-EEDB-413E-9D41-BED8213DCB95": { } }`);
            resolve(result);
        })
    }
});