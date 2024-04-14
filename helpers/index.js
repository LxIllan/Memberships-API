const logger = require("../config/logger");
const nodeMailer = require("nodemailer");

require("dotenv").config();

/*
 * @desc    Sends email to the specified email addresses.
 * @param {object} emailData - Object that contains subject, body and email addresses.
 * @return {Promise} - Promise object represents the email sent.
*/
exports.sendEmail = (emailData) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        requireTLS: true,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
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
* @return {string} - Unique code.
*/
exports.createCode = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
