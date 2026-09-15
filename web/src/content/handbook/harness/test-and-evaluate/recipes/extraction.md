---
title: Evaluate extraction
description: Measure valid structure separately from correct fields, normalized values, missing entities, and extra entities.
order: 851
---

Evaluate extraction as a set of field-level claims, not as a JSON parsing
exercise. A response can validate against an output schema and still assign the
wrong date, amount, person, or document category. Conversely, values can match
after a declared normalization even when formatting differs.

For each case, keep the authorized source input for the task and a reviewed
assessment containing expected entities and the normalization rule. State how
you compare case, whitespace, dates, currency units, aliases, and duplicate
entities before looking at results. A missing field, an explicit `null`, and an
extra entity are different outcomes and should stay different in the report.

Use at least two dimensions:

- **structure valid** is a deterministic schema or validator check; and
- **field accuracy** uses aligned entities to record true positives, false
  positives, and false negatives.

Calculate document-level success only when every required field is correct.
For corpus precision, recall, and F1, sum counts across the intended corpus or
declared class before calculating the metric. Do not average per-document F1
and call it micro-F1.

Include a case with valid JSON but the wrong value, a missing optional field,
an unexpected extra entity, and a normalization edge case. Segment by document
type or language if those conditions affect extraction. Next: [compare matched
results](/handbook/harness/test-and-evaluate/compare-and-diagnose-regressions/).
