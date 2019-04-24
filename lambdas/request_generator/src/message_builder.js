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
    return `<?xml version="1.0"?>
    <!-- Copyright UN/CEFACT and OASIS, 2002. All Rights Reserved. -->
    <tp:CollaborationProtocolProfile
      xmlns:tp="http://www.oasis-open.org/committees/ebxml-cppa/schema/cpp-cpa-2_0.xsd"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
      xmlns:xsd="http://www.w3.org/2001/XMLSchema"
      xsi:schemaLocation="http://www.oasis-open.org/committees/ebxml-cppa/schema/cpp-cpa-2_0.xsd
                          cpp-cpa-2_0b.xsd"
      tp:cppid="uri:companyB-cpp"
      tp:version="2_0b">
      <!-- Party info for CompanyB-->
      <tp:PartyInfo
        tp:partyName="CompanyB"
        tp:defaultMshChannelId="asyncChannelB1"
        tp:defaultMshPackageId="CompanyB_MshSignalPackage">
        <tp:PartyId tp:type="urn:oasis:names:tc:ebxml-cppa:partyid-type:duns">987654321</tp:PartyId>
        <tp:PartyRef xlink:type="simple" xlink:href="http://CompanyB.com/about.html"/>
        <tp:CollaborationRole>
          <tp:ProcessSpecification
            tp:version="2.0"
            tp:name="PIP3A4RequestPurchaseOrder"
            xlink:type="simple" xlink:href="http://www.rosettanet.org/processes/3A4.xml"
            tp:uuid="urn:icann:rosettanet.org:bpid:3A4$2.0"/>
          <tp:Role
            tp:name="Seller"
            xlink:type="simple"
            xlink:href="http://www.rosettanet.org/processes/3A4.xml#seller"/>
          <tp:ApplicationCertificateRef tp:certId="CompanyB_AppCert"/>
          <tp:ServiceBinding>
            <tp:Service>bpid:icann:rosettanet.org:3A4$2.0</tp:Service>
            <tp:CanSend>
              <tp:ThisPartyActionBinding
                tp:id="companyB_ABID1"
                tp:action="Purchase Order Confirmation Action"
                tp:packageId="CompanyB_ResponsePackage">
                <tp:BusinessTransactionCharacteristics
                  tp:isNonRepudiationRequired="true"
                  tp:isNonRepudiationReceiptRequired="true"
                  tp:isConfidential="transient"
                  tp:isAuthenticated="${contract_details.nhsMhsIsAuthenticated}"
                  tp:isTamperProof="persistent"
                  tp:isAuthorizationRequired="true"
                  tp:timeToAcknowledgeReceipt="PT2H"/>
                <tp:ActionContext
                  tp:binaryCollaboration="Request Purchase Order"
                  tp:businessTransactionActivity="Request Purchase Order"
                  tp:requestOrResponseAction="Purchase Order Confirmation Action"/>
                <tp:ChannelId>asyncChannelB1</tp:ChannelId>
              </tp:ThisPartyActionBinding>
            </tp:CanSend>
            <tp:CanSend>
              <tp:ThisPartyActionBinding
                tp:id="companyB_ABID2"
                tp:action="ReceiptAcknowledgement"
                tp:packageId="CompanyB_ReceiptAcknowledgmentPackage">
                <tp:BusinessTransactionCharacteristics
                  tp:isNonRepudiationRequired="true"
                  tp:isNonRepudiationReceiptRequired="true"
                  tp:isConfidential="transient"
                  tp:isAuthenticated="persistent"
                  tp:isTamperProof="persistent"
                  tp:isAuthorizationRequired="true"/>
                <tp:ChannelId>asyncChannelB1</tp:ChannelId>
              </tp:ThisPartyActionBinding>
            </tp:CanSend>
            <tp:CanSend>
              <tp:ThisPartyActionBinding
                tp:id="companyB_ABID3"
                tp:action="Exception"
                tp:packageId="CompanyB_ExceptionPackage">
                <tp:BusinessTransactionCharacteristics
                  tp:isNonRepudiationRequired="true"
                  tp:isNonRepudiationReceiptRequired="true"
                  tp:isConfidential="transient"
                  tp:isAuthenticated="persistent"
                  tp:isTamperProof="persistent"
                  tp:isAuthorizationRequired="true"/>
                <tp:ChannelId>asyncChannelB1</tp:ChannelId>
              </tp:ThisPartyActionBinding>
            </tp:CanSend>
            <tp:CanReceive>
              <tp:ThisPartyActionBinding
                tp:id="companyB_ABID4"
                tp:action="Purchase Order Request Action"
                tp:packageId="CompanyB_RequestPackage">
                <tp:BusinessTransactionCharacteristics
                  tp:isNonRepudiationRequired="true"
                  tp:isNonRepudiationReceiptRequired="true"
                  tp:isConfidential="transient"
                  tp:isAuthenticated="persistent"
                  tp:isTamperProof="persistent"
                  tp:isAuthorizationRequired="true"
                  tp:timeToAcknowledgeReceipt="PT2H"
                  tp:timeToPerform="P1D"/>
                <tp:ActionContext
                  tp:binaryCollaboration="Request Purchase Order"
                  tp:businessTransactionActivity="Request Purchase Order"
                  tp:requestOrResponseAction="Purchase Order Request Action"/>
                <tp:ChannelId>asyncChannelB1</tp:ChannelId>
              </tp:ThisPartyActionBinding>
            </tp:CanReceive>
            <tp:CanReceive>
              <tp:ThisPartyActionBinding
                tp:id="companyB_ABID5" tp:action="ReceiptAcknowledgment"
                tp:packageId="CompanyB_ReceiptAcknowledgmentPackage">
                <tp:BusinessTransactionCharacteristics
                  tp:isNonRepudiationRequired="true"
                  tp:isNonRepudiationReceiptRequired="true"
                  tp:isConfidential="transient"
                  tp:isAuthenticated="persistent"
                  tp:isTamperProof="persistent"
                  tp:isAuthorizationRequired="true"/>
                <tp:ChannelId>asyncChannelB1</tp:ChannelId>
              </tp:ThisPartyActionBinding>
            </tp:CanReceive>
            <!-- The next binding uses a synchronous delivery channel -->
            <tp:CanReceive>
              <tp:ThisPartyActionBinding
                tp:id="companyB_ABID6"
                tp:action="Purchase Order Request Action"
                tp:packageId="CompanyB_SyncReplyPackage">
                <tp:BusinessTransactionCharacteristics
                  tp:isNonRepudiationRequired="true"
                  tp:isNonRepudiationReceiptRequired="true"
                  tp:isConfidential="transient"
                  tp:isAuthenticated="persistent"
                  tp:isTamperProof="persistent"
                  tp:isAuthorizationRequired="true"
                  tp:timeToAcknowledgeReceipt="PT5M"
                  tp:timeToPerform="PT5M"/>
                <tp:ActionContext
                  tp:binaryCollaboration="Request Purchase Order"
                  tp:businessTransactionActivity="Request Purchase Order"
                  tp:requestOrResponseAction="Purchase Order Request Action"/>
                <tp:ChannelId>syncChannelB1</tp:ChannelId>
              </tp:ThisPartyActionBinding>
              <tp:CanSend>
                <tp:ThisPartyActionBinding
                  tp:id="companyB_ABID7"
                  tp:action="Purchase Order Confirmation Action"
                  tp:packageId="CompanyB_ResponsePackage">
                  <tp:BusinessTransactionCharacteristics
                    tp:isNonRepudiationRequired="true"
                    tp:isNonRepudiationReceiptRequired="true"
                    tp:isConfidential="transient"
                    tp:isAuthenticated="persistent"
                    tp:isTamperProof="persistent"
                    tp:isAuthorizationRequired="true"
                    tp:timeToAcknowledgeReceipt="PT5M"/>
                  <tp:ActionContext
                    tp:binaryCollaboration="Request Purchase Order"
                    tp:businessTransactionActivity="Request Purchase Order"
                    tp:requestOrResponseAction="Purchase Order Confirmation Action"/>
                  <tp:ChannelId>syncChannelB1</tp:ChannelId>
                </tp:ThisPartyActionBinding>
              </tp:CanSend>
              <tp:CanSend>
                <tp:ThisPartyActionBinding
                  tp:id="companyB_ABID8"
                  tp:action="Exception"
                  tp:packageId="CompanyB_ExceptionPackage">
                  <tp:BusinessTransactionCharacteristics
                    tp:isNonRepudiationRequired="true"
                    tp:isNonRepudiationReceiptRequired="true"
                    tp:isConfidential="transient"
                    tp:isAuthenticated="persistent"
                    tp:isTamperProof="persistent"
                    tp:isAuthorizationRequired="true"/>
                  <tp:ChannelId>syncChannelB1</tp:ChannelId>
                </tp:ThisPartyActionBinding>
              </tp:CanSend>
            </tp:CanReceive>
          </tp:ServiceBinding>
        </tp:CollaborationRole>
        <!-- Certificates used by the "Seller" company -->
        <tp:Certificate tp:certId="CompanyB_AppCert">
          <ds:KeyInfo>
            <ds:KeyName>CompanyB_AppCert_Key</ds:KeyName>
          </ds:KeyInfo>
        </tp:Certificate>
        <tp:Certificate tp:certId="CompanyB_SigningCert">
          <ds:KeyInfo>
            <ds:KeyName>CompanyB_Signingcert_Key</ds:KeyName>
          </ds:KeyInfo>
        </tp:Certificate>
        <tp:Certificate tp:certId="CompanyB_EncryptionCert">
          <ds:KeyInfo>
            <ds:KeyName>CompanyB_EncryptionCert_Key</ds:KeyName>
          </ds:KeyInfo>
        </tp:Certificate>
        <tp:Certificate tp:certId="CompanyB_ServerCert">
          <ds:KeyInfo>
            <ds:KeyName>CompanyB_ServerCert_Key</ds:KeyName>
          </ds:KeyInfo>
        </tp:Certificate>
        <tp:Certificate tp:certId="CompanyB_ClientCert">
          <ds:KeyInfo>
            <ds:KeyName>CompanyB_ClientCert_Key</ds:KeyName>
          </ds:KeyInfo>
        </tp:Certificate>
        <tp:Certificate tp:certId="TrustedRootCertB4">
          <ds:KeyInfo>
            <ds:KeyName>TrustedRootCertB4_Key</ds:KeyName>
          </ds:KeyInfo>
        </tp:Certificate>
        <tp:Certificate tp:certId="TrustedRootCertB5">
          <ds:KeyInfo>
            <ds:KeyName>TrustedRootCertB5_Key</ds:KeyName>
          </ds:KeyInfo>
        </tp:Certificate>
        <tp:Certificate tp:certId="TrustedRootCertB6">
          <ds:KeyInfo>
            <ds:KeyName>TrustedRootCertB6_Key</ds:KeyName>
          </ds:KeyInfo>
        </tp:Certificate>
        <tp:Certificate tp:certId="TrustedRootCertB7">
          <ds:KeyInfo>
            <ds:KeyName>TrustedRootCertB7_Key</ds:KeyName>
          </ds:KeyInfo>
        </tp:Certificate>
        <tp:Certificate tp:certId="TrustedRootCertB8">
          <ds:KeyInfo>
            <ds:KeyName>TrustedRootCertB8_Key</ds:KeyName>
          </ds:KeyInfo>
        </tp:Certificate>
        <tp:SecurityDetails tp:securityId="CompanyB_TransportSecurity">
          <tp:TrustAnchors>
            <tp:AnchorCertificateRef tp:certId="TrustedRootCertB5"/>
            <tp:AnchorCertificateRef tp:certId="TrustedRootCertB6"/>
            <tp:AnchorCertificateRef tp:certId="TrustedRootCertB4"/>
          </tp:TrustAnchors>
        </tp:SecurityDetails>
        <tp:SecurityDetails tp:securityId="CompanyB_MessageSecurity">
          <tp:TrustAnchors>
            <tp:AnchorCertificateRef tp:certId="TrustedRootCertB8"/>
            <tp:AnchorCertificateRef tp:certId="TrustedRootCertB7"/>
          </tp:TrustAnchors>
        </tp:SecurityDetails>
        <!-- An asynchronous delivery channel -->
        <tp:DeliveryChannel
          tp:channelId="asyncChannelB1"
          tp:transportId="transportB1"
          tp:docExchangeId="docExchangeB1">
          <tp:MessagingCharacteristics
            tp:syncReplyMode="none"
            tp:ackRequested="${contract_details.nhsMhsAckRequested}"
            tp:ackSignatureRequested="always"
            tp:duplicateElimination="${contract_details.nhsMhsDuplicateElimination}"/>
        </tp:DeliveryChannel>
        <!-- A synchronous delivery channel -->
        <tp:DeliveryChannel
          tp:channelId="syncChannelB1"
          tp:transportId="transportB2"
          tp:docExchangeId="docExchangeB1">
          <tp:MessagingCharacteristics
            tp:syncReplyMode="${contract_details.nhsMhsSyncReplyMode}"
            tp:ackRequested="${contract_details.nhsMhsAckRequested}"
            tp:ackSignatureRequested="always"
            tp:duplicateElimination="${contract_details.nhsMhsDuplicateElimination}"/>
        </tp:DeliveryChannel>
        <tp:Transport tp:transportId="transportB1">
          <tp:TransportSender>
            <tp:TransportProtocol tp:version="1.1">HTTP</tp:TransportProtocol>
            <tp:AccessAuthentication>basic</tp:AccessAuthentication>
            <tp:TransportClientSecurity>
              <tp:TransportSecurityProtocol tp:version="3.0">SSL</tp:TransportSecurityProtocol>
              <tp:ClientCertificateRef tp:certId="CompanyB_ClientCert"/>
              <tp:ServerSecurityDetailsRef tp:securityId="CompanyB_TransportSecurity"/>
            </tp:TransportClientSecurity>
          </tp:TransportSender>
          <tp:TransportReceiver>
            <tp:TransportProtocol tp:version="1.1">HTTP</tp:TransportProtocol>
            <tp:AccessAuthentication>basic</tp:AccessAuthentication>
            <tp:Endpoint
              tp:uri="${contract_details.nhsMhsEndPoint}"
              tp:type="allPurpose"/>
            <tp:TransportServerSecurity>
              <tp:TransportSecurityProtocol tp:version="3.0">SSL</tp:TransportSecurityProtocol>
              <tp:ServerCertificateRef tp:certId="CompanyB_ServerCert"/>
              <tp:ClientSecurityDetailsRef tp:securityId="CompanyB_TransportSecurity"/>
            </tp:TransportServerSecurity>
          </tp:TransportReceiver>
        </tp:Transport>
        <tp:Transport tp:transportId="transportB2">
          <tp:TransportSender>
            <tp:TransportProtocol tp:version="1.1">HTTP</tp:TransportProtocol>
            <tp:AccessAuthentication>basic</tp:AccessAuthentication>
            <tp:TransportClientSecurity>
              <tp:TransportSecurityProtocol tp:version="3.0">SSL</tp:TransportSecurityProtocol>
              <tp:ClientCertificateRef tp:certId="CompanyB_ClientCert"/>
              <tp:ServerSecurityDetailsRef tp:securityId="CompanyB_TransportSecurity"/>
            </tp:TransportClientSecurity>
          </tp:TransportSender>
          <tp:TransportReceiver>
            <tp:TransportProtocol tp:version="1.1">HTTP</tp:TransportProtocol>
            <tp:AccessAuthentication>basic</tp:AccessAuthentication>
            <tp:Endpoint
              tp:uri="https://www.CompanyB.com/servlets/ebxmlhandler/async"
              tp:type="allPurpose"/>
            <tp:TransportServerSecurity>
              <tp:TransportSecurityProtocol tp:version="3.0">SSL</tp:TransportSecurityProtocol>
              <tp:ServerCertificateRef tp:certId="CompanyB_ServerCert"/>
              <tp:ClientSecurityDetailsRef tp:securityId="CompanyB_TransportSecurity"/>
            </tp:TransportServerSecurity>
          </tp:TransportReceiver>
        </tp:Transport>
        <tp:DocExchange tp:docExchangeId="docExchangeB1">
          <tp:ebXMLSenderBinding tp:version="2.0">
            <tp:ReliableMessaging>
              <tp:Retries>3</tp:Retries>
              <tp:RetryInterval>PT2H</tp:RetryInterval>
              <tp:MessageOrderSemantics>Guaranteed</tp:MessageOrderSemantics>
            </tp:ReliableMessaging>
            <tp:PersistDuration>${contract_details.nhsMhsPersistduration}</tp:PersistDuration>
            <tp:SenderNonRepudiation>
              <tp:NonRepudiationProtocol>http://www.w3.org/2000/09/xmldsig#</tp:NonRepudiationProtocol>
              <tp:HashFunction>http://www.w3.org/2000/09/xmldsig#sha1</tp:HashFunction>
              <tp:SignatureAlgorithm>http://www.w3.org/2000/09/xmldsig#dsa-sha1</tp:SignatureAlgorithm>
              <tp:SigningCertificateRef tp:certId="CompanyB_SigningCert"/>
            </tp:SenderNonRepudiation>
            <tp:SenderDigitalEnvelope>
              <tp:DigitalEnvelopeProtocol tp:version="2.0">S/MIME</tp:DigitalEnvelopeProtocol>
              <tp:EncryptionAlgorithm>DES-CBC</tp:EncryptionAlgorithm>
              <tp:EncryptionSecurityDetailsRef tp:securityId="CompanyB_MessageSecurity"/>
            </tp:SenderDigitalEnvelope>
          </tp:ebXMLSenderBinding>
          <tp:ebXMLReceiverBinding tp:version="2.0">
            <tp:ReliableMessaging>
              <tp:Retries>${contract_details.nhsMhsRetries}</tp:Retries>
              <tp:RetryInterval>${contract_details.nhsMhsRetryInterval}</tp:RetryInterval>
              <tp:MessageOrderSemantics>Guaranteed</tp:MessageOrderSemantics>
            </tp:ReliableMessaging>
            <tp:PersistDuration>P1D</tp:PersistDuration>
            <tp:ReceiverNonRepudiation>
              <tp:NonRepudiationProtocol>http://www.w3.org/2000/09/xmldsig#</tp:NonRepudiationProtocol>
              <tp:HashFunction>http://www.w3.org/2000/09/xmldsig#sha1</tp:HashFunction>
              <tp:SignatureAlgorithm>http://www.w3.org/2000/09/xmldsig#dsa-sha1</tp:SignatureAlgorithm>
              <tp:SigningSecurityDetailsRef tp:securityId="CompanyB_MessageSecurity"/>
            </tp:ReceiverNonRepudiation>
            <tp:ReceiverDigitalEnvelope>
              <tp:DigitalEnvelopeProtocol tp:version="2.0">S/MIME</tp:DigitalEnvelopeProtocol>
              <tp:EncryptionAlgorithm>DES-CBC</tp:EncryptionAlgorithm>
              <tp:EncryptionCertificateRef tp:certId="CompanyB_EncryptionCert"/>
            </tp:ReceiverDigitalEnvelope>
          </tp:ebXMLReceiverBinding>
        </tp:DocExchange>
      </tp:PartyInfo>
      <!-- SimplePart corresponding to the SOAP Envelope -->
      <tp:SimplePart
        tp:id="CompanyB_MsgHdr"
        tp:mimetype="text/xml">
        <tp:NamespaceSupported
          tp:location="http://www.oasis-open.org/committees/ebxml-msg/schema/draft-msg-header-05.xsd"
          tp:version="2.0">
          http://www.oasis-open.org/committees/ebxml-msg/schema/draft-msg-header-05.xsd
        </tp:NamespaceSupported>
      </tp:SimplePart>
      <!-- SimplePart corresponding to a Receipt Acknowledgment business signal -->
      <tp:SimplePart
        tp:id="CompanyB_ReceiptAcknowledgment"
        tp:mimetype="application/xml">
        <tp:NamespaceSupported
          tp:location="http://www.ebxml.org/bpss/ReceiptAcknowledgment.xsd"
          tp:version="2.0">
          http://www.ebxml.org/bpss/ReceiptAcknowledgment.xsd
        </tp:NamespaceSupported>
      </tp:SimplePart>
      <!-- SimplePart corresponding to an Exception business signal -->
      <tp:SimplePart
        tp:id="CompanyB_Exception"
        tp:mimetype="application/xml">
        <tp:NamespaceSupported
          tp:location="http://www.oasis-open.org/committees/ebxml-msg/schema/draft-msg-header-05.xsd"
          tp:version="2.0">
          http://www.oasis-open.org/committees/ebxml-msg/schema/draft-msg-header-05.xsd
        </tp:NamespaceSupported>
      </tp:SimplePart>
      <!-- SimplePart corresponding to a request action -->
      <tp:SimplePart
        tp:id="CompanyB_Request"
        tp:mimetype="application/xml">
        <tp:NamespaceSupported
          tp:location="http://www.rosettanet.org/schemas/PIP3A4RequestPurchaseOrder.xsd"
          tp:version="2.0">
          http://www.rosettanet.org/schemas/PIP3A4RequestPurchaseOrder.xsd
        </tp:NamespaceSupported>
      </tp:SimplePart>
      <!-- SimplePart corresponding to a response action -->
      <tp:SimplePart
        tp:id="CompanyB_Response"
        tp:mimetype="application/xml">
        <tp:NamespaceSupported
          tp:location="http://www.rosettanet.org/schemas/PurchaseOrderConfirmation.xsd.xsd"
          tp:version="2.0">
          http://www.rosettanet.org/schemas/PIP3A4PurchaseOrderConfirmation.xsd
        </tp:NamespaceSupported>
      </tp:SimplePart>
      <!-- An ebXML message with a SOAP Envelope only -->
      <tp:Packaging tp:id="CompanyB_MshSignalPackage">
        <tp:ProcessingCapabilities
          tp:parse="true"
          tp:generate="true"/>
        <tp:CompositeList>
          <tp:Composite
            tp:id="CompanyB_MshSignal"
            tp:mimetype="multipart/related"
            tp:mimeparameters="type=text/xml">
            <tp:Constituent tp:idref="CompanyB_MsgHdr"/>
          </tp:Composite>
        </tp:CompositeList>
      </tp:Packaging>
      <!-- An ebXML message with a SOAP Envelope plus a request action payload -->
      <tp:Packaging tp:id="CompanyB_RequestPackage">
        <tp:ProcessingCapabilities
          tp:parse="true"
          tp:generate="true"/>
        <tp:CompositeList>
          <tp:Composite
            tp:id="RequestMsg"
            tp:mimetype="multipart/related"
            tp:mimeparameters="type=text/xml">
            <tp:Constituent tp:idref="CompanyB_MsgHdr"/>
            <tp:Constituent tp:idref="CompanyB_Request"/>
          </tp:Composite>
        </tp:CompositeList>
      </tp:Packaging>
      <!-- An ebXML message with a SOAP Envelope plus a response action payload -->
      <tp:Packaging tp:id="CompanyB_ResponsePackage">
        <tp:ProcessingCapabilities
          tp:parse="true"
          tp:generate="true"/>
        <tp:CompositeList>
          <tp:Composite
            tp:id="CompanyB_ResponseMsg"
            tp:mimetype="multipart/related"
            tp:mimeparameters="type=text/xml">
            <tp:Constituent tp:idref="CompanyB_MsgHdr"/>
            <tp:Constituent tp:idref="CompanyB_Response"/>
          </tp:Composite>
        </tp:CompositeList>
      </tp:Packaging>
      <!-- An ebXML message with a SOAP Envelope plus a Receipt Acknowledgment payload -->
      <tp:Packaging tp:id="CompanyB_ReceiptAcknowledgmentPackage">
        <tp:ProcessingCapabilities
          tp:parse="true"
          tp:generate="true"/>
        <tp:CompositeList>
          <tp:Composite
            tp:id="CompanyB_ReceiptAcknowledgmentMsg"
            tp:mimetype="multipart/related"
            tp:mimeparameters="type=text/xml">
            <tp:Constituent tp:idref="CompanyB_MsgHdr"/>
            <tp:Constituent tp:idref="CompanyB_ReceiptAcknowledgment"/>
          </tp:Composite>
        </tp:CompositeList>
      </tp:Packaging>
      <!-- An ebXML message with a SOAP Envelope plus an Exception payload -->
      <tp:Packaging tp:id="CompanyB_ExceptionPackage">
        <tp:ProcessingCapabilities
          tp:parse="true"
          tp:generate="true"/>
        <tp:CompositeList>
          <tp:Composite
            tp:id="CompanyB_ExceptionMsg"
            tp:mimetype="multipart/related"
            tp:mimeparameters="type=text/xml">
            <tp:Constituent tp:idref="CompanyB_MsgHdr"/>
            <tp:Constituent tp:idref="CompanyB_Exception"/>
          </tp:Composite>
        </tp:CompositeList>
      </tp:Packaging>
      <!-- An ebXML message with a Receipt Acknowledgment signal, plus a business response,
           or an ebXML message with an Exception signal -->
      <tp:Packaging tp:id="CompanyB_SyncReplyPackage">
        <tp:ProcessingCapabilities
          tp:parse="true"
          tp:generate="true"/>
        <tp:CompositeList>
          <tp:Composite
            tp:id="CompanyB_SignalAndResponseMsg"
            tp:mimetype="multipart/related"
            tp:mimeparameters="type=text/xml">
            <tp:Constituent tp:idref="CompanyB_MsgHdr"/>
            <tp:Constituent tp:idref="CompanyB_ReceiptAcknowledgment"/>
            <tp:Constituent tp:idref="CompanyB_Response"/>
          </tp:Composite>
        </tp:CompositeList>
        <tp:CompositeList>
          <tp:Composite
            tp:id="CompanyB_SyncExceptionMsg"
            tp:mimetype="multipart/related"
            tp:mimeparameters="type=text/xml">
            <tp:Constituent tp:idref="CompanyB_MsgHdr"/>
            <tp:Constituent tp:idref="CompanyB_Exception"/>
          </tp:Composite>
        </tp:CompositeList>
      </tp:Packaging>
      <tp:Comment xml:lang="en-US">Seller's Collaboration Protocol Profile</tp:Comment>
    </tp:CollaborationProtocolProfile>`;
}