---
version: alpha
name: PURISTA Website
description: >
  Design contract for the PURISTA v3 website and AI Harness pages. The site is
  dark-first, flat, precise, technical, and visual-led: fewer boxes, stronger
  story, meaningful diagrams, and high-quality rendered/isometric visuals.
colors:
  primary: "#60A5FA"
  secondary: "#B4B4BC"
  tertiary: "#C084FC"
  background: "#08080B"
  background-elevated: "#0F0F12"
  background-sunken: "#050507"
  background-deep: "#020203"
  foreground: "#FAFAFA"
  foreground-strong: "#FFFFFF"
  foreground-muted: "#B4B4BC"
  foreground-subtle: "#71717A"
  line: "#1A1A20"
  line-strong: "#2B2B34"
  line-vivid: "#4A4A56"
  structure: "#60A5FA"
  structure-bright: "#93C5FD"
  ai: "#C084FC"
  ai-bright: "#DDD6FE"
  approval: "#34D399"
  approval-bright: "#6EE7B7"
  warning: "#F59E0B"
  danger: "#F87171"
  code-background: "#0F0F12"
  code-foreground: "#E8E8EC"
typography:
  display:
    fontFamily: "Inter Tight"
    fontSize: "clamp(3rem, 7.5vw, 6.8rem)"
    fontWeight: 700
    letterSpacing: "0"
    lineHeight: 0.95
  h1:
    fontFamily: "Inter Tight"
    fontSize: "clamp(2.5rem, 5vw, 4.6rem)"
    fontWeight: 700
    letterSpacing: "0"
    lineHeight: 1
  h2:
    fontFamily: "Inter Tight"
    fontSize: "clamp(2rem, 3.8vw, 3.2rem)"
    fontWeight: 650
    letterSpacing: "0"
    lineHeight: 1.05
  h3:
    fontFamily: "Inter Tight"
    fontSize: "clamp(1.35rem, 2.3vw, 2rem)"
    fontWeight: 650
    letterSpacing: "0"
    lineHeight: 1.12
  body:
    fontFamily: Inter
    fontSize: "1rem"
    fontWeight: 400
    letterSpacing: "0"
    lineHeight: 1.6
  lede:
    fontFamily: Inter
    fontSize: "clamp(1.02rem, 1.25vw, 1.14rem)"
    fontWeight: 400
    letterSpacing: "0"
    lineHeight: 1.58
  label:
    fontFamily: "JetBrains Mono"
    fontSize: "0.72rem"
    fontWeight: 500
    letterSpacing: "0.14em"
    lineHeight: 1.4
  mono:
    fontFamily: "JetBrains Mono"
    fontSize: "0.875rem"
    fontWeight: 400
    letterSpacing: "0"
    lineHeight: 1.7
rounded:
  none: "0px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
  gutter: "clamp(1.25rem, 4vw, 3rem)"
  section: "clamp(3rem, 6vw, 5.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-ghost:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "20px"
  code-block:
    backgroundColor: "{colors.code-background}"
    textColor: "{colors.code-foreground}"
    typography: "{typography.mono}"
    rounded: "{rounded.md}"
    padding: "20px"
  icon-button:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground-muted}"
    rounded: "{rounded.md}"
    size: "36px"
---

## Overview

PURISTA is an engineering product, not a decorative SaaS template. The website
must feel precise, calm, inspectable, and production-ready. The target reader is
a senior developer, architect, or technical founder who wants to understand why
PURISTA makes AI-built and distributed TypeScript systems safer to ship.

The visual thesis is **flat technical editorial with premium system diagrams**:
dark canvas, restrained color, strong typography, crisp section rhythm, and one
clear visual idea per section. Use depth only when it explains structure. Avoid
generic card grids, noisy pill clusters, duplicated copy, and oversized blocks
that make the page feel like a dashboard.

Every page needs a storyline. The expected sequence is:

1. Establish the product or capability in plain language.
2. Show the mental model with one meaningful visual.
3. Explain the smallest useful implementation shape.
4. Prove what changes operationally: reviewability, observability, safety, or
   deployment flexibility.
5. End with a focused next step.

## Colors

The site is dark-first. Color has semantic meaning and should not be used as
decoration.

- **Structure blue** (`structure`, `structure-bright`) is for PURISTA contracts,
  typed boundaries, architecture, service definitions, and primary explanatory
  paths.
- **AI violet** (`ai`, `ai-bright`) is for models, agents, reasoning, generated
  proposals, and review gates.
- **Approval green** (`approval`, `approval-bright`) is for validation, checks,
  human approval, production readiness, and successful outcomes.
- **Warning amber** is for risk, escalation, policy, and review-required states.
- **Danger red** is for blocked, rejected, unsafe, or failed states only.

Use background layers sparingly. A section may use the base background or a
subtle sunken band, but it should not become a stack of nested surfaces.

## Typography

Typography should do most of the layout work. Use scale, whitespace, line
length, and alignment before adding borders or boxes.

- Display text is reserved for true heroes and page-level statements.
- Section headings should be compact and specific, not marketing slogans.
- Body copy must be short enough to scan. Prefer one strong paragraph over
  several generic paragraphs.
