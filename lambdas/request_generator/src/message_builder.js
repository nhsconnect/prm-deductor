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

exports.build_message = (ehr_extract, contract_details) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<SOAP:Envelope xmlns:xsi="http://www.w3c.org/2001/XML-Schema-Instance"
xmlns:SOAP="http://schemas.xmlsoap.org/soap/envelope/" xmlns:eb="http://www.oasis-
open.org/committees/ebxml-msg/schema/msg-header-2_0.xsd" xmlns:hl7ebxml="urn:hl7-
org:transport/ebxml/DSTUv1.0" xmlns:xlink="http://www.w3.org/1999/xlink">
<SOAP:Header>
  <eb:MessageHeader SOAP:mustUnderstand="1" eb:version="2.0">
    <eb:From>
<eb:PartyId eb:type="urn:nhs:names:partyType:ocs+serviceInstance">RHM- 801710</eb:PartyId>
    </eb:From>
    <eb:To>
      <eb:PartyId eb:type="urn:nhs:names:partyType:ocs+serviceInstance">RHM-
803229</eb:PartyId>
</eb:To>
<eb:CPAId>${contract_details.nhsMhsCPAId}</eb:CPAId> <eb:ConversationId>DC3BA663-7224-11DF-A0D3-A34D0675B68F</eb:ConversationId> <eb:Service>urn:nhs:names:services:itk</eb:Service> <eb:Action>COPC_IN000001GB01</eb:Action>
<eb:MessageData>
      <eb:MessageId>DC3BA663-7224-11DF-A0D3-A34D0675B68F</eb:MessageId>
      <eb:Timestamp>2010-06-07T12:07:28Z</eb:Timestamp>
    </eb:MessageData>
    <eb:DuplicateElimination>${contract_details.nhsMhsDuplicateElimination}</eb:DuplicateElimination>
  </eb:MessageHeader>
  <eb:AckRequested SOAP:mustUnderstand="1" eb:version="2.0" eb:signed="false"
SOAP:actor="${contract_details.nhsMhsActor}">${contract_details.nhsMhsAckRequested}</eb:AckRequested>
  </SOAP:Header>
<SOAP:Body>
    <SomeStuff>
        <EndPoint>${contract_details.nhsMhsEndPoint}</EndPoint>
        <IsAuthenticated>${contract_details.nhsMhsIsAuthenticated}</IsAuthenticated>
        <PersistDuration>${contract_details.nhsMhsPersistduration}</PersistDuration>
        <Retries>${contract_details.nhsMhsRetries}</Retries>
        <RetryInterval>${contract_details.nhsMhsRetryInterval}</RetryInterval>
        <SyncReplyMode>${contract_details.nhsMhsSyncReplyMode}</SyncReplyMode>
        <Subject>${ehr_extract}</Subject>
    </SomeStuff>
  <eb:Manifest SOAP:mustUnderstand="1" eb:version="2.0">
    <eb:Reference xlink:href="cid:DC3BA663-7224-11DF-A0D3-
A34D0675B68F@spine.nhs.uk">
      <eb:Schema eb:location="http://www.nhsia.nhs.uk/schemas/HL7-Message.xsd"
eb:version="1.0"/>
      <eb:Description xml:lang="en">HL7 payload</eb:Description>
      <hl7ebxml:Payload style="HL7" encoding="XML" version="3.0"/>
    </eb:Reference>
    <eb:Reference xlink:href="cid:DC3BA663-7224-11DF-A0D3-A34D0675B68F">
      <eb:Description xml:lang="en">ITK Tunnelled Message
Attachment</eb:Description>
    </eb:Reference>
  </eb:Manifest>
</SOAP:Body>
</SOAP:Envelope>`;
}