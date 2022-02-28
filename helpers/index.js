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
 * @desc    Adds weeks, months to a date.
 * @param {Date} date - Date to be added time.
 * @param {number} months - Number of months to be added.
 * @param {number} weeks - Number of weeks to be added.
*/
exports.addTimeToDate = (date, months, weeks) => {
    date.setMonth(date.getMonth() + months)
    // There are 7 days in a week
    date.setDate(date.getDate() + weeks * 7)
    // Set the last hour of the day, so member can train on his last day
    date.setHours(23, 59, 59)
    return date
};

/*
 * @desc    Checks if a member is on schedule.
 * @param {number} startHour - Minimum range value.
 * @param {number} endHour - Maximum range value.
*/
exports.isMemberOnSchedule = (startHour, endHour) => {
    if (startHour === undefined && endHour == undefined) {
        return true
    } else {
        const currentHour = new Date().getHours()
        return currentHour >= startHour && currentHour <= endHour
    }
}

/*
 * @desc    Checks if a member has an active membership.
 * @param {Date} endMembership - End date of a member's membership.
*/
exports.isMemberActive = (endMembership) => {
    let endMembershipDate = new Date(endMembership);
    let today = new Date();
    endMembershipDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return today <= endMembershipDate;
};

/*
 * @desc    Returns the difference between the current date and the end of a membership.
 * @param {Date} today - Initial date.
 * @param {Date} endMembership - End date.
*/
exports.daysDiff = (today, endMembership) => {
    let endMembershipDate = new Date(endMembership);
    endMembershipDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(endMembershipDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

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