const express = require('express');

const authController = require('../controllers/auth');
const userValidator = require('../validator/user');

const router = express.Router();

router.post('/signin', authController.signIn);
router.get('/signout', authController.signOut);
router.post('/signup', authController.signUp);

// password forgot and reset routes
router.put("/forgot-password", authController.forgotPassword);
router.put("/reset-password", userValidator.passwordResetValidator, authController.resetPassword);

module.exports = router;