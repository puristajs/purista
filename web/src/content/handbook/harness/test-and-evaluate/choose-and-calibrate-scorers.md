---
title: Choose and calibrate scorers
description: Combine deterministic checks, calibrated model judges, and reviewed labels without hiding uncertainty or scorer failure.
order: 840
---

A scorer is a named, versioned adapter that evaluates one observation and
returns declared dimensions. Use the smallest measurement that answers the
decision. One scorer can emit several dimensions; several scorers can assess
the same observation. They do not need a common provider or a scorer registry.

| Scorer | Use when | Do not treat it as |
| --- | --- | --- |
| Deterministic predicate or validator | A property has an exact, stable rule: schema validity, required citation, preserved placeholder, or an independently checked effect | Semantic correctness, usefulness, or factual grounding by itself |
| Reviewed reference label | A qualified reviewer can establish the target answer or acceptance decision | A reason to expose the reference to the candidate task |
| Model-backed rubric | Quality requires judgment over selected, authorized evidence | Ground truth without calibration |

Give every scorer and rubric a stable ID and version. A changed rubric, model,
input projection, or verdict schema is a changed measurement instrument, not a
minor implementation detail. Select only the minimum data that a remote judge
needs; a no-content trace policy does not prevent that selected data from being
sent to the judge provider.

## Report uncertainty honestly

Each declared dimension has one assessment outcome:

- `scored` supplies a value and may supply an explicit pass/fail decision;
- `not_applicable` means the dimension genuinely does not apply to this case;
- `inconclusive` means evidence is insufficient, the reference is ambiguous,
  or the scorer deliberately abstained.

These outcomes are different from an error, cancellation, timeout, or work
skipped by failure policy. Do not map uncertainty to zero, silently remove it
from coverage, or retry it as though it were an infrastructure fault.

## Calibrate a model judge

Create a small reviewed calibration set containing clear passes, clear fails,
borderline answers, and cases that tempt a judge to follow instructions inside
the candidate output. Compare the judge verdict with the review, inspect
disagreement by segment, then revise the rubric or evidence projection. Freeze
the judge version before measuring a candidate comparison. Reserve a separate
reviewed set for later validation.

Next: choose a [use-case recipe](/handbook/harness/test-and-evaluate/recipes/) or learn how to [compare results](/handbook/harness/test-and-evaluate/compare-and-diagnose-regressions/).
