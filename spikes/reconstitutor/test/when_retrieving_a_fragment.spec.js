const fragmentBuilder = require("../src/fragmentBuilder");
const given = require("./given");
const fs = require('fs');
jest.mock('fs');

describe.only('When retrieving a fragment', () => {
    let fragmentFile;

    beforeAll(() => {
        let fullFilePath = 'somewhere over the rainbow';
        fs.readFileSync = (path) => { 
            return (path === fullFilePath) ? given.fragmentContent : '';
        };

        fragmentFile = fragmentBuilder.build(fullFilePath);
    })

    test("it should have an id", () => {
        expect(fragmentFile.id).toBe('B48B8DC1-3C90-4817-8186-E2BA3B16E2EE');
    });

    test("it should have a partNumber", () => {
        expect(fragmentFile.partNumber).toBe(96);
    });
});