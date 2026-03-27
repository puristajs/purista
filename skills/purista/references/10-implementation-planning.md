# Implementation Planning

Use this reference when turning a PURISTA architecture into executable work.

## Planning rule
Slice work by owned boundaries, not by arbitrary file groups.

Good work-package anchors:
- one service boundary
- one queue-backed workflow
- one agent plus its deterministic coordinator
- one transport/runtime integration seam

## Decision rules
- keep work packages independently testable
- avoid cross-package changes that share the same ownership boundary unless necessary
- surface assumptions that still need business confirmation

## Anti-patterns
- implementation tickets that mix architecture discovery and code execution without naming unresolved assumptions
- agent-only work packages that mutate truth directly
