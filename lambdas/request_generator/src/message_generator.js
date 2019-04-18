const helper = require("./helper");

exports.generate = async (extract) => {
    let message = helper.build_message(extract);
    return message;
}