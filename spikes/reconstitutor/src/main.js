exports.retrieve_master_file = async (content) => {
    
    let name = content.match(/^------=_(.*?)\n/)[1];
    let files = content.match(/Filename=\"(.*?)(?=\"\s)/g); //?

    return {
        name,
        content,
        files
    };
}