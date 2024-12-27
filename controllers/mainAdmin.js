const hotelModel = require("../models/hotel");
const QrCode = require("qrcode");
const cloudinary = require("cloudinary");
const fs = require("fs");
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
    // upload image to cloudinary and save url
    // Upload file to Cloudinary
    const logo = await cloudinary.uploader.upload(req.file.path);
    console.log("Cloudinary Upload Result:", logo);
    // store logo url in DB
    saveHotel.logo = logo.secure_url;
    await saveHotel.save();
    // Delete file from /public/images after uploading
    await fs.unlinkSync(req.file.path);

    // generate qrcode and save url to db
    const url = `${req.protocol}://${req.get("host")}/guest/${saveHotel._id}`;
    const qrCode = await QrCode.toDataURL(url);
    saveHotel.qrCode = qrCode;
    await saveHotel.save();
    const hotels = await hotelModel.find({});
    if (!hotels) {
      return res.status(400).json("no hotel present in db");
    }

    return res.status(201).render("mainAdminDashboard", { hotels });
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
    return res.status(201).render("mainAdminDashboard", { hotels });
  } catch (error) {
    return res.status(500).json(error);
  }
};
//@desc  show hotel detail
// @route GET /main-admin/hotel/:hotelId/show
// @access public
const showHotel = async (req, res) => {
  const hotelId = req.params.hotelId;
  const hotel = await hotelModel.findById(hotelId);
  try {
    if (!hotel) {
      return res.status(404).json("hotel not found");
    }
    return res.status(200).render("viewHotel", {
      hotel,
    });
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
    return res.status(200).render("editHotel", {
      hotel,
    });
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
    // upload image to cloudinary and save url
    // Upload file to Cloudinary
    const logo = await cloudinary.uploader.upload(req.file.path);
    console.log("Cloudinary Upload Result:", logo);

    // Add logo URL to req.body
    req.body.logo = logo.secure_url;

    // Delete file from /public/images after uploading
    await fs.unlinkSync(req.file.path);

    hotel = await hotelModel.findByIdAndUpdate(hotelId, req.body, {
      new: true,
    });
    const hotels = await hotelModel.find({});
    return res.status(200).render("mainAdminDashboard", {
      msg: `${hotel.name} updated successfully`,
      hotels,
    });
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
//@desc  delete hotel detail
// @route DELETE /main-admin/hotel/:hotelId/delete
// @access public
const deleteHotel = async (req, res) => {
  const hotelId = req.params.hotelId;
  const hotel = await hotelModel.findById(hotelId);
  try {
    if (!hotel) {
      return res.status(404).json("hotel not found");
    }
    await hotelModel.findByIdAndDelete(hotelId);
    const hotels = await hotelModel.find({});
    return res.status(200).render("mainAdminDashboard", {
      msg: `${hotel.name} deleted successfully`,
      hotels,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  addHotel,
  showHotels,
  showHotel,
  editHotel,
  updateHotel,
  generateQrCode,
  deleteHotel,
};
