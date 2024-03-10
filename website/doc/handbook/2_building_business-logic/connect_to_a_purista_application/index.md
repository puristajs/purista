---
title: Connect to PURISTA
description: How to communicate and connect from external to a PURISTA application with client builder
order: 210000
---

# Connect the Outside World to PURISTA

In real-world scenarios, you will need to connect from the outside to your application. You might want to provide a client package, which you want to make public, without sharing your whole internal code.

As PURISTA has the concept of builders, the information about your structure, endpoints, and so on is already available for automation. Because of this, building a client is a two-step process:

1. Extract the information out of your code ([Export service definitions](./export_service_definitions.md))
2. Use the extracted information to generate clients:
   - [REST API client](./create_a_rest_api_client.md)
   - [EventBridge](./create_an_eventbridge_client.md) client
   - [Embedded Client](./embedded_client.md)
