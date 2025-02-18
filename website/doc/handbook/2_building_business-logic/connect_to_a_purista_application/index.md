---
title: Connect to PURISTA
description: How to communicate and connect from external to a PURISTA application with client builder
order: 210000
---

# Connect the Outside World to PURISTA

In real-world scenarios, you often need to allow external access to your application. You may want to provide a client package that is publicly available without exposing your entire internal codebase.

Since PURISTA uses the concept of builders, information about your structure, endpoints, and other details is already accessible for automation. This makes building a client a simple two-step process:

1. Extract the necessary information from your code ([Export service definitions](./export_service_definitions.md))
2. Use the extracted information to generate clients:
   - [REST API client](./create_a_rest_api_client.md)
   - [EventBridge](./create_an_eventbridge_client.md) client
   - [Embedded Client](./embedded_client.md)
