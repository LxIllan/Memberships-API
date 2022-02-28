const express = require('express');
const propertiesController = require('../controllers/property');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

const router = express.Router();


router.get('/properties', authController.requireSignIn, userController.isAdmin, propertiesController.getProperties);
router.post('/properties', authController.requireSignIn, userController.isAdmin, propertiesController.setProperty);

router.get('/properties/:name', authController.requireSignIn, userController.isAdmin, propertiesController.getProperty);
router.delete('/properties/:name', authController.requireSignIn, userController.isAdmin, propertiesController.deleteProperty);

module.exports = router;
