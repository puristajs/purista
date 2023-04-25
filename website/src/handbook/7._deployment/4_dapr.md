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

A detailed description and examples will come, as soon as more event bridges implemented.  
Stay tuned!

__You can follow updated on Twitter [@purista_js](https://twitter.com/purista_js) or join the [Discord server](https://discord.gg/9feaUm3H2v) to get in touch with PURISTA maintainers and other developers.__


Dapr and PURISTA share some basic concepts.  While PURISTA is focusing on the implementation level, Dapr is focusing on the infrastructure level.  
In this chapter, you will learn how to deploy your PURSITA services as independent instances on a Dapr infrastructure.

## Dapr core concept

Deployments to Dapr as similar to Kubernetes deployments.  
Your single services are deployed as container (pod) on a Kubernetes cluster.  
On plain Kubernetes deployments, the event bridge of a service is directly connected to the message broker.  
If you are on a Dapr infrastructure, Dapr will automatically add a sidecar container to your service instance.  
The whole communication from and to your service is normally passed through this sidecar container, based on HTTP.  

Dapr also provides some abstraction and adapters for config, state and secret stores.

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