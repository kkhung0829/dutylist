import express from 'express';
import path from 'path';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { DB } from './DB';
import { DutyRouter } from './routes/DutyRouter';

dotenv.config();

const db = new DB(
  process.env.DB_NAME,
  process.env.DB_HOST,
  parseInt(process.env.DB_PORT || "", 10),
  process.env.DB_USER,
  process.env.DB_PASSWORD,
);

const app = express();
app.use(helmet());

const clientPath = path.join(__dirname, '..', '..', 'client', 'build');
app.use(express.static(clientPath));
app.get('/', function (req, res) {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.use(bodyParser.json());

const dutyRouter = new DutyRouter(db);
app.use('/duty', dutyRouter.router);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});