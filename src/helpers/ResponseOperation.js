const HttpCode = require('./HttpCodes');

class ResponseOperation {
  success;
  statusCode;
  data;
  error;

  constructor(success, statusCode, data, error) {
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
    this.error = error;
  }
}

module.exports = ResponseOperation;
