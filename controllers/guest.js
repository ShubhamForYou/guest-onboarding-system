const hotelModel = require("../models/hotel");
const guestModel = require("../models/guest");
// @desc Guest scans QR code for filling form (QR-CODE link URL route)
// @route GET /guest/:hotelID
// @access public
const guestForm = async (req, res) => {
  const hotelId = req.params.hotelId;

  try {
    const hotel = await hotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json("hotel not found");
    }
    return res.status(200).render("guestOnboardingForm", {
      hotel,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
// @desc Guest  form  submit
// @route POST /guest/:hotelID
// @access public
const submitGuestForm = async (req, res) => {
  const hotelId = req.params.hotelId;

  try {
    const hotel = await hotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json("Hotel not found");
    }

    const {
      name,
      mobileNumber,
      address,
      purposeOfVisit,
      stayFromDate,
      stayToDate,
      email,
      idProofNumber,
    } = req.body;
    if (
      !name ||
      !mobileNumber ||
      !address ||
      !purposeOfVisit ||
      !stayFromDate ||
      !stayToDate ||
      !email ||
      !idProofNumber
    ) {
      return res.status(400).json("All fields are mandatory");
    }

    const guest = await guestModel.create({
      hotelId,
      name,
      mobileNumber,
      address,
      purposeOfVisit,
      stayFromDate,
      stayToDate,
      email,
      idProofNumber,
    });

    return res.status(200).render("thankYou", {
      name: guest.name, 
    });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { guestForm, submitGuestForm };
