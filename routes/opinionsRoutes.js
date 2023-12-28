const {
  deleteOpinionController,
  addOpinionController,
  getAllOpinionsController,
} = require("../controllers/opinionsController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const router = require("express").Router();

// add opinion
router.post("/add", verifyToken, verifyTokenAndAdmin, addOpinionController);

// get all opinions
router.get("/get/all", getAllOpinionsController);

// delete opinion
router.delete(
  "/delete/:opinionId",
  verifyToken,
  verifyTokenAndAdmin,
  deleteOpinionController
);

module.exports = router;
