const hotelModel = require("../models/hotel");
const QrCode = require("qrcode");
const cloudinary = require("cloudinary").v2;
const { v4: uuid } = require("uuid");

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

    // manually upload logo to cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        {
          // folder
          public_id: uuid(),
          resource_type: "image",
        },
        async (err, cloudinaryResult) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Cloudinary upload failed", details: error });
          }
          // save logo url in DB
          saveHotel.logo = cloudinaryResult.secure_url;
          await saveHotel.save();
        }
      );
      // send the file data from memory to Cloudinary
      result.end(req.file.buffer);
    }

    // generate qrcode and save url to db
    // create render url
    const url = `${req.protocol}://${req.get("host")}/guest/${saveHotel._id}`;
    // this will give 16byte string for QRcode
    const qrCode = await QrCode.toDataURL(url);
    // save in DB
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

    // Update the hotel with the new details (including the logo if uploaded)
    hotel = await hotelModel.findByIdAndUpdate(hotelId, req.body, {
      new: true,
    });

    //logo if present store to cloudinary and url to DB
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        {
          public_id: uuid(),
          resource_type: "image",
        },
        async (err, cloudinaryResult) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Cloudinary upload failed", details: error });
          }
          // save to DB
          hotel.logo = cloudinaryResult.secure_url;
          await hotel.save();
        }
      );
      result.end(req.file.buffer);
    }

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
