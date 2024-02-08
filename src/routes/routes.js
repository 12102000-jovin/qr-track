const express = require("express");

const router = express.Router();

const Model = require("../models/testmodels");

//Post Method
router.post("/post", (req, res) => {
  const data = new Model({
    name: req.body.name,
    age: req.body.age,
  });

  try {
    const dataToSave = data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/test", (req, res) => {
  res.send("test");
});

module.exports = router;
