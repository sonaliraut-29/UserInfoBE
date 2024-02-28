const { genSalt, hash, compare } = require("bcrypt");

exports.hashPassword = async (password) => {
  const salt = await genSalt();
  return hash(password, salt);
};
