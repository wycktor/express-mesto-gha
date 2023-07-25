const { CastError, ValidationError } = require('mongoose').Error;

const Card = require('../models/card');

const { STATUS_CODE_OK, STATUS_CODE_CREATED } = require('../utils/constants');

const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(STATUS_CODE_OK).send({ cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CODE_CREATED).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Передан несуществующий id карточки'));
      } else if (card.owner.toString() !== req.user._id) {
        next(
          new ForbiddenError('У Вас нет прав на удаление выбранной картчоки'),
        );
      } else {
        Card.deleteOne(card).then(() => res.status(STATUS_CODE_OK).send(card));
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные при удалении карточки',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Передан несуществующий id карточки'));
      } else {
        res.status(STATUS_CODE_OK).send(card);
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные для постановки лайка',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Передан несуществующий id карточки'));
      } else {
        res.status(STATUS_CODE_OK).send(card);
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(
          new BadRequestError(
            'Переданы некорректные данные для для снятия лайка',
          ),
        );
      } else {
        next(err);
      }
    });
};
