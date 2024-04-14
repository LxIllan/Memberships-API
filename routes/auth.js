const authController = require("../controllers/auth");
const authValidator = require("../validators/auth");
const express = require("express");
const userController = require("../controllers/user");

const router = express.Router();

router.post("/signin", authValidator.singIn, authController.signIn);
router.get("/signout", authController.requireSignIn, authController.signOut);
router.post(
    "/signup",
    authController.requireSignIn, // Comment this line to sign up the first admin
    userController.isAdmin, // Comment this line to sign up the first admin
    authValidator.signUp,
    authController.signUp
);

// password forgot and reset routes
router.put("/forgot-password", authValidator.forgotPassword, authController.forgotPassword);
router.put("/reset-password", authValidator.resetPassword, authController.resetPassword);

module.exports = router;
