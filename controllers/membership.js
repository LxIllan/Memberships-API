const Membership = require('../models/membership');
const _ = require('lodash');

/*
 * @desc    Get a member by id, every time param '/:membershipId' is called
*/
exports.membershipById = (req, res, next, id) => {
    Membership.findById(id)
        .populate()
        .exec((err, membership) => {
            if ((err) || !(membership)) {
                return res.status(404).json({error: 'Membership not found'});
            }
            req.membership = membership;
            next();
        })
}

/*
 * @desc    Get a membership by id
 * @route   GET /memberships/:membershipId
*/
exports.getMembership = (req, res) => {
    return res.status(200).json(req.post);
}

/*
 * @desc    Register a membership
 * @route   POST /memberships
 ? Memberships may or may not be time-restricted.
*/
exports.createMembership = async (req, res) => {
    const membershipExist = await Membership.findOne({membership: req.body.data.membership.toLowerCase()});
    if (membershipExist) {
        return res.status(403).json({error: 'Membership already exists.'});
    }
    const membership = await new Membership({
            membership: req.body.data.membership,
            price: req.body.data.price,
            months: req.body.data.months,
            weeks: req.body.data.weeks,
            specialHours: {
                startHour: req.body.data.startHour,
                endHour: req.body.data.endHour
            }
    });
    if (membership.specialHours.startHour === 0 && membership.specialHours.endHour === 0) {
        membership.specialHours = undefined;
    }
    membership.save((err, result) => {
        if (err) {
            return res.status(400).json({error: err});
        }
        return res.status(200).json(result);
    });
}

/*
 * @desc    Get all memberships
 * @route   GET /memberships
*/
exports.getMemberships = (req, res) => {
    Membership.find((err, memberships) => {
        if (err) {
            return res.status(400).json({error: err});
        }
        res.status(200).json(memberships);
    })
    .select('_id membership price months weeks specialHours updatedAt')
    .sort({months:1});
}

/*
 * @desc    Update membership by id
 * @route   PUT /memberships/:membershipId
*/
exports.editMembership = (req, res) => {
    let membership = req.membership;
    membership.membership = req.body.data.membership,
    membership.price = req.body.data.price,
    membership.months = req.body.data.months,
    membership.weeks = req.body.data.weeks,
    membership.specialHours = {
        startHour: req.body.data.startHour,
        endHour: req.body.data.endHour
    }
    if (membership.specialHours.startHour === 0 && membership.specialHours.endHour === 0) {
        membership.specialHours = undefined;
    }
    membership.updatedAt = Date.now();
    membership.save((err, result) => {
        if (err) {
            return res.status(400).json({error: err})
        }
        res.status(200).json({ message: 'success!'})
    })
}

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
}