const jwt = require("jsonwebtoken");
const verifyToken = async (req, res, next) => {
  const token = req.cookies.auth;
  if (token) {
    if (
      await jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .render("login", { err: "user is not authorized" });
        }
        req.user = decoded;
        return next();
      })
    ) {
    }
  } else {
    return res.status(404).render("login", { err: "login first" });
  }
};

module.exports = verifyToken;
