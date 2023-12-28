const {
  addAdminController,
  loginAdminController,
  getAllAdminsController,
  deleteAdminController,
} = require("../controllers/adminsController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const router = require("express").Router();

// add admin
router.post("/add", verifyToken, verifyTokenAndAdmin, addAdminController);

// login admin
router.post("/login", loginAdminController);

// get all admins
router.get(
  "/get/all",
  verifyToken,
  verifyTokenAndAdmin,
  getAllAdminsController
);

// delete admin
router.delete(
  "/delete/:adminId",
  verifyToken,
  verifyTokenAndAdmin,
  deleteAdminController
);

module.exports = router;
