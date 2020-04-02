const express = require("express");

const db = require("../../models");

const router = express.Router();

router.get("", async (req, res, next) => {
  try {
    const posts = await db.Post.findAll({
      where: {},
      order: [["created_at", "DESC"]],
      attributes: ["id", "userId", "title", "content", "created_at"]
    });

    return res.json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/publish", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const user = req.user.dataValues;
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
      const post = db.Post.destroy({
        where: { id: req.query.id }
      });
      console.log("remove post", await post);
      if (await post) {
        return res.status(201).send("Post Remove Complete! 🐳");
      }
      return res.send("This post has already been removed. 😱");
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
      const post = db.Commnet.create({
        comment: data.commnet,
        postId: data.postId
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
