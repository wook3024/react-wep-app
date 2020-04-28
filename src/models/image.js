module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "image",
    {
      location: {
        type: DataTypes.TEXT,
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
