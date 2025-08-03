require("dotenv").config();
const jwt = require("jsonwebtoken");

function roles(roles) {
  return function check(req, res, next) {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not exists" });
    }
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET_KEY || "nimadur");
      req.user = data;
      if (roles.includes(data.role)) {
        next();
      } else {
        res.status(401).json({ message: "Not permitted" });
      }
    } catch (e) {
      res.status(401).json({ message: "Token wrong" });
    }
  };
}

module.exports = roles;
