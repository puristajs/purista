---
name: purista-spec-elicitation
description: Ask the right follow-up questions so incomplete user requests can become strong PURISTA-ready specifications.
topics: [spec, elicitation, architecture-context]
phases: [chat, spec]
---

# PURISTA Spec Elicitation

## When to use this skill
Use this skill when the user gives incomplete requirements, asks for architecture too early, or mixes business goals with implementation guesses.

## What this component/package is for
This skill helps an agent turn vague requirements into structured, implementation-ready specifications that can later be mapped into services, contracts, resources, queues, and agents.

## Core PURISTA concept
Specification work should stay grounded in the user's language and persist as markdown truth that later architecture or planning work can read directly.

## Hard rules
- Ask for missing business outcomes before deciding technical topology.
- Separate confirmed requirements, assumptions, constraints, and open questions.
- Keep user-facing language concrete and domain-specific.
- Do not invent external systems, compliance rules, or SLAs without evidence.
- Keep the canonical spec in markdown files, not transient JSON summaries.

## Decision rules
- Ask about actors, inputs, outputs, invariants, integrations, failure handling, and latency only when they affect design choices.
- Ask fewer, higher-signal questions instead of dumping a full questionnaire.
- Escalate to architecture once responsibilities, data ownership, and critical workflows are clear enough.

## Recommended file/folder structure
```text
specs/
  README.md
  spec.md
  open-questions.md
```

## Common implementation patterns
- Summarize back the confirmed scope after each clarification.
- Translate the user’s words into candidate services and events only after the domain language is stable.
- Preserve unresolved questions instead of burying them in prose.
- Keep the current truth legible enough that a later worker can synthesize architecture from `specs/spec.md` plus `specs/open-questions.md` without hidden state.

## Common mistakes / anti-patterns
- Asking the user to choose framework internals too early.
- Turning open questions into false assumptions.
- Confusing UI fields with the real domain model.

## How this connects to other PURISTA concepts
Good spec work feeds directly into application architecture, schema contracts, service builders, queue decisions, and agent orchestration.

## Read if needed
- `specs/25-voyage/30-chat-and-delivery/10-spec-to-plan-to-delivery.md`
- `specs/26-voyage-refinement/10-contract-catalog.md`
- `website/doc/handbook/2_building_business-logic/schemas.md`
- `website/doc/handbook/2_building_business-logic/service/index.md`
