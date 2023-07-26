const router = require('express').Router();

const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

const {
  userByIdValidation,
  userProfileValidation,
  userAvatarValidation,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch('/me', userProfileValidation, updateUserProfile);
router.patch('/me/avatar', userAvatarValidation, updateUserAvatar);
router.get('/:userId', userByIdValidation, getUserById);

module.exports = router;
