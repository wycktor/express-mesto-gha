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
router.get('/:userId', userByIdValidation, getUserById);
router.patch('/me', userProfileValidation, updateUserProfile);
router.patch('/me/avatar', userAvatarValidation, updateUserAvatar);

module.exports = router;
