const hotelModel = require("../models/hotel");
const QrCode = require("qrcode");
const cloudinary = require("cloudinary").v2;
const { v4: uuid } = require("uuid");

// Function to upload an image to Cloudinary
const uploadToCloudinary = async (buffer) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: uuid(), resource_type: "image" },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      uploadStream.end(buffer);
    });
    return result.secure_url;
  } catch (error) {
    throw new Error("Cloudinary upload failed");
  }
};

// @desc Add new hotel
// @route POST /main-admin/add-hotel
const addHotel = async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name || !address) {
      return res.status(400).json({ error: "All fields are mandatory" });
    }

    const newHotel = new hotelModel({ name, address });
    if (req.file) {
      newHotel.logo = await uploadToCloudinary(req.file.buffer);
    }

    // Generate QR Code
    const url = `${req.protocol}://${req.get("host")}/guest/${newHotel._id}`;
    newHotel.qrCode = await QrCode.toDataURL(url);

    await newHotel.save();

    const hotels = await hotelModel.find({});
    return res.status(201).render("mainAdminDashboard", {
      hotels,
      msg: `${newHotel.name} added successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error", details: error });
  }
};

// @desc Show all hotels
// @route GET /main-admin/hotels
const showHotels = async (req, res) => {
  try {
    const hotels = await hotelModel.find({});
    return res.status(200).render("mainAdminDashboard", { hotels });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error });
  }
};

// @desc Show hotel detail
// @route GET /main-admin/hotel/:hotelId/show
const showHotel = async (req, res) => {
  try {
    const hotel = await hotelModel.findById(req.params.hotelId);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    return res.status(200).render("viewHotel", { hotel });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error });
  }
};

// @desc Edit hotel detail (Render edit page)
// @route GET /main-admin/hotel/:hotelId/edit
const editHotel = async (req, res) => {
  try {
    const hotel = await hotelModel.findById(req.params.hotelId);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    return res.status(200).render("editHotel", { hotel });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error });
  }
};

// @desc Update hotel details
// @route PUT /main-admin/hotel/:hotelId/update
const updateHotel = async (req, res) => {
  try {
    let hotel = await hotelModel.findById(req.params.hotelId);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    // Update hotel details
    hotel = await hotelModel.findByIdAndUpdate(req.params.hotelId, req.body, {
      new: true,
    });

    // Upload new logo if present
    if (req.file) {
      hotel.logo = await uploadToCloudinary(req.file.buffer);
      await hotel.save();
    }

    const hotels = await hotelModel.find({});
    return res.status(200).render("mainAdminDashboard", {
      msg: `${hotel.name} updated successfully`,
      hotels,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error });
  }
};

// @desc Generate hotel QR Code
// @route GET /main-admin/hotel/:hotelId/qrcode
const generateQrCode = async (req, res) => {
  try {
    const hotel = await hotelModel.findById(req.params.hotelId);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    return res.status(200).render("qrcode", { hotel });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error });
  }
};

// @desc Delete hotel
// @route DELETE /main-admin/hotel/:hotelId/delete
const deleteHotel = async (req, res) => {
  try {
    const hotel = await hotelModel.findById(req.params.hotelId);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    await hotelModel.findByIdAndDelete(req.params.hotelId);

    const hotels = await hotelModel.find({});
    return res.status(200).render("mainAdminDashboard", {
      msg: `${hotel.name} deleted successfully`,
      hotels,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error });
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
