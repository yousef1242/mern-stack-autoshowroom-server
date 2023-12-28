const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");
const app = express();

app.use(express.json());

dotenv.config();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://autoshowroomclient.vercel.app"],
  })
);

connectDB();

app.use("/api/admins", require("./routes/adminsRoutes"));

app.use("/api/categories", require("./routes/categoriesRoutes"));

app.use("/api/cars", require("./routes/carsRoutes"));

app.use("/api/opinions", require("./routes/opinionsRoutes"));

app.listen(8080, () => {
  console.log("Server is running on 8080");
});
