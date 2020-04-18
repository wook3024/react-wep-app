const db = require("../../models");
const fs = require("fs");
const path = require("path");

const removeLocalImage = (target, value) => {
  (() => {
    if (target === "postId") {
      return db.Image.findAll({
        where: { postId: value },
      });
    } else if (target === "userId") {
      return db.Image.findAll({
        where: { postId: value },
      });
    } else {
      console.error("😡 ", "target not found");
    }
  })().then((res) => {
    res.forEach((image) => {
      console.log("find image 🐳🐳", image.dataValues.filename);
      fs.unlink(
        path.join(
          __dirname,
          `../../../public/images/${image.dataValues.filename}`
        ),
        (error) => {
          if (error) {
            console.error("😡 ", error);
            return;
          }
          console.log("File deleted! 🐳");
        }
      );
    });
  });
};

module.exports = { removeLocalImage };
