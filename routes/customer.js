const { Router } = require("express");
const { models, sequelize } = require("../models");
const tokenHandler = require("./tokenHandler");
const router = Router();

router.post("/", tokenHandler, async (req, res) => {
  try {
    const userId = req.decoded["id"];
    if (
      !req.body ||
      !req.body.name ||
      !req.body.email ||
      !req.body.phone ||
      !req.body.address ||
      !req.body.gstno
    ) {
      res.status(400).json({
        message:
          "send: name,email,phone,address,gstno,reminder_frequency(optional) of the customer",
      });
    }
    let { name, email, phone, address, gstno, reminder_frequency } = req.body;
    reminder_frequency = reminder_frequency ? reminder_frequency : 7;
    await models.Customer.create({
      name,
      email,
      phone,
      address,
      gstno,
      reminder_frequency,
      userId,
      last_reminded: new Date().toISOString(),
    });
    res.status(201).json({ message: "customer created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occured" });
  }
});

router.get("/:id", tokenHandler, async (req, res) => {
  try {
    const userId = req.decoded["id"];
    const id = req.params.id;
    const customer = await models.Customer.findOne({ where: { userId, id } });
    if (!customer) {
      res.status(400).json({ message: "customer does not exist" });
    } else {
      res
        .status(200)
        .json({ message: "data fetched", data: { ...customer["dataValues"] } });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occured" });
  }
});

router.put("/:id", tokenHandler, async (req, res) => {
  try {
    const userId = req.decoded["id"];
    const id = req.params.id;
    if (!req.body) {
      res.status(400).json({
        message:
          "send either email,name,phone,gstno,address or reminder_frequency",
      });
    }
    let updatedCustomerData = {};
    if (req.body.email) {
      updatedCustomerData["email"] = req.body.email;
    }
    if (req.body.name) {
      updatedCustomerData["name"] = req.body.name;
    }
    if (req.body.phone) {
      updatedCustomerData["phone"] = req.body.phone;
    }
    if (req.body.gstno) {
      updatedCustomerData["gstno"] = req.body.gstno;
    }
    if (req.body.address) {
      updatedCustomerData["address"] = req.body.address;
    }
    if (req.body.reminder_frequency) {
      updatedCustomerData["reminder_frequency"] = req.body.reminder_frequency;
    }
    const result = await models.Customer.update(
      {
        ...updatedCustomerData,
      },
      {
        where: {
          userId,
          id,
        },
      }
    );
    if (result[0]) {
      res.status(200).json({ message: "customer data updated" });
    } else {
      res.status(400).json({ message: "customer data did not update" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occured" });
  }
});

router.delete("/:id", tokenHandler, async (req, res) => {
  try {
    const userId = req.decoded["id"];
    const id = req.params.id;
    const result = await models.Customer.destroy({
      where: {
        userId,
        id,
      },
    });
    if (result) {
      res.status(200).json({ message: `customer ${id} deleted` });
    } else {
      175017;
      res.status(400).json({ message: `customer ${id} does not exist` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occured" });
  }
});

// get list of customers
router.get("/", tokenHandler, async (req, res) => {
  try {
    const userId = req.decoded["id"];
    const customers = await models.Customer.findAll({ where: { userId } });
    res.status(200).json({ message: "success", data: customers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occured" });
  }
});

module.exports = router;
