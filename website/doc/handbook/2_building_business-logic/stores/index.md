---
title: Stores
description: Config stores, state stores and secret stores in PURISTA typescript framwork
order: 206000
---

# Stores

Stores in PURISTA are an abstraction layer.  
They provide a unified interface for handling configurations, secrets and states, without the need to know the actual implementation or used product.
This ensures, that the actual business implementation is decoupled and isolated.

When considering separation of concerns, PURISTA offers three types of stores. While they share similar APIs, each store type is tailored to address specific use cases.

## Config store

The config store serves as a repository for storing and retrieving technical configurations. For instance, you might store the URL of a third-party provider here, allowing commands or subscriptions to access this information when needed, such as in the [HttpClient](../fetch_based_http_client.md).

## Secret store

The secret store is designed to safeguard confidential and private data. For instance, if your HTTP request to a third-party provider requires API keys for authentication and authorization, it's essential to store your personal API key securely in the secret store.

## State store

State stores are tasked with managing the business states of your application. In PURISTA, commands and subscriptions are designed to be stateless, operating within a distributed system. If, for example, you require user sessions, you would utilize the state store to store session information.
