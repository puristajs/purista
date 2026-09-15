---
title: Evaluate subagents as tools
description: Test child contracts and the parent synthesis together, including delegation failures and information loss.
order: 855
---

Treat a subagent invocation as a typed dependency with its own contract. A
parent can fail even when every child result is individually correct: it can
drop an important qualification, combine facts from different cases, or make an
unsupported final conclusion.

Build two suites. The child suite verifies the child input/output contract,
failure behavior, and selected quality dimensions in isolation. The parent
suite verifies the complete handoff: the correct child was allowed to run, the
required child result was available, the parent preserved important facts, and
the final result satisfies the user-facing task.

Record selected, bounded delegation facts in the observation: child identity,
contract version, completion state, validated result category, and resource
accounting. Do not treat a missing transcript as proof that no incorrect
handoff happened. If a child response is unavailable or evidence was truncated,
mark the affected dimension inconclusive or report an operational failure.

Include a failed delegation, an incomplete child response, and a case where
correct child outputs lead to an incorrect synthesis. Measure total candidate
resource use once across the parent and children; do not add parent summaries
to their already-accounted child model calls. The workflow must explicitly
declare delegation; see [Use child tasks and data flow](/handbook/harness/orchestrate-work/child-tasks-and-data-flow/).
