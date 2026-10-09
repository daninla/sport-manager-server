import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import router from "./router/index.js"
import { errorHandler } from "./middlewares/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(errorHandler)
//Проверка на подключение к базе данных
app.get("/", async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users");
    res.json({ message: "Server is running", users: result.rows });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});
/////////


export default app;
