const express = require("express");
const passport = require("passport");
const bcyrpy = require("bcrypt");

const saltRounds = 12;
const db = require("../../../models");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const userInfo = req.query;
    const user = db.User.findOne({
      where: { username: userInfo.username },
      attributes: ["username"],
    });
    console.log("User create", userInfo, await user);
    if ((await user) !== null) {
      return res.send(user);
    }

    return bcyrpy.hash(userInfo.password, saltRounds, (error, hash) => {
      if (error) {
        console.error("😡 ", error);
        return res.send("Sign Up failes! 😱");
      }
      db.User.create({
        username: userInfo.username,
        password: hash,
        nickname: userInfo.nickname,
        age: userInfo.age,
        phonenumber: userInfo.phone,
      });
      res.status(200).send("Sign Up Success! 🐳");
    });
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/signin", (req, res, next) => {
  passport.authenticate("local", (error, user, message) => {
    if (error) {
      console.error(error);
      return next(error);
    }
    if (message) {
      console.log("message", message);
      return res.json(message);
    }
    return req.login(user, async (loginError) => {
      try {
        if (loginError) {
          return next(loginError);
        }

        const fullUser = await db.User.findOne({
          where: { username: user.username },
          attributes: [
            "username",
            "nickname",
            "id",
            "description",
            "age",
            "created_at",
          ],
          include: [
            {
              model: db.Image,
            },
          ],
        });
        const profileImage = await db.Image.findOne({
          where: { userId: user.id },
        });

        if (profileImage !== null) {
          user.dataValues.profileImage = profileImage.dataValues.filename;
        }
        console.log("userInfo", user);
        return res.json(fullUser);
      } catch (error) {
        console.error(error);
        next(error);
      }
    });
  })(req, res, next);
});

router.post("/signincheck", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const user = req.user.dataValues;

      const fullUser = await db.User.findOne({
        where: { username: user.username },
        attributes: [
          "username",
          "nickname",
          "id",
          "description",
          "age",
          "created_at",
        ],
        include: [
          {
            model: db.Image,
          },
        ],
      });

      console.log("userInfo", await fullUser);
    }
    res.send("😡  Login is required.");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

router.post("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).send("Logout success! 🐳");
});

router.get("/notification", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const user = req.user.dataValues;

      return db.Notification.findAll({
        where: { userId: user.id },
        order: [["created_at", "DESC"]],
      })
        .then((notifications) => {
          console.log("notification data", notifications);
          return res.json(notifications);
        })
        .catch((error) => {
          console.error("😡 ", error);
        });
    }
    res.send("😡  Login is required.");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

module.exports = router;
