const {
  addCarController,
  getAllCarsController,
  deleteCarController,
  updateCarController,
  getSingleCarController,
} = require("../controllers/carsController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const router = require("express").Router();
const storage = require("../utils/multer");

// add car
router.post(
  "/add",
  verifyToken,
  verifyTokenAndAdmin,
  storage.array("file"),
  addCarController
);

// get all cars
router.get("/get/all", getAllCarsController);

// get single car
router.get("/get/single/:carname", getSingleCarController);

// delete car
router.delete(
  "/delete/:carId",
  verifyToken,
  verifyTokenAndAdmin,
  deleteCarController
);

// update car
router.put(
  "/update/:carname",
  verifyToken,
  verifyTokenAndAdmin,
  storage.array("file"),
  updateCarController
);

module.exports = router;
