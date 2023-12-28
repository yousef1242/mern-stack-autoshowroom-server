const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { Admins } = require("../models/admin");

/**-------------------------------------
 *  @dec add admin
 * @route /api/admins/add
 * @method POST
 * @access private (admin only)
 -------------------------------------*/
const addAdminController = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await Admins.findOne({ email: email });
  if (findAdmin) {
    return res.status(400).json({ ok: false, message: "Admin already exist" });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  if (hashPassword) {
    const createAdmin = new Admins({ ...req.body, password: hashPassword });
    const saveِAdmin = await createAdmin.save();
    return res
      .status(200)
      .json({ ok: true, message: "Admin created successfully", saveِAdmin :  saveِAdmin});
  } else {
    return res.status(400).json({ ok: false, message: "Something went wrong" });
  }
});

/**-------------------------------------
 *  @dec login admin
 * @route /api/admins/login
 * @method POST
 * @access private (admin only)
 -------------------------------------*/
const loginAdminController = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await Admins.findOne({ email: email });
  if (!findAdmin) {
    return res.status(400).json({ ok: false, message: "Admin doesn't exist" });
  }
  if (findAdmin.isAdmin) {
    const comparePassowrd = await bcrypt.compare(password, findAdmin.password);
    if (comparePassowrd) {
      const token = JWT.sign(
        { id: findAdmin._id, isAdmin: findAdmin.isAdmin },
        process.env.JWT_SECRET
      );
      return res.status(200).json({
        ok: true,
        id: findAdmin._id,
        name: findAdmin.name,
        token: token,
      });
    } else {
      return res
        .status(400)
        .json({ ok: false, message: "Password doesn't match" });
    }
  } else {
    return res.status(400).json({ ok: false, message: "Only admin" });
  }
});

/**-------------------------------------
 *  @dec get all admins
 * @route /api/admins/get/all
 * @method GET
 * @access private (admin only)
 -------------------------------------*/
const getAllAdminsController = expressAsyncHandler(async (req, res) => {
  const admins = await Admins.find({})
    .sort({ createdAt: -1 })
    .select("-password");
  return res.status(200).json({ ok: true, data: admins });
});

/**-------------------------------------
 *  @dec delete admin
 * @route /api/admins/delete/:adminId
 * @method DELETE
 * @access private (admin only)
 -------------------------------------*/
const deleteAdminController = expressAsyncHandler(async (req, res) => {
  const findAdmin = await Admins.findById(req.params.adminId);
  if (!findAdmin) {
    return res.status(400).json({ ok: false, message: "Admin doesn't exist" });
  }
  await Admins.findByIdAndDelete(req.params.adminId);
  return res
    .status(200)
    .json({ ok: true, message: "Admin deleted successfully" });
});

module.exports = {
  addAdminController,
  loginAdminController,
  getAllAdminsController,
  deleteAdminController,
};
