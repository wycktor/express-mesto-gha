const STATUS_CODE_OK = 200;
const STATUS_CODE_CREATED = 201;
const STATUS_CODE_BAD_REQUEST = 400;
const STATUS_CODE_UNAUTHORIZED = 401;
const STATUS_CODE_FORBIDDEN = 403;
const STATUS_CODE_NOT_FOUND = 404;
const STATUS_CODE_CONFLICT = 409;
const STATUS_CODE_SERVER_ERROR = 500;

const regexLink = /(?:https?):\/\/(w{3}\.)?\w+([.|-]{1}\w+)*\.[0-9a-zA-Z-]+(\/[\w\-.~:/?#[\]@!$&'()*+,;=]*#?)?/;

module.exports = {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_UNAUTHORIZED,
  STATUS_CODE_FORBIDDEN,
  STATUS_CODE_NOT_FOUND,
  STATUS_CODE_CONFLICT,
  STATUS_CODE_SERVER_ERROR,
  regexLink,
};
