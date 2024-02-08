const mongoose = require("mongoose");

const PDCSchema = new mongoose.Schema(
  {
    link: {
      required: true,
      type: String,
    },
    generatedDate: {
      type: String,
    },
    upstairs: {
      type: String,
    },
    downstairs: {
      type: String,
    },
  },
  {
    collection: "pdc",
  }
);

module.exports = mongoose.model("PDCModel", PDCSchema);
