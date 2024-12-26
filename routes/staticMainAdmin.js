const express = require("express");
const router = express.Router();
// @desc main- admin- dashboard
// @route GET /main/main-admin-dashboard
// @access public
router.get("/main-admin-dashboard", (req, res) => {
  return res.render("mainAdminDashboard");
});

module.exports = router;
