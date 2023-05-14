---
order: 20
title: Test a subscription
shortTitle: Test a subscription
description: Learn how to unit test a single service subscription
image: https://purista.dev/graphic/add_subscription.png
tag:
  - service
  - subscription
  - test
  - unit test
  - jest
  - mock
---

Testing of subscriptions does not differ from testing of commands.  
The only difference is, that the builder method for getting the subscription function,has a slightly different name.

Getting the subscription function:

```typescript
 const subscriptionFunction = testSubscriptionBuilder.getSubscriptionFunction().bind(service)
 ```

See chapter [Test a command](../2.2_command/2_test-a-command.md).
