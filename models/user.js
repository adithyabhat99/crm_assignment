const user = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verification_code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
  User.associate = (models) => {
    User.hasMany(models.Customer, { onDelete: "CASCADE" });
    User.hasMany(models.Communication, { onDelete: "CASCADE" });
  };
  return User;
};
module.exports = user;
