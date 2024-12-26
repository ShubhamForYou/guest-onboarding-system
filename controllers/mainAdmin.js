const hotelModel = require("../models/hotel");
const QrCode = require("qrcode");
//@desc add new hotel
// @route POST /main-admin/add-hotel
// @access public
const addHotel = async (req, res) => {
  const { name, address } = req.body;
  if (!name || !address) {
    return res.status(400).json("all fields are mandatory");
  }
  try {
    const newHotel = new hotelModel({
      name,
      address,
    });
    const saveHotel = await newHotel.save();
    const url = `${req.protocol}://${req.get("host")}/guest/${saveHotel._id}`;
    const qrCode = await QrCode.toDataURL(url);
    saveHotel.qrCode = qrCode;
    await saveHotel.save();

    return res.status(201).json(saveHotel);
  } catch (error) {
    return res.status(500).json(error);
  }
};

//@desc  show all hotels
// @route GET /main-admin/hotels
// @access public

const showHotels = async (req, res) => {
  const hotels = await hotelModel.find({});
  try {
    if (!hotels) {
      return res.status(400).json("no hotel present in db");
    }
    return res.status(200).json(hotels);
  } catch (error) {
    return res.status(500).json(error);
  }
};

//@desc  edit hotel detail
// @route GET /main-admin/hotel/:hotelId/edit
// @access public
const editHotel = async (req, res) => {
  const hotelId = req.params.hotelId;
  const hotel = await hotelModel.findById(hotelId);
  try {
    if (!hotel) {
      return res.status(404).json("hotel not found");
    }
    return res.status(200).json(hotel);
  } catch (error) {
    return res.status(500).json(error);
  }
};
//@desc  update hotel detail
// @route PUT /main-admin/hotel/:hotelId/update
// @access public
const updateHotel = async (req, res) => {
  const hotelId = req.params.hotelId;
  let hotel = await hotelModel.findById(hotelId);
  try {
    if (!hotel) {
      return res.status(404).json("hotel not found");
    }
    hotel = await hotelModel.findByIdAndUpdate(hotelId, req.body, {
      new: true,
    });
    return res.status(200).json(hotel);
  } catch (error) {
    return res.status(500).json(error);
  }
};

//@desc hotel QrCode
// @route GET /main-admin/hotel/:hotelId/qrcode
// @access public
const generateQrCode = async (req, res) => {
  const hotelId = req.params.hotelId;
  try {
    const hotel = await hotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json("hotel not found");
    }
    const qrCodeImage = hotel.qrCode;
    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel QR Code</title>
  </head>
  <body>
    <div> 
      <h1>Hotel QR Code</h1>
      <p>Here is the QR code for the ${hotel.name}:</p>
      <img src="${qrCodeImage}" alt="Hotel QR Code" />
      <button onclick="window.print()">Print QR Code</button>
    </div>
  </body>
  </html>
`;
    return res.status(200).send(html);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  addHotel,
  showHotels,
  editHotel,
  updateHotel,
  generateQrCode,
};
