const helper = require("./helper");
const ldap_spine_client = require("./ldap_spine_client");
const convert = require('xml-js');

exports.generate = async (extract) => {
    let practice_code = getDestinationPracticeCode(extract);
    let contract_details = ldap_spine_client.retrieve_message_contract_details_for_practice(practice_code);
    let message = helper.build_message(extract, contract_details);
    return message;
}

function getDestinationPracticeCode(extractXml) {
    let extractJson = JSON.parse(convert.xml2json(extractXml, { compact: true, spaces: 4 })); 
    return extractJson.EhrRequest.destination.AgentOrgSDS.agentOrganizationSDS.id._attributes.extension;
}