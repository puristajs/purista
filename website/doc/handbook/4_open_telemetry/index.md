---
title: Open Telemetry
description: Tracing and metrics with Opentelemetry in PURISTA typescript nodejs backend framework applications and how to use them.
order: 400000
---

# Open Telemetry

PURISTA has build in support for [OpenTelemetry](https://opentelemetry.io/) and it is deeply integrated into the framework.

This means, there is a industrial standard way of tracking and metrics out of the box. This not only allows you to use nice third party applications for analysing and alerting.
It means also a huge benefit, when it comes to integration. This enables you, to trace and collect metrics across your whole setup and not to be restricted only to the PURISTA part.

## Tracing

Traceability comes in place at least when something does not work as expected.

One kind of issues are the ones, which are the more technical ones. Some function is throwing some error.
In other software designs, you often end up with some code line number, and you start digging into the code, follow all the logic through a lot of files. You jump from one abstraction to the next one. You check wrapper by wrapper, interfaces and all that stuff.
This can become quite challenging, if for example in production only bundled and compiled javascript code is deployed. In this case line numbers and even function names might completely differ from your source typescript code.

The other kind of issues are even harder to track. If the stuff is working from technical point of view, but not from business view.
In this case, you need to walk through the code logic, and check if the business logic is matching the implementation logic. And depending on your abstractions, layers and wrappers you will quickly blow up your head.

The concept of PURISTA will help you in both cases. You simply follow the message flow. Check the input/output of the functions, and you will find the root cause quickly.
You are able to follow single requests, because each one has a unique trace id all the way down. You can attach external providers and software solutions to track errors on each of your functions. You can track metrics on each of your functions.

## Metrics

Collecting metrics will become necessary at a certain point of growing.

Metrics should also be categorized into two big topics.

There are technical and functional metric values. Examples are things like time and ressource consumptions, counting failures and success, response times and so on.

On the other side you will have business related metrics.This includes more customer and user centric values. As an example you can think of things like active user count, daily active users, average order amount of users.

### Technical metric values

For handling the technical metric values, PURISTA tries to provide simple, first class connectivity to standard third party solutions. In most cases, this will simply a configuration.

### Business metric values

When it comes to business metrics, things become quite challenging, because this highly depends on your business, your metrics you like to collect and the third party solution you like to use to analyse business metrics.
This means, there can't be a out-of-the-box soulition for you needs.
But PURISTA can help you, to quickly aggregate values you need, because of its core concept.
