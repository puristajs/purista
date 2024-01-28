---
title: Concept
description: PURISTA typescript backend framework concept
order: 10
---

# PURISTA Concept

The concept behind PURISTA is quite simple and a message based approach.
There are message senders and receivers.
Messages are exchanged via an event bridge, which is connected to some kind of message broker.

The logic resists in Service. They are the DDD part.
A service is a logical group of commands and subscriptions which relate to a single domain.

Commands are active, triggered by someone, and the caller expects some kind of result. This is similar to functions in any programming language. It means the caller knows about the existence of the called service & command, and he knows at least the input and output format and maybe something about possible error responses.
How the called command function is implemented or how it works is unknown and not related to the caller. Also, the caller does not know which instance is handling the requests.

Subscriptions are a passive part, like event listeners. A subscription is triggered as soon as a message matches the subscription criteria. The producer of this message does not have knowledge about this subscription.

Commands and subscription can call other commands from same or other service by sending command messages. This means, there is a clean, structured and unified internal interface, which is also observable and traceable with error handling out of the box.

This allows real complex setups and scenarios.

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
