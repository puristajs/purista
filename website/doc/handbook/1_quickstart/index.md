---
title: Quickstart
description: Quickstart for creating a PURISTA typescript backend framework based project
order: 100000
---

# PURISTA Quickstart

In this quickstart example, you will use the PURISTA CLI to create a project and then extend it with generated business artifacts. Start with `npm create purista@latest` or `purista init my-app`, then use `purista add ...` commands as you work through the guide.

We will build a simple application with synchronous + asynchronous flows (service, command, subscription, stream, and a queue-powered async endpoint).  

## What you will build

1. a service
2. one synchronous command
3. one queue + worker pair (via `purista add queue`)
4. one subscription reacting to command events
5. one stream for incremental responses
6. a runnable local setup

## Requirements

- [Node](https://nodejs.org/) is installed on your local machine (LTS version recommended)
- a code editor like VSCode, Zed or similar
