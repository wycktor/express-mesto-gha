const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');
const { STATUS_CODE_NOT_FOUND } = require('../utils/constants');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('/*', (req, res) => {
  res.status(STATUS_CODE_NOT_FOUND).send({
    message: 'Страница не найдена',
  });
});

module.exports = router;
