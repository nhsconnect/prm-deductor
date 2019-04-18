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

    afterEach(() => {
        ldap.server.removeAllListeners()
    })

    afterAll(() => {
        ldap.stopServer()
        client.destroy()
    })

    test("the details of a given service is returned", () => {
        return expect(getServiceDetails(client, "P83020")).resolves.toEqual({
                nhsAsSvcIA: ['urn:nhs:names:services:gp2gp:RCMR_IN010000UK05'],
                uniqueIdentifier: ['12345'],
                nhsMhsPartyKey: ['P83020-0005239']
            })
    })

    test("and no serviceDetails are returned, an error is thrown", () => {
        return expect(getServiceDetails(client, "P44444")).rejects.toThrowError('No matching entries')
    })

    test("and more than one service is returned, an error is thrown", () => {
        return expect(getServiceDetails(client, "P6666")).rejects.toThrowError('Greater than one matching entry')
    })

    test("the message handling info is returned", () => {
        return expect(getMessageHandlingInfo(client, 'P83020-0005239')).resolves.toEqual({
            nhsMhsEndpoint: ["urn:nhs:test:endpoint"],
            nhsMhsIsAuthenticated: ["true"],
            nhsMhsPersistduration: ["30"],
            nhsMhsRetries: ["3"],
            nhsMhsRetryInterval: ["30"],
            nhsMhsSyncReplyMode: ["always"],
            nhsMhsAckRequested: ["true"],
            nhsMhsDuplicateElimination: ["false"],
            nhsMhsActor: ["66666"],
            nhsMhsCPAId: ["123456"]
        })
    })

    test("and no message handling info are returned, an error is thrown", () => {
        return expect(getMessageHandlingInfo(client, "P44444-0001234")).rejects.toThrowError('No matching entries')
    })

    test("and more than one message handling info is returned, an error is thrown", () => {
        return expect(getMessageHandlingInfo(client, "P77777-0001234")).rejects.toThrowError('Greater than one matching entry')
    })

    test("the details are returned", () => {
        return expect(sds.getMessageHandlingDetails(ldap.server.url, "P83020")).resolves.toEqual({
            nhsMhsEndpoint: ["urn:nhs:test:endpoint"],
            nhsMhsIsAuthenticated: ["true"],
            nhsMhsPersistduration: ["30"],
            nhsMhsRetries: ["3"],
            nhsMhsRetryInterval: ["30"],
            nhsMhsSyncReplyMode: ["always"],
            nhsMhsAckRequested: ["true"],
            nhsMhsDuplicateElimination: ["false"],
            nhsMhsActor: ["66666"],
            nhsMhsCPAId: ["123456"]
        })
    })
})