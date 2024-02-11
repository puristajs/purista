---
title: Unit Test the Service
description: How to unit test a PURISTA service
order: 201030
---

# Unit test the service

A service itself does not contain any logic which needs to be tested. It a container/group for commands and subscriptions.

If you use the CLI to generate a service, a simple unit test is generated. This test does not need any changes and only tests for valid configurations.

If you use an custom domain class, you might need to test this class. But be aware, that a service class __should not__ contain business logic.  
Use custom classes to provide something like database connections.