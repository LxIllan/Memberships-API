const express = require("express");
const receiptsController = require("../controllers/receipt");
const userController = require("../controllers/user");
const authController = require("../controllers/auth");
const receiptValidator = require("../validators/receipt");

const router = express.Router();

router.get(
    "/receipts",
    authController.requireSignIn,
    receiptValidator.getReceipts,
    receiptsController.getReceipts
);

router.get(
    "/receipts/member/:memberId",
    authController.requireSignIn,
    receiptValidator.getReceiptsByMember,
    receiptsController.getReceiptsByMember
);

router.get(
    "/receipts/user/:userId",
    authController.requireSignIn,
    receiptValidator.getReceiptsByUser,
    receiptsController.getReceiptsByUser
);

module.exports = router;
