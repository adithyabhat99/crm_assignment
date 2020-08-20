const { Router } = require("express");
const bcrypt = require("bcrypt");
const { models, sequelize } = require("../models");
const router = Router();

router.post("/", async (req, res) => {
  try {
    if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
      res.status(400).json({ message: "send email,name and password" });
    }
    let { name, email, password } = req.body;
    // hash password
    password = bcrypt.hashSync(password, 10);
    // create 6 digit verification code
    let verification_code = Math.floor(100000 + Math.random() * 900000);
    // create user
    await models.User.create({
      name,
      email,
      password,
      verification_code,
    });
    // send verification code to the email id
    res.status(201).json({ message: "user created" });
  } catch (error) {
    res.status(500).json({ message: "error occured" });
  }
});
module.exports = router;
