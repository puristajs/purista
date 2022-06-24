---
home: true
icon: house fas
title: PURISTA
heroText: PURISTA
tagline: THE TYPESCRIPT BACKEND FRAMEWORK
actions:
  - text: Get started
    link: /handbook/0_concept
    icon: bolt fas
    type: primary
  - text: Github
    link: https://github.com/sebastianwessel/purista
    icon: github fa-brands
    type: secondary

features:
  - title: 100% Typescript
    icon: node fa-brands
    details: typescript based and with typescript in mind and mostly async-await (no call-back hell)
    link: /handbook/1_get-started

  - title: K.I.S.S
    icon: face-kiss-wink-heart fas
    details: simply just implement your logic without overhead
    link: /handbook/0_concept

  - title: Modular & extendable
    icon: boxes-stacked fas
    details: adding new functions and services is simple, fast and isolated
    link: /handbook/0_concept

  - title: Scales
    icon: arrow-up-right-dots fas
    details: runs and scales from small single instance up to cloud clusters.
    link: /handbook/5_scale

  - title: Compliance & Monitoring
    icon: shield-halved fas
    details: flexible to trace, audit and monitor and to get a clear picture of what's going on
    link: /handbook/0_concept

  - title: Easy to test
    icon: vial-circle-check fas
    details: easy to test with ready to go mocks & stubs which increases productivity and reduces costs
    link: /handbook/4_testing


copyright: false
footer: Made from developers for developers with ❤️ | <a href="/privacy.html">Privacy</a> | <a href="/imprint.html">Imprint</a>
---

# PURISTA

A backend framework for building message based domain services.

This framework adapts and combines a wide range of different patters from domain driven design, cqrs, microservice, event sourcing and lambda functions.

It is build from ground up in typescript and highly focuses on schema, and auto generation of types, input-output-validation, openApi documentation (swagger).

## Why to use PURISTA

PURISTA tries to avoid the need for implementing boilerplate code as much as possible and to automate and autogenerate types, definitions, documentation when ever possible.

Schema and input-output-validation are deeply integrated, and they should be used whenever possible to build robust, stable systems.

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
