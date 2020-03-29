const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const db = require("./models");

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
    console.error(error);
  });

app.use(cors());
app.use(logger("dev"));
app.use(express.static("images"));

app.post("/user/signup", async (req, res, next) => {
  try {
    const userInfo = req.query;
    User.create({
      username: userInfo.username,
      password: userInfo.password,
      nickname: userInfo.nickname
    });
    console.log("User create", userInfo);
    res.send("Sign Up Success!");
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

app.get("/user/signin", async (req, res, next) => {
  console.log("userName", req.query);
  try {
    const userInfo = req.query;
    const users = User.findAll({
      where: {
        username: userInfo.username || null,
        password: userInfo.password || null
      },
      attributes: ["username", "nickname"]
    });
    console.log("users.....", await users);
    res.json({ users });
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

app.put("/user", (req, res) => {
  res.send("Got a PUT request  at /user");
});

app.delete("/user", (req, res) => {
  res.send("Got a DELETE request at /user");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
