const { CastError, ValidationError, DocumentNotFoundError } = require('mongoose').Error;

const {
  // STATUS_CODE_OK,
  // STATUS_CODE_CREATED,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_NOT_FOUND,
  STATUS_CODE_SERVER_ERROR,
} = require('./constants');

module.exports.handleError = (err, res) => {
  if (err instanceof CastError || err instanceof ValidationError) {
    res
      .status(STATUS_CODE_BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные' });
  } else if (err instanceof DocumentNotFoundError) {
    res
      .status(STATUS_CODE_NOT_FOUND)
      .send({ message: 'Элемент с таким _id не был найден' });
  } else {
    res
      .status(STATUS_CODE_SERVER_ERROR)
      .send({ message: 'Ошибка по умолчанию' });
  }
};
