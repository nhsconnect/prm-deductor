exports.retrieve_master_file = async (content) => {
    
    let name = content.match(/^------=_(.*?)\n/)[1];
    let filenames = content.match(/Filename=\"(.*?)(?=\"\s)/g);
    let contentTypes = content.match(/ContentType=(.*?)(?=\s)/g); //?
    
    let files = [];
    for (let index = 0; index < filenames.length; index++) {
        let file = {
            name: filenames[index].slice(10),
            contentType: contentTypes[index].slice(12)
        };
        files.push(file);
    }

    return {
        name,
        content,
        files
    };
}