module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "dislike",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("now()")
      }
    },
    {
      timestamps: false
    }
  );
};
