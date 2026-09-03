---
title: Evaluate translation
description: Assess meaning, terminology, fluency, and preserved placeholders without rejecting valid alternative wording.
order: 853
---

Exact string equality is usually the wrong translation scorer. Two translations
can express the same meaning with different word order, while a nearly identical
sentence can reverse a negation or corrupt a product name.

Give the task the source text and the context it is authorized to use. Keep
reviewed translations, terminology rules, and protected-token expectations in
scorer-only assessment material. Explicitly identify names, numbers, dates,
URLs, markup, variables, and placeholders that must survive unchanged.

Use deterministic dimensions for preserved tokens, placeholder count, markup,
and required terminology. Add a reviewed or calibrated semantic scorer for
meaning and fluency when those dimensions matter to the release decision. If
using a corpus metric, pin its implementation, tokenization, language, and
configuration with the analysis version. A corpus score is not the average of
independent sentence scores.

Include two valid alternative phrasings, a changed negation, a terminology
failure, and a corrupted placeholder. Segment results by source/target language
and domain. Treat an ambiguous reference translation as `inconclusive`, not as
a failure by default.
