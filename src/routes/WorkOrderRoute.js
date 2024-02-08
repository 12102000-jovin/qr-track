const express = require("express");

const router = express.Router();

const WorkOrderModel = require("../models/WorkOrderModel");

// Post Method
router.post("/generateWorkOrder", async (req, res) => {
  // Check if req.body is defined and has the 'links' property
  if (!req.body || !req.body.links) {
    return res
      .status(400)
      .json("Invalid request structure. 'links' property is missing.");
  }

  // Ensure that req.body.links is an array before using map
  if (!Array.isArray(req.body.links)) {
    return res.status(400).json("'links' property must be an array.");
  }

  const links = req.body.links.map((link) => ({
    link: link.link,
    generatedDate: new Date(),
  }));

  try {
    const workOrdersToSave = await WorkOrderModel.insertMany(links);
    res.status(200).json(workOrdersToSave);
  } catch (err) {
    res.status(400).json("Error:", err.message);
  }
});

// Get Method
router.get("/getAllWorkOrder", async (req, res) => {
  try {
    const workOrderData = await WorkOrderModel.find();
    res.json(workOrderData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
