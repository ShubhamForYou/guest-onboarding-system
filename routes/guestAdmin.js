const express = require("express");
const router = express.Router();
const {
  viewGuests,
  viewGuest,
  editGuest,
  updateGuest,
} = require("../controllers/guestAdmin");
router.get("/:hotelId/guests", viewGuests);
router.get("/:guestId/guest/view", viewGuest);
router.get("/:guestId/guest/edit", editGuest);
router.post("/:guestId/guest/update", updateGuest);

module.exports = router;
