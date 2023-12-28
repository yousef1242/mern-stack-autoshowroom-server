const expressAsyncHandler = require("express-async-handler");
const { Categories } = require("../models/category");

/**-------------------------------------
 *  @dec add category
 * @route /api/categories/add
 * @method POST
 * @access private (admin only)
 -------------------------------------*/
const addCategoryController = expressAsyncHandler(async (req, res) => {
  const { title } = req.body;
  const findCategory = await Categories.findOne({ title: title });
  if (findCategory) {
    return res
      .status(400)
      .json({ ok: false, message: "Category already exist" });
  }
  const createCategory = new Categories({ title });
  const saveCategory = await createCategory.save();
  return res
    .status(200)
    .json({
      ok: true,
      message: "Category created successfully",
      saveCategory: saveCategory,
    });
});

/**-------------------------------------
 *  @dec get all categories
 * @route /api/categories/get/all
 * @method GET
 * @access private (all : any one)
 -------------------------------------*/
const getAllCategoriesController = expressAsyncHandler(async (req, res) => {
  const categories = await Categories.find({}).sort({ createdAt: -1 });
  return res.status(200).json({ ok: true, data: categories });
});

/**-------------------------------------
 *  @dec delete category
 * @route /api/categories/delete/:categoryId
 * @method DELETE
 * @access private (admin only)
 -------------------------------------*/
const deleteCategoryController = expressAsyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const findCategory = await Categories.findById(categoryId);
  if (!findCategory) {
    return res
      .status(400)
      .json({ ok: false, message: "Category doesn't exist" });
  }
  await Categories.findByIdAndDelete(categoryId);
  return res
    .status(200)
    .json({ ok: true, message: "Category deleted successfully" });
});

module.exports = {
  addCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
};
