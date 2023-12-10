---
order: 30
title: Microservice style - scale on service level
shortTitle: Microservice style
description: Microservice style
image: https://purista.dev/graphic/microservice_style.png
cover: https://purista.dev/graphic/microservice_style.png
tag:
  - microservice
  - Kubernetes
  - k8s
  - cloud
---


It's a common way, to have a microservice approach.
We call it here _microservice style_, as classical microservices are typically (more or less) directly communicating via HTTP.
In PURISTA, the communication is not a direct connection between two instances - it is done via a message broker. Because of this, service mesh software like [Istio](https://istio.io) can't be simply used. Here, you might want to consider [dapr](https://dapr.io).

This solution fits if you have multiple developer teams, which should be able to work (and scale) independently.
This is the **biggest PRO** in comparison to the monolithic approach: It enables scaling the whole project and not only some software instances.

![example](/graphic/microservice_style.svg)

This solution will need the effort to set up, configure and maintain. You will also quickly hit the point, where you will need additional third-party solutions to handle the bigger complexity.
Here, a common way is, the usage of [kubernetes](https://kubernetes.io).
These third-party solutions will also bring a lot of additional benefits. The range will be from "some nicer UI" up to "autoscaling services" and automated, reproducible deployment.
The costs, for running a system this way, are (mostly) predictable - similar to the monolithic approach.

The overall workload is distributed across all running instances and the number of running instances per service can be set differently.
If you have for example some service, which does some time-consuming computation, it might make sense to have more instances running.

<Badge text="Be aware" type="warning"/>
In case, you are using the `@purista/httpserver` package, keep in mind, that the instances should be started before all other services or the API routing table must be provided as config. Otherwise, the HTTP server instance won't know the correct endpoints and correlating services!

::: tip Pros

- services can be deployed independently
- services can be scaled independently
- code can be handled in multiple repositories and multiple teams independently
- if one service instance crashes, the rest will not be impacted (in the meaning of "they are not automatically killed/crashing")
- different access levels, restrictions, and policies for single services possible
- by using tools like [kubernetes](https://kubernetes.io) more enhanced functions on infrastructure level like autoscaling
- enhanced monitoring and alerting become available because of the needed usage of third-party solutions (like [grafana](https://grafana.com))
- any bigger server/cloud provider has [kubernetes](https://kubernetes.io) focused solutions in his portfolio
:::

::: caution Cons

- much more complex orchestration to handle and will probably need some additional layer like [kubernetes.io](https://kubernetes.io) or [dapr.io](https://dapr.io)
- needs knowledge, time, and ressources to be configured correctly
- instances of services are running 24/7
- will in most cases need third-party applications to handle logs (collecting and merging logs from all instances)
- monitoring and alerting become much more complex and might need third-party solutions
:::
