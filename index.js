const express = require("express");
const { models, sequelize } = require("./models");
const { user, customer, auth } = require("./routes");
const app = express();

app.use(express.json());
// Middleware added to all routes to support Cross Origin Resource Sharing.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token"
  );
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE");
  next();
});

// routes
app.use("/user", user);
app.use("/auth", auth);
app.use("/customer", customer);

sequelize.sync({ force: true }).then(() => {
  const port = process.env.PORT || 7000;
  app.listen(port, () => {
    console.log(`Server started at ${port}`);
  });
});
