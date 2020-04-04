const multer = require("multer");
const moment = require("moment");

const storage = multer.diskStorage({
  //create-react-app의 public폴터에 이미지를 저장시 페이지가 refresh되는
  //현상이 나타난다. 현재 해결방법 찾지 못해 src폴더에 이미지를 저장하고
  //불러올 때 require를 사용하는 중
  destination: (req, file, cb) => {
    cb(null, "/home/swook/Documents/javascript/react-web-app/src/images");
  },
  filename: (req, file, cb) => {
    cb(null, moment().format("YYYYMMDDHHmmss") + "_" + file.originalname);
  }
});

const upload = multer({ storage: storage }).array("file");

module.exports = upload;
