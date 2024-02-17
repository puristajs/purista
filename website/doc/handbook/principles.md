---
title: Principles
description: PURISTA typescript backend framework concept
order: 20
---

# Principles of PURISTA

Here is a list of principles and goals of the PURISTA TypeScript framework.

## Focus on business logic

In the realm of PURISTA, one principle reigns supreme: **Focus on business logic**.
Our unwavering commitment is to swiftly deliver tangible business value with unwavering reliability and unparalleled flexibility.

## Isolation & separation

In the realm of PURISTA, our ethos revolves around a set of fundamental principles, ensuring the robust implementation of business logic:

1. **Isolation and Separation**: Business logic implementation adheres strictly to the principles of isolation and separation. The "outside world" is viewed as a black box with well-defined interfaces.

2. **Service Specificity**: Each service is dedicated to a single entity, maintaining clarity and focus within its domain.

3. **Isolated Commands and Subscriptions**: Commands and subscriptions operate in isolation, interacting with the external environment solely through known interfaces. This ensures a clear separation of concerns and minimizes dependencies.

4. **Runtime Validation**: Every input and output exchanged with a command or subscription undergoes rigorous validation during runtime, enhancing system reliability and security.

5. **Separation of Concerns**: Following the principle of separation of concerns, each component within PURISTA is designed with a clear and distinct purpose, fostering maintainability and scalability.

In essence, PURISTA embodies a steadfast commitment to excellence, ensuring the rapid delivery of business value while upholding the highest standards of reliability and flexibility.

## Stateless

Business logic implementation should remain stateless. By ensuring that implementations remain stateless, scaling and managing distributed systems becomes much easier.

PURISTA offers mechanisms to manage business states without the need for stateful implementations.

## Configuration

PURISTA follows the pattern to have always default values for config and settings.
These defaults can be overwritten.

## Handling of data

PURISTA empowers developers to construct applications that prioritize important principles such as data protection and the minimization of data usage. With PURISTA, developers can ensure that their applications are not only functional and efficient but also adhere to fundamental principles of privacy and data minimization.

## Tracing & Logging

In PURISTA, we prioritize key features like tracing, logging, and error handling. These important aspects are built into the framework automatically, making them easy to use from the start.

Moreover, PURISTA offers plenty of helpful tools and functions. These make tasks simpler and more straightforward for developers. With PURISTA, you'll find everything you need to streamline your work and boost productivity.

## Performance via scaling

In PURISTA, we understand the importance of performance. However, certain features like using messages for communication, checking data during runtime, and handling errors come with trade-offs in performance. Despite this, we prioritize these features over things like maximizing raw speed for processing HTTP requests.

Building software with PURISTA offers great flexibility in scaling. This means applications made with PURISTA can handle large amounts of work in various ways. Because of this flexibility, applications built with PURISTA can deliver excellent overall performance. They also offer high reliability when things go wrong and interesting options for recovering from errors.

## Decouple Logic from Infrastructure and Architecture

PURISTA offers a solution that lets you develop your business logic independently of the infrastructure or major architectural decisions. This means you can focus on building your logic without worrying about how it will fit into your infrastructure setup or future architectural changes.

By decoupling your logic from infrastructure, PURISTA minimizes the risk of vendor lock-in and makes it much easier to migrate to different service providers in the future. This flexibility ensures that your business logic remains agile and adaptable to evolving needs and technologies.
