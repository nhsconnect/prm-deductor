const sds = require('../sds')
const ldap = require('./ldap')
const ldapjs = require('ldapjs')
const rewire = require('rewire')

const sds_rewire = rewire('../sds')
const getServiceDetails = sds_rewire.__get__('getServiceDetails')
const getMessageHandlingInfo = sds_rewire.__get__('getMessageHandlingInfo')

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

    test("the details of a given service is returned", () => {
        let serviceDetails = getServiceDetails(client, "P83020")
        expect(serviceDetails).resolves.toEqual(
            {
                nhsAsSvcIA: ['urn:nhs:names:services:gp2gp:RCMR_IN010000UK05'],
                uniqueIdentifier: ['12345'],
                nhsMhsPartyKey: ['P83020-0005239']
            }
        );
    })

    test("the message handling info is returned", () => {
        let messageHandlingInfo = getMessageHandlingInfo(client, 'P83020-0005239')
        expect(messageHandlingInfo).resolves.toEqual({
            nhsMhsPartyKey: "P83020-0005239",
            nhsMhsEndpoint: "urn:nhs:test:endpoint",
            nhsMhsIsAuthenticated: true,
            nhsMhsPersistduration: 30,
            nhsMhsRetries: 3,
            nhsMhsRetryInterval: 30,
            nhsMhsSyncReplyMode: "always",
            nhsMhsAckRequested: true,
            nhsMhsDuplicateElimination: false,
            nhsMhsActor: "66666",
            nhsMhsCPAId: "123456"
        })
    })

    test("the details are returned when exactly one entry matches", async () => {
        expect(sds.getMessageHandlingDetails(ldap.server.url, "P83020")).resolves.toBeDefined()
    })
})