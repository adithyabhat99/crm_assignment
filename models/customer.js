const customer = (sequelize, DataTypes) => {
  const Customer = sequelize.define("customer", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gstno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reminder_frequency: {
      type: DataTypes.INTEGER,
      defaultValue: 7,
    },
    to_remind: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  Customer.associate = (models) => {
    Customer.belongsTo(models.User);
    Customer.hasMany(models.Communication, { onDelete: "CASCADE" });
  };
  return Customer;
};

module.exports = customer;
