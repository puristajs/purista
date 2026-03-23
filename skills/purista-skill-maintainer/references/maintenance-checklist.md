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
- One primary concern per skill
- Detailed material moved to `references/` when needed
- `scripts/` added only for repeatable deterministic tasks
- Filesystem layout supports progressive disclosure instead of loading everything at once
- Templates or assets exist only when they materially improve repeatability

## 4. Content check
- “When to use” is explicit
- “Hard rules” match framework constraints
- “Decision rules” help choose the right PURISTA primitive
- The PURISTA concept is taught, not only referenced
- The builder role is clear where relevant: definition, implementation, configuration, instantiation
- Related skill links exist where they help the model navigate prerequisite or next-step concepts
- File structures and package paths exist
- “Read if needed” links point to real files
- The skill category is clear: knowledge, verification, data, automation, scaffolding, review, or runbook
- The body contains only high-signal context the base model would not already know

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

## 7. Quality check
- No generic filler
- No duplicated guidance better owned by another skill
- No stale terminology from replaced designs
- No unresolved contradiction with the shared skill catalog
- No brittle over-constraint where flexible decision rules would be safer
- No noisy cross-link sprawl with weak or circular relationships
