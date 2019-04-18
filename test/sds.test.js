const sds = require('../sds')
const ldap = require('./ldap')
const ldapjs = require('ldapjs')
const rewire = require('rewire')

const sds_rewire = rewire('../sds')
const getServiceDetails = sds_rewire.__get__('getServiceDetails')

describe("When retrieving message handling details", () => {

    let client;

    beforeAll(async (done) => {
        ldap.server.on('listening', () => {
            client = ldapjs.createClient({
                url: ldap.server.url
            });
            done()
        })
        ldap.startServer()
    })

    afterAll(() => {
        ldap.stopServer()
        client.destroy()
    })

    test("the details of a given service is returned", (done) => {
        let serviceDetails = getServiceDetails(client, "P83020")
        expect(serviceDetails).resolves.toEqual(
            {
                nhsAsSvcIA: ['urn:nhs:names:services:gp2gp:RCMR_IN010000UK05'],
                uniqueIdentifier: ['12345'],
                nhsMhsPartyKey: ['P83020-0005239']
            }
        );
        done()
    })

    test("the details are returned when exactly one entry matches", async (done) => {
        try {
            var result = await sds.getMessageHandlingDetails(ldap.server.url, "P83020")
            console.log(result)
            done()
        } catch (err) {
            console.log(err)
            done.fail(err)
        }
    })
})