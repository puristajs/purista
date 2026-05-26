# Website Agent Guide

This directory contains the new Astro-based PURISTA website.

## Design Source of Truth

Before changing website layout, copy, UI components, visualizations, or page
structure, read `DESIGN.md` in this directory.

The design direction is:
- dark-first, flat, precise, technical editorial;
- fewer boxes and cards;
- focused page storylines with one job per section;
- high-quality semantic visuals on landing pages and AI Harness pages;
- Mermaid/code/schematics for handbook-style explanatory pages;
- reusable layout tokens and helpers instead of page-local magic numbers.

For AI Harness subpages, use the shared Harness layout direction:
- keep the page width aligned through `site-layout-story` / shared layout tokens;
- prefer balanced 50:50 story sections where visuals explain the text;
- reduce card grids and boxed panels;
- replace generic visuals with semantic isometric/diagrammatic assets that show
  relationships, boundaries, agents, tools, review gates, traces, and outputs.

## Frontend Verification

After visual or layout changes:
- run `npm run build`;
- inspect the affected pages in a browser;
- check desktop and mobile widths;
- verify there is no overlapping text, unreadable visual label, clipped SVG, or
  accidental card-heavy/noisy section.

Existing Vite large chunk warnings are known and should not block scoped design
work unless the task is performance-focused.
