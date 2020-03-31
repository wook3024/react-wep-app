module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "post",
    {
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
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
