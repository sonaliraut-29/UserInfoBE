const express = require("express");
const UserController = require("./components/user/user.controller");

/**
 * Here, you can register routes by instantiating the controller
 */
exports.registerRoutes = function () {
  const router = express.Router();

  // User controller
  const userController = new UserController();

  router.use("/api/user", userController.register());

  return router;
};
