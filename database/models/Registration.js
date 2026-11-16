export default (sequelize, DataTypes) => {
  const Registration = sequelize.define(
    "Registration",
    {
      tournamentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "tournament_id",
      },
      playerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "player_id",
      },
    },
    {
      tableName: "registrations",
      timestamps: false,
    },
  );

  // This model only reads the foreign keys used by the groups API.
  Registration.removeAttribute("id");

  return Registration;
};
