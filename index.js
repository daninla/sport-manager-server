import dotenv from "dotenv";
import app from "./src/app.js";
import http from "http";
import { sequelize } from "./database/models/index.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

await sequelize.authenticate();
console.log("Соединение с базой установлено");

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
