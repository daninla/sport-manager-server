## Sequelize group models

Models in `src/database/models` map groups and registrations to existing
PostgreSQL tables. Participants are users linked to the `player` role in `roles` through
`user_roles(user_id, role_id)`. Group assignments reference `users.id` through
`group_players.player_id`. The groups API keeps the `players` and
`playerIds` response and request fields used by the client.

## Club administration

Administrator permissions use the `admin` entry in `roles`, linked to the
user through `user_roles`. Other roles can coexist for the same user. Mount the project's authentication middleware before the API routes
so it sets `req.user.id` from a verified identity. The browser's mock sign-in
does not provide that identity. Requests without a verified ID receive 401.

Set `CLIENT_ORIGIN` when the client runs at an origin other than
`http://localhost:3000`. The client sends session credentials to the API.
