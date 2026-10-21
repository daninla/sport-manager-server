import express from 'express';
import cors from 'cors';

import routes from './routers/index.js';
import {
  validationErrorHandler,
  errorHandler,
} from './middleware/errorHandlers.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  }),
);
app.use(express.json());
app.use('/api', routes);
app.use(validationErrorHandler, errorHandler);

export default app;
