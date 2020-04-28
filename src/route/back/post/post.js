const {
  removeLocalImage,
  findAllPostElement,
  setPersonalMessage,
} = require("../middleware");

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
      ...findAllPostElement(),
      order: [
        ["created_at", "DESC"],
        [db.Comment, "group", "ASC"],
        [db.Comment, "sort", "DESC"],
      ],
      limit: 3,
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
              console.log("file info", file, file.location);
              // console.log("file.path", file);
              db.Image.create({
                postId: data.postId ? data.postId : null,
                location: file.location,
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

      console.log("user", user);
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
            setPersonalMessage(user, data);

            const hashtag = data.title.split(" ");
            hashtag.forEach(async (tag) => {
              if (tag.charAt(0) === "#") {
                const createHashtag = db.Hashtag.create({
                  postId: post.dataValues.id,
                  hashtag: tag.slice(1),
                });
                const createSearchtag = db.Searchtag.create({
                  postId: post.dataValues.id,
                  searchtag: tag.slice(1),
                });
                console.log(
                  "createTagState",
                  await createHashtag,
                  await createSearchtag
                );
              }
              const createSearchtag = db.Searchtag.create({
                postId: post.dataValues.id,
                searchtag: tag,
              });
              console.log("createSearchTagState", await createSearchtag);
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
      const user = req.user.dataValues;
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
          console.log("update post data 🐳", post);

          setPersonalMessage(user, data);

          const removeHashtag = db.Hashtag.destroy({
            where: { postId: post.dataValues.id },
          });
          console.log("removeHashtag 🐳", removeHashtag);

          const removeSearchtag = db.Searchtag.destroy({
            where: { postId: post.dataValues.id },
          });
          console.log("removeSearchtag 🐳", removeSearchtag);

          const hashtag = data.title.split(" ");
          hashtag.forEach(async (tag) => {
            if (tag.charAt(0) === "#") {
              const createHashtag = db.Hashtag.create({
                postId: post.dataValues.id,
                hashtag: tag.slice(1),
              });
              const createSearchtag = db.Searchtag.create({
                postId: post.dataValues.id,
                searchtag: tag.slice(1),
              });

              console.log(
                "createTag 🐳",
                await createHashtag,
                await createSearchtag
              );
            }
            const createSearchtag = db.Searchtag.create({
              postId: post.dataValues.id,
              searchtag: tag,
            });
            console.log("createSearchTagState", await createSearchtag);
          });
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

      removeLocalImage("postId", data.postId);

      const notification = db.Notification.destroy({
        where: { postId: data.postId },
      });
      console.log("remove notification 🐳\n", await notification);
      const hashtag = db.Hashtag.destroy({
        where: { postId: data.postId },
      });
      console.log("remove hashtag 🐳\n", await hashtag);
      const searchtag = db.Searchtag.destroy({
        where: { postId: data.postId },
      });
      console.log("remove searchtag 🐳\n", await searchtag);
      const comment = db.Comment.destroy({
        where: { postId: data.postId },
      });
      console.log("remove comment 🐳\n", await comment);
      const image = db.Image.destroy({
        where: { postId: data.postId },
      });
      console.log("remove image 🐳\n", await image);
      const post = db.Post.destroy({
        where: { userId: data.userId, id: data.postId },
      });
      console.log("remove post 🐳\n", await post);

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
        ...findAllPostElement(),
      },
    ],
    order: [
      ["created_at", "DESC"],
      [db.Post, db.Comment, "group", "ASC"],
      [db.Post, db.Comment, "sort", "DESC"],
    ],
    limit: 3,
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

router.get("/searchtag", async (req, res, next) => {
  console.log("searchtag check  🐳", req.query);
  const data = req.query;
  if (!data.content) {
    console.log("please insert content! 😱");
    return res.send("please insert content! 😱");
  }

  const condition = () => {
    console.log("data check", data);
    if (data.id === undefined) {
      return {};
    }
    console.log("data check op.lt", data);
    return { postId: { [Op.lt]: parseInt(data.id) } };
  };

  const searchtag = () => {
    const tag = data.content.split(" ");
    console.log("seatchtag check op.lt", tag);
    return { searchtag: { [Op.or]: tag } };
  };

  return db.Searchtag.findAll({
    where: { ...searchtag(), ...condition() },
    attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("postId")), "postId"]],
  })
    .then(async (postsId) => {
      console.log("#include searchtag postsId", await postsId);
      const postCondition = () => {
        const postSet = postsId.map((postId) => {
          console.log("include searchtag postsId", postId.dataValues);
          return postId.dataValues.postId;
        });

        //해당되는 포스트 없다면 빈 배열 반환
        if (!postSet[0]) {
          return [];
        }

        return { id: { [Op.or]: postSet } };
      };
      console.log("postCondition check", postCondition());

      //해당되는 포스드가 없을 때 빈 배열이 반환되므로 []를 response로 준다.
      if (!postCondition().id) {
        return res.json([]);
      }

      return db.Post.findAll({
        where: { ...postCondition() },
        ...findAllPostElement(),
        order: [
          ["created_at", "DESC"],
          [db.Comment, "group", "ASC"],
          [db.Comment, "sort", "DESC"],
        ],
        limit: 3,
      }).then((posts) => {
        console.log("include searchtag posts", posts);

        return res.json(posts);
      });
    })
    .catch((error) => {
      console.error("😡 ", error);
      next(error);
    });
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = req.params;

    return db.Post.findOne({
      where: { id: data.id },
      ...findAllPostElement(),
    })
      .then((post) => {
        return res.json(post);
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
    // console.log("response post data", await posts);
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

module.exports = router;
