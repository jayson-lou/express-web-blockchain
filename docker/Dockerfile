FROM node:carbon

# Create app directory
WORKDIR /home/app/express-blockchain

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]