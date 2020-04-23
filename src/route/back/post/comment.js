const express = require("express");
const Sequelize = require("sequelize");

const db = require("../../../models");
const { findAllCommentElement } = require("../middleware");

const router = express.Router();
const sequlize = db.sequelize;
const Op = Sequelize.Op;

router.get("/", async (req, res, next) => {
  try {
    const data = req.query;
    // console.log("postId check", data);
    const comments = await db.Comment.findAll({
      where: { postId: data.postId },
      ...findAllCommentElement(),
      order: [
        ["group", "ASC"],
        ["sort", "DESC"],
      ],
    });
    return res.json(comments);
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/add", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      // console.log("commnet add query check", req.query);
      const user = req.user.dataValues;
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
        db.Following.findAll({
          where: { targetUserId: user.id },
        }).then((followers) => {
          console.log("followers 😱😡", followers);
          followers.forEach((follower) => {
            db.Notification.create({
              userId: follower.dataValues.userId,
              postId: data.postId,
              username: user.username,
              state: "addReply",
              message: data.comment,
            })
              .then((res) => {
                console.log("create notification", res);
              })
              .catch((error) => {
                console.error("😡 ", error);
              });
          });
        });

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

router.post("/like", async (req, res, next) => {
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

        db.Following.findAll({
          where: { targetUserId: userInfo.id },
        }).then((followers) => {
          console.log("followers 😱😡", followers);
          followers.forEach((follower) => {
            db.Notification.create({
              userId: follower.dataValues.userId,
              postId: data.postId,
              commentId: data.commentId,
              username: userInfo.username,
              state: "like",
              message: data.title,
            })
              .then((res) => {
                console.log("create notification", res);
              })
              .catch((error) => {
                console.error("😡 ", error);
              });
          });
        });

        return res.status(201).send("like");
      }
      db.Like.destroy({
        where: { userId: userInfo.id, commentId: data.commentId },
      });
      db.Notification.destroy({
        where: {
          username: userInfo.username,
          state: "like",
          postId: data.postId,
          commentId: data.commentId,
        },
      });
      return res.status(201).send("unLike");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/likeState", async (req, res, next) => {
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

router.post("/dislike", async (req, res, next) => {
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

        db.Following.findAll({
          where: { targetUserId: userInfo.id },
        }).then((followers) => {
          console.log("followers 😱😡", followers);
          followers.forEach((follower) => {
            db.Notification.create({
              userId: follower.dataValues.userId,
              postId: data.postId,
              commentId: data.commentId,
              username: userInfo.username,
              state: "dislike",
              message: data.title,
            })
              .then((res) => {
                console.log("create notification", res);
              })
              .catch((error) => {
                console.error("😡 ", error);
              });
          });
        });

        return res.status(201).send("like");
      }
      db.Dislike.destroy({
        where: { userId: userInfo.id, commentId: data.commentId },
      });
      db.Notification.destroy({
        where: {
          username: userInfo.username,
          state: "dislike",
          postId: data.postId,
          commentId: data.commentId,
        },
      });
      return res.status(201).send("unLike");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/dislikeState", async (req, res, next) => {
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

router.post("/remove", async (req, res, next) => {
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

router.post("/change", async (req, res, next) => {
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
      db.Following.findAll({
        where: { targetUserId: userInfo.id },
      }).then((followers) => {
        console.log("followers 😱😡", followers);
        followers.forEach((follower) => {
          db.Notification.create({
            userId: follower.dataValues.userId,
            postId: data.postId,
            username: userInfo.username,
            state: "addReply",
            message: data.comment,
          })
            .then((res) => {
              console.log("create notification", res);
            })
            .catch((error) => {
              console.error("😡 ", error);
            });
        });
      });

      return res.status(201).send("Update comment success! 🐳");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

module.exports = router;
