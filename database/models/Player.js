export default (sequelize, DataTypes) => {
  const Player = sequelize.define(
    'Player',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'last_name',
      },
      birthDate: {
        type: DataTypes.DATEONLY,
        field: 'birth_date',
      },
      city: DataTypes.TEXT,
      rankCategory: {
        type: DataTypes.TEXT,
        field: 'rank_category',
      },
      ukrRating: {
        type: DataTypes.DECIMAL,
        field: 'ukr_rating',
      },
      worldRating: {
        type: DataTypes.INTEGER,
        field: 'world_rating',
      },
      club: DataTypes.TEXT,
      notes: DataTypes.TEXT,
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
    },
    {
      tableName: 'players',
      timestamps: false,
    },
  );

  Player.associate = ({ Group, GroupPlayer }) => {
    Player.belongsToMany(Group, {
      as: 'groups',
      through: GroupPlayer,
      foreignKey: 'playerId',
      otherKey: 'groupId',
    });
  };

  return Player;
};
