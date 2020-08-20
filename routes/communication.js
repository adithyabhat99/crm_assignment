const { Router } = require("express");
const { models, sequelize } = require("../models");
const tokenHandler = require("./tokenHandler");
const router = Router();

router.post("/", tokenHandler, async (req, res) => {
  res.status(201).json({ message: "communication added" });
});

module.exports = router;
