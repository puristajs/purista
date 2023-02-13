---
# This control sidebar index
index: true
# This is the title of the article
title: Introducing PURISTA version 1.5.0
shortTitle: PURISTA version 1.5.0
description: Checkout all the awesome features, improvements and changes in PURISTA v1.5.0 typescript framework.
tag:
  - purista
# this page will appear in article channel in home page
star: true
excerpt: <p>Checkout all the awesome features, improvements and changes in PURISTA v1.5.0 typescript framework.</p>
---

Version 1.5.0 of PURISTA backend typescript framework contains a lot of features, enhancements, improvements and also some breaking changes.  

<!-- more -->

## @purista/cli - cli automation

## Opentelemetry support

## Improved and simplified interfaces

### Breaking changes

- getInstance
- http server
- default eventbridge
- amqp eventbridge

### Deprecations

- FunctionDefinitionBuilder -> CommandDefinitionBuilder
  - setFunction / setCommandFunction
  - getFunction / getCommandFunction
- SubscriptionDefinitionBuilder
  - setFunction / setSubscriptionFunction
  - getFunction / getSubscriptionFunction
- ServiceBuilder
  - addFunctionDefinition -> addCommandDefinition
  - getFunctionBuilder -> getCommandBuilder

- getEventBridgeMock has now optionalparameter sandbox
- getLoggerMock has now optionalparameter sandbox
- getFunctionContextMock is now getCommandContextMock and has now optional parameter sandbox
- getSubscriptionContextMock has now optionalparameter sandbox

## Example overhauling

## Migration to version 1.5.0


