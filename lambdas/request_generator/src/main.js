const helper = require("./helper");

exports.handler = async (event) => {
    let ehr_extract = helper.get_ehr_extract(12345, "ABC123", "DEF456");
    return ehr_extract;
}