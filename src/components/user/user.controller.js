const router = require("express").Router();
const Response = require("../../utility/APIResponse");
const { validate } = require("express-validation");
const UserService = require("./user.service");
const { hashPassword } = require("../../utility/Hashing");
const { userRegisterSchema, addressSchema } = require("../../validators");
const APIError = require("../../utility/APIError");
const httpStatus = require("http-status");
const { verifyToken } = require("../../middleware/auth");

module.exports = class UserController {
  constructor() {
    this.userService = new UserService();
  }

  register() {
    router.post("/register", this.createUser.bind(this));
    router.post("/address", verifyToken, this.createAddress.bind(this));
    router.post("/login", this.loginUser.bind(this));
    router.post("/logout", verifyToken, this.logout.bind(this));
    return router;
  }

  async createUser(req, res, next) {
    try {
      await validate(userRegisterSchema, {}, {})(req, res, (error) => {
        if (error) {
          throw error;
        }
      });
      let password = req.body.password;

      req.body.password = await hashPassword(password);

      const result = await this.userService.createUser(req.body);

      return next(new Response(result));
    } catch (error) {
      return next(error);
    }
  }

  async createAddress(req, res, next) {
    try {
      await validate(addressSchema, {}, {})(req, res, (error) => {
        if (error) {
          throw error;
        }
      });

      const result = await this.userService.createAddress(req.body, req.token);

      return next(new Response(result));
    } catch (error) {
      return next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const result = await this.userService.getProfile(req.params.id);
      return next(new Response(result));
    } catch (error) {
      return next(error);
    }
  }

  async loginUser(req, res, next) {
    try {
      const result = await this.userService.loginUser(req.body);
      return next(new Response(result));
    } catch (error) {
      return next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const result = await this.userService.logout(req.body.userId);
      return next(new Response(result));
    } catch (error) {
      return next(error);
    }
  }
};
