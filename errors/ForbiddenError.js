const { STATUS_CODE_FORBIDDEN } = require('../utils/constants');

module.exports = class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.status = STATUS_CODE_FORBIDDEN;
  }
};
