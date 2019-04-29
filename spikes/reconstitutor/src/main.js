const fileParser = require('./fileParser');

exports.retrieve_master_file = async (content) => {
    let name = content.match(/^------=_(.*?)\n/)[1];
    
    let fileInfoCollection = content.match(/(\<eb\:Description xml\:lang=\"en\"\>Filename)(.*?)\<\/eb\:Description\>/g);
    let files = [];
    fileInfoCollection.forEach(fileInfo => {
        files.push(fileParser.parseFile(fileInfo));
    });
    
    return {
        name,
        content,
        files
    };
}