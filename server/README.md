# Duty List Server User Guide

## Install Dependencies
```
npm install
```

## Environment Configuration
An .env file containing the db configurations should be updated. It contains the following entries:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=dutylistdb

PORT=8080
```
- `DB_HOST`: database host name
- `DB_PORT`: database port number
- `DB_USER`: database user account name
- `DB_PASSWORD`: database user account password
- `DB_NAME`: database name
- `PORT`: server listening port number

## Database Configuration
Server using PostgreSQL as a database engine. Please create the database table `dutys` with following SQL statement:
```sql
CREATE TABLE IF NOT EXISTS dutys
(
    id character varying(255) not null,
    name character varying(255) not null,
    PRIMARY KEY (id)
)
```

## Compilation and Run
Since the server will serve the production build of client web page, please remember to build the client before compile and run server code.
```
npm run start
```

## Access Duty List
To access duty list, in web browser, navigate to the root of server (e.g. [`http://localhost:8080/`](http://localhost:8080/)).
![image](https://github.com/kkhung0829/dutylist/assets/22828883/c5df0b2e-3fe2-4e74-b6f4-4dcfe805cbce)
