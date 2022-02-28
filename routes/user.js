const express = require('express');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/users', authController.requireSignIn, userController.isAdmin, userController.getUsers);
router.post('/users', authController.requireSignIn, userController.isAdmin, userController.registerUser);

router.get('/users/:userId', authController.requireSignIn,  userController.getUser);
router.put('/users/:userId', authController.requireSignIn, userController.hasAuthorization, userController.updateUser);
router.delete('/users/:userId', authController.requireSignIn, userController.hasAuthorization, userController.deleteUser);

// photo
router.get('/users/photo/:userId', userController.getUserPhoto);

router.param('userId', userController.userById);

module.exports = router;
