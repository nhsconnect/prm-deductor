const helper = require("./helper");

exports.handler = async (event) => {
    const deduction_org_id = "DEF456";
    let patient_current_practice = "XYZ987";
    let ehr_extract = helper.get_ehr_extract(event.patient_nhs_number, patient_current_practice, deduction_org_id);
    return ehr_extract;
}