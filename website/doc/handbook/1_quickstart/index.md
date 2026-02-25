---
title: Quickstart
description: Quickstart for creating a PURISTA typescript backend framework based project
order: 100000
---

# PURISTA Quickstart

In this quickstart example, you will learn how to install and use the **PURISTA CLI** (`npm i -g @purista/cli` or `npx @purista/cli ...`). The CLI is the standard way to add services, commands, subscriptions, **and queues**—every tutorial step references the command to run so you can follow the same workflow in real projects.

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
