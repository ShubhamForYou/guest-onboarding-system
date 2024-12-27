const userModel = require("../models/user");
// delete after apply role-middleware
const hotelModel = require("../models/hotel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc user register
// @route POST /api/auth/signin
// @access public
const signin = async (req, res) => {
  const { name, email, role, password } = req.body;
  try {
    if (!name || !email || !role || !password) {
      return res.status(400).render("signin", {
        err: "all fields are mandatory",
      });
    }
    if (await userModel.findOne({ email })) {
      return res.status(400).render("login", {
        err: "already registered",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name,
      email,
      role,
      password: hashPassword,
    });
    return res.status(201).render("login");
  } catch (error) {
    return;
  }
};
// @desc user login
// @route POST /api/auth/login
// @access public
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).render("login", {
        err: "All fields are mandatory",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).render("signin", {
        err: "User not found!",
      });
    }
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      const token = await jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      // Check role and render the appropriate dashboard
      if (user.role === "main-admin") {
        return res.status(200).redirect("/main-admin-dashboard");
      } else if (user.role === "guest-admin") {
        return res.status(200).redirect("/guest-admin-dashboard");
      } else {
        return res.status(200).render("login", { err: "Unauthorized role" });
      }
    } else {
      return res
        .status(401)
        .render("login", { err: "Incorrect email or password" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).render("login", { err: "Server error" });
  }
};

module.exports = { signin, login };
