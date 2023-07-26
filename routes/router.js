const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/NotFoundError');
const { login, createUser } = require('../controllers/users');

const {
  loginValidation,
  userValidation,
} = require('../middlewares/validation');

router.post('/signin', loginValidation, login);
router.post('/signup', userValidation, createUser);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
