---
title: Version 1.7
description: "Introducing PURISTA TypeScript Framework v1.7 - Enhanced Messaging and Improved Stability"
date: 2023-06-01
order: 20230601
---


We are happy to announce the release of PURISTA TypeScript Framework v1.7.
This release introduces new features, improvements, and bug fixes that make PURISTA more reliable and efficient.

---

## New Features

### NATS as Message Broker

With PURISTA v1.7, we are excited to introduce NATS as a new message broker option. NATS is a lightweight and high-performance messaging system that provides reliable communication between microservices. By integrating NATS into PURISTA, we enhance the messaging capabilities and facilitate seamless communication within your application.

### NATS State Store for JetStream Enabled NATS Server

PURISTA now supports the NATS State Store for JetStream enabled NATS servers. This feature enables efficient state management within the NATS server, allowing you to store and retrieve application-specific data.

### NATS Config Store for JetStream Enabled NATS Server

To further enhance the configurability of JetStream-enabled NATS servers, we introduced the NATS Config Store in PURISTA v1.7. This enables you to store and manage configuration data in NATS with a centralized and scalable approach.

### Redis Config Store

PURISTA v1.7 now also supports the Redis Config Store, expanding the range of configuration storage options. Redis is a popular and robust in-memory data store, and integrating it into PURISTA allows you to leverage its powerful features for managing your application's configurations effectively.

### Infisical Secret Store

Keeping secrets secure is crucial in modern applications. With the Infisical Secret Store feature in PURISTA v1.7, you can securely store and access sensitive information, such as API keys and authentication tokens, ensuring the highest level of security for your application.

## Breaking Changes

In previous versions of PURISTA, messages only contained the sender `instanceId` in the root object.
In v1.7, we changed this to improve messaging structure.
The instanceId of the sender is now moved to the sender property, and the instanceId of the receiver (if available) is included in the receiver property.
This change allows for more granular subscription targeting, enabling you to subscribe to specific senders or receivers.
Additionally, this modification simplifies support for topic-based brokers like MQTT and NATS, eliminating the need for duplicate message publications.

## Other Improvements and Fixes

In addition to the exciting new features mentioned above, PURISTA v1.7 includes various other enhancements and bug fixes to provide a more stable and seamless development experience. Some notable improvements include:

- **Improved documentation:** We enhanced documentation to make it more comprehensive, accessible, and easier to follow.
- **Fixed minor bugs:** We addressed several community-reported issues for a smoother and more reliable framework experience.

## Examples and Documentation

To help you get started with the new features and improvements in PURISTA v1.7, we have provided comprehensive examples, documentation, and a handbook. These resources offer step-by-step guidance, code samples, and best practices to assist you in leveraging the full potential of the framework.

Remember to refer to the official PURISTA documentation at [purista.dev](https://purista.dev) and the examples provided at the GitHub repository [github.com/puristajs/purista](https://github.com/puristajs/purista).
