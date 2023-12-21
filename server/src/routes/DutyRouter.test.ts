import request from 'supertest';
import { Duty } from '../types';
import { DB } from '../DB';
import { DutyRouter } from './DutyRouter';
import express from 'express';

const db = new DB(
  process.env.DB_NAME,
  process.env.DB_HOST,
  parseInt(process.env.DB_PORT || "", 10),
  process.env.DB_USER,
  process.env.DB_PASSWORD,
);

const app = express();
app.use(express.json());

const dutyRouter = new DutyRouter(db);
app.use('/duty', dutyRouter.router);

describe('DutyRouter API', () => {
  it('should get all duties', async () => {
    const response = await request(app).get('/duty');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should create a new duty', async () => {
    const newDuty: Duty = { id: '0001', name: 'This is a test duty' };
    const response = await request(app)
      .post('/duty')
      .send(newDuty);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(newDuty);
  });

  it('should update an existing duty', async () => {
    const orgDuty: Duty = { id: '0002', name: 'This is a test duty for update' };
    const createResponse = await request(app)
      .post('/duty')
      .send(orgDuty);
  
    const id = createResponse.body.id;
  
    const newDuty: Duty = {...orgDuty, name: 'This is updated duty'};
    const updateResponse = await request(app)
      .put(`/duty/${id}`)
      .send({ name: newDuty.name});
  
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toStrictEqual(newDuty);
  });

  it('should delete existing duty', async () => {
    const existingDutys: Duty[] = [
      { id: '0001', name: 'This is a test duty' },
      { id: '0002', name: 'This is updated duty' },
    ];

    for (const duty of existingDutys) {
      const response = await request(app)
        .delete(`/duty/${duty.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(duty);
    }
  });
});