const Joi = require("joi");

const userRegisterSchema = Joi.object({
  firstname: Joi.string().trim().required(),
  lastname: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim(),
  phoneno: Joi.string().trim().required(),
  dateofbirth: Joi.string().trim(),
  gender: Joi.string().trim().allow(null),
  address: Joi.array().items(
    Joi.object({
      streetAddress: Joi.string().trim().required(),
      city: Joi.string().trim().required(),
      state: Joi.string().trim().required(),
      zipcode: Joi.string().trim(),
      country: Joi.string().trim().required(),
    })
  ),
});

module.exports = {
  userRegisterSchema: { body: userRegisterSchema },
};
