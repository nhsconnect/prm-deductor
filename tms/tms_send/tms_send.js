const requestPromise = require('request-promise-native');
const fs = require('fs');
const path = require('path');

exports.send = async function() {
    const options = {
        method: 'POST',
        
        multipart: [
            {
                'content-type': 'text/xml; charset=UTF-8',
                body: fs.createReadStream(path.resolve(__dirname, 'test/soap-data.xml'))
            },
            {
                'content-type': 'text/xml; charset=UTF-8',
                body: fs.createReadStream(path.resolve(__dirname, 'test/hl7-data.xml'))
            }
        ],
        headers: {
            SOAPAction: 'urn:nhs:names:services:pdsquery/QUPA_IN000006UK02'
        },
        resolveWithFullResponse: true
    };

    let response = await requestPromise(options);

    return response.statusCode;
};