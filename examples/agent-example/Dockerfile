# Build with the PURISTA repository root as context:
# docker build -f examples/agent-example/Dockerfile -t purista-agent-example:local .
FROM node:24.15.0-bookworm-slim AS build

WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
COPY packages ./packages
COPY examples/agent-example ./examples/agent-example

RUN npm install --ignore-scripts --package-lock=false \
	&& npm run build -w @purista/agent-example \
	&& npm run build:production -w @purista/agent-example \
	&& npm prune --omit=dev

FROM node:24.15.0-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/examples/agent-example/package.json ./examples/agent-example/package.json
COPY --from=build /app/examples/agent-example/dist ./examples/agent-example/dist

USER node
EXPOSE 3000
CMD ["npm", "run", "start:production", "-w", "@purista/agent-example"]

