/*
 * @desc    Format date to an object with start date and end date.
 * @param {String} stringDate - Date to convert.
*/
exports.strDateToStartEndDate = (stringDate) => {
    const date = {}
    
    if (stringDate) {
        date.start = new Date(stringDate + " 00:00:00");
        date.end = new Date(stringDate + " 23:59:59");
    } else {
        let auxDate = new Date();
        auxDate.setHours(0, 0, 0);
        date.start = auxDate.toISOString();
        auxDate.setHours(23, 59, 59);
        date.end = auxDate.toISOString();
    }
    return date;
}

/*
 * @desc    Adds weeks, months to a date.
 * @param {Date} date - Date to be added time.
 * @param {number} months - Number of months to be added.
 * @param {number} weeks - Number of weeks to be added.
*/
exports.addTimeToDate = (date, months, weeks) => {
    date.setMonth(date.getMonth() + months)
    // There are 7 days in a week, so multiply weeks by 7.
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