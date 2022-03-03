const Receipt = require("../models/receipt");
const { validationResult } = require("express-validator");
const { strDateToStartEndDate } = require("../helpers/dates")

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

    const date = strDateToStartEndDate(req.query.date);
    
    console.log(date)
    Receipt.find({ date: { $gte: date.start, $lt: date.end } })
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

/*
 * @desc    Get receipts by member
 * @route   GET /receipts/member/:memberId
 */
exports.getReceiptsByMember = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    Receipt.find({ boughtBy: req.params.memberId })
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

/*
 * @desc    Get receipts by user
 * @route   GET /receipts/user/:userId
 */
exports.getReceiptsByUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    Receipt.find({ soldBy: req.params.userId })
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
