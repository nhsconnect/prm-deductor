exports.retrieve_master_file = async () => {
    let content = `------=_Part_82_12073865.1555409597528
    <eb:Manifest
    otherthings<RCMR_IN030000UK06evenmorethings<EhrExtractmorethings`;

    let name = content.match('------=_(.*?)\n')[1];

    return {
        name,
        content
    };
}