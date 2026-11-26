import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";
app.locals.clientOrigin = clientOrigin;

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);

export default app;
