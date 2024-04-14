const User = require('../models/user');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
const { sendEmail } = require("../helpers/index");
const { validationResult } = require('express-validator');

require("dotenv").config();

/*
 * @desc    Get a user by id, every time param '/:userId' is called
*/
exports.userById = (req, res, next, id) => {
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.warn(`Invalid user id. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(404).json({ error: `${id} is not a valid userId` });
    }

    User.findById(id)
        .exec()
        .then((user) => {
            if (!user) {
                logger.warn(`User not found. Method: ${req.method}, URL: ${req.url}.`);
                return res.status(404).json({ error: "User not found" });
            }
            logger.info(`User found by id. Method: ${req.method}, URL: ${req.url}.`);
            req.profile = user;
            next();
        })
        .catch((err) => {
            logger.warn(`Error getting user by id. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(400).json({ error: "User not found" });
        });
};

/*
 * @desc    Get user by id
 * @route   GET /users/:user:id
 * @return  JSON object
*/
exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    req.profile.resetPasswordLink = undefined;
    logger.info(`Get user. Method: ${req.method}, URL: ${req.url}.`);
    return res.status(200).json(req.profile);
};

/*
 * @desc    Get a user photo in other endpoint
 * @route   GET /users/photo/:userId
 * @return  JSON object
*/
exports.getUserPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.setHeader('Content-Type', req.profile.photo.contentType);
        logger.info(`Serving user photo. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(200).send(req.profile.photo.data);
    }
    logger.info(`User has no photo. Method: ${req.method}, URL: ${req.url}.`);
    next();
};

/*
 * @desc    Get all users
 * @route   GET /users
 * @return  JSON object
*/
exports.getUsers = (req, res) => {
    User.find()
        .select('name lastName email role createdAt')
        .then((users) => {
            logger.warn(`Get users. Method: ${req.method}, URL: ${req.url}.`);
            return res.json(users);
        }).catch((err) => {
            logger.warn(`Error getting users. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(400).json({ error: err });
        });
};

/*
 * @desc    Sign up a receptionist user
 * @route   POST /users
 ! This endpoint does not sign up admin users
 * @return  JSON object
*/
exports.registerUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        logger.warn(`Photo could not be uploaded. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map(e => e.msg) })
    }

    const userExists = await User.findOne({ email: req.body.email.toLowerCase() });
    if (userExists) {
        logger.warn(`Email taken. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(403).json({
            error: "Email is taken!",
        });
    }
    req.body.password = 'Memberships3';
    const user = await new User(req.body);
    user.email = req.body.email.toLowerCase();
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

    const emailData = {
        from: process.env.MAIL_USERNAME,
        to: user.email,
        subject: "Memberships Log In instructions",
        text: `Please use the following link to set your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
        html: `<p>Please use the following link to set your password:</p> <a href="${process.env.CLIENT_URL}/reset-password/${token}">${process.env.CLIENT_URL}/reset-password/${token}</a>`
    };

    user.updateOne({ resetPasswordLink: token })
        .then((success) => {
            logger.info(`User has been registered. Method: ${req.method}, URL: ${req.url}.`);
            sendEmail(emailData);
            return res.status(200).json({ message: `Email has been sent to ${user.email}. Follow the instructions to set your password.` });
        })
        .catch((err) => {
            logger.warn(`Set reset password link failed. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(400).json({ error: err });
        });
};

/*
 * @desc    Update an user
 * @route   PUT /users/:userId
 TODO: Validate incoming form.
 * @return  JSON object
*/
exports.updateUser = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            logger.warn(`Photo could not be uploaded. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(400).json({ error: "Photo could not be uploaded." });
        }
        let user = req.profile;

        if (fields.email) {
            const userExists = await User.findOne({ 'email': fields.email.toLowerCase() });
            if (userExists) {
                if (!(user._id.equals(userExists._id))) {
                    logger.warn(`Email taken. Method: ${req.method}, URL: ${req.url}.`);
                    return res.status(400).json({ error: 'Email is taken!' });
                }
            }
        }
        user = _.extend(user, fields);
        user.updatedAt = Date.now();
        user.email = user.email.toLowerCase();
        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.filepath);
            user.photo.contentType = files.photo.mimetype;
        }
        user.save()
            .then((result) => {
                user.hashed_password = undefined;
                user.salt = undefined;
                user.resetPasswordLink = undefined;
                logger.info(`User has been updated. Method: ${req.method}, URL: ${req.url}.`);
                return res.status(200).json(user);
            })
            .catch((err) => {
                logger.warn(`User could not be updated. Method: ${req.method}, URL: ${req.url}.`);
                return res.status(400).json({ error: err });
            });
    });
}

/*
 * @desc    Delete an user
 * @route   DELETE /users/:userId
 * @return  JSON object
*/
exports.deleteUser = (req, res) => {
    let user = req.profile;
    user.deleteOne()
        .then((user) => {
            logger.info(`User has been deleted. Method: ${req.method}, URL: ${req.url}.`);
            res.json({ message: "User was deleted successfully!" });
        })
        .catch((err) => {
            logger.warn(`User could not be deleted. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(400).json({ error: err });
        });
};

/*
 * @desc    Middleware to check if a user is the same user who is updating their data or is an admin.
*/
exports.hasAuthorization = (req, res, next) => {
    const isUserHimself = ((req.profile) && (req.auth) && (req.profile._id == req.auth._id));
    const isAdmin = ((req.profile) && (req.auth) && (req.auth.role === 'admin'));
    const isAuthorized = ((isUserHimself) || (isAdmin))

    if (!isAuthorized) {
        return res.status(403).json({ error: "User is not authorized to perform this action" });
    }
    next();
};

/*
 * @desc    Middleware to check if a user is an admin.
*/
exports.isAdmin = (req, res, next) => {
    if (!(req.auth.role === 'admin')) {
        return res.status(403).json({ error: "User is not authorized to perform this action" });
    }
    next();
};
