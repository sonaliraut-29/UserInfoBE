const Joi = require("joi");
const APIError = require("../utility/APIError");
const httpStatus = require("http-status");

module.exports.validateBody = function (validator) {
  const options = {
    abortEarly: false, // include all errors

    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };
  return async function (req, res, next) {
    const { error, value } = validator.validate(req.body, options);
    if (error) {
      const errorMessages = error.details.map((x) => x.message).join(", ");
      next(
        new APIError({
          message: errorMessages,
          status: httpStatus.UNPROCESSABLE_ENTITY,
        })
      );
    } else {
      req.body = value;
      next();
    }
  };
};
