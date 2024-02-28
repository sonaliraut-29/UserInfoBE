const httpStatus = require("http-status");
const Response = require("../utility/APIResponse");

/**
 * success handler
 */

exports.addSuccessHandler = (obj, req, res, next) => {
  let response = null;
  if (obj instanceof Response) {
    response = {
      success: true,
      data: obj.message || httpStatus[obj.status || 200],
    };
    res.status(obj.status || 200);
    return res.json(response);
  }
  return next(obj);
};
