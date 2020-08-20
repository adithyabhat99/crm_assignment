const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { models, sequelize } = require("../models");
const mail = require("./email/email");
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
      verified: false,
    });
    // send verification code to the email id(no need to be synchronous)
    mail(
      email,
      "Verify your email",
      `Welcome to CRM, authentication code: ${verification_code}`
    );
    console.log("VERIFCATION CODE: ", verification_code);
    res.status(201).json({ message: "user created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occured" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.verification_code) {
      res.status(400).json({ message: "send email and verification_code" });
    }
    const { email, verification_code } = req.body;
    const user = await models.User.findOne({
      where: { email, verification_code },
    });
    if (!user) {
      res
        .status(400)
        .json({ message: "email or verification_code is invalid" });
    }
    await user.update({ verified: true }, { where: { email } });
    res.status(200).json({ message: "email verified" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occured" });
  }
});

router.post("/auth", async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      res.status(400).json({ message: "send email and password" });
    }
    let { email, password } = req.body;
    const user = await models.User.findOne({
      where: { email, verified: true },
    });
    if (!user) {
      res
        .status(400)
        .json({ message: "either email is invalid or not verified" });
    }
    const hashedPassword = user.password;
    const result = bcrypt.compareSync(password, hashedPassword);
    if (result === false) {
      res.status(401).json({ message: "wrong password" });
    }
    // sign a token which is valid for 10 days
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 10 * 7 * 24 * 60 * 60,
        id: user.id,
      },
      process.env.AUTH_SECRET
    );
    res.status(200).json({ message: "success", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occured" });
  }
});
module.exports = router;
