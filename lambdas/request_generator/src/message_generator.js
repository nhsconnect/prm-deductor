const helper = require("./message_builder");
const ldap_spine_client = require("./ldap_spine_client");
const convert = require('xml-js');

exports.generate = async (request) => {
    let practice_code = getDestinationPracticeCode(request);
    let contract_details = ldap_spine_client.retrieve_message_contract_details_for_practice(practice_code);
    let soapMessage = helper.build_soap_message(contract_details);
    let payload = helper.build_payload_message(request);
    return {
        soapMessage,
        payload
    };
}

function getDestinationPracticeCode(requestXml) {
    let requestJson = JSON.parse(convert.xml2json(requestXml, { compact: true, spaces: 4 })); 
    return requestJson.EhrRequest.destination.AgentOrgSDS.agentOrganizationSDS.id._attributes.extension;
}