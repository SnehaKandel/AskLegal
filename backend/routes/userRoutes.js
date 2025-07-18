const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const {
  getProfile,
  updateProfile,
  changePassword,
  updateNotifications,
} = require('../controllers/userController');

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.put('/notifications', updateNotifications);

module.exports = router;