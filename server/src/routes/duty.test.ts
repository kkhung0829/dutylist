import request from 'supertest';
import { dutyRouter } from './duty';
import express from 'express';

const app = express();
app.use(express.json());
app.use('/duty', dutyRouter);

describe('Duty API', () => {
  it('should get all duties', async () => {
    const response = await request(app).get('/duty');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should create a new duty', async () => {
    const newDuty = { id: '0001', name: 'This is a test duty' };
    const response = await request(app)
      .post('/duty')
      .send(newDuty);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(newDuty);
  });

  it('should update an existing duty', async () => {
    const orgDuty = { id: '0002', name: 'This is a test duty for update' };
    const createResponse = await request(app)
      .post('/duty')
      .send(orgDuty);
  
    const id = createResponse.body.id;
  
    const newDuty = {...orgDuty, name: 'This is updated duty'};
    const updateResponse = await request(app)
      .put(`/duty/${id}`)
      .send({ name: newDuty.name});
  
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toStrictEqual(newDuty);
  });

  it('should delete existing duty', async () => {
    const existingDutys = [
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