import { Duty } from './types';
import { DB } from './DB';

const db = new DB(
    process.env.DB_NAME,
    process.env.DB_HOST,
    parseInt(process.env.DB_PORT || "", 10),
    process.env.DB_USER,
    process.env.DB_PASSWORD,
);

describe('DB API', () => {
    it('should get all duties', async () => {
        const dutys: Duty[] = await db.queryAllDutys();
        expect(dutys).toEqual([]);
    });

    it('should create a new duty', async () => {
        const newDuty: Duty = { id: '0001', name: 'This is a test duty' };
        const result = await db.addDuty(newDuty);
        expect(result).toStrictEqual(newDuty);
    });

    it('should update an existing duty', async () => {
        const orgDuty: Duty = { id: '0002', name: 'This is a test duty for update' };
        const createResult: Duty = await db.addDuty(orgDuty);

        const newDuty: Duty = { ...orgDuty, name: 'This is updated duty' };
        const updateResult: Duty = await db.updateDuty(newDuty);

        expect(updateResult).toStrictEqual(newDuty);
    });

    it('should delete existing duty', async () => {
        const existingDutys: Duty[] = [
            { id: '0001', name: 'This is a test duty' },
            { id: '0002', name: 'This is updated duty' },
        ];

        for (const duty of existingDutys) {
            const result = await db.deleteDuty(duty.id);
            expect(result).toStrictEqual(duty);
        }
    });
});