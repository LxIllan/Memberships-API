const nodeMailer = require("nodemailer");

/*
 * @desc    Sends email to the specified email addresses.
 * @param {object} emailData - Object that contains subject, body and email addresses.
*/
exports.sendEmail = (emailData) => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.hostinger.mx",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "mailer@syss.tech",
            pass: "__2Mailer",
        },
    });
    return transporter
        .sendMail(emailData)
        .then((info) => console.log(`Message sent: ${info.response}`))
        .catch((err) => console.log(`Problem sending email: ${err}`));
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