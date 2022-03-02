const { body, param, query } = require('express-validator');

/*
 * @route   GET /members
*/
exports.getMembers = [
    query('page', 'Page must be a number.').isNumeric().optional(),
    query('limit', 'Limit must be a number.').isNumeric().optional()
]

/*
 * @route   GET /members/code/:code
*/
exports.getMemberByCode = [
    param('code', 'Code must be a four digit code.').matches(/^\d{4}$/)
]

/*
 * @route   PUT /members/send-notification
*/
exports.sendNotification = [
    body("subject", "Subject is required.").notEmpty(),
    body("body", "Body is required.").notEmpty()
];

/*
 * @route   PUT /members/assistance
*/
exports.setAssistance = [
    body("memberId", "memberId is not a mongo id.").isMongoId()
];

/*
 * @route   PUT /members/pay-membership
*/
exports.payMembership = [
    body("memberId", "memberId is not a mongo id.").isMongoId()
];