const moment = require("moment");
const { now } = moment;
const stillUtc = moment.utc(now()).toDate();

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "comment",
    {
      comment: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      group: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      depth: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sort: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("now()"),
      },
    },
    {
      timestamps: false,
    }
  );
};
