FROM node:16-alpine

WORKDIR /app
COPY package.json yarn.lock /
RUN yarn install
COPY . .
RUN npx prisma generate
CMD [ "yarn", "start" ]