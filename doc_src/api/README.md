@purista/core / [Exports](modules.md)

# PURISTA

A backend framework for building message based domain services.

This framework adapts and combines a wide range of different patters from domain driven design, cqrs, microservice, eventsourcing and lambda functions.

It is build from ground up in typescript and highly focuses on schema, and auto generation of types, input-output-validation, openApi documentation (swagger).

## Why to use PURISTA

PURISTA tries to avoid the need for implementing boilerplate code as much as possible and to automate and autogenerate types, definitions, documentation when ever possible.

Schema and input-output-validation are deeply integrated and they should be used whenever possible to build robust, stable systems.

PURISTA addresses developers which want to simply focus on implementation, while providing them the necessary things to use the great node/typescript tooling.

### Features

- typescript based and with typescript in mind
- mostly async-await (no call-back hell)
- easy versioning of services & api
- modular & extendable
- runs and scales from small single instance up to cloud clusters
- flexible to trace, audit and monitor
- easy to test with ready to go mocks & stubs
- clean error handling
- low learning curve

## Does PURISTA fit for every use case?

Simply answer is **NO**.

If your project is mainly focused on something like processing streams (e.g. video/audio) this framework does not fit for you.  
PURISTA is message based and there are also some low performance impacts based on the strict validations, the high useage of async-await and so on.

- [Core concept](doc/concept.md)
- [Setup a new project](doc/get-started.md)
- [Create a service](doc/create-new-service.md)
  - [Setup a new service](doc/create-new-service.md#Setup_a_new_service)
  - [Add a command function](doc/create-new-service.md#Create_a_command_function)
  - [Add a subscription](doc/create-new-service.md#Create_a_subscription)
- [Error handling in service](doc/error-handling.md)
- [Testing](doc/testing.md)
- Webserver
  - Setup
  - OpenApi
  - Add routes and handlers
  - Serve static content
  - Error Handling
  - Proxy requests
- [Scale up](doc/scale.md)
  - [Combine different Services](doc/scale.md)
  - [Cluster](doc/scale.md)
