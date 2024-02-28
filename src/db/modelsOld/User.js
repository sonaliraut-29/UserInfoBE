module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneno: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dateofbirth: {
        type: Sequelize.DATEONLY,
        notEmpty: false,
      },
      gender: {
        type: Sequelize.STRING,
        notEmpty: false,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      accessToken: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: "Users",
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Address, {
      foreignKey: "userId",
    });
  };

  return User;
};
