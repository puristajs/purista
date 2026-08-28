# Primary Website Pages

## Purpose

Use this reference for routes in `web/src/pages/`, primary navigation, landing pages, enterprise/framework positioning, or visual section structure. Read `web/AGENTS.md` and `web/DESIGN.md` first; they are the current design contract.

## Audience boundary

Primary website pages help technical leaders and architects decide whether and how to evaluate PURISTA. They should answer:

- Which enterprise engineering problem is being addressed?
- What architectural mechanism changes the outcome?
- What remains application-owned versus framework-owned?
- What operational, governance, security, and deployment consequences follow?
- What evidence can the evaluator inspect?
- What is the smallest credible next step?

Do not turn primary pages into long developer tutorials. Link to the exact handbook quickstart, concept, operations guide, API module, or example that proves the claim.

## Page flow

A strong decision-oriented page usually moves through:

1. Specific problem and audience.
2. Clear outcome and boundary; avoid broad promises.
3. Mental model or architecture visual.
4. How PURISTA changes implementation and review surfaces.
5. Real operational proof: typed contracts, traces, generated artifacts, failure handling, tests, or deployment flexibility.
6. Fit/limitations and relevant choices.
7. One focused call to action.

Each section should have one job, one headline, one dominant content object, and one takeaway.

## Content and visual rules

- Use the dark-first, flat, technical-editorial design system already defined by the site.
- Let typography, alignment, spacing, and semantic visuals carry hierarchy before adding cards or containers.
- Use bespoke system visuals on primary pages when architecture or relationships are the point. Use Mermaid and code primarily in the handbook.
- Use cards only when their boundaries materially improve comparison or interaction.
- Avoid generic dashboards, decorative panels, icon grids without decisions, and repeated marketing copy.
- Keep terminology aligned with the handbook and implementation. A landing page may simplify; it may not contradict.
- Give claims an evidence route: focused guide, API entry, example, architecture page, or operational page.
- State important limitations and ownership boundaries. Enterprise credibility comes from precision, not absolute claims.

## Cross-audience linking

Map each high-level claim to the next useful developer or reviewer surface:

| Website claim | Evidence destination |
|---|---|
| business boundaries stay explicit | service/architecture concept plus builder guide |
| infrastructure remains swappable | capability hub and adapter comparison |
| background work is reliable | queue lifecycle, bridge guarantees, and operations guide |
| systems are observable | metrics/tracing guide and focused example |
| AI actions are governed | agent/guardrail architecture, security, and testing guide |
| deployment shape can change | deployment decision guide and runtime wiring example |

Avoid linking every section to the handbook homepage. Link to the exact supporting route.

## SEO and trust

- Use a page title and description that match the actual question answered.
- Keep one clear H1 and sequential headings.
- Use concrete language readers search for, then introduce PURISTA terminology.
- Ensure important explanatory content exists as text, not only inside canvas/SVG visuals.
- Keep canonical routes and redirects deliberate.
- Verify external claims and compatibility against current authoritative sources.
- Avoid unqualified superlatives, unsupported performance claims, and claims that a structural pattern automatically guarantees security or correctness.

## Review questions

- Can the target reader identify the problem and fit in the first screen?
- Does the visual explain a real relationship or boundary?
- Are application, PURISTA, adapter, and platform ownership distinct?
- Does the page show evidence rather than repeat promises?
- Are risks and limitations visible at the decision point?
- Is the CTA appropriate for the reader's stage?
- Does every linked handbook page support the claim it is attached to?
