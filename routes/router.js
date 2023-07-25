const router = require('express').Router();

const { STATUS_CODE_SERVER_ERROR } = require('../utils/constants');

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

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

router.use((err, req, res, next) => {
  const { statusCode = STATUS_CODE_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === STATUS_CODE_SERVER_ERROR ? 'Ошибка по умолчанию' : message,
  });

  next();
});

module.exports = router;
