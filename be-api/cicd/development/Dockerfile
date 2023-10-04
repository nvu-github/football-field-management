FROM node:16-alpine

WORKDIR /src
COPY package.json yarn.lock /
EXPOSE 8080
RUN yarn install
COPY . .
RUN npx prisma generate
CMD [ "yarn", "start:dev" ]