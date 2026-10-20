import dotenv from "dotenv";
import app from "./src/app.js";
import http from "http";

dotenv.config();

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
