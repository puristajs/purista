---
order: 20
title: Monolithic way - horizontal scale
shortTitle: Monolithic way
description: Monolithic
tag:
  - typescript
  - nodejs
  - javascript
  - backend
  - framework
  - cloud
  - microservice
  - lambda
  - Installation
  - Setup
  - Guide
---

It is the most matured and straight forward way, to simply deploy multiple instances to have horizontal scaling and to provide some kind of failover solution.  

In the picture below, a simplified setup with two instances is shown.  
You can scale it up by adding more instances or scale down, to one instance, if you think of [IoT and small edge devices](2_edge_device.md).  

![example](/graphic/monolithic.svg)

This solutions works for a single developer team or for local, development and test environments.  
It perfectly fits for early stages and if the final decision about infrastructure/cloud provider are not made.  
If not enough devops ressources available, this might be a the preferred way.  
Also, costs for running the application are predictable in easy way (price per instance). The costs do not directly correlate to the usage of executing single functions.  
This approach does not need a real cloud provider and you are able to choose cheep (dedicated) servers.

To have a scalable solution, there is a need to ensure that the message broker and the http proxy/load balancer does not become a single point of fail.  
They need to be fault tollerant and should be able to scale or at least to handle the amount of requests.

The overall workload is distributed across all running instances.  
In the picture above you can see, that every user request is sent to the http server service of one of the instances.  
The http server itself invokes the correlating command of the matching service.  
The invoked service might be executed on same instance or on a different instance. This depends on the message broker and the timing.  
The command execution result will be sent to the instance, which was receiving the users request and will respond to the users request.  

Subscriptions are triggered by messages from the message broker. This means they are executed at "some" of the instances.

<Badge text="Be aware" type="warning"/>  
If you need some kind of **state or session handling**:  
Because execution of commands and subscription is generally done on "any of the instances" (random!), state handling will need some shared state store, even if a single user session is pinned to a specific instance!

The simple and common solution, to advice the load balancer/proxy, to pin the users session to always the same instance, and to store the session data simply in the memory of that instance, will **not work** properly! Only the same http server service will be invoked, but the command, corresponding to called http endpoint, might be executed on any of the available instance.

You will need some additional external, shared state storage!

## Pros

- simple in basic setup
- can run on bare metal with no additional overhead (IoT/edge devices)
- low configuration
- scales workload
- provides low level backup
- different geo locations possible
- ensures all services (schemas, db migrations...) are in sync
- can be done at nearly any provider

## Cons

- the need to deploy always all services
- different access levels, restrictions, policies for services & functions is not possible
- every instance can only have one PURISTA eventbridge instance per service version
- instances (incl. all services & functions) are running 24/7
- most likely a lot of manual steps
- the amount of work to manage grows with the amount of instances in most cases
- every addition, like state handling, secret and config stores, must be provided - somehow
- code must be in monorepo or additional effort to merge all repos to single deployment bundle
