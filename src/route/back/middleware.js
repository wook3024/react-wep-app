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
  })()
    .then((res) => {
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
            console.log("File deleted! 🐳", image.dataValues.filename);
          }
        );
      });
    })
    .catch((error) => {
      console.error("😡 ", error);
    });
};

const findAllPostElement = () => {
  return {
    include: [
      {
        model: db.Comment,
        include: [
          {
            model: db.Like,
          },
          {
            model: db.Dislike,
          },
          {
            model: db.User,
            include: [
              {
                model: db.Image,
              },
            ],
          },
        ],
      },
      {
        model: db.Image,
      },
      {
        model: db.User,
        include: [
          {
            model: db.Image,
          },
        ],
        attributes: ["username", "id"],
      },
    ],
  };
};

const findAllCommentElement = () => {
  return {
    include: [
      {
        model: db.Like,
      },
      {
        model: db.Dislike,
      },
      {
        model: db.User,
        include: [
          {
            model: db.Image,
          },
        ],
      },
    ],
  };
};
module.exports = {
  removeLocalImage,
  findAllPostElement,
  findAllCommentElement,
};
