const express = require("express");
const router = express.Router();
const { guestForm, submitGuestForm } = require("../controllers/guest");

router.route("/:hotelId").get(guestForm).post(submitGuestForm);

module.exports = router;
