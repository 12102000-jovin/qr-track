const express = require("express");
const router = express.Router();
const WorkOrderModel = require("../models/WorkOrderModel");
const { PanelModel, PDCModel } = require("../models/PDCModel");

const applicationPortNumber = process.env.REACT_APP_APPLICATION_PORT;

router.post(
  "/Panel/:WorkOrderId/:PDCId/generateSubAssembly",
  async (req, res) => {
    try {
      const { WorkOrderId, PDCId } = req.params;
      const links = req.body;

      const workOrder = await WorkOrderModel.findOne({
        link: `http://localhost:${applicationPortNumber}/PDC/${WorkOrderId}`,
      }).populate("pdcs");

      if (!workOrder) {
        return res.status(404).json({ message: "WorkOrder not found" });
      }

      for (const linkObj of links) {
        const { link, generatedDate, panelId } = linkObj; // Include the generatedDate

        const pdcWithReference = workOrder.pdcs.find((pdc) => {
          if (pdc.link && pdc.link.includes(`/${PDCId}`)) {
            return true;
          }
          return false;
        });

        if (pdcWithReference) {
          // Create and save a new sub-assembly with the generatedDate
          const newSubAssembly = new PanelModel({
            link,
            generatedDate,
            panelId,
          });
          await newSubAssembly.save();

          // Update the specified PDC document to include the reference to the new sub-assembly
          await PDCModel.findOneAndUpdate(
            { _id: pdcWithReference._id }, // Use the ObjectId of the PDC with the reference
            { $push: { panels: newSubAssembly._id } }
          );
        } else {
          return res.status(404).json({
            message: "WorkOrder does not have the specified PDC reference",
          });
        }
      }
      return res.status(200).json({ links });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ Error: "Internal Server Error" });
    }
  }
);

router.get("/Panel/:WorkOrderId/:PDCId/getSubAssembly", async (req, res) => {
  const { WorkOrderId, PDCId } = req.params;

  try {
    // console.log(WorkOrderId);
    // console.log(PDCId);
    // Ensure that the WorkOrder exists and populate the pdcs array with the PDC documents
    const workOrder = await WorkOrderModel.findOne({
      link: `http://localhost:${applicationPortNumber}/PDC/${WorkOrderId}`,
    }).populate("pdcs");

    if (!workOrder) {
      return res.status(404).json({ message: "WorkOrder not found" });
    } else {
      // console.log("WO Exist!");
    }

    // Check if the WorkOrder has the specified PDC reference
    const pdcWithReference = workOrder.pdcs.find((pdc) => {
      // Ensure that pdc.link is defined before using the includes method
      if (pdc.link) {
        // console.log("PDC link:", pdc.link);
        return pdc.link.includes(`/${PDCId}`);
      }
      return false;
    });

    if (pdcWithReference) {
      // console.log("PDC with reference found");
      // Get the PanelModel document with the spcified PDCId
      // console.log("PDCId:", PDCId);
      // Get the PanelModel documents with the specified PDCId
      const panelPDC = await PanelModel.find({
        _id: { $in: pdcWithReference.panels },
      });

      // console.log(panelPDC);

      if (panelPDC && panelPDC.length > 0) {
        return res.status(200).json({
          message: "WorkOrder has the specified PDC reference",
          panelPDC,
        });
      } else {
        return res.status(404).json({
          message: "PanelModel not found for the specified PDCId",
        });
      }
    } else {
      // console.log("No PDC with reference found");
      return res.status(404).json({
        message: "WorkOrder does not have the specified PDC reference",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
});

module.exports = router;
