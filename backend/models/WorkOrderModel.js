const mongoose = require("mongoose");

const WorkOrderSchema = new mongoose.Schema(
  {
    link: {
      required: true,
      type: String,
      unique: true,
    },
    generatedDate: {
      type: String,
      required: true,
    },
    workOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    pdcs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PDCModel",
      },
    ],
  },
  {
    // Set the name of the collection
    collection: "workOrder",
  }
);

module.exports = mongoose.model("WorkOrderModel", WorkOrderSchema);
