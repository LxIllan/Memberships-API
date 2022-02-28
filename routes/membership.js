const express = require('express');
const authController = require('../controllers/auth');
const membershipController = require('../controllers/membership');

const router = express.Router();

router.get('/memberships', authController.requireSignIn, membershipController.getMemberships);
router.post('/memberships', authController.requireSignIn, membershipController.createMembership);

router.get('/memberships/:membershipId', authController.requireSignIn, membershipController.getMembership);
router.put('/memberships/:membershipId', authController.requireSignIn, membershipController.editMembership);
router.delete('/memberships/:membershipId', authController.requireSignIn, membershipController.deleteMembership);

router.param('membershipId', membershipController.membershipById);

module.exports = router;