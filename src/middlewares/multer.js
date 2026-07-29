const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const prefix = Date.now() + "-" + Math.round(Math.random() * 1000);
    cb(null, (prefix + "-" + file.originalname).replaceAll(" ", "-"));
  },
});

const limits = { fileSize: 5 * 1024 * 1024 };

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|webp/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png, webp) are allowed!"));
  }
};

exports.upload = multer({ storage, limits, fileFilter });
