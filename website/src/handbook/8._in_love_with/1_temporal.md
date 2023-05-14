---
order: 10
title: Temporal
shortTitle: Temporal
description: Temporal
image: https://purista.dev/graphic/temporal.png
cover: https://purista.dev/graphic/temporal.png
tag:
  - temporal
---

With PURISTA you are able to build complex business logic. But it still has limitations.  
The logic is limited to be a kind of waterfall. Each action results in triggers for other actions.  
This might not fit for complex business logic, which involves a lot of cross domain actions and time based logic.

Here, [Temporal](https://temporal.io) is one cool way to close the gap.  

The concept of Temporal has two main parts. They are called _Workflow_ and _Activity_.  

A _Workflow_ maps the business logic to code execution order. A _Workflow_ itself does not contain actual implementations of functions.  
_Activities_ are the actual implementation of functions, arranged in _Workflows_.  

This concept perfectly matches to PURISTA. It is possible to map _Activities_ to PURISTA commands.

![Example](/graphic/temporal.svg)

In the example above, you can see how a new user workflow of an imaginary bank is controlled by Temporal. The actual implementation is done in PURISTA. Here, features like sending emails or SMS to customer, can be added in PURISTA, while keeping the workflow untouched.

Temporal provides a lot more features, like time based functionality, signals, workflow tracing and so on.

::: info
In future, there will be some helpers, examples and documentation available, on how to integrate Temporal in your PURISTA project.  
It's on the roadmap: [GitHub issue](https://github.com/sebastianwessel/purista/issues/86)
:::

__see: [Temporal](https://temporal.io)__

__You can follow updated on Twitter [@purista_js](https://twitter.com/purista_js) or join the [Discord server](https://discord.gg/9feaUm3H2v) to get in touch with PURISTA maintainers and other developers.__
