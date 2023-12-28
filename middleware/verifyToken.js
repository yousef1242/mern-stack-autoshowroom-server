const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decodedPlayload = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = decodedPlayload;
      next();
    } catch (error) {
      return res.status(401).json({ ok: false, message: "no token provided" });
    }
  } else {
    return res
      .status(401)
      .json({ ok: false, message: "invalid token, access deniend" });
  }
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.admin.isAdmin) {
      next();
    } else {
      return res.status(403).json({ ok: false, message: "Only admin" });
    }
  });
};

module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
}
