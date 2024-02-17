---
title: Concept
description: PURISTA typescript backend framework concept
order: 10
---

# PURISTA Concept

PURISTA operates on a straightforward message-based system. In this system, there are message senders and receivers. Messages are passed through an event bridge, which connects to a message broker.

The heart of PURISTA's logic lies in its Services, which follow the principles of Domain-Driven Design (DDD). Each Service represents a logical grouping of commands and subscriptions that pertain to a specific domain.

Commands are active actions triggered by an external source. When a command is invoked, the caller expects a response. Think of commands as similar to functions in traditional programming languages. The caller knows about the command's existence, its input and output formats, and potentially error responses. However, the caller doesn't need to understand how the command is implemented or executed, nor does it need to know which instance of the service is handling the request.

On the other hand, Subscriptions are passive listeners. When a message matches the criteria defined by a subscription, the subscription is triggered. Importantly, the producer of the message isn't aware of any subscriptions that may be listening.

Commands and subscriptions can invoke other commands within the same or different services by sending command messages. This creates a structured and unified internal interface that allows for clean communication between components. Additionally, this setup provides built-in error handling capabilities, making the system both observable and traceable.

By leveraging this architecture, PURISTA enables the creation of complex setups and scenarios with ease.

## Example

We will use a simple example for better understanding.

![example](/graphic/user_email_example.svg)

- the browser calls the endpoint `/api/v1/sign-up`
- the web server will send a command request `userSignUp` to the event bridge, which is received by an instance of service `User`
- the command `userSignUp` is responding to the web server with the ID of this new created user via the event bridge
- the response of command `userSignUp` is marked with the event name `newUserRegistered`
- the web server will receive the response command `userSignUp` and sends the response back to the browsers
- the service `Email` has a subscription `sendWelcomeEmail` which is listening to all successful calls to `newUserRegistered` command
- the subscription `sendWelcomeEmail` in service `Email` connects to the mail provider and sends the email

Each of these steps is only one single and simple function, which is easy to implement, to understand and to test.
Each of these steps has input-output-validation in place.
Each step has its own error handling and responses are divided into success and error response.
Each step is decoupled from the others.

The different services can be implemented by different developers, which are able to work independently on their feature.
