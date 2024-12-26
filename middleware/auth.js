const jwt = require("jsonwebtoken");
const verifyToken = async (req, res, next) => {
  const token = req.cookies.auth;
  if (token) {
    if (
      await jwt.verify(token, process.env.TOKEN_SECRET, (err, decode) => {
        if (err) {
          return res.status(401).json("user is not authorized");
        }
        req.user = decoded;
        return next();
      })
    ) {
    }
  } else {
    return res.status(404).json("login first");
  }
};

module.exports = verifyToken;
