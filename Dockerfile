FROM node:14.16.1

# Create api directory
RUN mkdir -p /api
WORKDIR /api

COPY package*.json /api/
RUN npm config set registry https://registry.npm.taobao.org
RUN npm config set sentrycli_cdnurl https://npm.taobao.org/mirrors/sentry-cli/
RUN npm i --force
COPY . /api
RUN npm run build

EXPOSE 3000
CMD npm run start