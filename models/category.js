const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Categories = mongoose.model("Category", categoriesSchema);

module.exports = {
  Categories,
};
