const Membership = require("../models/membership");
const { validationResult } = require("express-validator");
const _ = require("lodash");

/*
 * @desc    Get a member by id, every time param '/:membershipId' is called
 */
exports.membershipById = (req, res, next, id) => {
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: `${id} is not a valid membershipId` });
    }
    Membership.findById(id)
        .populate()
        .exec((err, membership) => {
            if (err || !membership) {
                return res.status(404).json({ error: "Membership not found" });
            }
            req.membership = membership;
            next();
        });
};

/*
 * @desc    Get a membership by id
 * @route   GET /memberships/:membershipId
 */
exports.getMembership = (req, res) => {
    return res.status(200).json(req.membership);
};

/*
 * @desc    Create a membership
 * @route   POST /memberships
 ? Memberships may or may not be time-restricted.
*/
exports.createMembership = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }
    if (!req.body.months && !req.body.weeks) {
        return res.status(400).json({ error: "Months or weeks must be provided." });
    }

    const membershipExist = await Membership.findOne({
        membership: req.body.membership.toLowerCase(),
    });
    if (membershipExist) {
        return res.status(403).json({ error: "Membership already exists." });
    }
    const membership = await new Membership({
        membership: req.body.membership,
        price: req.body.price,
        months: req.body.months | 0,
        weeks: req.body.weeks | 0,
        specialHours: {
            startHour: req.body.startHour | 0,
            endHour: req.body.endHour | 0,
        },
    });
    if (membership.specialHours.startHour === 0 && membership.specialHours.endHour === 0) {
        membership.specialHours = undefined;
    }
    membership.save((err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        return res.status(200).json(result);
    });
};

/*
 * @desc    Get all memberships
 * @route   GET /memberships
 */
exports.getMemberships = (req, res) => {
    Membership.find((err, memberships) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.status(200).json(memberships);
    })
        .select("_id membership price months weeks specialHours updatedAt")
        .sort({ months: 1 });
};

/*
 * @desc    Update membership by id
 * @route   PUT /memberships/:membershipId
 */
exports.editMembership = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array().map((e) => e.msg) });
    }
    let membership = req.membership;
    membership = _.extend(membership, req.body);
    membership.specialHours = {
        startHour: req.body.startHour | 0,
        endHour: req.body.endHour | 0,
    };
    if (membership.specialHours.startHour === 0 && membership.specialHours.endHour === 0) {
        membership.specialHours = undefined;
    }
    membership.updatedAt = Date.now();
    membership.save((err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.status(200).json({ result, message: "success!" });
    });
};

/*
 * @desc    Remove membership by id
 * @route   DELETE /memberships/:membershipId
 */
exports.deleteMembership = (req, res) => {
    let membership = req.membership;
    membership.remove((err, result) => {
        if (err) {
            return res.status(400).json({ error: "Membership has not been deleted" });
        }
        res.status(200).json({ message: "Membership has been deleted successfully!" });
    });
};
