---
title: Serverless function
description: Deploy your typescript application in a microservice styled way
order: 504000
---

# Serverless functions (FaaS)

AWS has named its popular function-as-service product _AWS Lambda_ and the word _lambda_ has more or less become a synonym for function-as-service.
Every big player provides a solution for function-as-service. But, the implementation, the possibilities, and the usage differ on each provider - vendor lock.

PURISTA adapts the core idea, to have single, stateless, and independent functions, which can be managed and deployed independently. It also provides an abstraction layer between your business logic and the underneath provider implementation.
Because of this, the vendor lock issue for this specific problem is solved.

In the picture below, you can see a simplified overview of how it might look on AWS.

![example](/graphic/lambda.svg)

::: tip Pros

- most granular scaling solution
- access levels, restrictions, policies on function level possible
- function instances are only running if they are needed (no instance running 24/7 as in other solutions)
- might be more cost-efficient than running instances 24/7
- you can benefit from your cloud provider solutions like AWS Step Functions and similar
- on most providers, functions can be triggered scheduled by time in addition to triggered by an event
:::

::: warning Cons

- needs special knowledge on the used provider to be configured correctly
- deployment & configuration is more complex / bigger amount of stuff to be handled
- might be hard to test locally as soon as one function is invoking other functions.
- logging, tracing, and metrics are depending on cloud provider possibilities
:::
