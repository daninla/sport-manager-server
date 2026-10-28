import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Пул pg используется сервисами с прямыми SQL-запросами; это отдельное подключение от Sequelize.
const pool = new Pool({
  host: process.env.PGHOST,
  port: 5432,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

export default pool;
