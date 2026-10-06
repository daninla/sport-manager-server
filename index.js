import dotenv from "dotenv";
import app from "./src/app.js";
import pool from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
pool
  .query("SELECT NOW()")
  .then(() => {
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
