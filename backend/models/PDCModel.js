const mongoose = require("mongoose");

// Panel Model
const PanelSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
      unique: true,
    },
    generatedDate: {
      type: String,
      required: true,
    },
    panelId: {
      type: String,
      unique: true,
    },
  },
  {
    collection: "panels-subassembly",
  }
);

const PanelModel = mongoose.model("Panel", PanelSchema);

const PDCSchema = new mongoose.Schema(
  {
    link: {
      required: true,
      type: String,
    },
    generatedDate: {
      type: String,
      required: true,
    },
    pdcId: {
      type: String,
      required: true,
      unique: true,
    },
    panels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Panel",
      },
    ],
  },
  {
    collection: "pdc",
  }
);

const PDCModel = mongoose.model("PDCModel", PDCSchema);

module.exports = {
  PanelModel,
  PDCModel,
};
