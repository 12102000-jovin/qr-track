const express = require("express");

const router = express.Router();

const SubAssemblyModel = require("../models/SubAssemblyModel");

const applicationPortNumber = process.env.REACT_APP_APPLICATION_PORT;

// Define your SubAssemblyRoute endpoints
router.post("/generateSubAssembly", async (req, res) => {
  const { link, upstairs, downstairs } = req.body;
  try {
    const subAssemblyToSave = await SubAssemblyModel.create({
      link,
      upstairs,
      downstairs,
    });
    res.status(200).json(subAssemblyToSave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Export the router
module.exports = router;
