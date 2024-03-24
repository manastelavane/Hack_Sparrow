const express = require('express');
const router = express.Router();

const {
    googleSignUp,
    search,
    editProfile,
    updateTestScore,
    reportUser,
} = require('../controllers/user.js');
const auth = require('../middleware/auth.js');

router.get('/:userId', search);
router.patch('/edit', auth, editProfile);
router.post('/googleSignUp', googleSignUp);
router.post('/test', updateTestScore);
router.patch('/report', auth, reportUser);
module.exports = router;
