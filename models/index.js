const Sequelize = require("sequelize");
const path = require("path");
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

const models = {
  User: require(path.join(__dirname, "./user"))(sequelize, Sequelize),
  Customer: require(path.join(__dirname, "./customer"))(sequelize, Sequelize),
  Communication: require(path.join(__dirname, "./communication"))(
    sequelize,
    Sequelize
  ),
};
Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

module.exports = {
  sequelize,
  models,
};
