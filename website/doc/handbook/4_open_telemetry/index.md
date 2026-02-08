---
title: Open Telemetry
description: Tracing and metrics with Opentelemetry in PURISTA typescript nodejs backend framework applications and how to use them.
order: 400000
---

# Open Telemetry

PURISTA has built-in support for [OpenTelemetry](https://opentelemetry.io/) and it is deeply integrated into the framework.

This means there is an industry-standard way of tracing and metrics out of the box. This not only allows you to use third-party applications for analysis and alerting.
It is also a huge benefit when it comes to integration. This enables you to trace and collect metrics across your whole setup and not be restricted only to the PURISTA part.

## Tracing

Traceability becomes essential when something does not work as expected.

One kind of issues are the ones, which are the more technical ones. Some function is throwing some error.
In other software designs, you often end up with some code line number, and you start digging into the code, follow all the logic through a lot of files. You jump from one abstraction to the next one. You check wrapper by wrapper, interfaces and all that stuff.
This can become quite challenging, if for example in production only bundled and compiled javascript code is deployed. In this case line numbers and even function names might completely differ from your source typescript code.

The other kind of issues are even harder to track: things work from a technical point of view, but not from a business point of view.
In this case, you need to walk through the code logic, and check if the business logic is matching the implementation logic. And depending on your abstractions, layers and wrappers you will quickly blow up your head.

The concept of PURISTA will help you in both cases. You simply follow the message flow. Check the input/output of the functions, and you will find the root cause quickly.
You are able to follow single requests, because each one has a unique trace id all the way down. You can attach external providers and software solutions to track errors on each of your functions. You can track metrics on each of your functions.

## Metrics

Collecting metrics becomes necessary at a certain scale.

Metrics should also be categorized into two big topics.

There are technical and functional metric values. Examples include time and resource consumption, failure and success counts, response times, and so on.

On the other side, you will have business-related metrics. This includes customer- and user-centric values. For example, active user count, daily active users, or average order amount.

### Technical metric values

For technical metric values, PURISTA tries to provide simple, first-class connectivity to standard third-party solutions. In most cases, this is just configuration.

### Business metric values

When it comes to business metrics, things become more challenging, because this highly depends on your business, the metrics you want to collect, and the third-party solution you want to use for analysis.
This means there cannot be an out-of-the-box solution for every need.
But PURISTA can help you quickly aggregate the values you need because of its core concept.
