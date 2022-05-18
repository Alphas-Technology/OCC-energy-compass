FROM node:14.15.0-stretch-slim

# Create app directory
WORKDIR /app

COPY . .
RUN yarn install
RUN yarn run build

COPY .env /app/dist/

EXPOSE 3000
CMD ["yarn", "up"]
# CMD ["node", "/app/dist/server.js"]
