const { Router } = require("express");
const { models, sequelize } = require("../models");
const tokenHandler = require("./tokenHandler");
const router = Router();

router.post("/", tokenHandler, async (req, res) => {
  const userId = req.decoded["id"];
  try {
    if (
      !req.body ||
      !req.body.title ||
      !req.body.description ||
      !req.body.time ||
      !req.body.id
    ) {
      res.status(400).json({
        message:
          "send title, description and time of the communication and id of the customer",
      });
    }
    const { title, description, time, id } = req.body;
    await models.Communication.create({
      title,
      description,
      time,
      customerId: id,
      userId,
      notified: false,
    });
    res.status(201).json({ message: "communication added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occured" });
  }
});

//get all communications of a customerId(:id)
router.get("/:id", tokenHandler, async (req, res) => {
  const userId = req.decoded["id"];
  const customerId = req.params.id;
  try {
    const data = await models.Communication.findAll({
      where: { customerId, userId },
      order: ["time"],
    });
    res.status(200).json({ message: "data fetched", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occured" });
  }
});

module.exports = router;
