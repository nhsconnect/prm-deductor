const ldap=require('ldapjs')

exports.getMessageHandlingDetails = async function getMessageHandlingDetails(url, odsCode) {
    let client = ldap.createClient({
        url: url
    });

    try {
      var result = await getServiceDetails(client, odsCode)
      console.log(result)
      return result
    } finally {
      client.destroy()
    }
    // return await getMessageHandlingDetails(client, serviceDetails.partyCode)
}

async function getServiceDetails(client, odsCode) {
    let opts = {
        filter: ldap.parseFilter('(&(nhsIDCode=P83020)(objectClass=nhsAs)(|(nhsAsSvcIA=urn:nhs:names:services:gp2gp:RCMR_IN010000UK05)(nhsAsSvcIA=urn:nhs:names:services:gp2gp:RCMR_IN010000UK06)))'),
        scope: 'sub',
        attributes: ['uniqueIdentifier', 'nhsMhsPartyKey', 'nhsASSvcIA']
    }

    return new Promise((resolve, reject) => {
        return client.search("ou=services,o=nhs", opts, (_, res) => {
            let match = null

            res.on('searchEntry', (entry) => {
              match = entry.attributes
            })

            res.on('end', (result) => {
              resolve(match)
            })
        })
    })
}

function getMessageHandlingDetails(client, partyCode) {
    let opts = {
        filter: `
            (&(nhsMhsPartyKey=${partyCode})(objectlass=nhsMhs)
                (nhsMhsSvcIA=urn:nhs:names:services:gp2gp:RCMR_IN010000UK05))`,
        scope: 'sub',
        attributes: ['nhsMhsEndPoint', 'nhsMhsIsAuthenticated', 'nhsMhsPersistduration', 'nhsMhsRetries',
            'nhsMhsRetryInterval', 'nhsMhsSyncReplyMode', 'nhsMhsAckRequested', 'nhsMhsDuplicateElimination',
            'nhsMhsActor', 'nhsMhsCPAId']
    }
    
    return new Promise((resolve, reject) => {
        return client.search("ou=services,o=nhs", opts, (err, res) => {
            if(err) {
                reject(err)
            }
            else {
              let count = 0
              let match = null

              res.on('searchEntry', (entry) => {
                count++
                match = entry
              })

              res.on('error', (error) => {
                  reject(error)
              })

              res.on('end', (result) => {
// TODO: check result object
                if (count===1) {
                    resolve(entry)
                  } else {
                    reject("Unexpected number of entries: " + count)
                  }
              })
            }
        })
    })
}