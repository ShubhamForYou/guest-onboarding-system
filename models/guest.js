const mongoose = require("mongoose");
const guestSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "hotel",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  purposeOfVisit: { type: String, required: true },
  stayFromDate: { type: Date, required: true },
  stayToDate: { type: Date, required: true },
  email: { type: String, required: true },
  idProofNumber: { type: String, required: true },
});
const guestModel = mongoose.model("guest", guestSchema);

module.exports = guestModel;
