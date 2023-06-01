---
# This control sidebar index
index: true
# This is the title of the article
title: Introducing PURISTA TypeScript Framework v1.7 - Enhanced Messaging and Improved Stability
shortTitle: PURISTA version 1.7
description: Introducing PURISTA TypeScript Framework v1.7 - Enhanced Messaging and Improved Stability
tag:
 - purista
 - version 1.7.0
category:
 - version
 - news
 - announcement
star: true
isOriginal: true
image: https://purista.dev/graphic/nats_event_bridge_header.png
cover: https://purista.dev/graphic/nats_event_bridge_header.png
---

PURISTA Logo

We are thrilled to announce the release of PURISTA TypeScript Framework v1.7, the latest version of our powerful and versatile framework for building robust applications.  
This release introduces exciting new features, improvements, and bug fixes, making PURISTA even more reliable and efficient. Let's dive into the highlights of this release.

<!-- more -->

## New Features

### NATS as Message Broker

With PURISTA v1.7, we are excited to introduce NATS as a new message broker option. NATS is a lightweight and high-performance messaging system that provides reliable communication between microservices. By integrating NATS into PURISTA, we enhance the messaging capabilities and facilitate seamless communication within your application.

### NATS State Store for JetStream Enabled NATS Server

PURISTA now supports the NATS State Store for JetStream enabled NATS servers. This feature enables efficient state management within the NATS server, allowing you to store and retrieve application-specific data.

### NATS Config Store for JetStream Enabled NATS Server

To further enhance the configurability of your JetStream enabled NATS server, we have introduced the NATS Config Store feature in PURISTA v1.7. This feature enables you to store and manage configuration data in the JetStream enabled NATS server, providing a centralized and scalable solution.

### Redis Config Store

PURISTA v1.7 now also supports the Redis Config Store, expanding the range of configuration storage options. Redis is a popular and robust in-memory data store, and integrating it into PURISTA allows you to leverage its powerful features for managing your application's configurations effectively.

### Infisical Secret Store

Keeping secrets secure is crucial in modern applications. With the Infisical Secret Store feature in PURISTA v1.7, you can securely store and access sensitive information, such as API keys and authentication tokens, ensuring the highest level of security for your application.

## Breaking Changes

In previous versions of PURISTA, messages only contained the instanceId of the sender, with the instanceId being a property in the root of a message.  
However, in v1.7, we have made changes to enhance the messaging structure.  
The instanceId of the sender is now moved to the sender property, and the instanceId of the receiver (if available) is included in the receiver property.  
This change allows for more granular subscription targeting, enabling you to subscribe to specific senders or receivers.  
Additionally, this modification simplifies support for topic-based brokers like MQTT and NATS, eliminating the need for duplicate message publications.

## Other Improvements and Fixes

In addition to the exciting new features mentioned above, PURISTA v1.7 includes various other enhancements and bug fixes to provide a more stable and seamless development experience. Some notable improvements include:

**Improved documentation:** We have invested effort in enhancing the documentation to make it more comprehensive, accessible, and easier to follow. The updated documentation will serve as an excellent resource for both new and experienced PURISTA users.
Fixed minor bugs: We have addressed several minor bugs reported by the community, ensuring a smoother and more reliable framework experience.  

## Examples and Documentation

To help you get started with the new features and improvements in PURISTA v1.7, we have provided comprehensive examples, documentation, and a handbook. These resources offer step-by-step guidance, code samples, and best practices to assist you in leveraging the full potential of the framework.

Remember to refer to the official PURISTA documentation at [purista.dev](https://purista.dev) and the examples provided at the GitHub repository [github.com/sebastianwessel/purista](https://github.com/sebastianwessel/purista).
