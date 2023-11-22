FROM node:16-alpine

# Install build dependencies
RUN apk --no-cache add \
    build-base \
    python3

WORKDIR /src
COPY package.json yarn.lock /
EXPOSE 8881 8882
RUN yarn install
COPY . .
RUN npx prisma generate
CMD [ "yarn", "start:dev" ]
