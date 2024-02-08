const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    age: {
      required: true,
      type: Number,
    },
  },
  {
    // Ser the name of the collection
    collection: "testData",
  }
);

// Export the Mongoose model based on the defined schema
// This model will be named "testData" and can be used to interact with the "testData" collection in MongoDB
module.exports = mongoose.model("testData", dataSchema);
