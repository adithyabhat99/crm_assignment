const { Router } = require("express");
const router = Router();

router.post("/", async (req, res) => {
  try {
    res.status(201).json({ message: "customer created" });
  } catch (error) {
    res.status(500).json({ message: "error occured" });
  }
});
module.exports = router;
