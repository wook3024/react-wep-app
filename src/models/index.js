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

db.User.hasMany(db.Post, { foreignKey: "poster", sourceKey: "id" });
db.Post.belongsTo(db.User, { foreignKey: "poster", targetKey: "id" });
db.Post.hasMany(db.Comment, { foreignKey: "commenter", sourceKey: "id" });
db.Comment.belongsTo(db.Post, { foreignKey: "commenter", targetKey: "id" });

module.exports = db;
