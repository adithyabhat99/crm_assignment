const communication = (sequelize, DataTypes) => {
  const Communication = sequelize.define("communication", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    notified: {
      type: DataTypes.BOOLEAN,
      defaltValue: false,
    },
  });
  Communication.associate = (models) => {
    Communication.belongsTo(models.User);
    Communication.belongsTo(models.Customer);
  };
  return Communication;
};

module.exports = communication;
