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
EXPOSE 3000

# build production version
RUN npm run build

# install serve
RUN npm install -g serve

# run the app
CMD ["serve", "-s", "build"]