---
title: Motivation
description: Motivation and benefits to combine PURISTA application with Temporal.
order: 601001
---

# Motivation

Applications built with PURISTA are highly flexible.  
With PURISTA, it's easy to create complex processes.

However, there's a limitation: it's only suitable for building processes where an action immediately triggers a reaction.

If your business logic involves processes that depend on time or need to wait for specific conditions, you'll require a third-party solution. Depending on your specific needs, using something like Redis or [BullMQ](https://bullmq.io) might suffice.

Another option is [Temporal](https://temporal.io), which is an excellent product. It allows you to define complex processes known as workflows. These workflows consist of activities, which are essentially individual steps within the process. For example, a workflow can execute one activity, then wait for a certain period before proceeding to the next activity, or it can wait for a signal before continuing.

The activity represents the actual implementation of a single step within the workflow, while the workflow defines the overall process flow. If an activity can be transformed into a PURISTA command, you can orchestrate PURISTA commands within workflows.

This opens up a whole new range of possibilities.
