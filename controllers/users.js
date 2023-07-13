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
      if (err.name === 'CastError') {
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
      if (err.name === 'ValidationError') {
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

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(STATUS_CODE_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else if (err.name === 'DocumentNotFoundError') {
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

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(STATUS_CODE_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      } else if (err.name === 'DocumentNotFoundError') {
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

/*
// "_id": "64aae3ecef1ed5370abf50e7",
"name": "Тест22",
"about": "Инфо",
"avatar": "https://static.tildacdn.com/tild3363-3361-4361-b263-303164643262/photo.jpg"

"_id": "64ad7baee9f4839cd21e4af3"
"name": "Нечто",
"link": "https://unsplash.com/photos/5sPYYR6lG28"
*/
