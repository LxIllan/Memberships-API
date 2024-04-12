const { param, query } = require("express-validator");

const pagination = [
    query("page", "Page must be a number.").isNumeric().optional().toInt(),
    query("limit", "Limit must be a number.").isNumeric().optional().toInt(),
];

/*
* @route   GET /receipts
*/
exports.getReceipts = [
    ...pagination,
    query("date", "Is not a valid date.").isISO8601().optional()
];

/*
 * @desc    Get receipts by member
 * @route   GET /receipts/member/:memberId
 */
exports.getReceiptsByMember = [
    ...pagination,
    param("memberId", "memberId is not a mongo id.").isMongoId(),
];

/*
 * @desc    Get receipts by user
 * @route   GET /receipts/user/:userId
 */
exports.getReceiptsByUser = [
    ...pagination,
    param("userId", "userId is not a mongo id.").isMongoId(),
];
