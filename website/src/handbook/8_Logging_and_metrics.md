---
# This control sidebar index
index: true
order: 90
# This is the icon of the page
icon: chart-line fas
# This is the title of the article
title: Logging and metrics
# A page can have multiple tags
tag:
  - Guide
# this page is sticky in article list
sticky: true
# this page will appear in article channel in home page
star: true
---

# Logging and metrics

## Logging

PURISTA provides logging as integral part.  
Per default, [tslog](https://tslog.js.org) is used as logging library.  

But you can in theory use any logging library. There is only the need to build a simple wrapper.  
This wrapper should be a class which extends `Logger` from `@purista/core`. See `DefaultLogger.ts` in core package.

The logger is expected to log:

- service name
- service version
- service function/subscription name
- trace id

When messages are logged - the message payload will be removed to prevent leaking of data.

## Metrics

PURISTA has build in functions for metrics. 

### Service events

Each service works as `EventEmitter`. This allows to decouple metrics from business logic.

#### Timings

A service emits events `metric-function-execution` and `metric-subscription-execution` each time a function or subscription is executed. These events containing time measures.

You are also able to add your own metrics entries within a function or subscription. The `context` object contains the `performance` array. Simply put a `MetricEntry` into it, and it will be available with the event.

Example output:

```typescript
[
  {
    traceId: 'oMERFQXVVrVn1Hba1YlFY',
    name: 'functionExecution',
    startTime: 1659034029070,
    endTime: 1659034029071,
    duration: 1,
    functionName: 'testFunction'
  },
  {
    traceId: 'oMERFQXVVrVn1Hba1YlFY',
    name: 'total',
    startTime: 1659034029070,
    endTime: 1659034029071,
    duration: 1,
    functionName: 'testFunction'
  }
```

#### Error tracking

To allow a more flexible way of tracking, monitoring or alerting, you might want to use some external services like [sentry](https://sentry.io/).

To allow a flexible and decoupled way, a service emits the following events:

- `handled-subscription-error` emitted when a subscription throws a HandledError
- `handled-function-error` emitted when a function throws a HandledError
- `unhandled-subscription-error` emitted when a subscription throws an error other than a HandledError
- `unhandled-function-error` emitted when a function throws an error other than a HandledError

#### Events vs subscription

There is also the option to have a subscription for error messages. This only works for functions, but not for subscriptions, as they do not emit a response message. Also, the error handling should be close to the root cause, it works even when there is an issue with event bus, and it might be faster when it comes to alerting.

But, subscriptions should be preferred, if you like to build some (business) analytics like "hourly average of..."