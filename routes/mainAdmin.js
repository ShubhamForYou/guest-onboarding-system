const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerForFileUpload");
const {
  addHotel,
  showHotels,
  showHotel,
  editHotel,
  updateHotel,
  generateQrCode,
  deleteHotel,
} = require("../controllers/mainAdmin");
router.post("/add-hotel",upload.single("logo"), addHotel);
router.get("/hotels", showHotels);
router.get("/hotel/:hotelId/show", showHotel);
router.get("/hotel/:hotelId/edit", editHotel);
router.post("/hotel/:hotelId/update",upload.single("logo"), updateHotel);
router.get("/hotel/:hotelId/qrcode", generateQrCode);
router.get("/hotel/:hotelId/delete", deleteHotel);
module.exports = router;
