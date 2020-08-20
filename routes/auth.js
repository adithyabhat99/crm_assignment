const { Router } = require("express");
const bcrypt = require("bcrypt");
const { models, sequelize } = require("../models");
const router = Router();

router.post("/", async (req, res) => {
  try {
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: "error occured" });
  }
});
router.post("/email", async (req, res) => {
  res.json({ message: "email verified" });
});
module.exports = router;
