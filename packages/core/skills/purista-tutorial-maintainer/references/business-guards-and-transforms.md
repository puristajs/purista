# Business guards and transforms

## Teach a decision, not a presence check

Hono authentication establishes who is calling. A business guard answers whether
that caller may perform this action on this account, case, document or proposal.
Use current server-owned permissions and resource scope; a tenant/principal ID
or role label alone is not the lesson's authorization policy.

For the banking plan, the shared decision catalog lives in
`plans/banking-tutorials/business-rules-and-transforms.md` above the repo.
Public tutorials must explain the rule locally without requiring that plan.

Use paired cases that keep the session valid and change one business fact:

- A bookkeeper may read/export account A under a current mandate, but may not
  record a posting or read unrelated account C in the same tenant.
- An investigator may read an assigned case, not every case in the organization.
- A reviewer may approve only within their authority, may not approve their own
  proposal, and must act on the current unexpired revision.
- Revoking a mandate after a statement is queued can block generation/download
  under the example's explicit current-entitlement policy.

Explain the business rule before code, then show the allowed and denied action
through both the real runtime and UI. Assert no forbidden write, event, job,
retrieved content, model call or artifact release. Hiding a button proves none
of those boundaries. Distinguish initiator from service actor for delayed work.

## Give transforms a real representation problem

An input transform can map supported legacy decimal strings and debit/credit
codes into integer minor units and the domain enum. An output transform can
serialize an authorized typed statement as CSV. Teach raw schema, mapping,
domain schema and business guard as separate responsibilities.

State exact accepted decimal/currency/timezone formats, reject unsupported
precision/overflow, and preserve source IDs needed for idempotency. Never guess
locale or silently convert currencies. A normalization example must not hide
private lookups, permission decisions, model work or business side effects.

Output transforms format already-authorized data; they are not a substitute
for scoped queries or field-level authorization. CSV requires escaping, bounds
and spreadsheet formula handling. Keep source-addressable text normalization
separate from AI summarization, which changes meaning and needs its own contract.

## Respect actual hook semantics

Verify the current implementation and tests before writing runnable snippets:

- `packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts`
- `packages/core/src/CommandDefinitionBuilder/getCommandFunctionWithValidation.impl.ts`
- `packages/core/src/core/Service/commandTransformInput.impl.ts`
- `packages/core/src/core/Service/Service.impl.ts`

Current command order: wire validation → input transform → domain input
validation → before guards → handler → domain output validation → after guards
→ output transform → transformed-output validation → success response.
Optional stages run only when configured. Verify other primitives separately.

Guards in each stage run concurrently. Do not use named guards as a sequential
pipeline or depend on another guard's mutation of shared context. A failed
guard does not undo effects placed in another concurrent guard. Dependency
failure must not grant access.

A before guard is not a transaction lock. Mutation handlers/repositories must
recheck changing permissions/state and atomically apply the effect where needed.
Use current revisions and idempotency receipts; test check-to-write races.

After guards run after the handler. Use a read-only statement result to teach
the additional release check: inject a wrong-account row and reject the entire
result. Do not imply an after-guard or transform error reverses a posted effect.
Test actual success-event payloads when output transforms are present; keep
presentation formats separate from canonical business event contracts.

Focused mapping/handler tests do not prove full lifecycle. Invoke the registered
service for transform and after-guard checks and assert which stages/effects
were reached. Reuse supported testing helpers only for the boundaries they run.

Keep agent governance, content guardrails and Framework business guards distinct.
Tools must call the same guarded business operations; a prompt, classification,
plugin or model decision cannot grant permission. Filter retrieval before
content enters the model, not by redacting the final answer afterward.
