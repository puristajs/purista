---
order: 40
title: Deploy to Dapr
shortTitle: Dapr
description: Deploy a PURISTA application to Dapr.
tag:
  - function
  - cloud
  - Dapr
  - deployment
---



## Dapr core concept

Deployments to Dapr as similar to Kubernetes deployments.  
Your single services are deployed as container (pod) on a Kubernetes cluster.  
On plain Kubernetes deployments, the event bridge of a service is directly connected to the message broker.  
If you are on a Dapr infrastructure, Dapr will automatically add a sidecar container to your service instance.  
The whole communication from and to your service is passed through this sidecar container.  

Dapr also provides some abstraction and adapters for config, state and secret stores.

![single instance](/graphic/dapr.svg)

## Prepare your code

Similar to Kubernetes deployments, a http server must be provided by your service instance.  
The `@purista/dapr-sdk` package provides an event bridge which working as HTTP server. In addition, adapters for config, state and secrets stores are available.

Dapr requires to have a unique app-ID for a service defined in the deployment.  
This id match the pattern `[prefix-][service-name]-v[service version]`.

```typescript
```

### Limitations

Dapr provides some additional functionality, like the concept of actors or bulk messageing. Currently these functionalities are not supported by the `@purista/dapr-sdk`

It is also not possible to deploy multiple services or service versions in one container (pod). Each service/service-version must be deployed independently.