- Technical labels, file names, APIs, and short state labels use JetBrains Mono.
- Do not use negative letter spacing. The current site deliberately uses `0`
  tracking for the cleaner PURISTA v3 direction.

## Layout

Use the shared layout tokens and helpers instead of page-local max-width values.

- `--layout-max-fluid: 1680px` is for immersive home or framework surfaces that
  need room to breathe.
- `--layout-max-wide: 1440px` is for broad editorial pages.
- `--layout-max-page: 1280px` is the default landing-page reading width.
- `--layout-max-story: 1240px` is the AI Harness subpage width and the default
  for visual/text story sections.
- `--layout-max-copy: 960px` is for narrow documentation, essays, and deep
  prose.

Harness story rows should use a balanced 50:50 split when visual explanation is
central. The left and right sides must feel equally important: the copy names
the idea, the visual explains the system. Avoid visual columns that are too
small to carry information.

Each section gets one job, one headline, one dominant visual or content object,
and one clear takeaway. If a section needs three different content patterns, it
should probably become two sections or be edited down.

## Elevation & Depth

Default to flat design. Use section bands, dividers, spacing, and typography for
hierarchy. Cards are exceptions, not defaults.

Allowed depth:

- Code blocks and genuinely framed tools.
- Repeated interactive items where the boundary is necessary.
- Diagram elements where surface depth communicates architecture or flow.
- Subtle glow/shadow inside custom visuals to create dimensionality.

Avoid:

- Cards inside cards.
- Decorative floating panels.
- Shadow-heavy marketing tiles.
- Large bordered boxes around every small idea.
- Hero content inside cards.

## Shapes

Shapes should be crisp and engineered.

- UI radius should usually be `6px` to `10px`.
- Visual objects may use more dimensional geometry when it explains the object:
  command centers, queues, shields, review desks, databases, people, or service
  boundaries.
- Pills are for compact state labels only. Do not build layouts from pill
  clusters.
- Prefer full-width sections and aligned columns over isolated rounded islands.

## Components

### Buttons

Use one primary action per section at most. Secondary actions are ghost buttons
or text links. Button labels should describe the destination or action, not
repeat nearby headings.

### Cards

Default: no cards. A card is allowed only when the boundary improves scanning,
comparison, or interaction. If removing the background, border, shadow, and
radius would not reduce comprehension, it should not be a card.

For AI Harness migration work, actively reduce card count. Replace card grids
with:

- Editorial rows.
- Timelines.
- Split visual/text story sections.
- Compact definition lists.
- Inline code examples.
- Diagrams with direct labels.

### Visuals

Visuals must explain the content. They are not decorative placeholders.

Main landing pages should use high-quality rendered or isometric scenes with
subtle microanimation. The visual style should be realistic enough to feel
premium, but simplified enough to stay technical and legible. Good visuals show
relationships: inputs, boundaries, agents, tools, approval gates, traces, queues,
state, and outputs.

Harness page visuals should follow the current animated isometric SVG direction:
dark technical canvas, dimensional objects, semantic icons, readable labels,
animated flow lines, and no generic indistinguishable image cards. Each visual
should answer: "What changed in the system because PURISTA or the Harness is
here?"

Handbook pages should prefer Mermaid, code, sequence diagrams, and small
technical schematics. Main pages should prefer bespoke visuals, not Mermaid.

### Code

Use code snippets as proof, not filler. A snippet should be short, runnable in
spirit, and tied to the adjacent explanation. Avoid giant blocks before the user
understands the mental model.

### Motion

Motion should create presence and hierarchy, not noise. Prefer two or three
intentional motions per visually led page:

- Flow lines moving through a diagram.
- Gentle object hover/float on visual anchors.
- Reveal timing that clarifies reading order.

Always support `prefers-reduced-motion`.

## Do's and Don'ts

Do:

- Start every page pass by identifying the narrative job of each section.
- Use `DESIGN.md`, `src/styles/tokens.css`, `src/styles/components.css`, and
  `src/styles/site.css` before inventing new styling.
- Prefer reusable layout helpers over page-local magic numbers.
- Use balanced 50:50 story sections for Harness visual explainers.
- Keep copy concise, concrete, and technical.
- Make visuals semantic: every object, label, and connection must explain the
  text.
- Verify frontend changes in the browser at desktop and mobile widths.
- Check for overlap, unreadable labels, clipped visuals, and excessive visual
  noise before calling work done.

Don't:

- Add boxes because the layout feels empty.
- Use repeated cards for every idea.
- Ship visuals where text is unreadable or every image looks essentially the
  same.
- Use stock-like, blurry, abstract, or purely atmospheric images as explanatory
  visuals.
- Duplicate the same claim in multiple sections.
- Use decorative gradients, blobs, bokeh, or floating badges to create interest.
- Let the first viewport become a dashboard of stats, pills, and promos.
- Add a new visual style per page; extend the existing PURISTA v3 language.

For major AI Harness page refactors, the acceptance bar is: flatter than today,
more focused than today, fewer boxes than today, stronger visual explanation than
today, and easier to scan in one pass.
