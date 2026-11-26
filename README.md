## Sequelize group models

`src/models/Group.js`, `GroupPlayer.js`, and `Player.js` map to the existing
`groups`, `group_players`, and `players` tables. Their `associate(models)`
methods define the many-to-many group/player relationship. No schema
synchronization or table-creation migration is needed for the existing
database.

## Club administration

The server grants administrator access when `user_roles` contains a row with
the user's ID in `user_id` and `title = 'admin'`. Other roles can coexist for the
same user. Mount the project's authentication middleware before the API routes
so it sets `req.user.id` from a verified identity. The browser's mock sign-in
does not provide that identity. Requests without a verified ID receive 401.

Set `CLIENT_ORIGIN` when the client runs at an origin other than
`http://localhost:3000`. The client sends session credentials to the API.
