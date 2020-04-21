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
db.Image = require("./image")(sequelize, Sequelize);
db.Hashtag = require("./hashtag")(sequelize, Sequelize);
db.Searchtag = require("./searchtag")(sequelize, Sequelize);

//database association
//현재 sequelize의 이해가 부족하여 필요한 부분만 사용가능하도록 만들었지만
//부족한 부분이 많다고 생각한다.
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
/*--------------------------------------------------*/
db.Post.hasMany(db.Image);
db.Image.belongsTo(db.Post, { foreignKey: "postId" });
/*--------------------------------------------------*/
db.User.hasMany(db.Image);
db.Image.belongsTo(db.User, { foreignKey: "userId" });
/*--------------------------------------------------*/
db.User.hasMany(db.Comment);
db.Comment.belongsTo(db.User, { foreignKey: "userId" });
/*--------------------------------------------------*/
db.Post.hasMany(db.Hashtag);
db.Hashtag.belongsTo(db.Post, { foreignKey: "postId" });
/*--------------------------------------------------*/
db.Post.hasMany(db.Searchtag);
db.Searchtag.belongsTo(db.Post, { foreignKey: "postId" });

module.exports = db;
