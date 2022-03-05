const nodeMailer = require("nodemailer");
const logger = require("../config/logger");
require("dotenv").config();

/*
 * @desc    Sends email to the specified email addresses.
 * @param {object} emailData - Object that contains subject, body and email addresses.
*/
exports.sendEmail = (emailData) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    return transporter
        .sendMail(emailData)
        .then((info) => logger.info(`Email sent: ${info.response}`))
        .catch((err) => logger.warn(`Problem sending email: ${err}`));
};

/*
 * @desc    Creates an unique code to members.
 ? Code is four random numbers.
*/
exports.createCode = () => {
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += Math.floor(Math.random() * 10) + '';
    }
    return code;
}