---
title: Evaluate tool-calling agents
description: Verify actual effects, permissions, arguments, termination, and task success rather than trusting an agent's final text.
order: 854
---

For a tool-calling agent, final prose is only one part of the result. Measure
the independent effect that matters: a reservation really exists, a ticket was
updated once, an unsafe action was denied, or the agent stopped without a
required effect. The application owns that verification; a model judge should
not infer it from the agent's claim.

Design each case with a controlled tool fixture and a verified expected state.
Capture only selected bounded facts for scoring, such as the allowed tool name,
validated argument category, effect receipt, termination reason, and budget
usage. Do not save raw tool input, secret-bearing output, or a complete prompt
trace in a generic result.

Score permission, argument validity, independent effect, and final task
success as distinct dimensions. A denied unsafe call can be a successful
security outcome; an agent that says it completed work without the effect is a
failure. A timeout, cancellation, or incomplete event evidence is operational
or inconclusive, not proof of a missing tool call.

Include an unauthorized-call fixture, a valid call with an invalid argument, a
false-success response, and a loop/budget boundary. Test the deterministic tool
and permission behavior separately before a live-agent evaluation. See
[define, validate, fail, and test a tool](/handbook/harness/add-capabilities/tools/) for the runtime boundary.
