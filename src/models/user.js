module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      nickname: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("now()")
      }
    },
    {
      timestamps: false
    }
  );
};
