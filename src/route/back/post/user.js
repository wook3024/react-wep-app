const { removeLocalImage } = require("../middleware");

const express = require("express");
const multer = require("multer");

const db = require("../../../models");
const upload = require("../fileupload");

const router = express.Router();

router.post("/nicknameChange", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      console.log("update check", req.query);
      return db.User.update(
        { nickname: req.query.changeToNickname },
        { where: { id: req.query.id } }
      )
        .then(async () => {
          return res.json(
            await db.User.findOne({
              where: { id: req.query.id },
              include: [
                {
                  model: db.Image,
                },
              ],
              attributes: [
                "username",
                "id",
                "nickname",
                "description",
                "created_at",
              ],
            })
          );
        })
        .catch((error) => {
          console.error("😡 ", error);
          next(error);
        });
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/descriptionChange", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      console.log("update check", req.query);
      return db.User.update(
        { description: req.query.description },
        { where: { id: req.query.id } }
      )
        .then(async () => {
          const user = await db.User.findOne({ where: { id: req.query.id } });
          return res.json(user);
        })
        .catch((error) => {
          console.error("😡 ", error);
          next(error);
        });
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/uploadProfileImage", (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      try {
        upload(req, res, (err) => {
          // console.log("user check", req);
          if (err instanceof multer.MulterError) {
            return next(err);
          } else if (err) {
            return next(err);
          }

          const data = req.query;

          removeLocalImage("userId", data.userId);

          return (async () => {
            if (!(await req).files[0]) {
              return res.send("Upload failed! 😡");
            }
            const imageCheck = db.Image.findOne({
              where: { userId: data.userId },
            });
            console.log("imageCheck", await imageCheck);
            if ((await imageCheck) === null) {
              db.Image.create({
                postId: data.postId ? data.postId : null,
                filename: (await req).files[0].filename,
                userId: data.userId ? data.userId : null,
              });
            } else {
              db.Image.update(
                {
                  filename: (await req).files[0].filename,
                },
                {
                  where: { userId: req.query.userId ? req.query.userId : null },
                }
              );
            }
            return res.json((await req).files[0].filename);
          })();
        });
      } catch (error) {
        console.error("😡 ", error);
        next(error);
      }
    } else {
      res.send("Login Please! 😱");
    }
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

module.exports = router;
