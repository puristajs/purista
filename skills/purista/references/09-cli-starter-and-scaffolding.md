# CLI, Starter, and Scaffolding

Use this reference when aligning framework, starter, and generator behavior.

## Alignment rule
Framework capability changes land in `purista` first, then propagate to:
- `starter`
- `create-purista`
- downstream product layers such as `voyage`

## Scaffolding rule
Generated structure should reflect the builder model, not hide it.

## Review cues
- starter defaults match framework best practices
- generated file structure keeps versioned services and explicit resources
- skill/docs updates are reflected in generated guidance where applicable
