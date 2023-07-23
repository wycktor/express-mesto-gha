const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');

const NotFoundError = require('../errors/NotFoundError');
const { login, createUser } = require('../controllers/users');

const {
  loginValidation,
  userValidation,
} = require('../middlewares/validation');

const auth = require('../middlewares/auth');
const serverError = require('../middlewares/errorDefault');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.post('/signin', loginValidation, login);
router.post('/signup', userValidation, createUser);

router.use(auth);
router.use(serverError);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
