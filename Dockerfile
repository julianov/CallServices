# pull official base image
FROM node:14-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN ionic serve

EXPOSE 8000

# add app

COPY . ./

# start app
CMD ["ionic", "serve"]