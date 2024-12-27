const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const env = require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const authRoute = require("./routes/auth");
const mainAdminRoutes = require("./routes/mainAdmin");
const guestRoutes = require("./routes/guest");
const guestAdminRoutes = require("./routes/guestAdmin");
const path = require("path");
const authStaticRoutes = require("./routes/authStaticRoutes");
const roleBasedDashboard = require("./routes/roleBasedDashboards");
const verifyToken = require("./middleware/auth");
const verifyRole = require("./middleware/roleMiddleware");
// CONNECT DB
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

// config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use("/api/auth", authRoute);
app.use("/main-admin", verifyToken, verifyRole("main-admin"), mainAdminRoutes);
app.use("/guest", guestRoutes);
app.use(
  "/guest-admin",
  verifyToken,
  verifyRole("guest-admin"),
  guestAdminRoutes
);
app.use("/user", authStaticRoutes);
app.use("/", roleBasedDashboard);
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
