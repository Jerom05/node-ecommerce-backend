import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import routes from './routes/index.js';
import { handleNotFound, errorHandler } from './middlewares/index.js';
import { connectDB } from './config/index.js';
import YAML from 'yamljs';

const app = express();

dotenv.config();
connectDB();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerDocument = YAML.load('./src/swagger/swagger-output.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API' });
});
app.use('/api', routes);

app.use(handleNotFound);
app.use(errorHandler);

export default app;
