FROM node:18-alpine as builder

RUN mkdir -p /app
WORKDIR /app

# should be improved by you depending on your needs
# AVOID TO COPY EVERYTHING FOR REAL PRODUCTION!
COPY . .

RUN npm ci

RUN tsc
# or you can use esbuild
# RUN npx esbuild ./src/index.ts --bundle --platform=node --outfile=build/src/index.js

FROM node:18-alpine as app

ENV NODE_ENV=production

RUN mkdir -p /app
WORKDIR /app
COPY --chown=node:node --from=builder /app/package.json /app
COPY --chown=node:node --from=builder /app/build /app

RUN npm install --omit=dev

# exposed port must match the one used to start the http server in src/index.ts
EXPOSE 8080
ENTRYPOINT ["node", "index.js"]
