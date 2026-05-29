# PURISTA Skill Maintenance Checklist

Use this checklist when creating or updating a skill.

## 1. Source check
- Relevant `specs/` documents read
- Current implementation paths verified in `purista/`
- Neighboring skills reviewed for overlap
- Downstream repos checked when capability changes affect generated or default behavior
- The framework knowledge required by an otherwise untrained model has been identified explicitly

## 2. Routing check
- `name` is stable and specific
- `description` names the trigger conditions and PURISTA concept clearly
- `topics` and `phases` reflect actual usage
- Metadata does not promise behavior the skill does not cover

## 3. Structure check
- `SKILL.md` stays compact
- The umbrella `purista` skill keeps one coherent navigation model
- Detailed material moved to `references/` when needed
- `scripts/` added only for repeatable deterministic tasks
- Filesystem layout supports progressive disclosure instead of loading everything at once
- Templates or assets exist only when they materially improve repeatability
- Reference documents are grouped so a model can load only the needed topic
- Short code snippets appear only where they materially teach a PURISTA concept

## 4. Content check
- “When to use” is explicit
- “Hard rules” match framework constraints
- “Decision rules” help choose the right PURISTA primitive
- The PURISTA concept is taught, not only referenced
- The builder role is clear where relevant: definition, implementation, configuration, instantiation
- Schema guidance reinforces boundary-local consumer schemas instead of one oversized shared cross-service schema
- Observability guidance keeps custom metrics on `ServiceBuilder.defineMetric(...)` and `AgentQueueBuilder.defineMetric(...)`
- Handler guidance uses typed `context.metrics` and does not expose raw metric recording
- AI guidance states that `@purista/harness` owns GenAI, model, token, and tool metrics
- Security guidance treats tenant isolation, authorization guards, data minimization, secret handling, PII redaction, prompt/completion privacy, least-privilege resources, and auditability as first-class architecture requirements
- Examples do not leak secrets, tokens, PII, prompts, completions, headers, raw payloads, attachments, or tenant/user identifiers into logs, metrics, traces, events, generated fixtures, or model calls without explicit policy
- Related skill links exist where they help the model navigate prerequisite or next-step concepts
- File structures and package paths exist
- “Read if needed” links point to real files
- The skill category is clear: knowledge, verification, data, automation, scaffolding, review, or runbook
- The body contains only high-signal context the base model would not already know
- The umbrella skill avoids duplicate explanations across references
- The single-skill navigation remains coherent for an otherwise untrained model

## 5. Verification check
- The skill defines how success is validated
- Tests, assertions, logs, sample runs, or diffs are named when applicable
- Repeatedly brittle checks are moved into `scripts/`
- Known edge cases or gotchas are captured in the skill or a reference file
- Verification checks that outputs respect PURISTA builder patterns, not just generic code correctness

## 6. Drift check
- `starter` aligned when defaults or generated app shape changed
- `create-purista` aligned when scaffolding or templates changed
- `voyage` aligned when framework capability assumptions changed
- `specs` updated when guidance or migration expectations changed
- Observability handbook, metric catalog, examples, and skills agree on metric names, attributes, and ownership boundaries
- Security/privacy handbook pages, AI docs, examples, generated templates, and skills agree on tenant/principal propagation, guard placement, secret-store usage, redaction, sandboxing, and sensitive telemetry rules
- Public handbook and published LLM knowledge files point to the canonical single skill path
- Voyage still works correctly with one shared framework skill plus local overlays

## 7. Quality check
- No generic filler
- No duplicated guidance better owned by another skill
- No stale terminology from replaced designs
- No unresolved contradiction with the shared skill catalog
- No brittle over-constraint where flexible decision rules would be safer
- No noisy cross-link sprawl with weak or circular relationships
- The split between `SKILL.md` and `references/` is intentional and readable
- Schema examples do not encourage consumers to import a bigger shared shape than they actually use
