---
title: Connect an external policy engine
description: Map a least-data governance request to an authenticated policy service and fail closed on uncertainty.
order: 708
---

An external evaluator is an application-owned adapter. Harness supplies the
selected operation and typed input; the evaluator returns an allow, deny, audit,
or approval outcome. Authentication, endpoint, timeout, and deployment health
remain application responsibilities.

```ts title="Connect External Policy Engine example 1"
const transfer = defineTool('transferFunds', {
  description: 'Execute a synthetic transfer after policy evaluation.',
  input: transferInput,
  output: transferOutput,
  handler: executeTransfer,
})
const agent = defineAgent('payments', {
  model: 'answering',
  tools: [transfer],
  instructions: 'Use the transfer tool only for an authorized payment request.',
  governance: { policies: [opaPolicy] },
})
const definition = defineHarness({ name: 'payments' }).addAgent(agent)
const harness = await definition.getInstance({ models: { answering: answeringModel } })
```
Project only the fields needed by the policy. Never send prompts, documents,
credentials, raw tool payloads, or unnecessary identity data. Validate the
response schema, reject unknown effects, time out the request, and fail closed
when the service is unavailable or the result is malformed. Test redirect
rejection, authentication failure, evaluator timeout, deny, audit, and approval
resume.

Keep approval decisions as typed interrupted outcomes. Authenticate the
reviewer in the application before resuming the same run; do not treat an
external policy response as proof of caller identity.

## Test mapping and enforcement separately

Test the adapter with fixed requests and responses to prove field minimization,
authentication, response validation, cancellation, timeout, and fail-closed
behavior. Then inject a fake evaluator into a Harness integration test and
prove that allow, deny, audit, approval, and evaluator failure produce the
expected tool behavior. Keep live policy-engine tests in a separate suite.

## Keep Cedar and custom engines separate

Harness does not ship a Cedar or AWS Verified Permissions adapter. Implement
the typed evaluator contract in the application and keep policy schema,
entities, snapshot lifecycle, credentials, and service request mapping at that
boundary. Return only Harness governance effects; do not make the policy
engine a source of authenticated caller identity.
