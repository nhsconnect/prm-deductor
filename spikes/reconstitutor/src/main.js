exports.retrieve_master_file = async (content) => {
    
    let name = content.match('^------=_(.*?)\n')[1];

    return {
        name,
        content
    };
}