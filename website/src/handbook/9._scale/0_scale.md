---
order: 1
title: Scale your project
shortTitle: Scaling
description: Learn how to scale nodejs typescript applications built with PURISTA framework.
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

PURISTA adapts the ideas from microservices and serverless functions to separate the logic into small pieces and to use some way of unified communication. The underlaying way of communication is blackboxed to the implementation of your business logic.
This means you can scale things as you need, while keeping your business logic safe and separated.

## Benefits

Because of blackboxing the whole underlaying system, you do not need to decide at the very first step, how you like to deploy or how you like to scale at the end.  
You can simply start local and scale when you need. You are not nailed down to start with infrastructure or architectural questions and setups.

Start small and efficient, like you would do with the beginners "hello world" example, and move to the solution which fits your needs.

You are not limited to scale "the whole blob". You are able to scale parts of your software differently.

As an example, you might have some function which takes longer for processing data. This means this function can't handle the same amount of requests, then the rest of your system. You are able to scale this specific part by adding more instances, without the need to have more instance for all of your functions.

Also, in times of IoT and edge computing, you are able to build software, which can run on edge devices with low footprint and also runs in server and cloud environments with the possibility to be highly scalable