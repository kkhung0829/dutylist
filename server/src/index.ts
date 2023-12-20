import express from 'express';
import path from 'path';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { dutyRouter } from './routes/duty';

dotenv.config();

const app = express();
app.use(helmet());

const clientPath = path.join(__dirname, '..', '..', 'client', 'build');
app.use(express.static(clientPath));
app.get('/', function (req, res) {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.use(bodyParser.json());

app.use('/duty', dutyRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});