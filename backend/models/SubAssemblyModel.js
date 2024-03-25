const mongoose = require("mongoose");

const SubAssemblySchema = new mongoose.Schema(
  {
    link: {
      required: true,
      type: String,
      unique: true,
    },
    generatedDate: {
      required: true,
      type: String,
    },
  },
  {
    collection: "subAssembly",
  }
);

module.exports = mongoose.model("SubAssemblyModel", SubAssemblySchema);
