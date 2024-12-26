const mongoose = require("mongoose");
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  qrCode: { type: String },
});
const hotelModel = mongoose.model("hotel", hotelSchema);
module.exports = hotelModel;
