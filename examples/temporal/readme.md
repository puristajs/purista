# PURISTA Temporal integration

In this example, a PURISTA application integrates [Temporal](https://temporal.io).

## Start

### 1. Start docker containers

Start the required docker containers for NATS, Temporal and Jaeger Tracing:

```bash
docker compose up -d
```

### 2. Start temporal worker

```bash
npm run dev:worker
```

### 3. Start PURISTA application

```bash
npm run dev:worker
```

### 4. Open browser

When all services are up and running, you can navigate to [localhost:3000](http://localhost:3000).  
Here you will find links to:

- [the OpenApi UI of the PURISTA application](http://localhost:3000/api)
- [Jaeger Tracing UI](http://localhost:16686)
- [Temporal UI](http://localhost:8080)
- [NATS UI](http://localhost:8222)


Visit [https://purista.dev](https://purista.dev) for documentation