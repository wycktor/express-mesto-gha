const Card = require('../models/card');

const {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_NOT_FOUND,
  STATUS_CODE_SERVER_ERROR,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(STATUS_CODE_OK).send({ cards }))
    .catch(() => res
      .status(STATUS_CODE_SERVER_ERROR)
      .send({ message: 'Ошибка по умолчанию' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CODE_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res
          .status(STATUS_CODE_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(STATUS_CODE_NOT_FOUND).send({
          message: 'Передан несуществующий id карточки',
        });
      } else {
        res.status(STATUS_CODE_OK).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при удалении карточки',
        });
      } else {
        res
          .status(STATUS_CODE_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(STATUS_CODE_NOT_FOUND).send({
          message: 'Передан несуществующий id карточки',
        });
      } else {
        res.status(STATUS_CODE_OK).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      } else {
        res
          .status(STATUS_CODE_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(STATUS_CODE_NOT_FOUND).send({
          message: 'Передан несуществующий id карточки',
        });
      } else {
        res.status(STATUS_CODE_OK).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(STATUS_CODE_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else {
        res
          .status(STATUS_CODE_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
};
