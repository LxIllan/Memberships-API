const Receipt = require("../models/receipt");
const { validationResult } = require("express-validator");

/*
 * @desc    Get receipts
 * @route   GET /receipts
 */
exports.getReceipts = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    
    Receipt.find()
        .populate("soldBy", "_id name lastName")
        .populate("boughtBy", "_id name lastName")
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .exec((err, receipts) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            res.status(200).json(receipts);
        });
};
