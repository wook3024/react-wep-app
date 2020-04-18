const express = require("express");
const multer = require("multer");
const Sequelize = require("sequelize");

const db = require("../../models");
const upload = require("./fileupload");

const router = express.Router();
const sequlize = db.sequelize;
const Op = Sequelize.Op;

router.get("", async (req, res, next) => {
  try {
    const data = req.query;
    const condition = () => {
      console.log("data check", data);
      if (data.id === undefined) {
        return {};
      }
      console.log("data check op.lt", data);
      return { id: { [Op.lt]: parseInt(data.id) } };
    };
    const posts = await db.Post.findAll({
      where: { ...condition() },
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
      order: [
        ["created_at", "DESC"],
        [db.Comment, "group", "ASC"],
        [db.Comment, "sort", "DESC"],
      ],
      limit: 5,
    });
    console.log("response post data", await posts);
    return res.json(posts);
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.get("/comment", async (req, res, next) => {
  try {
    const data = req.query;
    // console.log("postId check", data);
    const comments = await db.Comment.findAll({
      where: { postId: data.postId },
      order: [["created_at", "DESC"]],
    });
    return res.json(comments);
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/comment/add", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      // console.log("commnet add query check", req.query);
      const data = req.query;
      console.log("data check", data);

      let findLocation = db.Comment.findOne({
        where: {
          postId: data.postId,
          depth: data.depth,
          group: data.group,
        },
        order: [["sort", "DESC"]],
      });

      console.log("findLocation 🐳🐳🐳🐳\n", await findLocation);
      console.log("depth 🐳🐳🐳🐳\n", data.depth);

      const updateCheck = db.Comment.update(
        { sort: sequlize.literal("sort +1") },
        {
          where: {
            postId: data.postId,
            group: data.group,
            sort: {
              [Op.gte]: parseInt(parseInt(data.sort)),
            },
          },
        }
      );

      const sort = parseInt(parseInt(data.sort));
      console.log("updateCheck 🐳🐳🐳🐳", await updateCheck, sort);
      const post = db.Comment.create({
        comment: data.comment,
        postId: data.postId,
        userId: data.userId,
        depth: data.depth,
        sort: sort,
        group: data.group,
      });
      // console.log("commnet add check", await post);
      if (await post) {
        const commentGroup = db.Comment.findAll({
          where: { group: data.group },
          include: [
            {
              model: db.User,
              attributes: ["username", "id", "nickname"],
              include: [{ model: db.Image }],
            },
            { model: db.Like },
            { model: db.Dislike },
          ],
          order: [
            ["group", "ASC"],
            ["sort", "DESC"],
          ],
        });
        console.log("commentGroup", await commentGroup);

        return res.json(commentGroup);
      }
      return res.send("Comment add failure. 😱");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/comment/like", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const data = req.query;
      const userInfo = req.user.dataValues;
      // console.log("Like post", userInfo);
      const checkStatus = db.Like.findOne({
        where: { userId: userInfo.id, commentId: data.commentId },
      });

      console.log("Like post user check", await checkStatus);
      if ((await checkStatus) === null) {
        db.Like.create({
          userId: userInfo.id,
          commentId: data.commentId,
        });
        return res.status(201).send("like");
      }
      db.Like.destroy({
        where: { userId: userInfo.id, commentId: data.commentId },
      });
      return res.status(201).send("unLike");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/comment/likeState", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const data = req.query;
      if (!data.commentId) return res.status(201).send("false");
      console.log("data Info! 😱", data);
      const userInfo = req.user.dataValues;
      const checkStatus = db.Like.findOne({
        where: { userId: userInfo.id, commentId: data.commentId },
      });

      // console.log("Like post user check", await checkStatus);
      if ((await checkStatus) === null) {
        return res.status(201).send("false");
      }
      return res.status(201).send("true");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/comment/dislike", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const data = req.query;
      const userInfo = req.user.dataValues;
      // console.log("Dislike post", userInfo);
      const checkStatus = db.Dislike.findOne({
        where: { userId: userInfo.id, commentId: data.commentId },
      });

      if ((await checkStatus) === null) {
        db.Dislike.create({
          userId: userInfo.id,
          commentId: data.commentId,
        });
        return res.status(201).send("like");
      }
      db.Dislike.destroy({
        where: { userId: userInfo.id, commentId: data.commentId },
      });
      return res.status(201).send("unLike");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/comment/dislikeState", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const data = req.query;
      const userInfo = req.user.dataValues;
      if (!data.commentId) return res.status(201).send("false");
      const checkStatus = db.Dislike.findOne({
        where: { userId: userInfo.id, commentId: data.commentId },
      });
      if ((await checkStatus) === null) {
        return res.status(201).send("false");
      }
      return res.status(201).send("true");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/comment/remove", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const data = req.query;
      const userInfo = req.user.dataValues;
      if (!data.commentId) return res.send("not found! 😱");
      let removeStatus = null;
      if (!data.force) {
        removeStatus = db.Comment.destroy({
          where: { userId: userInfo.id, id: data.commentId },
        });
      } else if (data.force) {
        removeStatus = db.Comment.destroy({
          where: { id: data.commentId },
        });
      }
      console.log("removeStatus", await removeStatus);
      if ((await removeStatus) === 0) {
        return res.send(
          "It's not your comment! or The comment has already been removed.😱"
        );
      }
      const updateCheck = db.Comment.update(
        { sort: sequlize.literal("sort -1") },
        {
          where: {
            postId: data.postId,
            group: data.group,
            sort: {
              [Op.gte]: parseInt(parseInt(data.sort)),
            },
          },
        }
      );

      console.log("updateCheck 🐳🐳🐳🐳", await updateCheck);
      return res.status(201).send("Remove comment success! 🐳");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/comment/change", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const data = req.query;
      const userInfo = req.user.dataValues;
      if (!data.commentId) return res.send("not found! 😱");
      console.log("check data", userInfo.id, data.commentId, data.comment);
      const updateStatus = db.Comment.update(
        { comment: data.comment },
        { where: { userId: userInfo.id, id: data.commentId } }
      );
      console.log("updateStatus", await updateStatus);
      if ((await updateStatus) === 0) {
        return res.send(
          "It's not your comment! or The comment has already been updated.😱"
        );
      }
      return res.status(201).send("Update comment success! 🐳");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/uploadPostImage", (req, res, next) => {
  // console.log("uploda image data 😱😱😱\n", req.file);
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
          // console.log("uploadPostImage data", data);
          return db.Image.destroy({
            where: { postId: data.postId },
          }).then(async (destroyResult) => {
            // console.log(
            //   "Image destroy state",
            //   destroyResult,
            //   data.postId,
            //   (await req).files
            // );
            if (!(await req).files[0]) {
              return res.send("Upload Complete! 🐳");
            }
            (await req).files.forEach((file) => {
              console.log("file info", file.filename);
              // console.log("file.path", file);
              db.Image.create({
                postId: data.postId ? data.postId : null,
                filename: file.filename,
                userId: data.userId ? data.userId : null,
              });
            });
            const imageFiles = (await req).files;
            req = null;
            return res.json(imageFiles);
          });
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
            const imageCheck = db.Image.findOne({
              where: { userId: req.query.userId },
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

router.post("/publish", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const user = req.user.dataValues;
      const data = req.query;

      //비동기 작업을 위해 작성한 구문
      return db.Post.create({
        userId: user.id,
        title: data.title,
        content: data.content,
        updated_at: data.now,
      }).then(async () => {
        return res.json(
          await db.Post.findOne({
            order: [["id", "DESC"]],
            include: {
              model: db.User,
              include: {
                model: db.Image,
              },
              attributes: ["username", "id"],
            },
          })
        );
      });
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/remove", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const data = req.query;
      // console.log("remove proccessiong", data);
      const comment = db.Comment.destroy({
        where: { postId: data.postId },
      });
      console.log("remove comment 🐳🐳🐳🐳\n", await comment);
      const image = db.Image.destroy({
        where: { postId: data.postId },
      });
      console.log("remove image 🐳🐳🐳🐳\n", await image);
      const post = db.Post.destroy({
        where: { userId: data.userId, id: data.postId },
      });
      console.log("remove post 🐳🐳🐳🐳\n", await post);
      if (await post) {
        return res.status(201).send("Post Remove Complete! 🐳");
      }
      return res.send("You do not have permission to delete this post! 😱");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/update", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      // console.log("update check", req.query);
      const data = req.query;
      const post = db.Post.update(
        {
          title: data.title,
          content: data.content,
          updated_at: data.now,
        },
        { where: { id: data.id } }
      );
      // console.log("update post", await post);
      if (await post) {
        return db.Post.findOne({
          where: { id: data.id },
          include: {
            model: db.User,
            include: {
              model: db.Image,
            },
            attributes: ["username", "id"],
          },
        }).then((post) => {
          return res.json(post);
        });
      }
      return res.send("This post has already been removed. 😱");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/user/nicknameChange", async (req, res, next) => {
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

router.post("/user/descriptionChange", async (req, res, next) => {
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

module.exports = router;
