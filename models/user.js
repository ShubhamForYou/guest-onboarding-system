const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["main-admin", "gust-admin"],
  },
  password: {
    type: String,
    required: true,
  },
});
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
