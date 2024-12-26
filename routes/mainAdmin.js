const express = require("express");
const router = express.Router();
const {
  addHotel,
  showHotels,
  showHotel,
  editHotel,
  updateHotel,
  generateQrCode,
  deleteHotel,
} = require("../controllers/mainAdmin");
router.post("/add-hotel", addHotel);
router.get("/hotels", showHotels);
router.get("/hotel/:hotelId/show", showHotel);
router.get("/hotel/:hotelId/edit", editHotel);
router.post("/hotel/:hotelId/update", updateHotel);
router.get("/hotel/:hotelId/qrcode", generateQrCode);
router.get("/hotel/:hotelId/delete", deleteHotel);
module.exports = router;
