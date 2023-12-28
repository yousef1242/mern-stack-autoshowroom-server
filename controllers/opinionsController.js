const expressAsyncHandler = require("express-async-handler");
const { Opinions } = require("../models/opinion");

/**-------------------------------------
 *  @dec add opinion
 * @route /api/opinions/add
 * @method POST
 * @access private (admin only)
 -------------------------------------*/
const addOpinionController = expressAsyncHandler(async (req, res) => {
  const addOpinion = new Opinions({ ...req.body });
  const saveopinion = await addOpinion.save();
  return res
    .status(200)
    .json({
      ok: true,
      message: "Opinion added successfully",
      saveopinion: saveopinion,
    });
});

/**-------------------------------------
 *  @dec delete opinion
 * @route /api/opinions/delete/:opinionId
 * @method DELETE
 * @access private (admin only)
 -------------------------------------*/
const deleteOpinionController = expressAsyncHandler(async (req, res) => {
  const { opinionId } = req.params;
  const findOpinion = await Opinions.findById(opinionId);
  if (!findOpinion) {
    return res
      .status(400)
      .json({ ok: false, message: "Opinion doesn't exist" });
  }
  await Opinions.findByIdAndDelete(opinionId);
  return res
    .status(200)
    .json({ ok: true, message: "Opinion deleted successfully" });
});

/**-------------------------------------
 *  @dec get all opinions
 * @route /api/opinions/get/all
 * @method GET
 * @access private (all : any one)
 -------------------------------------*/
const getAllOpinionsController = expressAsyncHandler(async (req, res) => {
  const opinions = await Opinions.find({}).sort({ createdAt: -1 });
  return res.status(200).json({ ok: true, data: opinions });
});

module.exports = {
  addOpinionController,
  deleteOpinionController,
  getAllOpinionsController,
};
