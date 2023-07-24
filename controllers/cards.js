const { CastError, ValidationError } = require('mongoose').Error;

const Card = require('../models/card');

const { STATUS_CODE_OK, STATUS_CODE_CREATED } = require('../utils/constants');

const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(STATUS_CODE_OK).send({ cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CODE_CREATED).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      }

      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Передан несуществующий id карточки'));
      }

      if (card.owner.toString() !== req.user._id) {
        return next(
          new ForbiddenError('У Вас нет прав на удаление выбранной картчоки'),
        );
      }

      return Card.deleteOne(card).then(() => res.status(STATUS_CODE_OK).send(card));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при удалении карточки',
          ),
        );
      }

      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Передан несуществующий id карточки'));
      }

      return res.status(STATUS_CODE_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(
          new BadRequestError(
            'Переданы некорректные данные для постановки лайка',
          ),
        );
      }

      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Передан несуществующий id карточки'));
      }

      return res.status(STATUS_CODE_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(
          new BadRequestError(
            'Переданы некорректные данные для для снятия лайка',
          ),
        );
      }

      return next(err);
    });
};
