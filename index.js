const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const env = require("dotenv").config();
const authRoute = require("./routes/auth");
const mainAdminRoutes = require("./routes/mainAdmin");
const guestRoutes = require("./routes/guest");
const guestAdminRoutes = require("./routes/guestAdmin");
// CONNECT DB
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use("/api/auth", authRoute);
app.use("/main-admin", mainAdminRoutes);
app.use("/guest", guestRoutes);
app.use("/guest-admin", guestAdminRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
