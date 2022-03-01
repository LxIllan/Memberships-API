const { body } = require("express-validator");

/*
 * @route   POST /memberships
*/
exports.createMembership = [
    body("membership", "Membership is required.").notEmpty(),
    body("price", "Price must be a number higher than 0.").isNumeric({ min: 1 }).toFloat(),
    body("months", "Months must be a number higher than 0.")
        .isNumeric()
        .optional({ nullable: true }),
    body("weeks", "Weeks must be a number higher than 0.").isNumeric().optional({ nullable: true }),
    body("startHour").isNumeric().optional({ nullable: true }),
    body("endHour").isNumeric().optional({ nullable: true }),
];

/*
 * @route   PUT /memberships/:membershipId
 */
exports.editMembership = [
    body("membership", "Membership is required.").notEmpty().optional({ nullable: true }),
    body("price", "Price must be a number higher than 0.")
        .isNumeric({ min: 1 })
        .optional({ nullable: true })
        .toFloat(),
    body("months", "Months must be a number higher than 0.")
        .isNumeric()
        .optional({ nullable: true }),
    body("weeks", "Weeks must be a number higher than 0.").isNumeric().optional({ nullable: true }),
    body("startHour").isNumeric().optional({ nullable: true }),
    body("endHour").isNumeric().optional({ nullable: true }),
];
