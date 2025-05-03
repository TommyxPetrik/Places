const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  if (req.url.startsWith("/public")) {
    return next();
  }
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({ message: "Chyba overenia totožnosti" });
  }
  try {
    const decoded = jwt.verify(token, process.env.API_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Chyba overenia totožnosti" });
  }
};

module.exports = authMiddleware;
