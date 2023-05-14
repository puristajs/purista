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
image: https://purista.dev/graphic/dapr_deployment.png
cover: https://purista.dev/graphic/dapr_deployment.png
---

## Dapr core concept

Deployments to Dapr as similar to Kubernetes deployments.  
Your single services are deployed as container (pod) on a Kubernetes cluster.  
On plain Kubernetes deployments, the event bridge of a service is directly connected to the message broker.  
If you are on a Dapr infrastructure, Dapr will automatically add a sidecar container to your service instance.  
The whole communication from and to your service is passed through this sidecar container.  

Dapr also provides some abstraction and adapters for config, state and secret stores.

To learn more about Dapr, visit the official site __[dapr.io](https://dapr.io/)__.

![single instance](/graphic/dapr.svg)

## Prepare your code

Similar to Kubernetes deployments, a http server must be provided by your service instance.  
The `@purista/dapr-sdk` package provides an event bridge which working as HTTP server. In addition, adapters for config, state and secrets stores are available.

You can find an example in the [PURISTA repository](https://github.com/sebastianwessel/purista/tree/master/examples/dapr-example).  
This example also contains the usage of the Dapr config store, secret store and state store.

### Kubernetes deployment file

The deployment of an application or service follows teh regular Kubernetes deployment.  
The only difference here is, to provide the information, required by Dapr to work properly.

Dapr requires to have a unique app-ID for a service defined in the deployment.  
This id match the pattern `[prefix-][convertToKebabCase(service-name)]-v[convertToKebabCase(service version)]`.  
If the app-ID does not follow this pattern, PURISTA services might be not able to invoke commands or subscribe to events correctly

```yaml
# file order-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: purista-order-service-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: purista-order-service
  template:
    metadata:
      # We add the annotations below to let Dapr recognize
      # and deploy the sidecar together with our service in the pod.
      annotations:
        dapr.io/enabled: "true"
        # The client service will use this name to locate
        # the Order service through the Dapr sidecar.
        dapr.io/app-id: "purista-order-v1"
        # The port that your application is listening on
        dapr.io/app-port: "3000"
      labels:
        app: purista-order-service
    spec:
      containers:
        - name: purista-order-service
          image: example/dapr-example-purista-order-service
```

### Limitations

Dapr provides some additional functionality, like the concept of actors or bulk messageing. Currently these functionalities are not supported by the `@purista/dapr-sdk`

It is also not possible to deploy multiple services or service versions in one container (pod). Each service/service-version must be deployed independently.

__You can follow updated on Twitter [@purista_js](https://twitter.com/purista_js) or join the [Discord server](https://discord.gg/9feaUm3H2v) to get in touch with PURISTA maintainers and other developers.__
