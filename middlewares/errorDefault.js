const { STATUS_CODE_SERVER_ERROR } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === STATUS_CODE_SERVER_ERROR ? 'Ошибка по умолчанию' : message,
  });

  next();
};
