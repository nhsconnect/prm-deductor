const ldap=require("ldapjs")

let client = ldap.createClient({
    url: "ldap://0.0.0.0:1389"
});

let odsCode = "P83020"

let opts = {
    filter: `
        (&(nhsIDCode=${odsCode})(objectClass=nhsAs)
            (|(nhsAsSvcIA=urn:nhs:names:services:gp2gp:RCMR_IN010000UK05)
                (nhsAsSvcIA=urn:nhs:names:services:gp2gp:RCMR_IN010000UK06)))`,
    scope: 'sub',
    attributes: ['uniqueIdentifier', 'nhsMhsPartyKey', 'nhsASSvcIA']
}

client.search("ou=services,o=nhs", opts, (err, res) => {
    if(err) {
        console.log("Error:" + err)
    }
    else {
      res.on('searchEntry', (entry) => {
        console.log("Entry: " + JSON.stringify(entry))
      })

      res.on('error', (error) => {
        console.log("Error: " + error)
      })

      res.on('end', (result) => {
        console.log("End: " + result)
      })
    }
})