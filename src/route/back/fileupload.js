const multer = require("multer");
const moment = require("moment");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/home/swook/Documents/javascript/react-web-app/src/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, moment().format("YYYYMMDDHHmmss") + "_" + file.originalname);
  }
});

const upload = multer({ storage: storage }).array("file");

module.exports = upload;
