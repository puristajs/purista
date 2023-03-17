---
order: 70
shortTitle: Stores
title: Stores
description: Stores
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

Stores are provided inside the `context` of command functions and subscription functions.

## Config store

A configuration passed into the service creation, should focus on technical configurations. As an example, defining urls, ports, timeouts and similar, are technical configurations.  
Configurations, related to business logic, like feature flags and values for business calculations, should be separated from technical configurations. This allows to manage configuration, without the need to restart instances, and to use solutions like AWS Parameter Store, without directly coupling vendor specific solutions to business code.  
The config store is a simple interface to a key-value-store.

## Secret store

The secret store is addressing two things.  
One focus is, to provide a solution, where the secret is short living, and only available, when there is an actual need for it. Secrets should not be provided via service configuration.  
The second reason for the secret store interface:  
It provides the possibility, to use different solutions like AWS Secret Store, without vendor specific code implementation, within the business code.  
The secret store is a simple interface to a key-value-store.

## State store

State stores are essential for scaling.  
Decoupling the business logic from the actual used state store, allows the usage of different databases or vendor solutions.  
The state store is a simple interface to a key-value-store.
