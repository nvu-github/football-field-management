FROM node:16-alpine

# Install build dependencies
RUN apk --no-cache add \
    build-base \
    python3

WORKDIR /src
COPY package.json yarn.lock /
RUN yarn install
RUN npm install -g @nestjs/cli
COPY . .
EXPOSE 8881 8882
RUN npx prisma generate
CMD [ "yarn", "dev" ]
