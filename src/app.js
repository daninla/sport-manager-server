import express from 'express';
import cors from 'cors';

import routes from './routers/index.js';
import {
  ValidationErrorHandler,
  errorHandler,
} from './middleware/errorHandlers.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use(ValidationErrorHandler);
app.use(errorHandler);

export default app;
