const express = require("express");

const router = express.Router();

const WorkOrderModel = require("../models/WorkOrderModel");
const PDCModel = require("../models/PDCModel");

const applicationPortNumber = process.env.REACT_APP_APPLICATION_PORT;

// Post Method
router.post("/:WorkOrderId/generatePDC", async (req, res) => {
  try {
    const { WorkOrderId } = req.params;

    const pdcs = req.body.links;

    // Ensure that the WorkOrder Exists
    const workOrder = await WorkOrderModel.findOne({
      link: `http://localhost:${applicationPortNumber}/WorkOrderDashboard?id=${WorkOrderId}`,
    });

    if (!workOrder) {
      return res.status(404).json({ message: "WorkOrder not found" });
    }

    // Create an array of PDC documents
    const pdcDocuments = pdcs.map((pdc) => ({
      ...pdc,
      workOrder: WorkOrderId,
    }));

    // Insert the PDC documents
    const insertedPDCs = await PDCModel.insertMany(pdcDocuments);

    // Add the new PDC IDs to the existing array
    workOrder.pdcs = workOrder.pdcs.concat(insertedPDCs.map((pdc) => pdc._id));

    // Save the updated WorkOrder
    await workOrder.save();

    res.status(201).json(insertedPDCs);
  } catch (error) {
    console.error("Error generating PDCs: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Method
router.get("/:WorkOrderId/getAllPDC", async (req, res) => {
  const { WorkOrderId } = req.params;

  try {
    // Ensure that the WorkOrder Exists
    const workOrder = await WorkOrderModel.findOne({
      link: `http://localhost:${applicationPortNumber}/WorkOrderDashboard?id=${WorkOrderId}`,
    });

    if (!workOrder) {
      return res.status(404).json({ message: "WorkOrder not found" });
    }

    const pdcs = await PDCModel.find({
      _id: { $in: workOrder.pdcs },
    });

    res.status(200).json(pdcs);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error retrieving pdcs in ${WorkOrderId}` });
  }
});

module.exports = router;
