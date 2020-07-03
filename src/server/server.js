const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const hpp = require("hpp");
const helmet = require("helmet");

const db = require("../models");
const passportConfig = require("../passport/index");
const user = require("../route/back/user/user");
const post = require("../route/back/post/post");
const postUser = require("../route/back/post/user");
const comment = require("../route/back/post/comment");
const auth = require("../route/back/auth");
const cookieSecret = require("../config/cookieSecret.json");

const sequelize = db.sequelize;
const app = express();
const port = 80;

sequelize
  .sync()
  .then(() => {
    console.log("\n\n🦛 ", "Sequelize Connection Success!", "🤫\n\n");
  })
  .catch((error) => {
    console.error("😡 ", error);
  });

passportConfig();

app.use(hpp());
app.use(helmet());
app.use(logger("dev"));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.static("public"));
app.use(express.static("images"));
app.use(cookieParser(cookieSecret.secret));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: cookieSecret.secret,
    cookie: {
      httpOnly: true,
      // secure: true,
      // maxAge: 60000,
      // domain: ".swook.ml",
    },
    name: "whynot?",
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/post/comment", comment);
app.use("/post/user", postUser);
app.use("/user", user);
app.use("/post", post);
app.use("/auth", auth);

app.listen(port, () =>
  console.log(`Example app listening on port ${port}! 🐳`)
);
