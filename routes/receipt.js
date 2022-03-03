const express = require('express');
const receiptsController = require('../controllers/receipt');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const receiptValidator = require("../validators/receipt");

const router = express.Router();


router.get('/receipts', authController.requireSignIn, userController.isAdmin, receiptValidator.getReceipts, receiptsController.getReceipts);


module.exports = router;
