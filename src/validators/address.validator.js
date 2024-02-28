const Joi = require("joi");

const addressSchema = Joi.array().items(
  Joi.object({
    streetAddress: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    zipcode: Joi.string().trim(),
    country: Joi.string().trim().required(),
  })
);

module.exports = {
  addressSchema: { body: addressSchema },
};
