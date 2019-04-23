exports.build_ehr_extract = (nhsNumber, authorOrgId, destOrgId) => {
    return `<EhrRequest xmlns="urn:hl7-org:v3" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:msg="urn:hl7-org:v3/mif" xmlns:voc="urn:hl7-org:v3/voc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:hl7-org:v3 ../../Schemas/RCMR_MT010101UK03.xsd" classCode="EXTRACT" moodCode="RQO">
                <id root="BBBBA01A-A9D1-A411-F824-9F7A00A33757"/>
                <recordTarget typeCode="RCT">
                    <patient classCode="PAT">
                        <id root="2.16.840.1.113883.2.1.4.1" extension="${nhsNumber}"/>
                    </patient>
                </recordTarget>
                <author typeCode="AUT">
                    <AgentOrgSDS>
                        <agentOrganizationSDS>
                            <id root="1.2.826.0.1285.0.1.10" extension="${authorOrgId}"/>
                        </agentOrganizationSDS>
                    </AgentOrgSDS>
                </author>
                <destination typeCode="DST">
                    <AgentOrgSDS classCode="AGNT">
                        <agentOrganizationSDS classCode="ORG" determinerCode="INSTANCE">
                            <id root="1.2.826.0.1285.0.1.10" extension="${destOrgId}"/>
                        </agentOrganizationSDS>
                    </AgentOrgSDS>
                </destination>
            </EhrRequest>`;
}

exports.build_message = (ehr_extract, contract_details) => {
    return `<SomeMessage>
                <EndPoint>${contract_details.nhsMhsEndPoint}</EndPoint>
                <Subject>${ehr_extract}</Subject>
            </SomeMessage>`;
}