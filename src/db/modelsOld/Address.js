module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define(
    "Address",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      streetAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      zipcode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Addresses",
    }
  );

  Address.associate = (models) => {
    Address.belongsTo(models.User, {
      foreignKey: "id",
      sourceKey: "userId",
      constraints: false,
      as: "userDetails",
    });
  };

  return Address;
};
