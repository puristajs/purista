---
title: Principles
description: PURISTA typescript backend framework concept
order: 20
---

# Principles of PURISTA

## Focus on business logic

## Isolation & separation

The implementation of business logic should follow the principals of isolation and separation. The "outside world" should be seen as black box with known interfaces.

- a service relates to one entity
- commands and subscriptions are isolated and they only know the interface shape to the outside world
- every input and output to/from a command or subscription should be validated

## Configuration

PURISTA follows the pattern to have always default values for config and settings.
These defaults can be overwritten.

## Handling of data

## Tracing & Logging

## Performance via scaling
