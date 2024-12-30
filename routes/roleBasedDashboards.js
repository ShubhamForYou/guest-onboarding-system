const express = require("express");
const router = express.Router();
const hotelModel = require("../models/hotel");
const verifyToken = require("../middleware/auth");
const verifyRole = require("../middleware/roleMiddleware");
// @desc main- admin- dashboard
// @route GET /main-admin-dashboard
// @access private
router.get(
  "/main-admin-dashboard",
  verifyToken,
  verifyRole("main-admin"),
  async (req, res) => {
    const hotels = await hotelModel.find({});
    return res.render("mainAdminDashboard", { hotels });
  }
);
// @desc main- admin- dashboard
// @route GET /guest-admin-dashboard
// @access private
router.get(
  "/guest-admin-dashboard",
  verifyToken,
  verifyRole("guest-admin"),
  async (req, res) => {
    const hotels = await hotelModel.find({});
    return res.render("guestAdminDashboard", { hotels });
  }
);

router.get("/", (req, res) => {
  return res.render("login");
});
module.exports = router;
