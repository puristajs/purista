---
title: Version 2.1
description: PURISTA 2.1 - a minor update with bug fixes and enhancements.
date: 2025-03-04
order: 20250304
image: /graphic/purista_2_1_cover.jpg
---
<PostDetail>

In version 2.1, we made several improvements and bug fixes to enhance PURISTA. This update includes:

## Enhancements

### HttpClient

The `baseUrl` parameter in HttpClient is now optional. Previously, it was mandatory, as the primary use case was interacting with an external API with multiple endpoints. Making this parameter optional allows for simpler usage when making a single request.

### Service Event Handling

The service event enum was previously a TypeScript `enum`, which is now deprecated. It has been replaced with a new object-based approach. This change enables the use of Node.js with the `--experimental-strip-types` flag to run TypeScript natively. See **[Running TypeScript Natively](https://nodejs.org/en/learn/typescript/run-natively)**.

**Previous approach:**

```ts
export enum ServiceEvent {
  /**
   * Emitted by the ping v1 command:
   * the ping command is exposed as an HTTP endpoint.
   */
  Pinged = 'pinged',
}
```

**New approach:**

```ts
export const ServiceEvent = {
  /**
   * Emitted by the ping v1 command:
   * the ping command is exposed as an HTTP endpoint.
   */
  Pinged: 'pinged',
} as const
```

The CLI supports both approaches. However, migrating to the new approach is recommended for better compatibility with future versions of PURISTA. The PURISTA template has already been updated to use this new approach.

## Bug Fixes

A memory leak in the `DefaultEventBridge` service has been fixed. This issue caused the application to consume increasing amounts of memory over time, potentially leading to crashes or performance degradation. The fix ensures proper resource cleanup and adds additional logging to detect unexpected behavior.

</PostDetail>
