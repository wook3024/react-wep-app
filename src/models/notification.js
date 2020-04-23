module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "notification",
    {
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
