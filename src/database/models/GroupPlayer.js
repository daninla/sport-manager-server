export default (sequelize, DataTypes) => {
  const GroupPlayer = sequelize.define(
    'GroupPlayer',
    {
      groupId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        field: 'group_id',
      },
      playerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        field: 'player_id',
      },
    },
    {
      tableName: 'group_players',
      timestamps: false,
    },
  );

  GroupPlayer.associate = ({ Group, User }) => {
    GroupPlayer.belongsTo(Group, {
      as: 'group',
      foreignKey: 'groupId',
    });
    GroupPlayer.belongsTo(User, {
      as: 'player',
      foreignKey: 'playerId',
    });
  };

  return GroupPlayer;
};
