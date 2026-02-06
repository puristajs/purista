---
title: Command
description: How to add a command to a PURISTA typescript framework service
order: 202000
---

# Command

![Add command with cli](/graphic/add_command.png)

A command is a single function, which will be called (invoked) by someone with the expectation to get a result back.

Add a command to an existing service with `purista add command`.

## Command lifecycle

1. optional input transform
2. payload/parameter validation
3. before guards
4. command function execution
5. output validation
6. after guards
7. optional output transform

## What to read next

- [The command builder](./the-command-builder.md)
- [Invoke another command](./invoke_command_from_command.md)
- [Expose as HTTP endpoint](./exposing-a-command-as-http-endpoint.md)
- [Test a command](./test-a-command.md)
