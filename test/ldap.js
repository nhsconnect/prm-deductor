const ldap = require('ldapjs')
const getPort = require('get-port')

let server = ldap.createServer()

exports.server = server

exports.startServer = async function() { 
    server.search('ou=services,o=nhs', function(req, res, next) {
      let services = [
        {
          dn: req.dn.toString(),
          attributes: {
            objectclass: ['nhsAs', 'top'],
            nhsIDCode: "P83020",
            nhsAsSvcIA: "urn:nhs:names:services:gp2gp:RCMR_IN010000UK05",
            uniqueIdentifier: 12345,
            nhsMhsPartyKey: "P83020-0005239"
          }
        },
        {
          dn: req.dn.toString(),
          attributes: {
            objectclass: ['nhsMhs', 'top'],
            nhsMhsPartyKey: "P83020-0005239",
            nhsMhsSvcIA: "urn:nhs:names:services:gp2gp:RCMR_IN010000UK05",
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
          }
        },
        {
          dn: req.dn.toString(),
          attributes: {
            objectclass: ['nhsAs', 'top'],
            nhsIDCode: "P6666",
            nhsAsSvcIA: "urn:nhs:names:services:gp2gp:RCMR_IN010000UK05",
            uniqueIdentifier: 12345,
            nhsMhsPartyKey: "P6666-0001234"
          }
        },
        {
          dn: req.dn.toString(),
          attributes: {
            objectclass: ['nhsAs', 'top'],
            nhsIDCode: "P6666",
            nhsAsSvcIA: "urn:nhs:names:services:gp2gp:RCMR_IN010000UK05",
            uniqueIdentifier: 12345,
            nhsMhsPartyKey: "P6666-0001236"
          }
        },
        {
          dn: req.dn.toString(),
          attributes: {
            objectclass: ['nhsMhs', 'top'],
            nhsMhsPartyKey: "P77777-0001234",
            nhsMhsSvcIA: "urn:nhs:names:services:gp2gp:RCMR_IN010000UK05",
            nhsMhsEndpoint: "urn:nhs:test:endpoint",
            nhsMhsIsAuthenticated: true,
            nhsMhsPersistduration: 30,
            nhsMhsRetries: 3,
            nhsMhsRetryInterval: 30,
            nhsMhsSyncReplyMode: "always",
            nhsMhsAckRequested: true,
            nhsMhsDuplicateElimination: false,
            nhsMhsActor: "7777777",
            nhsMhsCPAId: "123456"
          }
        },
        {
          dn: req.dn.toString(),
          attributes: {
            objectclass: ['nhsMhs', 'top'],
            nhsMhsPartyKey: "P77777-0001234",
            nhsMhsSvcIA: "urn:nhs:names:services:gp2gp:RCMR_IN010000UK05",
            nhsMhsEndpoint: "urn:nhs:test:endpoint",
            nhsMhsIsAuthenticated: true,
            nhsMhsPersistduration: 30,
            nhsMhsRetries: 3,
            nhsMhsRetryInterval: 30,
            nhsMhsSyncReplyMode: "always",
            nhsMhsAckRequested: true,
            nhsMhsDuplicateElimination: false,
            nhsMhsActor: "77777",
            nhsMhsCPAId: "000000"
          }
        }
      ]

      services.forEach(entry => {
        if (req.filter.matches(entry.attributes)) {
          res.send(entry)
        }
      })

      res.end();
    });
     
    let port = await getPort()

    server.listen(port, function() {
      console.log('ldapjs listening at ' + server.url);
      server.emit('listening', server)
    });
}

exports.stopServer = function() {
    server.close()
}