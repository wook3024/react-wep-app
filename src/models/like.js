module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "like",
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
