const helper = require("./helper");
const pds_client = require("./pds_client");

exports.handler = async (event) => {
    const deduction_org_id = "DEF456";
    let patient_most_recent_practice_code = pds_client.retrieve_most_recent_practice_code_for(event.patient_nhs_number);

    let ehr_extract = helper.get_ehr_extract(event.patient_nhs_number, 
                                             patient_most_recent_practice_code,
                                             deduction_org_id);

    return ehr_extract;
}