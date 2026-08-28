---
title: Start with PURISTA
description: Create a local service, handle a command, react to an event, and verify the result.
order: 100
---

Build a small incident desk that accepts an incident, emits an event, and lets another service react. The default path uses only the generated project and the in-memory runtime, so no broker, database, or cloud account is required.

## What you will have

```mermaid title="Incident desk starter flow"
flowchart LR
  C[Create incident command] --> I[Incident service]
  I -->|incident.created| N[Notification subscription]
```

By the end, the project contains a versioned service, a typed command, and a subscription. Run its tests before adding a real EventBridge, stores, or HTTP server.

## Follow this path

1. [Check requirements](/handbook/framework/start/requirements-and-installation/) and create the project.
2. [Create the service](/handbook/framework/start/create-the-first-service/).
3. [Add a command](/handbook/framework/start/add-a-command/) that returns a result and can emit an event.
4. [Add a subscription](/handbook/framework/start/add-a-subscription/) that reacts without coupling the services.
5. [Run and verify](/handbook/framework/start/run-and-verify/) the generated tests and application.

## Choose a starting shape

| Need | Start with | Add later |
| --- | --- | --- |
| Local business API | Default EventBridge and a command | HTTP exposure, a production EventBridge |
| Background work | A queue and worker | Redis or NATS QueueBridge |
| Live progress | A stream | HTTP streaming transport |
| AI-assisted business action | An AI-powered service | Model provider and Harness capabilities |

The in-memory defaults are useful for development and tests. They are not a production persistence or transport strategy; choose the relevant adapter before deploying a durable or distributed workload.

Next: [requirements and installation](/handbook/framework/start/requirements-and-installation/).
