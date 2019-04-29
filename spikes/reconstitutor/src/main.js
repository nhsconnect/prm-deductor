exports.retrieve_master_file = async (content) => {
    
    let name = content.match(/^------=_(.*?)\n/)[1];
    let matches = content.match(/Filename=\"(.*?)(?=\"\s)/g);
    let files = [];
    matches.forEach(match => {
        let file = {
            name: match.slice(10)
        };
        files.push(file);
    });

    return {
        name,
        content,
        files
    };
}