const multer = require("multer");
const path = require("path");
const moment = require("moment");
const fs = require("fs");

const storage = (nameFolder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const pathDir = path.join(__dirname, "..", "..", "public", nameFolder);
      if (!fs.existsSync(pathDir)) {
        fs.mkdirSync(pathDir);
      }
      cb(null, pathDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = moment().unix();
      cb(null, uniqueSuffix + file.originalname);
    },
  });

const upload = (nameFolder) =>
  multer({
    storage: storage(nameFolder),
  });

module.exports = { upload };
