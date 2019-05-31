const convert = require('xml-js');

let options = {compact: true, spaces: 4};

exports.getMessageId = (content) => {
    let messageId = content.match(/(?=\<eb:MessageId>)(.*?)(?=\<\/eb:MessageId>)/g); 
    return messageId[0].slice(14); 
}

exports.getFilename = (content) => {
    content //?
    let filename = content.match(/[F|f]ilename=\"(.*?)(?=\"\s)/); //?
    return filename[0].slice(10);
}

exports.getSubjectFilename = (content) => {
    let gp2gpFragmentJson = getGp2GpFragmentInfoAsJson(content);
    if (gp2gpFragmentJson.Gp2gpfragment) {
        let filename = gp2gpFragmentJson.Gp2gpfragment.subject._text.match(/([A|a]ttachment:\s)(.*?)$/); 
        return filename[0].slice(12);
    } else {
        return this.getFilename(content);
    }
}

exports.getReferenceId = (content) => {
    let referenceJson = convertXmlToJson(content);
    let refId = referenceJson['eb:Reference']._attributes['xlink:href'];
    return refId.slice(4);
}

exports.isAttachmentData = (fragmentReference) => {
    return fragmentReference.toLowerCase().indexOf('hl7ebxml') < 0;
}

exports.getPartName = (content) => {
    let name = content.match(/^------=_(.*?)\s/);
    return name[1];
}

exports.hasDataStoredOnPrimaryFile = (attachmentReference) => {
    return (attachmentReference.id.indexOf('Attachment') > -1);
}

exports.getFileInfoElement = (content) => {
    let element = '';
    if (this.isAttachmentData(content)) {
        content //?
        let referenceJson = convertXmlToJson(content);
        element = referenceJson['eb:Reference']['eb:Description']._text;
    }

    return element;
}

function getSoapEnvelopeAsJson(content) {
    let soapEnvelope = content.match(/(\<soap:Envelope\s)(.*?)(\<\/soap:Envelope\>)/);
    return (soapEnvelope) ? convertXmlToJson(soapEnvelope[0]) : '';
}

function getGp2GpFragmentInfoAsJson(content) {
    let gp2gpFragmentInfo = content.match(/(\<Gp2gpfragment\s)(.*?)(\<\/Gp2gpfragment\>)/);
    return (gp2gpFragmentInfo) ? convertXmlToJson(gp2gpFragmentInfo[0]) : '';
}

function convertXmlToJson(content) {
    return JSON.parse(convert.xml2json(content, options));
}