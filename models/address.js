"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Address.belongsTo(models.User, {
        foreignKey: "id",
        sourceKey: "userId",
        constraints: false,
        as: "userDetails",
      });
    }
  }
  Address.init(
    {
      userId: DataTypes.INTEGER,
      streetAddress: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      zipcode: DataTypes.STRING,
      country: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Address",
    }
  );
  return Address;
};
