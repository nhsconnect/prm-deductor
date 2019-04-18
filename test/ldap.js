const ldap = require('ldapjs')
const getPort = require('get-port')

var server = ldap.createServer()

exports.server = server

exports.startServer = async function() { 
    server.search('ou=services,o=nhs', function(req, res, next) {
      var autonomousService = {
        dn: req.dn.toString(),
        attributes: {
          objectclass: ['nhsAs', 'top'],
          nhsIDCode: "P83020",
          nhsAsSvcIA: "urn:nhs:names:services:gp2gp:RCMR_IN010000UK05",
          uniqueIdentifier: 12345,
          nhsMhsPartyKey: "P83020-0005239"
        }
      }; 
    
      var messageHandlingService = {
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
      }
    
      if (req.filter.matches(autonomousService.attributes)) {
          res.send(autonomousService);
      } else if (req.filter.matches(messageHandlingService.attributes)) {
          res.send(messageHandlingService);
      }
    
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