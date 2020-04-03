const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");

const db = require("../models");
const passportConfig = require("../passport/index");
const user = require("./back/user");
const post = require("./back/post");

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

app.use("/user", user);
app.use("/post", post);

app.listen(port, () =>
  console.log(`Example app listening on port ${port}! 🐳`)
);
