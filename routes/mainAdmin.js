const express = require("express");
const router = express.Router();
const {
  addHotel,
  showHotels,
  editHotel,
  updateHotel,
  generateQrCode,
} = require("../controllers/mainAdmin");
router.post("/add-hotel", addHotel);
router.get("/hotels", showHotels);
router.get("/hotel/:hotelId/edit", editHotel);
router.put("/hotel/:hotelId/update", updateHotel);
router.get("/hotel/:hotelId/qrcode", generateQrCode);

module.exports = router;
