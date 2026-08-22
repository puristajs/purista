---
title: Deploy to Kubernetes
description: Run PURISTA service and scheduler processes as independently operated workloads.
order: 503010
---

# Deploy to Kubernetes

Kubernetes runs compiled PURISTA processes; it does not replace the EventBridge,
queue backend, state stores, or scheduler provider. Package each independently
operated process as a container: one or more service deployments, optional HTTP
gateway deployments, and one deployment per scheduler group.

## Application deployment

Build an ESM application image and run its bootstrap command. The bootstrap
starts the selected services, an external EventBridge, required stores, and any
Hono HTTP service. Register service routes before opening the socket.

```yaml [orders-deployment.yaml]
apiVersion: apps/v1
kind: Deployment
metadata:
  name: orders
spec:
  replicas: 3
  selector:
    matchLabels: { app: orders }
  template:
    metadata:
      labels: { app: orders }
    spec:
      containers:
        - name: orders
          image: registry.example.com/orders:4.0.0
          command: ["node", "dist/orders.js"]
          env:
            - name: NATS_URL
              valueFrom:
                secretKeyRef: { name: messaging, key: nats-url }
          ports: [{ containerPort: 3000, name: http }]
          readinessProbe:
            httpGet: { path: /healthz, port: http }
          livenessProbe:
            httpGet: { path: /healthz, port: http }
```

The probe endpoint is application-owned. Make readiness reflect whether the
process can accept its intended traffic; do not label an unavailable bridge or
required store healthy merely because Node.js is running. Configure resource
requests/limits, topology, secret delivery, network policy, autoscaling, and
termination grace according to the workload.

## Scheduler deployment

The scheduler is a separate process with only an exported manifest, shared
EventBridge, and scheduler provider. It never imports the business service
graph. One replica is sufficient for a single owner; replicated scheduler
deployments require distributed occurrence claims.

```yaml [billing-scheduler.yaml]
apiVersion: apps/v1
kind: Deployment
metadata:
  name: billing-scheduler
spec:
  replicas: 2
  selector:
    matchLabels: { app: billing-scheduler }
  template:
    metadata:
      labels: { app: billing-scheduler }
    spec:
      containers:
        - name: scheduler
          image: registry.example.com/billing:4.0.0
          command: ["node", "dist/scheduler.js"]
          env:
            - name: PURISTA_SCHEDULER_GROUP
              value: billing
            - name: REDIS_URL
              valueFrom:
                secretKeyRef: { name: scheduler, key: redis-url }
```

Its bootstrap uses a production bridge plus a durable provider, then calls
`.setStrict().setRequireDistributedClaims()` before `getInstance()`. Use a
unique provider key prefix per application and environment. Consumers still
deduplicate important effects with `message.schedule.occurrenceId`.

## Delivery checklist

- Run `purista validate --strict` on exported definitions in CI.
- Build and test the image before deployment; test the real bridge and provider
  in an integration environment.
- Use rolling rollout compatibility rules for messages and schemas.
- Export and mount the current schedule manifest with the scheduler image.
- Monitor pod health separately from bridge, store, queue, and scheduler
  provider health.
- Grant the scheduler only the credentials needed to publish trigger events and
  claim occurrences.

For the Hono service setup, see [HTTP server](../../3_eco_system/http_server.md).
