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

    if (req.file) {
      // The logo is uploaded to Cloudinary and we get the URL
      const logo = req.file; // The logo file uploaded directly to Cloudinary via Multer

      // Store the Cloudinary URL in the database
      saveHotel.logo = logo.secure_url; // `secure_url` contains the full URL of the uploaded image

      // Save the updated hotel document with the logo URL
      await saveHotel.save();
    }

    // generate qrcode and save url to db
    const url = `${req.protocol}://${req.get("host")}/guest/${saveHotel._id}`;
    const qrCode = await QrCode.toDataURL(url);
    saveHotel.qrCode = qrCode;
    await saveHotel.save();
    const hotels = await hotelModel.find({});
    if (!hotels) {
      return res.status(400).json("no hotel present in db");
    }

    return res.status(201).render("mainAdminDashboard", {
      hotels,
      msg: `${saveHotel.name} add successfully`,
    });
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

    // Check if a new logo is uploaded
    if (req.file) {
      // The logo is uploaded to Cloudinary and we get the URL
      const logo = req.file; // The logo file uploaded directly to Cloudinary via Multer

      // Store the Cloudinary URL in the database
      saveHotel.logo = logo.secure_url; // `secure_url` contains the full URL of the uploaded image

      // Save the updated hotel document with the logo URL
      await saveHotel.save();
    }

    // Update the hotel with the new details (including the logo if uploaded)
    hotel = await hotelModel.findByIdAndUpdate(hotelId, req.body, {
      new: true,
    });

    // Find all hotels and return the updated hotel list
    const hotels = await hotelModel.find({});
    return res.status(200).render("mainAdminDashboard", {
      msg: `${hotel.name} updated successfully`,
      hotels,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// @desc hotel QrCode
// @route GET /main-admin/hotel/:hotelId/qrcode
// @access public
const generateQrCode = async (req, res) => {
  const hotelId = req.params.hotelId;

  try {
    const hotel = await hotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json("Hotel not found");
    }

    // Render the qrcode.ejs page and pass hotel data
    return res.status(200).render("qrcode", {
      hotel: hotel,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
