const authorizedRole = (allowedRole) => {
  return (req, res, next) => {
    if (allowedRole === req.user.role) {
      return next();
    } else {
      res.status(401).json({ err: "user is not authorized to access this" });
    }
  };
};

module.exports = authorizedRole;
