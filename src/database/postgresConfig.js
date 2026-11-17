import dotenv from 'dotenv';

dotenv.config();

// Sequelize CLI использует эту конфигурацию для подключения к PostgreSQL при миграциях.
const databaseConfig = {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: 5432,
    dialect: 'postgres',
    logging: false,
};

export default {
    development: databaseConfig,
};
