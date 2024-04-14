const { check, body } = require("express-validator");

/*
 * @route   POST /users
*/
exports.registerUser = [
    body("name", "Name is required.").notEmpty(),
    body("lastName", "LastName is required.").notEmpty(),
    body("email", "Email must be a valid email.").isEmail().toLowerCase(),
];

/*
 * @route   POST /users/:userId
 ! Not used because of I'm using formidable.
*/
exports.updateUser = [
    check("name", "Name is required.").notEmpty(),
    check("lastName", "LastName is required.").notEmpty(),
    check("email", "Email must be a valid email.").isEmail().toLowerCase(),
    check("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 5 chars long.")
        .matches(/\d/)
        .withMessage("Password must contain a number."),
    check("address")
        .isLength({ min: 10 })
        .withMessage("Please write a valid address.")
];
