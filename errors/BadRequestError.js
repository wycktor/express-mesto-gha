const { STATUS_CODE_BAD_REQUEST } = require('../utils/constants');

module.exports = class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.status = STATUS_CODE_BAD_REQUEST;
  }
};
