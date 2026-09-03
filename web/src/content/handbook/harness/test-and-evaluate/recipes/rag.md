---
title: Evaluate RAG
description: Separate retrieval coverage, answer correctness, groundedness, citations, and unanswerable questions.
order: 852
---

Evaluate retrieval-augmented generation as two linked systems: retrieval and
answer generation. A polished answer cannot prove that the needed document was
retrieved, and a retrieved document cannot prove that the answer used it
correctly.

Freeze the corpus or index version, retrieval configuration, reranking choice,
and authorization boundary for each dataset version. A case should record the
question, the relevant document identifiers, whether the question is
answerable from that corpus, and the expected citation policy. The task may
receive only the authorized retrieved evidence; relevant identifiers remain
scorer-only assessment material.

Measure these dimensions separately:

- retrieval recall and precision over ranked document identifiers;
- answer correctness for the question;
- groundedness: whether answer claims are supported by the supplied evidence;
- citation validity and completeness; and
- appropriate abstention for an unanswerable question.

Keep selected retrieved IDs and bounded tool facts in the observation so a
scorer can diagnose retrieval versus generation failures. If a stream overflow
or unavailable tool means the evidence is incomplete, report an inconclusive
dimension rather than approving an absence claim.

Include a case where retrieval misses the relevant source, one where the source
is retrieved but the answer omits its fact, one with a wrong citation, and one
that must be declined. Build the application retrieval boundary as described
in [Build grounded retrieval](/handbook/harness/configure-the-runtime/grounded-retrieval/); this recipe measures its quality.
