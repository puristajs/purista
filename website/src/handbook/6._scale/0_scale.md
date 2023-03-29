---
order: 1
title: Scale your project
shortTitle: Scaling
description: Learn how to scale nodejs typescript applications built with PURISTA framework.
tag:
  - scaling
  - scale
  - performance
---

PURISTA adapts the ideas from microservices and serverless functions to separate the logic into small pieces and to use some way of unified communication. The underlying way of communication is black-boxed to the implementation of your business logic.
This means you can scale things as you need while keeping your business logic safe and separated.

## Benefits

Because of black-boxing the whole underlying system, you do not need to decide at the very first step, how you like to deploy or how you like to scale at the end.
You can simply start locally and scale when you need. You are not nailed down to start with infrastructure or architectural questions and setups.

Start small and efficiently, like you would do with the beginner "hello world" example, and move to the solution which fits your needs.

You are not limited to scale "the whole blob". You can scale parts of your software differently.

As an example, you might have some function that takes longer for processing data. This means this function can't handle the same amount of requests, then the rest of your system. You can scale this specific part by adding more instances, without the need to have more instances for all of your functions.

Also, in times of IoT and edge computing, you can build software, which can run on edge devices with low footprint and also runs in server and cloud environments with the possibility to be highly scalable
