const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");

const db = require("./models");
const passportConfig = require("./passport/index");

const sequelize = db.sequelize;
const User = db.User;
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
    console.log("User create", userInfo);
    User.create({
      username: userInfo.username,
      password: userInfo.password,
      nickname: userInfo.nickname
    });
    res.send("Sign Up Success!");
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
        console.log("fullUser", user);
        return res.json(fullUser);
      } catch (e) {
        next(e);
      }
    });
  })(req, res, next);
});

app.post("/user/signincheck", async (req, res, next) => {
  const user = Object.assign({}, req.user.toJSON());
  delete user.password;
  return res.json(user);
});

app.post("/logout", (req, res) => {
  // /api/user/logout
  req.logout();
  req.session.destroy();
  res.send("logout 성공");
});

app.delete("/user", (req, res) => {
  res.send("Got a DELETE request at /user");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
