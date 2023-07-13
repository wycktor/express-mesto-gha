const { CastError, DocumentNotFoundError, ValidationError } = require('mongoose').Error;

const User = require('../models/user');

const {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_NOT_FOUND,
  STATUS_CODE_SERVER_ERROR,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_CODE_OK).send({ data: users }))
    .catch(() => res
      .status(STATUS_CODE_SERVER_ERROR)
      .send({ message: 'Ошибка по умолчанию' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(STATUS_CODE_NOT_FOUND)
          .send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.status(STATUS_CODE_OK).send({ data: user });
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(STATUS_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при поиске пользователя',
        });
      } else {
        res
          .status(STATUS_CODE_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CODE_CREATED).send({ data: user }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(STATUS_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        res
          .status(STATUS_CODE_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const updateUserInfo = (data, req, res) => {
  User.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    .then((newData) => res.status(STATUS_CODE_OK).send({ data: newData }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(STATUS_CODE_BAD_REQUEST).send({
          message:
            'Переданы некорректные данные при обновлении данных пользователя',
        });
      } else if (err instanceof DocumentNotFoundError) {
        res
          .status(STATUS_CODE_NOT_FOUND)
          .send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res
          .status(STATUS_CODE_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  updateUserInfo({ name, about }, req, res);
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUserInfo({ avatar }, req, res);
};
