
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm i -g @nestjs/cli typescript ts-node
RUN npm install --production
# RUN npm ci --only=production
# RUN npm install -g source-map-support



COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]
