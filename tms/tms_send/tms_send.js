const requestPromise = require('request-promise-native');
const fs = require('fs');
const path = require('path');

const CA_DATA = fs.readFileSync(path.resolve(__dirname, "../tls/trust.pem"))
const CERT = fs.readFileSync(path.resolve(__dirname, "../tls/test.crt"))
const KEY = fs.readFileSync(path.resolve(__dirname, "../tls/test.key"))

exports.send = async function() {
    const options = {
        method: 'POST',
        uri: 'https://localhost:4001/reliablemessaging/queryrequest',
        agentOptions: {
            cert: CERT,
            key: KEY,
            ca: CA_DATA
        },
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