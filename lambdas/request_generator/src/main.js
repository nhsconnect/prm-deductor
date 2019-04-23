const message_builder = require("./message_builder");
const pds_client = require("./pds_client");

exports.handler = async (event) => {
    const deduction_org_id = "DEF456";
    let patient_most_recent_practice_code = pds_client.retrieve_most_recent_practice_code_for(event.patient_nhs_number);

    pds_client.update_patient_practice(deduction_org_id);

    let ehr_request = message_builder.build_ehr_request(event.patient_nhs_number, 
        patient_most_recent_practice_code,
        deduction_org_id);
        
    return ehr_request;
}