const authController = require("../controllers/auth");
const express = require("express");
const receiptValidator = require("../validators/receipt");
const receiptsController = require("../controllers/receipt");

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
