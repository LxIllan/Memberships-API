const express = require("express");
const memberController = require("../controllers/member");
const authController = require("../controllers/auth");
const memberValidator = require("../validators/member");

const router = express.Router();

router.get(
    "/members",
    authController.requireSignIn,
    memberValidator.getMembers,
    memberController.getMembers
);
router.post("/members", authController.requireSignIn, memberController.registerMember);

router.put(
    "/members/assistance",
    authController.requireSignIn,
    memberValidator.setAssistance,
    memberController.setAssistance
);
router.put(
    "/members/pay-membership",
    authController.requireSignIn,
    memberValidator.payMembership,
    memberController.payMembership
);
router.put(
    "/members/send-notification",
    authController.requireSignIn,
    memberValidator.sendNotification,
    memberController.sendNotification
);

router.get("/members/:memberId", authController.requireSignIn, memberController.getMember);
router.put("/members/:memberId", authController.requireSignIn, memberController.updateMember);
router.delete("/members/:memberId", authController.requireSignIn, memberController.deleteMember);

// Photo
router.get("/members/photo/:memberId", memberController.getMemberPhoto);
router.get(
    "/members/code/:code",
    authController.requireSignIn,
    memberValidator.getMemberByCode,
    memberController.getMemberByCode
);

router.param("memberId", memberController.memberById);

module.exports = router;
