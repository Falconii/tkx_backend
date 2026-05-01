const fs = require("fs");
const { Resend } = require("resend");

let key_email;

if (process.env.RESEND_API_KEY) {
    key_email = process.env.RESEND_API_KEY;
} else {
    key_email = fs.readFileSync("./resend_api_Key.txt", "utf8").trim();
}

const resend = new Resend(key_email);

module.exports = resend;