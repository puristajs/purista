# Claude Website Guidance

Follow `AGENTS.md` first. For any PURISTA website UI, layout, visual, content,
or Astro component work, also read `DESIGN.md` before editing.

For handbook, API, and public agent-facing content, follow the implemented API
and public docs source. Specs are the source of truth for framework development,
but public website and user-facing skill content must not require internal spec
access. When specs and implementation drift, correct the stale side first, then
update public guidance from the aligned behavior.

Use the design guide as the contract for taste and implementation:
- flat technical editorial, not card-heavy SaaS;
- crisp spacing, restrained surfaces, strong typography;
- concise story-driven content;
- meaningful high-quality visuals on landing and AI Harness pages;
- Mermaid/code/schematic visuals for handbook pages;
- browser verification after frontend changes.

When refactoring AI Harness pages, actively remove visual noise and duplicated
information. Prefer reusable layout tokens, shared components, balanced
visual/text sections, and semantic visuals that explain system relationships.

Run `npm run audit:knowledge` after changing skill-install docs, handbook API
docs, Claude/agent guidance, or other assistant-facing website content.
