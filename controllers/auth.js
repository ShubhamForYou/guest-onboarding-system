const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// @desc user register
// @route POST /api/auth/signin
// @access public
const signin = async (req, res) => {
  const { username, role, password } = req.body;
  try {
    if (!username || !role || !password) {
      return res.status(400).json("all fields are mandatory");
    }
    if (await userModel.findOne({ username })) {
      return res.status(400).json(`${username} already registered`);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      username,
      role,
      password: hashPassword,
    });
    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
  }
};
// @desc user login
// @route POST /api/auth/login
// @access public
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json("all fields are mandatory");
    }
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).json("user not found");
    }
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        id: user._id,
        username: user.username,
        role: user.role,
      };
      const token = await jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.cookie.auth = token;
      return res.status(200).json(token);
    } else {
      return res.status(401).json("Incorrect username or password");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { signin, login };
