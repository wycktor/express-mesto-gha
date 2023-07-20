const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  cardValidation,
  cardByIdValidation,
} = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', cardValidation, createCard);
router.delete('/:cardId', cardByIdValidation, deleteCard);
router.put('/:cardId/likes', cardByIdValidation, likeCard);
router.delete('/:cardId/likes', cardByIdValidation, dislikeCard);

module.exports = router;
