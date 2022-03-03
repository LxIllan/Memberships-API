const { query } = require('express-validator');

/*
 * @route   GET /receipts
*/
exports.getReceipts = [
    query('page', 'Page must be a number.').isNumeric().optional().toInt(),
    query('limit', 'Limit must be a number.').isNumeric().optional().toInt()
]