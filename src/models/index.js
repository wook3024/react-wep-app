const path = require("path");
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "..", "config", "sequelize.json"))[
  env
];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./user")(sequelize, Sequelize);
db.Comment = require("./comment")(sequelize, Sequelize);
db.Post = require("./post")(sequelize, Sequelize);
db.Like = require("./like")(sequelize, Sequelize);
db.Dislike = require("./dislike")(sequelize, Sequelize);

//database association
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User, { foreignKey: "userId" });
/*--------------------------------------------------*/
db.Post.hasMany(db.Comment);
db.Comment.belongsTo(db.Post, { foreignKey: "postId" });
/*--------------------------------------------------*/
db.Comment.hasMany(db.Like);
db.Like.belongsTo(db.Comment, { foreignKey: "commentId" });
/*--------------------------------------------------*/
db.Comment.hasMany(db.Dislike);
db.Dislike.belongsTo(db.Comment, { foreignKey: "commentId" });

module.exports = db;
