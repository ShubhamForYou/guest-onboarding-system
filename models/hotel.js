const mongoose = require("mongoose");
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  logo: {
    type: String,
    default:
      "https://res.cloudinary.com/de1zpahuu/image/upload/v1735280322/vjpech1vdjz5s7mwnzpw.png",
  },
  qrCode: { type: String },
});
const hotelModel = mongoose.model("hotel", hotelSchema);
module.exports = hotelModel;
