FROM node:10
# Create app directory
RUN mkdir -p app
WORKDIR /usr/src/website_api
COPY package*.json /app/

# Bundle app source
RUN npm install
COPY . .

EXPOSE 3000
CMD [ "node", "app"]