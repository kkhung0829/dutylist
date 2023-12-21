# Duty List
An end-to-end web application that allows the user to read, create and update a to-do list of duties.

## Server
The server is written in Node JS with Typescript, using PostgreSQL as a database engine.
It will also serve the production build of client web page.
Please refer to the [server user guide](server/README.md) for details 

## Client
The client is a frontend developed in React with Typescript.
Please refer to the [client user guide](client/README.md) for details 

## Run in Docker Environment
Suppose you have docker and docker compose installed, you can simply run through
```
docker compose up -d
```
In web browser, navigate to the root of server (e.g. [`http://localhost:8080/`](http://localhost:8080/)).
![image](https://github.com/kkhung0829/dutylist/assets/22828883/c5df0b2e-3fe2-4e74-b6f4-4dcfe805cbce)
