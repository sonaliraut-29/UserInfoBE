const db = require("../../models/index");

let dbConnection = async () => {
  try {
    db.sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { dbConnection };
