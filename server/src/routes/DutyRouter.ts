import express, { Request, Response } from 'express';
import { Duty } from '../types';
import { DB, DBError } from '../DB';

export class DutyRouter {
  router = express.Router();
  db: DB;

  constructor(db: DB) {
    this.db = db;

    this.router.get('/', async (req: Request, res: Response) => {
      try {
        let dutys = await this.db.queryAllDutys();

        res.json(dutys);
      } catch (error) {
        res.status((error as DBError).status).send((error as DBError).message);
      }
    });
    
    this.router.post('/', async (req: Request, res: Response) => {
      const duty: Duty = req.body;

      try {
        let result: Duty = await this.db.addDuty(duty);
    
        res.json(result);
      } catch (error) {
        res.status((error as DBError).status).send((error as DBError).message);
      }
    });
    
    this.router.put('/:id', async (req: Request, res: Response) => {
      let duty: Duty = {
        id: req.params.id,
        name: req.body.name,
      };
    
      try {
        let result: Duty = await this.db.updateDuty(duty);

        res.json(result);
      } catch (error) {
        res.status((error as DBError).status).send((error as DBError).message);
      }
    });
    
    this.router.delete('/:id', async (req: Request, res: Response) => {
      const { id } = req.params;
    
      try {
        let result: Duty = await this.db.deleteDuty(id);

        res.json(result);
      } catch (error) {
        res.status((error as DBError).status).send((error as DBError).message);
      }
    });
  }
}