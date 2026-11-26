export default (sequelize, DataTypes) =>
  sequelize.define(
    "UserRole",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
    },
    {
      tableName: "user_roles",
      timestamps: false,
    },
  );
