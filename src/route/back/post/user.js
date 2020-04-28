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

          return (async () => {
            if (!(await req).files[0]) {
              return res.send("Upload failed! 😡");
            }

            removeLocalImage("userId", data.userId);

            return db.Image.destroy({
              where: { userId: data.userId },
            }).then(async (destroyResult) => {
              console.log("Image destroy state", destroyResult);
              (await req).files.forEach(async (file) => {
                console.log("file info", file.location);
                // console.log("file.path", file);
                db.Image.create({
                  postId: data.postId ? data.postId : null,
                  filename: (await req).files[0].location,
                  userId: data.userId ? data.userId : null,
                });
              });
              const imageFiles = (await req).files[0].location;
              return res.json(imageFiles);
            });
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

router.post("/following", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const data = req.query;
      console.log("get following data check", req.query);

      const followingCheck = db.Following.findOne({
        where: { userId: data.userId, targetUserId: data.targetUserId },
      });
      if ((await followingCheck) !== null) {
        return res.status(201).send("following already completed! 😱");
      }

      return db.Following.create({
        userId: data.userId,
        targetUserId: data.targetUserId,
      })
        .then((followingData) => {
          console.log("following result check", followingData.dataValues);
          return res.json(followingData.dataValues);
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

router.post("/scrap", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const data = req.query;
      console.log("get scrap data check", req.query);

      const scrapCheck = db.Scrap.findOne({
        where: { userId: data.userId, postId: data.postId },
      });
      if ((await scrapCheck) !== null) {
        return res.status(201).send("scrap already completed! 😱");
      }

      return db.Scrap.create({
        userId: data.userId,
        postId: data.postId,
      })
        .then((scrapData) => {
          console.log("scrap result check", scrapData.dataValues);
          return res.json(scrapData.dataValues);
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

router.get("/getFollowingData", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      try {
        const user = req.user;
        console.log("getFollwingData set", user.dataValues);

        return db.Following.findAll({
          where: { userId: user.dataValues.id },
          include: [
            {
              model: db.User,
              attributes: [
                "id",
                "username",
                "nickname",
                "description",
                "age",
                "created_at",
              ],
            },
          ],
        }).then((getFollowingData) => {
          console.log("get following data", getFollowingData);
          return res.json(getFollowingData);
        });
      } catch (error) {
        console.error("😡 ", error);
        next(error);
      }
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.get("/getScrapData", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      try {
        const user = req.user;
        console.log("getFollwingData set", user.dataValues);

        return db.Scrap.findAll({
          where: { userId: user.dataValues.id },
          include: [
            {
              model: db.Post,
              include: [
                {
                  model: db.User,
                  attributes: [
                    "id",
                    "username",
                    "nickname",
                    "description",
                    "created_at",
                  ],
                },
              ],
            },
          ],
        }).then((getScrapData) => {
          console.log("get Scrap data", getScrapData);
          return res.json(getScrapData);
        });
      } catch (error) {
        console.error("😡 ", error);
        next(error);
      }
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/unfollowing", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      try {
        const user = req.user;
        const data = req.query;
        console.log("getFollwingData set", user.dataValues);

        return db.Following.destroy({
          where: { userId: user.id, targetUserId: data.userId },
        }).then((state) => {
          if (state !== null) {
            return res.status(201).send("unFollowing succsess! 🐳");
          }
          return res.send("unFollowing failed! 😱");
        });
      } catch (error) {
        console.error("😡 ", error);
        next(error);
      }
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/unScrap", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      try {
        const user = req.user;
        const data = req.query;
        console.log("getFollwingData set", user.dataValues);

        return db.Scrap.destroy({
          where: { userId: user.id, postId: data.postId },
        }).then((state) => {
          if (state !== null) {
            return res.status(201).send("unFollowing succsess! 🐳");
          }
          return res.send("unFollowing failed! 😱");
        });
      } catch (error) {
        console.error("😡 ", error);
        next(error);
      }
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/notification/delete", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const data = req.query;
      // console.log("remove proccessiong", data);
      const notification = db.Notification.destroy({
        where: { id: data.id },
      });
      console.log("remove notification 🐳\n", await notification);
    }
    return res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

module.exports = router;
