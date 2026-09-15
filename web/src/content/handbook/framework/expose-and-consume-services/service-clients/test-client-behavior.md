---
title: Test client behavior
description: Verify generated source contracts, address-first routing, and HTTP failure mapping at separate deterministic boundaries.
order: 447
---

Test the contract you own. A generated-source snapshot does not prove a running
provider, and a live happy path does not prove identity/error mapping.

| Boundary | Prove |
| --- | --- |
| Generator test | Expected service/version/method exists; invalid definition files fail the build; output compiles. |
| Embedded EventBridge test | The generated method reaches a registered command, propagates identity, and returns/throws the expected command contract. |
| HTTP client test | URL/path/query/body/headers, timeout, `204`, JSON/text parsing, cookie/bearer behavior, and `HttpError` mapping. |
| Real gateway test | Hono authentication, business guard, response/problem details, OpenAPI, and deployed network policy. |

```ts title="Embedded generated-client integration test"
const eventBridge = new DefaultEventBridge({ logger })
await eventBridge.start()
const service = await transactionV1Service.getInstance(eventBridge, { logger, resources })
await service.start()

try {
  const client = new EventBridgeClient(eventBridge)
  await expect(client.transaction.v1.getTransaction(
    undefined,
    { transactionId },
    { principalId: 'user-1', tenantId: 'tenant-1' },
  )).resolves.toMatchObject({ id: transactionId })
} finally {
  await service.destroy()
  await eventBridge.destroy()
}
```

For generated REST and generic `HttpClient`, replace `globalThis.fetch` with a
deterministic mock in the focused unit test and restore it afterward. Assert the
exact public URL and safe headers; do not put real credentials in fixtures.
Then run one integration test against Hono to prove that the generated contract
matches the server's actual handling, especially the async `202` receipt and
bodyless `DELETE` contract.

When a generated client package is published, compile a small consumer fixture
against the produced declarations. This catches accidental export/name changes
that provider tests alone cannot see.

Return to [Service clients](/handbook/framework/expose-and-consume-services/service-clients/).
