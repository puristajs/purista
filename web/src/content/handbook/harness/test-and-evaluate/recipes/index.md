---
title: Evaluation recipes
description: Choose a measurement design for extraction, retrieval, translation, tool-using agents, subagents, or workflows.
order: 850
---

Use a recipe to choose the evaluation unit and evidence before choosing a
metric. The same generic run and scorer contracts work for every recipe; the
application supplies the domain case shape, reference material, observation
projection, and task-specific analysis.

| System | Start with | Measure separately |
| --- | --- | --- |
| Classification | [Run your first evaluation](/handbook/harness/test-and-evaluate/evaluate-prompts-and-outputs/) | Correct labels, abstention, and important-class slices |
| Extraction | [Evaluate extraction](/handbook/harness/test-and-evaluate/recipes/extraction/) | Valid structure, field values, missing and extra entities |
| RAG | [Evaluate RAG](/handbook/harness/test-and-evaluate/recipes/rag/) | Retrieval, answer correctness, grounding, citations |
| Translation | [Evaluate translation](/handbook/harness/test-and-evaluate/recipes/translation/) | Meaning, terminology, fluency, protected tokens |
| Tool-using agent | [Evaluate tool-calling agents](/handbook/harness/test-and-evaluate/recipes/tool-calling-agents/) | Effects, permissions, arguments, completion, budget |
| Parent agent delegating to subagents | [Evaluate subagents as tools](/handbook/harness/test-and-evaluate/recipes/subagent-as-tool/) | Child contracts, handoff fidelity, parent synthesis |
| Agent workflow | [Evaluate agent workflows](/handbook/harness/test-and-evaluate/recipes/workflows/) | Terminal state, invariants, branches, resume, duplicate effects |

Every recipe starts with reviewed pass, fail, ambiguous, and edge cases. Keep a
weak baseline in the example, show the exact diagnosed failure, make one
targeted change, and rerun matched identities. A fluent answer, a valid schema,
or a completed run is not automatically evidence that the system solved the
user's problem.

Choose a scorer that matches the property: deterministic checks for exact
constraints, reviewed labels for known answers, and calibrated model rubrics
only where human-quality judgment is needed. Continue with [comparison and
regression diagnosis](/handbook/harness/test-and-evaluate/compare-and-diagnose-regressions/) after selecting a recipe.
