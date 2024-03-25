const express = require("express");

const router = express.Router();

const WorkOrderModel = require("../models/WorkOrderModel");

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

  const linksToInsert = req.body.links.map((link) => ({
    link: link.link,
    generatedDate: new Date(),
    workOrderId: link.workOrderId,
  }));

  try {
    // Check for duplicate links before inserting
    const existingLinks = await WorkOrderModel.find({
      link: { $in: linksToInsert.map((link) => link.link) },
    });

    if (existingLinks.length > 0) {
      // Handle duplicate error
      return res
        .status(400)
        .json("Duplicate Work Order Found. Please generate other Work Order.");
    }

    // No duplicates found, proceed to insert
    const workOrdersToSave = await WorkOrderModel.insertMany(linksToInsert);
    res.status(200).json(workOrdersToSave);
  } catch (err) {
    // Handle other errors
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
