---
order: 30
title: Transformer & Guards
shortTitle: Transformer & Guards
description: Learn how to unit test a single service command
image: https://purista.dev/graphic/add_command.png
tag:
  - service
  - command
  - test
  - unit test
  - jest
  - mock
---

PURISTA provides transformers and hooks for commands.

## Transformer

The idea of having transformers, follows the PURISTA principal to separate things and decouple business logic from technical needs.  
Transformers are responsible to convert the raw message payload in/to the data shape & type, the command function is expecting.

Use transformers for:

- converting data format (example xml to js object to xml)
- decrypt and encrypt the payload (end-to-end encryption)

### Input transformer

If a input transform is set, it will be executed as very first step in the message handling.  
The input transformer has it's own schemas for input payload and parameters.  
If the schema validation fails, an error response will automatically created and sent back to the caller. The command guards and the command function are not executed, if this validations fails.
The error will be a `HandledError` with status of `Bad Request`, as the input is not as expected.

If the transform function itself is throwing an error, other than `HandledError`, a `UnhandledError` with status `Internal Server Error` is sent back to the caller.

If the transformer is used for decryption, and the decryption fails, the transform function should throw a `HandledError` with a status of `Unauthorized` or `Not permitted`.

The transform function must return a object with `payload` and `parameter` property. The type of these two properties is generated and set, based on the command function input schema and command function parameter schema.
Because of this, the input transformer must be defined after the command function schemas.

### Output transformer

If a output transform is set, it will be executed as very last step in the message handling.  
The output transformer has it's own schema, which will validate the returned value of the transform function.  
If the schema validation fails, an error response will automatically created and sent back to the caller. The command guards and the command function are not executed, if this validations fails.

If the transform function itself is throwing an error, other than `HandledError`, a `UnhandledError` with status `Internal Server Error` is sent back to the caller.

The transform function must return the final raw payload.
Because of this, the output transformer must be defined after the command function schemas.

## Guards

The intention of guards is, to have the opportunity, to move authentication and authorization logic out of the main business logic.  
A common example is, to add role and permission checks by using guards.

You can add multiple values to command function. Guards are executed in parallel after transformers and before the command function is executed.  
Guards should throw a `HandledError` with a proper status code, if the execution should be aborted.  
If a guard is throwing an error, other than a `HandledError`, a `UnhandledError` with status `Internal Server Error` is sent back to the caller.

A guard should not change values and does not return a value.
