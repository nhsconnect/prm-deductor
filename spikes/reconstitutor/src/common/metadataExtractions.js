const convert = require('xml-js');

let options = {compact: true, spaces: 4};

exports.getMessageId = (content) => {
    let soapJson = getSoapEnvelopeAsJson(content);
    let messageId = soapJson['soap:Envelope']['soap:Header']['eb:MessageHeader']['eb:MessageData']['eb:MessageId']._text;
    return messageId; 
}

exports.getFilename = (content) => {
    let filename = content.match(/Filename=\"(.*?)(?=\"\s)/);
    return filename[0].slice(10);
}

exports.getSubjectFilename = (content) => {
    let gp2gpFragmentJson = getGp2GpFragmentInfoAsJson(content);
    if (gp2gpFragmentJson.Gp2gpfragment) {
        let filename = gp2gpFragmentJson.Gp2gpfragment.subject._text.match(/(Attachment:\s)(.*?)$/); 
        return filename[0].slice(12);
    } else {
        return this.getFilename(content);
    }
}

exports.getReferenceId = (content) => {
    let referenceJson = convertToJson(content);
    let refId = referenceJson['eb:Reference']._attributes['xlink:href'];
    return refId.slice(4);
}

exports.isAttachmentData = (fragmentReference) => {
    return fragmentReference.indexOf('hl7ebxml') < 0;
}

exports.getPartName = (content) => {
    let name = content.match(/^------=_(.*?)\s/);
    return name[1];
}

exports.hasDataStoredOnPrimaryFile = (attachmentReference) => {
    return (attachmentReference.id.indexOf('Attachment') > -1);
}

function getSoapEnvelopeAsJson(content) {
    let soapEnvelope = content.match(/(\<soap:Envelope\s)(.*?)(\<\/soap:Envelope\>)/);
    return (soapEnvelope) ? convertToJson(soapEnvelope[0]) : '';
}

function getGp2GpFragmentInfoAsJson(content) {
    let gp2gpFragmentInfo = content.match(/(\<Gp2gpfragment\s)(.*?)(\<\/Gp2gpfragment\>)/);
    return (gp2gpFragmentInfo) ? convertToJson(gp2gpFragmentInfo[0]) : '';
}

function convertToJson(content) {
    return JSON.parse(convert.xml2json(content, options));
}