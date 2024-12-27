const multer = require("multer");
const path = require("path");
const shortid = require("shortid");

// multer

const uploadDir = path.join(__dirname, "../public/images");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniquePreffix = shortid.generate();
    cb(null, uniquePreffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
