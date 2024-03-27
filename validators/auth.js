const { body } = require("express-validator");

/*
 * @route   POST /signup
*/
exports.signUp = [
    body("name", "Name is required.").notEmpty(),
    body("lastName", "LastName is required.").notEmpty(),
    body("email", "Email must be a valid email.").isEmail().toLowerCase(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long.")
        .matches(/\d/)
        .withMessage("Password must contain a number.")
];


/*
 * @route   POST /signin
*/
exports.singIn = [
    body("email", "Email must be a valid email.").isEmail().toLowerCase(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long.")
        .matches(/\d/)
        .withMessage("Password must contain a number."),
];


/*
 * @route   PUT /forgot-password
*/
exports.forgotPassword = [
    body("email", "Email must be a valid email.").isEmail().toLowerCase()   
];


/*
 * @route   PUT /reset-password
*/
exports.resetPassword = [
    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long.")
        .matches(/\d/)
        .withMessage("Password must contain a number."),
    body("resetPasswordLink", "Password reset link is required.").notEmpty()
];