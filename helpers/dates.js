/*
 * @desc    Format string date to an object with start date and end date.
 * @param {String} strDate - Date to convert.
 * @return {Object} - Object with start and end date.
*/
exports.strDateToStartEndDatesObject = (strDate) => {
    const date = { start: null, end: null };

    if (strDate) {
        date.start = new Date(strDate + "T00:00:00Z").toISOString();
        date.end = new Date(strDate + "T23:59:59Z").toISOString();
    } else {
        const todayStart = new Date().setHours(0, 0, 0, 0);
        date.start = new Date(todayStart).toISOString();
        const todayEnd = new Date().setHours(23, 59, 59, 999);
        date.end = new Date(todayEnd).toISOString();
    }
    console.log(date);
    return date;
};

/*
 * @desc    Adds weeks, months to a date.
 * @param {Date} date - Date to be added time.
 * @param {number} months - Number of months to be added.
 * @param {number} weeks - Number of weeks to be added.
 * @return {Date} - Date with added time.
*/
exports.addTimeToDate = (date, months, weeks) => {
    let newDate = new Date(date.getTime());
    newDate.setMonth(newDate.getMonth() + months);
    // There are 7 days in a week, so multiply weeks by 7.
    newDate.setDate(newDate.getDate() + weeks * 7);
    // Set the last hour of the day, so member can train on his last day
    newDate.setHours(23, 59, 59);
    return newDate;
};

/*
 * @desc    Checks if a member is on schedule.
 * @param {number} startHour - Minimum range value.
 * @param {number} endHour - Maximum range value.
 * @return {boolean} - True if member is on schedule, otherwise false.
*/
exports.isMemberOnSchedule = (startHour, endHour) => {
    const currentHour = new Date().getHours();
    return (startHour === undefined && endHour === undefined) || (currentHour >= startHour && currentHour <= endHour);
};

/*
 * @desc    Checks if a member has an active membership.
 * @param {Date} endMembership - End date of a member's membership.
 * @return {boolean} - True if member has an active membership, otherwise false.
*/
exports.isMemberActive = (endMembership) => {
    const endMembershipDate = new Date(endMembership).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    return today <= endMembershipDate;
};

/*
 * @desc    Returns the difference between the current date and the end of a membership.
 * @param {Date} from - Initial date.
 * @param {Date} to - End date.
 * @return {number} - Difference between dates.
*/
exports.daysDiff = (from, to) => {
    const fromDate = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const toDate = new Date(to.getFullYear(), to.getMonth(), to.getDate());
    const diffTime = Math.abs(toDate - fromDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
