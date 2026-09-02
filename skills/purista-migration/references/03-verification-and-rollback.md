# Verification And Rollback

## Verification matrix

| Boundary | Prove before release |
| --- | --- |
| Dependencies | One compatible `@purista/*` version set and a committed lockfile |
| Definitions | Export succeeds; `inspect`, strict `validate`, and `doctor` have reviewed output |
| HTTP | Problem Details content type and safe body match client expectations |
| Queues | Retry, dead-letter, idempotency, and replay paths survive a duplicate or retry |
| Schedules | Exported manifest matches the selected external scheduler; the explicit trigger reaches its event, queue, or short command; duplicate delivery is idempotent |
| State and agents | Retention, tenant/principal boundaries, access control, and expiry match the data policy |
| Observability | Application-owned SDK/exporter works; adapter inheritance is visible before startup; no sensitive fields appear |
| Deployment | Canary, alerts, dashboards, owners, and rollback command are ready |

## Rollback design

Define the rollback before a behavior-changing deployment. Preserve the prior
artifact and compatible configuration, keep a reversible schema/data path, and
state the trigger in measurable terms: error rate, duplicate business effect,
queue backlog, missed or duplicate schedule trigger, client parse failure, or
policy breach.

Do not roll back by deleting live state, discarding messages, disabling strict
validation, or turning off observability. Pause the affected consumer or
scheduler group only when the operational runbook authorizes it; retain enough
evidence to reconcile work after recovery.

## Completion record

The final handoff includes the migration ledger, exact version set, static
diagnostic artifacts, check output, changed public contracts, production
deployment order, monitoring links or signal names, rollback trigger, and a
dated plan to remove any temporary consumer compatibility.
