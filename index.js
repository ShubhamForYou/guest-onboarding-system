const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const env = require("dotenv").config();
const authRoute = require("./routes/auth");
const mainAdminRoutes = require("./routes/mainAdmin");
const guestRoutes = require("./routes/guest");
const guestAdminRoutes = require("./routes/guestAdmin");
const path = require("path");
const staticRoutes = require("./routes/staticRoutes");
// CONNECT DB
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log(err);
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
app.use("/main-admin", mainAdminRoutes);
app.use("/guest", guestRoutes);
app.use("/guest-admin", guestAdminRoutes);
app.use("/", staticRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
