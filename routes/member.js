const express = require('express');
const memberController = require('../controllers/member');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/members', authController.requireSignIn, memberController.getAllMembers);
router.post('/members', authController.requireSignIn, memberController.registerMember);

router.put('/members/assistance', authController.requireSignIn, memberController.setAssistance);
router.put('/members/paymembership', authController.requireSignIn, memberController.payMembership);
router.put('/members/sendEmail', authController.requireSignIn, memberController.sendEmail);

router.get('/members/:memberId', authController.requireSignIn, memberController.getMember);
router.put('/members/:memberId', authController.requireSignIn, memberController.updateMember);
router.delete('/members/:memberId', authController.requireSignIn, memberController.deleteMember);

// Photo
router.get('/members/photo/:memberId', memberController.getMemberPhoto);
router.get('/members/code/:code', authController.requireSignIn, memberController.getMemberByCode);

router.param('memberId', memberController.memberById);

module.exports = router;