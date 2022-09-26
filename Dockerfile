FROM node:17

# Create API directory
WORKDIR /usr/src/app/panyart-api

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies
RUN npm install --quiet

# Bundle app source
COPY . . 

ENTRYPOINT npm run start
