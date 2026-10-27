## Sequelize group models

`src/models/Group.js`, `GroupPlayer.js`, and `Player.js` map to the existing
`groups`, `group_players`, and `players` tables. Their `associate(models)`
methods define the many-to-many group/player relationship. No schema
synchronization or table-creation migration is needed for the existing
database.