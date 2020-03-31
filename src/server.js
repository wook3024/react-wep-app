const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");

const db = require("./models");
const passportConfig = require("./passport/index");

const sequelize = db.sequelize;
const app = express();
const port = 8080;

sequelize
  .sync()
  .then(() => {
    console.log("\n\n🦛 ", "Sequelize Connection Success!", "🤫\n\n");
  })
  .catch(error => {
    console.error("😡 ", error);
  });

passportConfig();
app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(logger("dev"));
app.use(express.static("images"));
app.use(cookieParser("inputencryptstring"));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "inputencryptstring",
    cookie: {
      httpOnly: true,
      secure: false
    },
    name: "whynot?"
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.post("/user/signup", async (req, res, next) => {
  try {
    const userInfo = req.query;
    const user = db.User.findOne({
      where: { username: userInfo.username },
      attributes: ["username"]
    });
    console.log("User create", userInfo, await user);
    if ((await user) !== null) {
      return res.send(user);
    }
    db.User.create({
      username: userInfo.username,
      password: userInfo.password,
      nickname: userInfo.nickname
    });
    res.send("Sign Up Success! 🐳");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

app.post("/user/signin", (req, res, next) => {
  passport.authenticate("local", (error, user, message) => {
    if (error) {
      console.error(error);
      return next(error);
    }
    if (message) {
      console.log("message", message);
      return res.json(message);
    }
    return req.login(user, async loginError => {
      try {
        if (loginError) {
          return next(loginError);
        }
        const fullUser = await db.User.findOne({
          where: { username: user.username },
          attributes: ["username", "nickname"]
        });
        // console.log("fullUser", user);
        return res.json(fullUser);
      } catch (error) {
        console.error(error);
        next(error);
      }
    });
  })(req, res, next);
});

app.post("/user/signincheck", async (req, res, next) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    return res.json(user);
  }
  res.send("😡  Login is required.");
});

app.post("/user/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("Logout success! 🐳");
});

app.post("/post/publish", async (req, res, next) => {
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

      return res.send("Create Post Success! 🐳");
    }
    res.send("Login Please! 😱");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get("/post", async (req, res, next) => {
  try {
    const posts = await db.Post.findAll({
      where: {},
      order: [["created_at", "DESC"]],
      attributes: ["userId", "title", "content", "created_at"]
    });

    return res.json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.listen(port, () =>
  console.log(`Example app listening on port ${port}! 🐳`)
);
