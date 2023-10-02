import multer from "multer";
import path from "path";
import fs from "fs";
import moment from "moment";

const storage = (nameFolder: string) =>
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

const upload = (nameFolder: string) =>
  multer({
    storage: storage(nameFolder),
  });

export default upload;
