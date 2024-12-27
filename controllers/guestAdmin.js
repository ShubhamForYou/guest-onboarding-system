const hotelModel = require("../models/hotel");
const guestModel = require("../models/guest");
//@desc View guests hotel-wise
//@route GET /guest-admin/:hotelId/guests
//@access public
const viewGuests = async (req, res) => {
  const hotelId = req.params.hotelId;
  try {
    const hotel = await hotelModel.findById(hotelId); // Corrected query
    if (!hotel) {
      return res.status(404).json("Hotel not found");
    }
    const guests = await guestModel.find({ hotelId: hotelId });

    return res.status(200).render("hotelGuests", {
      guests,
      hotel,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

//@desc View guest details
//@route GET /guest-admin"/:guestId/guest/edit"
//@access public
const viewGuest = async (req, res) => {
  const guestId = req.params.guestId;

  try {
    const guest = await guestModel.findById(guestId);

    if (!guest) {
      return res.status(404).json("Guest not found");
    }
    const hotel = await hotelModel.findById(guest.hotelId);
    return res.render("viewGuest", { guest, hotel });
  } catch (error) {
    return res.status(500).json(error);
  }
};

//@desc Edit guest
//@route GET /guest-admin/:guestId/guest/edit
//@access public
const editGuest = async (req, res) => {
  const guestId = req.params.guestId;
  try {
    const guest = await guestModel.findById(guestId);
    if (!guest) {
      return res.status(404).json("Guest not found");
    }
    return res.render("editGuest", { guest });
  } catch (error) {
    return res.status(500).json(error);
  }
};

//@desc update guest
//@route POSTs /guest-admin/:guestId/guest/update
// @access public
const updateGuest = async (req, res) => {
  const guestId = req.params.guestId;
  try {
    let guest = await guestModel.findById(guestId);
    if (!guest) {
      return res.status(404).json("guest not found");
    }
    guest = await guestModel.findByIdAndUpdate(guestId, req.body, {
      new: true,
    });

    const hotel = await hotelModel.findById(guest.hotelId);
    return res.status(200).render("viewGuest", {
      guest,
      hotel,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { viewGuests, viewGuest, editGuest, updateGuest };
