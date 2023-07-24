const { celebrate, Joi } = require('celebrate');

const { regexLink } = require('../utils/constants');

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
});

const userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(new RegExp(regexLink)),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
});

const userByIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

const userProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const userAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(new RegExp(regexLink)).required(),
  }),
});

const cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(new RegExp(regexLink)),
  }),
});

const cardByIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  loginValidation,
  userValidation,
  userByIdValidation,
  userProfileValidation,
  userAvatarValidation,
  cardValidation,
  cardByIdValidation,
};
