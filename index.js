const express = require("express");
const winston = require("winston");
const { models, sequelize } = require("./models");
const { user, customer, communication } = require("./routes");
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

// logger(console log in development)
const logger = winston.createLogger({
  transports: [
    process.env.DEPLOYEMENT === "DEVELOPMENT"
      ? new winston.transports.Console()
      : new winston.transports.File({ filename: "requests.log" }),
  ],
});
app.use((req, res, done) => {
  logger.info(req.originalUrl);
  done();
});

// routes
app.use("/api/user", user);
app.use("/api/customer", customer);
app.use("/api/communication", communication);

// default
app.get("/", (req, res) => {
  res.status(201).json({ message: "Hi, this is CRM API" });
});

// redis installed only in local
if (process.env.DEPLOYEMENT === "DEVELOPMENT") require("./kue/task");

// sequelize.sync().then(() => {
sequelize.sync({ force: true }).then(() => {
  const port = process.env.PORT || 7000;
  app.listen(port, () => {
    console.log(`Server started at ${port}`);
  });
});
