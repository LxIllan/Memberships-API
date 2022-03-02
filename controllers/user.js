const User = require('../models/user');
const jwt = require("jsonwebtoken");
const formidable = require('formidable');
const {validationResult } = require('express-validator')
const fs = require('fs');
const _ = require('lodash');
const { handleErrors, sendEmail } = require("../helpers");
require("dotenv").config();

/*
 * @desc    Get a user by id, every time param '/:userId' is called
*/
exports.userById = (req, res, next, id) => {
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: `${id} is not a valid userId` });
    }

    User.findById(id)
        .exec((err, user) => {
            if ((err) || !(user)) {
                return res.status(400).json({ error: "User not found" });
            }
            req.profile = user;
            next();
        });
};

/*
 * @desc    Get user by id
 * @route   GET /users/:user:id
*/
exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.status(200).json(req.profile);
};

/*
 * @desc    Get a user photo in other endpoint
 * @route   GET /users/photo/:userId
*/
exports.getUserPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.setHeader('Content-Type', req.profile.photo.contentType);
        return res.status(200).send(req.profile.photo.data);
    }
    next();
};

/*
 * @desc    Get all users
 * @route   GET /users
*/
exports.getUsers = (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.json(users);
    }).select('name lastName email role createdAt');
};

/*
 * @desc    Sign up a receptionist user
 * @route   POST /users
 ! This endpoint does not sign up admin users
*/
exports.registerUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array().map(e => e.msg) })
    }
    
    const userExists = await User.findOne({email: req.body.email.toLowerCase() });
    if (userExists) {
        return res.status(403).json({
			error: "Email is taken!",
		});
    }
    req.body.password = 'Memberships3';
    const user = await new User(req.body);
    user.email = req.body.email.toLowerCase();
    await user.save();
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET_KEY);
    
    const emailData = {
        from: "mailer@syss.tech",
        to: user.email,
        subject: "Memberships Log In instructions",
        text: `Please use the following link to set your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
        html: `<p>Please use the following link to set your password:</p> <a href="${process.env.CLIENT_URL}/reset-password/${token}">${process.env.CLIENT_URL}/reset-password/${token}</a>`
    };
        
    user.updateOne({resetPasswordLink: token}, (err, success) => {
        if (err) {
            return res.status(400).json({error: err});
        } else {
            sendEmail(emailData);
            return res.status(200).json({message: `Email has been sent to ${user.email}. Follow the instructions to set your password.`});
        }
    });
};

/*
 * @desc    Update an user
 * @route   PUT /users/:userId
 TODO: Validate incoming form.
*/
exports.updateUser = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        console.log(fields)
        if (err) {
            return res.status(400).json({error: "Photo could not be uploaded."});
        }
        let user = req.profile;
        if (fields.email) {
            const userExists = await User.findOne({'email': fields.email.toLowerCase()});
            if (userExists) {
                if (!(user._id.equals(userExists._id))) {
                    return res.status(400).json({error: 'Email is taken!'});
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
        user.save((err, result) => {
            if (err) {
                return res.status(400).json({error: err});
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            return res.status(200).json(user);
        });
    });
}

/*
 * @desc    Delete an user
 * @route   DELETE /users/:userId
*/
exports.deleteUser = (req, res) => {
    let user = req.profile;
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.json({ message: "User was deleted successfully!" });
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