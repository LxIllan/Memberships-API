const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
const User = require("../models/user");
const _ = require("lodash");
require("dotenv").config();

/*
 * @desc    Sing up an receptionist
 * @route   POST /signup
 * @access  Public
*/
exports.signUp = async(req, res) => {
    const userExists = await User.findOne({
        email: req.body.email.toLowerCase(),
    });
    if (userExists) {
        return res.status(403).json({
            error: "Email is taken!",
        });
    }
    const user = await new User(req.body);
    /* Save email in lower case */
    user.email = req.body.email.toLowerCase();
    await user.save();
    res.json({ message: "Signup success! Please login." });
};

/*
 * @desc    Sing in
 * @route   POST /signin
 * @access  Public
*/
exports.signIn = (req, res) => {
    console.log(req.body.data)
    const { email, password } = req.body.data;
    console.log(email)
    // find user with email
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        // if there is a error or not user
        if (err || !user) {
            return res.status(401).json({
                error: "User with that email does not exist. Please sing in",
            });
        }
        // if user found check if password match
        if (!user.authenticate(password)) {
            return res
                .status(401)
                .json({ error: "Email and password do not match" });
        }

        // generate a token with user id and secret
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET_KEY);
        // persist the token as 't' with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });

        const { _id, name, lastName, email, role } = user;
        return res.status(200).json({ token, user: { _id, name, lastName, email, role } });
    });
};

/*
 * @desc    Sing out
 * @route   get /signout
 * @access  Public
*/
exports.signOut = (req, res) => {
    res.clearCookie("t");
    return res.json({ message: "Signout success!" });
};

/*
 * @desc    Send an email to reset their password
 * @route   PUT /forgot-password
 * @access  Public
*/
exports.forgotPassword = (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "No request body" });
    }
    if (!req.body.email) {
        return res.status(400).json({ message: "No Email in request body" });
    }

    const { email } = req.body;

    // find the user based on email
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err || !user) {
            return res
                .status("401")
                .json({ error: "User with that email does not exist!" });
        }
        // generate a token with user id and secret
        const token = jwt.sign({ _id: user._id, iss: "NODEAPI" },
            process.env.JWT_SECRET_KEY
        );

        // email data
        const emailData = {
            from: "mailer@syss.tech",
            to: email,
            subject: "Password Reset Instructions",
            text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`,
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ error: err });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
                });
            }
        });
    });
};

/*
 * @desc    Reset password
 * @route   PUT /reset-password
 * @access  Public
*/
exports.resetPassword = (req, res) => {	
    const { newPassword, resetPasswordLink } = req.body;
    console.log(req.body);
    User.findOne({ resetPasswordLink }, (err, user) => {
        if (err || !user)
            return res.status(401).json({
                error: "Invalid Link!"
            });
 
        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
        };
 
        user = _.extend(user, updatedFields);
        user.updated = Date.now();
 
        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.status(200).json({
                message: `Success! Now you can login with your new password.`
            });
        });
    });
};

/*
 * Middleware validating JWTs through the jsonwebtoken.
*/
exports.requireSignIn = expressJWT({
    secret: process.env.JWT_SECRET_KEY,
    algorithms: ["HS256"],
    userProperty: "auth",
});