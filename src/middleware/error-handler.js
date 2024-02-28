const httpStatus = require("http-status");
const APIError = require("../utility/APIError");
const expressValidation = require("express-validation");
const { ValidationError } = require("express-validation");

/**
 * error handler
 * @public
 */
const addErrorHandler = (err, req, res, next) => {
  const response = {
    success: false,
    error: {
      message: err.message || httpStatus[err.status],
      errors: err.errors,
    },
  };

  res.status(err.status);
  res.json(response);
};

exports.addErrorHandler = addErrorHandler;

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
exports.converter = (err, req, res, next) => {
  let convertedError = err;
  if (!(err instanceof APIError)) {
    let status = err.status;
    if (err.code && err.code === "ECONNABORTED") {
      status = httpStatus.GATEWAY_TIMEOUT;
    }
    convertedError = new APIError({
      message: err.message,
      status: status,
    });
  }
  return addErrorHandler(convertedError, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res, next) => {
  const err = new APIError({
    message: "Not found",
    status: httpStatus.NOT_FOUND,
  });
  return addErrorHandler(err, req, res);
};

exports.validationError = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    // MARK: Form validation error
    const { body, query, params } = err.details;
    let errorMessage = {};
    if (body) {
      for (const error of body) {
        delete error.path;
        delete error.type;
        delete error.context;
      }
    }
    if (query) {
      for (const error of query) {
        delete error.path;
        delete error.type;
        delete error.context;
      }
    }
    if (params) {
      for (const error of params) {
        delete error.path;
        delete error.type;
        delete error.context;
      }
    }
    const response = {
      success: false,
      data: {
        message: err.message || httpStatus[err.status || 400],
        errors: err.details,
      },
    };
    return res.status(422).json(response);
  }
  return next(err);
};
