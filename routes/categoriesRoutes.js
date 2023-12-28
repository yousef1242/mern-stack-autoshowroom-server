const {
  addCategoryController, deleteCategoryController, getAllCategoriesController,
} = require("../controllers/categoriesController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const router = require("express").Router();

// add category
router.post("/add", verifyToken, verifyTokenAndAdmin, addCategoryController);

// delete category
router.delete("/delete/:categoryId", verifyToken, verifyTokenAndAdmin, deleteCategoryController);

// get all categories
router.get("/get/all", getAllCategoriesController);

module.exports = router;
