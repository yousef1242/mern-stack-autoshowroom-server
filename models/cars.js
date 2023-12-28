const mongoose = require("mongoose");

const carsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    specifications: {
      type: String,
      required: true,
    },
    files: {
      type: [
        {
          url: {
            type: String,
            default: "",
          },
          publicId: {
            type: String,
            default: "",
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Cars = mongoose.model("Car", carsSchema);

module.exports = {
  Cars,
};
