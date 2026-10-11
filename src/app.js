import express from 'express';
import cors from 'cors';

import router from './routers/index.js';
import { errorHandler } from './middleware/errorHandler.mw.js';

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

export default app;
