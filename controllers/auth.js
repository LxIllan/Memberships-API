const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");
const User = require("../models/user");
const { validationResult } = require('express-validator');
const { sendEmail } = require('../helpers');
const _ = require("lodash");
const logger = require('../config/logger');
require("dotenv").config();

/*
 * @desc    Sing up a receptionist
 * @route   POST /signup
 * @return  JSON object
*/
exports.signUp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map(e => e.msg) });
    }

    req.body.email = req.body.email.toLowerCase();
    const userExists = await User.findOne({
        email: req.body.email
    });
    if (userExists) {
        logger.warn(`Email taken. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(403).json({
            error: "Email is taken!",
        });
    }
    const user = await new User(req.body);

    user.role = 'admin';
    await user.save();
    logger.info(`Admin signed up. Method: ${req.method}, URL: ${req.url}.`);
    return res.json({ message: "Signup success! Please login." });
};

/*
 * @desc    Sing in
 * @route   POST /signin
 * @return  JSON object
*/
exports.signIn = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map(e => e.msg) });
    }

    const { email, password } = req.body;

    User.findOne({ email: email.toLowerCase() }).then((user) => {
        if (!user) {
            logger.warn(`User does not exist. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(401).json({
                error: "User with that email does not exist. Please sing in.",
            });
        }
        // if user found check if password match
        if (!user.authenticate(password)) {
            logger.warn(`Email and password do not match. Method: ${req.method}, URL: ${req.url}.`);
            return res
                .status(401)
                .json({ error: "Email and password do not match." });
        }

        // generate a token with user id and secret
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET_KEY);

        // persist the token as 't' with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });

        const { _id, name, lastName, email, role } = user;
        logger.info(`User signed in. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(200).json({ token, user: { _id, name, lastName, email, role } });
    }).catch((err) => {
        logger.warn(`User does not exist. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(401).json({
            error: "User with that email does not exist. Please sing in.",
        });
    });
};

/*
 * @desc    Sing out
 * @route   GET /signout
 * @return  JSON object
*/
exports.signOut = (req, res) => {
    res.clearCookie("t");
    logger.info(`User signed out. Method: ${req.method}, URL: ${req.url}.`);
    return res.json({ message: "Signout success!" });
};

/*
 * @desc    Send an email to reset their password
 * @route   PUT /forgot-password
 * @return  JSON object
*/
exports.forgotPassword = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map(e => e.msg) });
    }

    const { email } = req.body;

    // find the user based on email
    User.findOne({ email: email.toLowerCase() }).then((user) => {
        if (!user) {
            logger.warn(`User does not exist. Method: ${req.method}, URL: ${req.url}.`);
            return res
                .status("404")
                .json({ error: "User with that email does not exist!" });
        }
        // generate a token with user id and secret
        const token = jwt.sign({ _id: user._id, iss: "MEMBERSHIPSAPI" },
            process.env.JWT_SECRET_KEY
        );

        // email data
        const emailData = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: "Password Reset Instructions",
            text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <a href="${process.env.CLIENT_URL}/reset-password/${token}">${process.env.CLIENT_URL}/reset-password/${token}</a>`
        };

        return user.updateOne({ resetPasswordLink: token }).then((success) => {
            sendEmail(emailData);
            logger.info(`Set reset password link success. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(200).json({
                message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
            });
        }).catch((err) => {
            logger.warn(`Set reset password link failed. Method: ${req.method}, URL: ${req.url}.`);
            return res.json({ error: err });
        });
    }).catch((err) => {
        logger.warn(`User does not exist. Method: ${req.method}, URL: ${req.url}.`);
        return res
            .status("404")
            .json({ error: err });
    });
};

/*
 * @desc    Reset password
 * @route   PUT /reset-password
 * @return  JSON object
*/
exports.resetPassword = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Validation errors. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: errors.array().map(e => e.msg) });
    }

    const { newPassword, resetPasswordLink } = req.body;
    User.findOne({ resetPasswordLink }).then((user) => {
        if (!user) {
            logger.warn(`Reset password link does not exist. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(401).json({
                error: "Invalid Link!"
            });
        }
        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
        };

        user = _.extend(user, updatedFields);
        user.updated = Date.now();

        user.save().then((user) => {
            logger.info(`User has restored his password. Method: ${req.method}, URL: ${req.url}.`);
            res.status(200).json({
                message: `Success! Now you can login with your new password.`
            });
        }).catch((err) => {
            logger.warn(`User could not reset his password. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(400).json({
                error: err
            });
        });
    }).catch((err) => {
        logger.warn(`User could not reset his password. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({
            error: err
        });
    });
};

/*
 * Middleware validating JWTs through the jsonwebtoken.
*/
exports.requireSignIn = expressjwt({
    secret: process.env.JWT_SECRET_KEY,
    algorithms: ["HS256"],
    userProperty: "auth",
});