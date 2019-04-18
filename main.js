var ldap = require('ldapjs');
 
var server = ldap.createServer();
 
server.search('ou=organisation,o=nhs', function(req, res, next) {
  var practice = {
    dn: req.dn.toString(),
    attributes: {
      objectclass: ['nhsGPPractice', 'top'],
      nhsIDCode: "P83020",
      o: "My GP",
      postaladdress: "This is a postal address",
      postalcode: "AB234XY",
      telephonenumber: "01234 576890"
    }
  };
 
  if (req.filter.matches(practice.attributes)) {
    res.send(practice);
  }

  res.end();
});

server.search('ou=services,o=nhs', function(req, res, next) {
  console.log(req)

  var autonomousService = {
    dn: req.dn.toString(),
    attributes: {
      objectclass: ['nhsAs', 'top'],
      nhsIDCode: "P83020",
      nhsAsSvcIA: "urn:nhs:names:services:gp2gp:RCMR_IN010000UK05",
      uniqueIdentifier: "12345",
      nhsMhsPartyKey: "P83020-0005239"
    }
  }; 

  var messageHandlingService = {
    dn: req.dn.toString(),
    attributes: {
      objectclass: ['nhsMhs', 'top'],
      nhsMhsPartyKey: "P83020-0005239",
      nhsMhsSvcIA: "urn:nhs:names:services:gp2gp:RCMR_IN010000UK05",
      nhsMhsEndpoint: "fish",
      nhsMhsIsAuthenticated: "chips",
      nhsMhsPersistduration: "puish",
      nhsMhsRetries: "posh",
      nhsMhsRetryInterval: "lash",
      nhsMhsSyncReplyMode: "leash",
      nhsMhsAckRequested: "link",
      nhsMhsDuplicateElimination: "lanky",
      nhsMhsActor: "hunky",
      nhsMhsCPAId: "wonky"
    }
  }

  if (req.filter.matches(autonomousService.attributes)) {
      res.send(autonomousService);
  } else if (req.filter.matches(messageHandlingService.attributes)) {
      res.send(messageHandlingService);
  }

  res.end();
});
 
server.listen(1389, function() {
  console.log('ldapjs listening at ' + server.url);
});
