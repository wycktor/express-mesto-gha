const { CastError, ValidationError } = require('mongoose').Error;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { STATUS_CODE_OK, STATUS_CODE_CREATED } = require('../utils/constants');

const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(STATUS_CODE_OK).send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(
          new NotFoundError('Пользователь по указанному _id не найден'),
        );
      }
      return res.status(STATUS_CODE_OK).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new BadRequestError('Введены некорректные данные поиска'));
      }

      return next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }

      return res.status(STATUS_CODE_OK).send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(STATUS_CODE_CREATED).send({
      name,
      about,
      avatar,
      email,
    }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(new BadRequestError('Введены некорректные данные'));
      }

      if (err.code === 11000) {
        return next(
          new ConflictError('Пользователь с таким email уже существует'),
        );
      }

      return next(err);
    });
};

const updateUserInfo = (data, req, res, next) => {
  User.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    .then((newData) => {
      if (!newData) {
        return next(new NotFoundError('Пользователь не найден'));
      }

      return res.status(STATUS_CODE_OK).send({ data: newData });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении данных пользователя',
          ),
        );
      }

      return next(err);
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  updateUserInfo({ name, about }, req, res, next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUserInfo({ avatar }, req, res, next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неверные email и/или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(new UnauthorizedError('Неверные email и/или пароль'));
        }

        const token = jwt.sign({ _id: user._id }, 'secret-key', {
          expiresIn: '7d',
        });

        return res.status(STATUS_CODE_OK).send({ token });
      });
    })
    .catch(next);
};
