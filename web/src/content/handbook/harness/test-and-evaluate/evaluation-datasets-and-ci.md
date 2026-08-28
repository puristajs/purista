---
title: Build evaluation datasets and run them in CI
description: Create reviewed, versioned cases that expose important failures, then use explicit coverage and release policy in CI.
order: 830
---

An evaluation dataset is a reviewed sample of the decisions your system must
make. It is not a production event export and it is not automatically a source
of truth. Give it a stable dataset ID and version, stable case IDs, and only
the input that the candidate may use. Put references, expected values, and
grading notes in scorer-only assessment material.

Build cases from three sources:

- representative examples of normal work;
- failures discovered through authorized, redacted production review; and
- deliberately difficult negative, ambiguous, boundary, and policy-sensitive cases.

Use segments for questions that could hide in an overall average: language,
document type, retrieval availability, task risk, customer tier, or a rare
class. Segments describe the case; do not place tenant, user, document, or
other sensitive identifiers in them.

Keep a development set and a holdout set. Improve candidates using the
development set. Only use the holdout for decisions at planned checkpoints; if
it repeatedly guides tuning, move those cases into development and prepare a
new holdout. Record the corpus, index, tool configuration, and model/candidate
versions that make a case comparable.

## Use CI as a decision gate, not a retry loop

Run the same versioned suite against a named candidate in CI. Make the policy
explicit: which dimensions are hard gates, which segments have minimum
coverage, which operational failures block a release, and who reviews a result
that is inconclusive. Do not retry model output until it passes and present the
best attempt as first-attempt quality.

CI should preserve the full result artifact in an application-controlled secure
location. The Harness result is content-minimized, so save raw observations
only when the data policy permits it and only if re-scoring or diagnosis needs
them. A failed case needs enough approved evidence to reproduce the problem,
not a copied prompt or customer record.

Next: [choose and calibrate scorers](/handbook/harness/test-and-evaluate/choose-and-calibrate-scorers/).
