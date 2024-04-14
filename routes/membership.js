const authController = require("../controllers/auth");
const express = require("express");
const membershipController = require("../controllers/membership");
const membershipValidator = require("../validators/membership");

const router = express.Router();

router.get("/memberships", authController.requireSignIn, membershipController.getMemberships);
router.post(
    "/memberships",
    authController.requireSignIn,
    membershipValidator.createMembership,
    membershipController.createMembership
);

router.get(
    "/memberships/:membershipId",
    authController.requireSignIn,
    membershipController.getMembership
);
router.put(
    "/memberships/:membershipId",
    authController.requireSignIn,
    membershipValidator.editMembership,
    membershipController.editMembership
);
router.delete(
    "/memberships/:membershipId",
    authController.requireSignIn,
    membershipController.deleteMembership
);

router.param("membershipId", membershipController.membershipById);

module.exports = router;
