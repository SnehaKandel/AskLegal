const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roles');
const {
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  deleteUser,
} = require('../controllers/adminController');

router.use(authenticate);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);
router.put('/users/:userId/status', updateUserStatus);
router.delete('/users/:userId', deleteUser);

module.exports = router;