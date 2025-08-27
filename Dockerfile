FROM node:24-alpine

WORKDIR /usr/dist

COPY . .

RUN yarn install

RUN yarn build

CMD ["yarn", "start:migrate"]