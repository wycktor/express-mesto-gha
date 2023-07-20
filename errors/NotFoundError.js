const { STATUS_CODE_NOT_FOUND } = require('../utils/constants');

module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = STATUS_CODE_NOT_FOUND;
  }
};
