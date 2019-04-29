exports.build_ehr_request = (nhsNumber, authorOrgId, destOrgId) => {
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

exports.build_soap_message = (contract_details) => {
    return `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" 
                xmlns:eb="http://www.oasis-open.org/committees/ebxml-msg/schema/msg-header-2_0.xsd" 
                xmlns:hl7ebXML="urn:hl7-org:transport/ebxml/DSTUv1.0" 
                xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/" 
                xmlns:xlink="http://www.w3.org/1999/xlink">
                <SOAP-ENV:Header>
                    <eb:MessageHeader eb:version="2.0" soap-env:mustUnderstand="1">
                        <eb:From>
                            <eb:PartyId eb:type="urn:nhs:names:partyType:ocs+serviceInstance">A28009-821605</eb:PartyId>
                        </eb:From>
                        <eb:To>
                            <eb:PartyId eb:type="urn:nhs:names:partyType:ocs+serviceInstance">5EP-807264</eb:PartyId>
                        </eb:To>
                        <eb:CPAId>${contract_details.nhsMhsCPAId}</eb:CPAId>
                        <eb:ConversationId>84106041-3FD6-4A48-BEA4-2A1CBA2D2880</eb:ConversationId>
                        <eb:Service>urn:nhs:names:services:gp2gp</eb:Service>
                        <eb:Action>RCMR_IN010000UK05</eb:Action>
                        <eb:MessageData>
                            <eb:MessageId>84106041-3FD6-4A48-BEA4-2A1CBA2D2880</eb:MessageId>
                            <eb:Timestamp>2019-04-16T10:09:37Z</eb:Timestamp>
                            <eb:TimeToLive>2019-04-23T10:09:37Z</eb:TimeToLive>
                        </eb:MessageData>
                        <eb:DuplicateElimination>${contract_details.nhsMhsDuplicateElimination}</eb:DuplicateElimination>
                    </eb:MessageHeader>
                    <eb:AckRequested eb:signed="false" eb:version="2.0" soap-env:actor="${contract_details.nhsMhsActor}" soap-env:mustUnderstand="1">${contract_details.nhsMhsAckRequested}</eb:AckRequested>
                </SOAP-ENV:Header>
                <SOAP-ENV:Body>
                    <eb:Manifest eb:version="2.0">
                        <eb:Reference eb:id="_9A28DEDC-EA35-4BE2-9A0B-E680330C74FF" xlink:href="cid:9A28DEDC-EA35-4BE2-9A0B-E680330C74FF@inps.co.uk/Vision/3">
                            <eb:Description xml:lang="en-GB">RCMR_IN010000UK05</eb:Description>
                            <hl7ebXML:Payload encoding="XML" style="HL7" version="3.0"/>
                        </eb:Reference>
                    </eb:Manifest>
                </SOAP-ENV:Body>
            </SOAP-ENV:Envelope>`
}

exports.build_payload_message = (ehr_request) => {
    return `<RCMR_IN010000UK05 xmlns="urn:hl7-org:v3" 
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:hl7-org:v3 RCMR_IN010000UK05.xsd">
                <id root="84106041-3FD6-4A48-BEA4-2A1CBA2D2880"/>
                <creationTime value="20190416100936"/>
                <versionCode code="V3NPfIT3.1.10"/>
                <interactionId extension="RCMR_IN010000UK05" root="2.16.840.1.113883.2.1.3.2.4.12"/>
                <processingCode code="P"/>
                <processingModeCode code="T"/>
                <acceptAckCode code="NE"/>
                <communicationFunctionRcv typeCode="RCV">
                    <device classCode="DEV" determinerCode="INSTANCE">
                        <id extension="031759679512" root="1.2.826.0.1285.0.2.0.107"/>
                    </device>
                </communicationFunctionRcv>
                <communicationFunctionSnd typeCode="SND">
                    <device classCode="DEV" determinerCode="INSTANCE">
                        <id extension="200000000835" root="1.2.826.0.1285.0.2.0.107"/>
                    </device>
                </communicationFunctionSnd>
                <ControlActEvent classCode="CACT" moodCode="EVN">
                    <author1 typeCode="AUT">
                        <AgentSystemSDS classCode="AGNT">
                            <agentSystemSDS classCode="DEV" determinerCode="INSTANCE">
                                <id extension="200000000835" root="1.2.826.0.1285.0.2.0.107"/>
                            </agentSystemSDS>
                        </AgentSystemSDS>
                    </author1>
                    <subject contextConductionInd="false" typeCode="SUBJ">
                        ${ehr_request}
                    </subject>
                </ControlActEvent>
            </RCMR_IN010000UK05>`
}

{/* <EndPoint>${contract_details.nhsMhsEndPoint}</EndPoint>
<IsAuthenticated>${contract_details.nhsMhsIsAuthenticated}</IsAuthenticated>
<PersistDuration>${contract_details.nhsMhsPersistduration}</PersistDuration>
<Retries>${contract_details.nhsMhsRetries}</Retries>
<RetryInterval>${contract_details.nhsMhsRetryInterval}</RetryInterval>
<SyncReplyMode>${contract_details.nhsMhsSyncReplyMode}</SyncReplyMode> */}
