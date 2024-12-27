const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary");
const shortid = require("shortid");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// multer

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: "hotels", // Folder name in Cloudinary
      format: (req, file) => {
        // Automatically determine format based on file type
        if (file.mimetype === "image/png") {
          return "png"; // If the file is PNG
        } else {
          return "jpeg"; // Default to JPEG
        }
      },
      public_id: shortid.generate() + "-" + file.originalname, // Unique ID for file name
    };
  },
});

// Create Multer upload middleware
const upload = multer({ storage: storage });

module.exports = upload;

// first store in "../public/images" then -> cloudinary -> delete for  "../public/images"
/*const uploadDir = path.join(__dirname, "../public/images");
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

module.exports = upload;*/
