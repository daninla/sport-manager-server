export default (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    "UserRole",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: "user_id",
      },
      roleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: "role_id",
      },
    },
    {
      tableName: "user_roles",
      timestamps: false,
    },
  );

  UserRole.associate = ({ User, Role }) => {
    UserRole.belongsTo(User, { foreignKey: "userId" });
    UserRole.belongsTo(Role, { foreignKey: "roleId" });
  };

  return UserRole;
};
