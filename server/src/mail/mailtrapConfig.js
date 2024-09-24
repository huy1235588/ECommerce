const { MailtrapClient } = require("mailtrap");
const dotenv = require('dotenv');
dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

const mailtrapClient = new MailtrapClient({
    token: TOKEN,
    ENDPOINT: ENDPOINT,
});

const mailtrapSender = {
    email: "hello@demomailtrap.com",
    name: "Ha",
};

module.exports = {
    mailtrapClient,
    mailtrapSender,
};