const multer = require("multer");
const moment = require("moment");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const path = require("path");

AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: "",
  secretAccessKey: "",
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "/home/swook/Documents/javascript/react-web-app/public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, moment().format("YYYYMMDDHHmmss") + "_" + file.originalname);
//   },
// });

const upload = multerS3({
  s3: new AWS.S3(),
  bucket: "swook-react-web-app",
  key(req, file, cb) {
    cb(null, `original/${+new Date()}${path.basename(file.originalname)}`);
  },
});

module.exports = upload;
