const { verify } = require("jsonwebtoken");
const APIError = require("../utility/APIError");
const httpStatus = require("http-status");

exports.verifyToken = async (req, res, next) => {
  try {
    let tokenToVerify;
    if (req.header("Authorization")) {
      const parts = req.header("Authorization").split(" ");
      if (parts.length !== 2 || parts[0] !== "Bearer") {
        throw new APIError({
          message: "Bearer <token> header invalid",
          status: httpStatus.UNAUTHORIZED,
        });
      }

      tokenToVerify = parts[1];
      const payload = verify(
        tokenToVerify,
        process.env.JWT_SECRET,
        process.env.JWT_ALGORITHM
      );
      req["token"] = payload;
      return next();
    } else {
      throw new APIError({
        message: "No Authorization was found",
        status: httpStatus.UNAUTHORIZED,
      });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      error.status = httpStatus.UNAUTHORIZED;
    }
    return next(error);
  }
};
