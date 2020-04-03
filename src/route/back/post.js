const express = require("express");

const db = require("../../models");

const router = express.Router();

router.get("", async (req, res, next) => {
  try {
    const posts = await db.Post.findAll({
      where: {},
      include: [
        {
          model: db.Comment,
          order: [["created_at", "DESC"]],
          include: [
            {
              model: db.Like
            },
            {
              model: db.Dislike
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]],
      attributes: ["id", "userId", "title", "created_at"]
    });

    return res.json(posts);
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.get("/comment", async (req, res, next) => {
  try {
    const data = req.query;
    console.log("postId check", data);
    const comments = await db.Comment.findAll({
      where: { postId: data.postId },
      order: [["created_at", "DESC"]],
      attributes: ["id", "comment", "username", "created_at"]
    });
    return res.json(comments);
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/comment/like", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const data = req.query;
      const userInfo = req.user.dataValues;
      console.log("Like post", userInfo);
      const checkStatus = db.Like.findOne({
        where: { userId: userInfo.id, commentId: data.commentId }
      });

      console.log("Like post user check", await checkStatus);
      if ((await checkStatus) === null) {
        db.Like.create({
          userId: userInfo.id,
          commentId: data.commentId
        });
        return res.status(201).send("like");
      }
      db.Like.destroy({
        where: { userId: userInfo.id, commentId: data.commentId }
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
      const userInfo = req.user.dataValues;
      const checkStatus = db.Like.findOne({
        where: { userId: userInfo.id, commentId: data.commentId }
      });

      console.log("Like post user check", await checkStatus);
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
      console.log("Dislike post", userInfo);
      const checkStatus = db.Dislike.findOne({
        where: { userId: userInfo.id, commentId: data.commentId }
      });

      if ((await checkStatus) === null) {
        db.Dislike.create({
          userId: userInfo.id,
          commentId: data.commentId
        });
        return res.status(201).send("like");
      }
      db.Dislike.destroy({
        where: { userId: userInfo.id, commentId: data.commentId }
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
      const checkStatus = db.Dislike.findOne({
        where: { userId: userInfo.id, commentId: data.commentId }
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

router.post("/publish", async (req, res, next) => {
  const user = req.user.dataValues;
  try {
    if (req.isAuthenticated()) {
      const data = req.query;
      console.log("create post", user, data);
      db.Post.create({
        userId: user.id,
        title: data.title,
        content: data.content
      });

      return res.status(201).send("Post Create Complete! 🐳");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/remove", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const data = req.query;
      console.log("remove proccessiong", data);
      const post = db.Post.destroy({
        where: { userId: data.userId, id: data.postId }
      });
      console.log("remove post", await post);
      if (await post) {
        return res.status(201).send("Post Remove Complete! 🐳");
      }
      return res.send("You do not have permission to delete this post! 😱");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/update", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      console.log("update check", req.query);
      const post = db.Post.update(
        { title: req.query.title, content: req.query.content },
        { where: { id: req.query.id } }
      );
      console.log("update post", await post);
      if (await post) {
        return res.status(201).send("Post Update Complete! 🐳");
      }
      return res.send("This post has already been removed. 😱");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/comment/add", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      console.log("commnet add query check", req.query);
      const data = req.query;
      const post = db.Comment.create({
        comment: data.comment,
        postId: data.postId,
        username: data.username
      });
      console.log("commnet add check", await post);
      if (await post) {
        return res.status(201).send("Comment add Complete! 🐳");
      }
      return res.send("Comment add failure. 😱");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
