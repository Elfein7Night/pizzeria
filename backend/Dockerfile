# get Node lts from docker hub
FROM node:16.16

# set working directory
WORKDIR /workspace

# copy package.json to workspace
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the files to the workspace
COPY . .

# expose port
EXPOSE 8080

# run the app
CMD ["npm", "start"]