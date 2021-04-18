FROM node:alpine
WORKDIR /app

# copy
COPY package.json package-lock.json ./

# install and build
RUN npm install
COPY . .
RUN npm run build
# run the app
CMD ["npm", "run", "start"]