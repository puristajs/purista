---
title: Evaluate agent workflows
description: Measure terminal state and business invariants across branches, approvals, resumes, and duplicate-effect cases.
order: 856
---

A workflow can return plausible text while leaving the business state wrong.
Evaluate durable effects and named invariants independently from the model's
language. The application owns workflow state, checkpoint records, approvals,
and side-effect receipts; the Harness evaluation observes only the selected
facts needed to judge the case.

For each case, specify the initial state, allowed branch, approval condition,
expected terminal state, and idempotent effect rule. Test the branch where an
approval is rejected or times out, the resume after a controlled interruption,
and repeated delivery of a side-effect request. Keep any fixture reset and
cleanup outside the scorer so independently repeated trials start from a known
state.

Use deterministic invariant checks for state transition, authorization,
duplicate effect, and checkpoint behavior. Add probabilistic quality scoring
only for the decision or explanation a model genuinely supplies. This keeps a
workflow infrastructure defect from being hidden inside a single quality score.

An invocation retry repairs a technical callback failure; it is not a second
quality trial. A trial has its own identity and requires an application reset.
See [Build a workflow](/handbook/harness/orchestrate-work/workflows/) for the
runtime model and [Handle human review](/handbook/harness/orchestrate-work/human-review/) for the durable review boundary.
