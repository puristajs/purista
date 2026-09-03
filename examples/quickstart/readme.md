# Quickstart example

This is an example of PURISTA from the quickstart presentation.

Install, verify, and run it from this example directory:

```bash
npm install
npm test
npm start
```

## HTTP endpoints

The example exposes two HTTP endpoints via the default HTTP server:

1. `POST /api/v1/ping` – synchronous echo endpoint returning `{ pong }`.
2. `POST /api/v1/ping/async` – asynchronous variant that enqueues a job and immediately responds with:

```jsonc
{
  "jobId": "uuid",
  "queue": "pingJob",
  "queueName": "pingJob",
  "scheduledAt": 1700000000000
}
```

The asynchronous endpoint demonstrates the new queue builders, the `.canEnqueue()` context helper, and the HTTP `202 Accepted` contract.
