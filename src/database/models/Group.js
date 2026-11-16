export default (sequelize, DataTypes) => {
  const Group = sequelize.define(
    'Group',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tournamentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'tournament_id',
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
    },
    {
      tableName: 'groups',
      timestamps: false,
    },
  );

  Group.associate = ({ Player, GroupPlayer }) => {
    Group.belongsToMany(Player, {
      as: 'players',
      through: GroupPlayer,
      foreignKey: 'groupId',
      otherKey: 'playerId',
    });
    Group.hasMany(GroupPlayer, {
      as: 'groupPlayers',
      foreignKey: 'groupId',
    });
  };

  return Group;
};
