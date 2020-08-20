const express = require("express");
const { models, sequelize } = require("./models");
const { user, customer, communication, auth } = require("./routes");
const app = express();

app.use(express.json());
// Add cors headers
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
app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api/customer", customer);
app.use("/api/communication", communication);

// default
app.get("/", (req, res) => {
  res.status(201).json({ message: "Hi, this is CRM API" });
});

sequelize.sync({ force: true }).then(() => {
  const port = process.env.PORT || 7000;
  app.listen(port, () => {
    console.log(`Server started at ${port}`);
  });
});
