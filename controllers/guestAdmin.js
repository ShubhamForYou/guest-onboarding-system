const hotelModel = require("../models/hotel");
const guestModel = require("../models/guest");
//@desc view guests hotel wise
//@route GET /guest-admin/:hotelId/guests
// @access public
const viewGuests = async (req, res) => {
  const hotelId = req.params.hotelId;
  try {
    const hotel = await hotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json("hotel not found");
    }
    const guests = await guestModel.find({ hotelId });
    if (!guests) {
      return res.status(404).json(" no guest registered yut");
    } else {
      return res.status(200).json(guests);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
//@desc edit guest
//@route GET /guest-admin/:guestId/guest/edit
// @access public
const editGuest = async (req, res) => {
  const guestId = req.params.guestId;
  try {
    const guest = await guestModel.findById(guestId);
    if (!guest) {
      return res.status(404).json("guest not found");
    }
    return res.status(200).json(guest);
  } catch (error) {
    return res.status(500).json(error);
  }
};
//@desc update guest
//@route PUT /guest-admin/:guestId/guest/update
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
    return res.status(200).json(guest);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { viewGuests, editGuest, updateGuest };
