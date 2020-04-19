const { removeLocalImage } = require("../middleware");

const express = require("express");
const multer = require("multer");
const Sequelize = require("sequelize");

const db = require("../../../models");
const upload = require("../fileupload");

const router = express.Router();

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
    // console.log("response post data", await posts);
    return res.json(posts);
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

          removeLocalImage("postId", data.postId);

          return db.Image.destroy({
            where: { postId: data.postId },
          }).then(async (destroyResult) => {
            console.log("Image destroy state", destroyResult);
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
        db.Post.findOne({
          order: [["id", "DESC"]],
          include: {
            model: db.User,
            include: {
              model: db.Image,
            },
            attributes: ["username", "id"],
          },
        })
          .then((post) => {
            const hashtag = data.title.split(" ");
            hashtag.forEach(async (hashtag) => {
              if (hashtag.charAt(0) === "#") {
                // console.log(
                //   "hashtag.slice(1)",
                //   hashtag.slice(1),
                //   post.dataValues
                // );
                const createHashtag = db.Hashtag.create({
                  postId: post.dataValues.id,
                  hashtag: hashtag.slice(1),
                });
                console.log("createHashtagState", await createHashtag);
              }
            });

            // console.log("hashtag post", post.dataValues);
            return res.json(post.dataValues);
          })
          .catch((error) => {
            console.error("😡 ", error);
          });
      });
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
      const data = req.query;
      // console.log("update check", data);
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
    return res.send("Login Please! 😱");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.get("/hashtag", async (req, res, next) => {
  console.log("hashtag check  🐳", req.query);

  const data = req.query;
  if (!data.hashtag) {
    console.log("please insert hashtag! 😱");
    return res.send("please insert hashtag! 😱");
  }
  const condition = () => {
    console.log("data check", data);
    if (data.id === undefined) {
      return {};
    }
    console.log("data check op.lt", data);
    return { postId: { [Op.lt]: parseInt(data.id) } };
  };
  return db.Hashtag.findAll({
    where: { hashtag: data.hashtag, ...condition() },
    include: [
      {
        model: db.Post,
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
            attributes: ["username", "nickname", "id"],
            include: [
              {
                model: db.Image,
              },
            ],
          },
        ],
      },
    ],
    order: [["created_at", "DESC"]],
    limit: 5,
  })
    .then(async (posts) => {
      posts.forEach((post) => {
        console.log("include hashtag posts", post.dataValues);
      });
      return res.json(posts);
    })
    .catch((error) => {
      console.error("😡 ", error);
      next(error);
    });
});

module.exports = router;
