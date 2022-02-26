const nodeMailer = require("nodemailer");

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

exports.addTimeToDate = (date, months, weeks) => {
    date.setMonth(date.getMonth() + months);
    // There are 7 days in a week
    date.setDate(date.getDate() + weeks * 7);
    // Set the last hour of the day, so member can train on his last day
    date.setHours(23, 59, 59);
    return date;
};

exports.isMemberOnSchedule = (startHour, endHour) => {
    if (startHour === undefined && endHour == undefined) {
        return true
    } else {
        const currentHour = new Date().getHours()
        return currentHour >= startHour && currentHour <= endHour
    }
}

exports.isMemberActive = (endMembership) => {
    let endMembershipDate = new Date(endMembership);
    let today = new Date();
    endMembershipDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return today <= endMembershipDate;
};

exports.daysDiff = (today, endMembership) => {
    let endMembershipDate = new Date(endMembership);
    endMembershipDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(endMembershipDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

exports.createCode = () => {
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += Math.floor(Math.random() * 10) + '';
    }
    return code;
}