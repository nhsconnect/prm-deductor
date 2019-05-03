exports.build = async (content) => {
    let name = getPartName(content);
    let fragments = getAllFragments(content);

    return {
        name,
        content, 
        fragments
    };
}

function getAllFragments(content) {
    let fragmentReferences = getAllFragmentsReferences(content);
    let fragments = [];
    fragmentReferences.forEach(attachmentReference => {
        if (referenceIsForFragmentData(attachmentReference)) {
            let name = getFragmentName(content);
            fragments.push(name);
        }
    });
    return fragments;
}

function getPartName(content) {
    let name = content.match(/^------=_(.*?)\n/);
    return name[1];
}

function getFragmentName(content) {
    return content.match(/(\<eb\:Description xml\:lang=\"en\"\>)(.*?)(?=\<\/eb\:Description\>)/g)[1].slice(30);
}

function getAllFragmentsReferences(content) {
    return content.match(/(\<eb\:Reference)(.*?)\<\/eb\:Reference\>/g);
}

function referenceIsForFragmentData(reference) {
    return reference.indexOf('cid:Content') < 0;
}