const multer = require("multer");
const moment = require("moment");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

const s3 = new aws.S3({
  accessKeyId: "",
  secretAccessKey: "",
  region: "ap-northeast-2",
});

const storage = multerS3({
  s3: s3,
  bucket: "bucketname",
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key(req, file, cb) {
    cb(null, moment().format("YYYYMMDDHHmmss") + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).array("file");

module.exports = upload;
