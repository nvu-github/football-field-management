FROM node:18-alpine

ENV HOST='0.0.0.0'
ENV PORT='3002'

WORKDIR /src
COPY package.json yarn.lock /
EXPOSE 3002
RUN yarn install
COPY . .
CMD [ "yarn", "dev" ]