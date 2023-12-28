const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECT_MONGODB);
    console.log("success connect DB");
  } catch (error) {
    console.log("Faild to connect DB");
    console.log(error);
  }
};

module.exports = { connectDB };
