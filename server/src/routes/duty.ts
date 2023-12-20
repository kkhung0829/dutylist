import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "", 10),
  database: process.env.DB_NAME,
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM dutys');
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error retrieving dutys');
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { id, name } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO dutys (id, name) VALUES ($1, $2) RETURNING *',
      [id, name]
    );
    client.release();

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error creating duty');
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE dutys SET name = $2 WHERE id = $1 RETURNING *',
      [id, name]
    );
    client.release();
    if (result.rowCount === 0) {
      res.status(404).send('Todo not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error updating duty');
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM dutys WHERE id = $1 RETURNING *', [id]);
    client.release();
    if (result.rowCount === 0) {
      res.status(404).send('Duty not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error deleting duty');
  }
});

export { router as dutyRouter };