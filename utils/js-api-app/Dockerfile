FROM node:jod-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
RUN npm install

# Bundle app source
COPY . .

CMD [ "node", "main.js" ]
