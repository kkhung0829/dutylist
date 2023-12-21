import { Pool } from 'pg';
import { Duty } from './types';

/**
 * DB error returned
 */
export interface DBError {
    message: string;
    status: number;
}

export class DB {
    /**
     * DB class for handling database operations
     */
    pool: Pool;

    constructor(
        db_name?: string,
        db_host?: string,
        db_port?: number,
        db_user?: string,
        db_password?: string,
    ) {
        this.pool = new Pool({
            user: db_user,
            password: db_password,
            host: db_host,
            port: db_port,
            database: db_name
        });
    }

    /**
     * Query all duties
     */
    async queryAllDutys(): Promise<Duty[]> {
        try {
            const client = await this.pool.connect();
            const result = await client.query('SELECT * FROM dutys');
            client.release();
            return (result.rows as Duty[]);
        } catch (error) {
            console.log(error);
            throw {
                message: 'Error querying duty',
                status: 500,
            } as DBError;
        }
    }

    /**
     * Add new duty
     */
    async addDuty(duty: Duty): Promise<Duty> {
        try {
            const client = await this.pool.connect();
            const result = await client.query(
                'INSERT INTO dutys (id, name) VALUES ($1, $2) RETURNING *',
                [duty.id, duty.name]
            );
            client.release();

            return (result.rows[0] as Duty);
        } catch (error) {
            console.log(error);
            throw {
                message: 'Error adding duty',
                status: 500,
            } as DBError;
        }
    }

    /**
     * Update existing duty
     */
    async updateDuty(duty: Duty): Promise<Duty> {
        try {
            const client = await this.pool.connect();
            const result = await client.query(
                'UPDATE dutys SET name = $2 WHERE id = $1 RETURNING *',
                [duty.id, duty.name]
            );
            client.release();

            if (result.rowCount === 0) {
                // No record updated
                throw {
                    message: 'Duty not found',
                    status: 404,
                } as DBError;
            } else {
                return result.rows[0] as Duty;
            }
        } catch (error) {
            console.log(error);
            throw {
                message: 'Error updating duty',
                status: 500,
            } as DBError;
        }
    }

    /**
     * Delete existing duty
     */
    async deleteDuty(id: string): Promise<Duty> {
        try {
            const client = await this.pool.connect();
            const result = await client.query('DELETE FROM dutys WHERE id = $1 RETURNING *', [id]);
            client.release();

            if (result.rowCount === 0) {
                // No record deleted
                throw {
                    message: 'Duty not found',
                    status: 404,
                } as DBError;
            } else {
                return result.rows[0] as Duty;
            }
        } catch (error) {
            console.log(error);
            throw {
                message: 'Error deleting duty',
                status: 500,
            } as DBError;
        }
    }
}