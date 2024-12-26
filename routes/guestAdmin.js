const express = require("express");
const router = express.Router();
const {
  viewGuests,
  editGuest,
  updateGuest,
} = require("../controllers/guestAdmin");
router.get("/:hotelId/guests", viewGuests);
router.get("/:guestId/guest/edit", editGuest);
router.put("/:guestId/guest/update", updateGuest);

module.exports = router;
