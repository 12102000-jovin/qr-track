const mongoose = require("mongoose");

// Upstairs Model
const UpstairsSchema = new mongoose.Schema(
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
  },
  {
    collection: "upstairs-subassembly",
  }
);

// Downstairs Model
const DownstairsSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
});

const DownstairsModel = mongoose.model("Downstairs", DownstairsSchema);

const UpstairsModel = mongoose.model("Upstairs", UpstairsSchema);

const PDCSchema = new mongoose.Schema(
  {
    link: {
      required: true,
      type: String,
    },
    generatedDate: {
      type: String,
    },
    upstairs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Upstairs",
      },
    ],
    downstairs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Downstairs",
      },
    ],
  },
  {
    collection: "pdc",
  }
);

const PDCModel = mongoose.model("PDCModel", PDCSchema);

module.exports = {
  UpstairsModel,
  DownstairsModel,
  PDCModel,
};
