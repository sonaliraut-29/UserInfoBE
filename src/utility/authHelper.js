const { verify, sign } = require("jsonwebtoken");

exports.verifyAuth = (tokenToVerify) => {
  try {
    const payload = verify(
      tokenToVerify,
      process.env.JWT_SECRET,
      process.env.JWT_ALGORITHM
    );
    return payload;
  } catch (error) {
    return false;
  }
};

exports.generateToken = (payload, expiry) => {
  try {
    const token = sign(payload, process.env.JWT_SECRET, {
      expiresIn: `${expiry}`,
      algorithm: process.env.JWT_ALGORITHM,
    });
    return token;
  } catch (error) {
    return false;
  }
};
