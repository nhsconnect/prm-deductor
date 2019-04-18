const ldapjs=require('ldapjs')

exports.getMessageHandlingDetails = async function getMessageHandlingDetails(url, odsCode) {
    let client = ldapjs.createClient({
        url: url
    });

    try {
      var result = await getServiceDetails(client, odsCode)
      return await getMessageHandlingDetails(client, serviceDetails.nhsMhsPartyKey[0])
    } finally {
      client.destroy()
    }
}

function getServiceDetails(client, odsCode) {
    let opts = {
        filter: `(&(nhsIDCode=${odsCode})(objectClass=nhsAs)(|(nhsAsSvcIA=urn:nhs:names:services:gp2gp:RCMR_IN010000UK05)(nhsAsSvcIA=urn:nhs:names:services:gp2gp:RCMR_IN010000UK06)))`,
        scope: 'sub',
        attributes: ['uniqueIdentifier', 'nhsMhsPartyKey', 'nhsASSvcIA']
    }

    return new Promise((resolve, reject) => {
        return client.search("ou=services,o=nhs", opts, (err, res) => {
            let match = {}

            res.on('searchEntry', (entry) => {
                entry.attributes.forEach(element => {
                    match[element.type] = []
                    element._vals.forEach( val => {
                        match[element.type].push(val.toString('utf-8'))
                    })
                })
            })

            res.on('end', (result) => {
              resolve(match)
            })
        })
    })
}

function getMessageHandlingInfo(client, partyKey) {
    let opts = {
        filter: `
            (&(nhsMhsPartyKey=${partyKey})(objectlass=nhsMhs)
                (nhsMhsSvcIA=urn:nhs:names:services:gp2gp:RCMR_IN010000UK05))`,
        scope: 'sub',
        attributes: ['nhsMhsEndPoint', 'nhsMhsIsAuthenticated', 'nhsMhsPersistduration', 'nhsMhsRetries',
            'nhsMhsRetryInterval', 'nhsMhsSyncReplyMode', 'nhsMhsAckRequested', 'nhsMhsDuplicateElimination',
            'nhsMhsActor', 'nhsMhsCPAId']
    }
    
    return new Promise((resolve, reject) => {
        return client.search("ou=services,o=nhs", opts, (err, res) => {
          let match = {}

          res.on('searchEntry', (entry) => {
              entry.attributes.forEach(element => {
                  match[element.type] = []
                  element._vals.forEach( val => {
                      match[element.type].push(val.toString('utf-8'))
                  })
              })
          })

          res.on('end', (result) => {
            resolve(match)
          })
      })
    })
}