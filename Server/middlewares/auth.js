const jwt = require("jsonwebtoken");
const SECRET_KEY =
  "b2902047568d75506938e4f2dd9a7a25dd1f31ba8de2c04705c6bf7ce9c9663aa1df9fd4c2b8f1cf56d7bfe4beec4e75cfd6d935e162069ecc0eccfef9816dfd";

  const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.userId = decoded.id;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };

module.exports = auth;
