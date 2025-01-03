const express = require("express");
const router = express.Router();

const { signin, login, logout } = require("../controllers/auth");
router.post("/signin", signin);
router.post("/login", login);
router.get("/logout", logout);
module.exports = router;
