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

Use a deterministic scorer for exact rules. Wrap a model-backed judge behind an
application-owned port so the scorer does not depend on a provider package and
can be calibrated with a fake.

```ts title="src/evaluation/createTranslationScorer.ts"
import type { EvaluationScorer } from '@purista/harness'

type TranslationAssessment = { requiredTerm: string }
type TranslationOutput = { text: string }

export interface TranslationJudge {
	judge(
		input: { source: string; translation: string; requiredTerm: string },
		signal: AbortSignal,
	): Promise<{ score: number; rationaleRef: string }>
}

export function createTranslationScorer(
	judge: TranslationJudge,
): EvaluationScorer<TranslationAssessment, TranslationOutput, string> {
	return {
		id: 'translation-judge',
		version: '1',
		dimensions: [{ id: 'translation-quality', kind: 'number' }],
		async score({ observation }, signal) {
			const assessment = observation.assessment
			if (!assessment) {
				return {
					dimensions: [
						{
							outcome: 'inconclusive',
							dimensionId: 'translation-quality',
							kind: 'number',
							reason: 'insufficient_evidence',
						},
					],
				}
			}

			const verdict = await judge.judge(
				{
					source: observation.scorerContext ?? '',
					translation: observation.output.text,
					requiredTerm: assessment.requiredTerm,
				},
				signal,
			)

			return {
				dimensions: [
					{
						outcome: 'scored',
						dimensionId: 'translation-quality',
						kind: 'number',
						value: verdict.score,
						passed: verdict.score >= 0.8,
						evidence: { kind: 'reference', ref: verdict.rationaleRef },
					},
				],
			}
		},
	}
}
```

The evaluation task places only the source text needed by this rubric in
`scorerContext`; it does not expose the assessment to the candidate. The judge
returns a bounded score and an application-controlled evidence reference rather
than raw rationale content. In production, record judge accounting separately
from candidate accounting so judging cost and tokens remain visible.

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

Use this loop:

1. Inject a deterministic fake judge and test scorer output shapes,
   `inconclusive`, cancellation, timeout, and sanitized failure handling.
2. Run the real judge over reviewed clear-pass, clear-fail, borderline, and
   prompt-injection cases.
3. Compare its pass/fail decision and numeric score with reviewer labels by
   segment; inspect disagreements rather than tuning only an overall average.
4. Change the rubric, evidence projection, model, or threshold, then increment
   the scorer version.
5. Freeze that version and validate it on a separate reviewed set before using
   it for a candidate release decision.

Scorer retry is only for technical callback failure. Do not retry a low score,
`not_applicable`, or `inconclusive` outcome. If reviewer agreement is weak, the
dataset or rubric is not ready to act as a release gate.

Next: choose a [use-case recipe](/handbook/harness/test-and-evaluate/recipes/) or learn how to [compare results](/handbook/harness/test-and-evaluate/compare-and-diagnose-regressions/).
