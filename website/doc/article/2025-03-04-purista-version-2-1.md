---
title: Version 2.1
description: PURISTA 2.1 – A Minor Update with Bug Fixes and Enhancements.
date: 2025-03-04
order: 20250304
image: /graphic/purista_2_1_cover.jpg
---
<PostDetail>

In version 2.1, we have made several improvements and bug fixes to enhance the functionality of PURISTA. This update includes:

## Enhancements

### HttpClient

The `baseUrl` parameter in HttpClient is now optional. Previously, it was mandatory, as the main use case was to an external API with multiple endpoints. Making the parameter optional allows a simpler usage, when it is used only for a single request.

### Service Event Handling

The service event enum was a Typescript enum, which is now deprecated. It is replaced by a new object-based approach. This change allows to useage of Nodes.js with `--experimental-strip-types` flag, to run typescript natively. See **[Running TypeScript Natively](https://nodejs.org/en/learn/typescript/run-natively)**.

**Previously:**

```ts
export enum ServiceEvent {
  /**
   * Emitted by ping v1 command ping:
   * the ping command exposed as http endpoint
   */
  Pinged = 'pinged',
}
```

**New approach:**

```ts
export const ServiceEvent {
  /**
   * Emitted by ping v1 command ping:
   * the ping command exposed as http endpoint
   */
  Pinged: 'pinged',
} as const
```

The CLI is able to handle both approaches. It is recommend to migrate to the new approach for better compatibility with future versions of PURISTA. The PURISTA template is already updated to use the new approach.

## Bugfixes

There was a memory leak in the `DefaultEventBridge` service that has been fixed. This issue caused the application to consume more memory over time, leading to potential crashes or performance degradation. The fix involves ensuring proper cleanup of resources and adds additional logging in case of unexpected behavior.

</PostDetail>
