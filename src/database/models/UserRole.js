export default (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
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

  UserRole.associate = ({ User }) => {
    UserRole.belongsTo(User, {
      foreignKey: "userId",
    });
  };

  return UserRole;
};
