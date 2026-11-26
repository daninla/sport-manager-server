export default (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
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
    },
    {
      tableName: "roles",
      timestamps: false,
    },
  );

  Role.associate = ({ UserRole }) => {
    Role.hasMany(UserRole, { foreignKey: "roleId" });
  };

  return Role;
};
