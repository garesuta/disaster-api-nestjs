# select latest nodejs image
FROM node:latest

# Set the working directory
WORKDIR /usr/src/app

# COPY package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of application
COPY . .

# build ths nestjs application
RUN npm run build

# Expose the application port
EXPOSE 3000

# command to run app
CMD ["node","dist/src/main"]