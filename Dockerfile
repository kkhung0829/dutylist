FROM node:18.16.0-alpine3.17

# Install client
WORKDIR /client
COPY client/package.json client/package-lock.json client/tsconfig.json .
RUN npm install
COPY client/ .
RUN npm run build

# Install server
WORKDIR /server
COPY server/package.json server/package-lock.json server/tsconfig.json .
RUN npm install
COPY server/ .
RUN npm run build

EXPOSE 8080
CMD [ "npm", "start"]