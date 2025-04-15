const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  // return next();
  if (req.url.startsWith("/public")) {
    return next();
  }
  // const token = req.headers["x-access-token"];
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2N2U2YmUyMjU4YTBmMDczNzlmYTgwYjMiLCJ1c2VybmFtZSI6IkNpZ2FuIiwidXNlcnJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ0NzE0MjE0fQ.7lI6C3OQig9Rk6Fhkqx1Lc4CC91Q2rPQEYTg_LjiDwE";
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
