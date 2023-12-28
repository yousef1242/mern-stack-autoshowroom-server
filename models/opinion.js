const mongoose = require("mongoose");

const opinionSchema = new mongoose.Schema(
  {
    name: {
      // client name
      type: String,
      required: true,
    },
    message: {
      // client message
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Opinions = mongoose.model("Opinion", opinionSchema);

module.exports = {
  Opinions,
};
