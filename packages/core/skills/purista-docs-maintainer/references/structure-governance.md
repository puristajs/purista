# Handbook Structure Governance

## Contents

- [Authority order](#authority-order)
- [Find the current structure](#find-the-current-structure)
- [Structural manifest](#structural-manifest)
- [Required invariants](#required-invariants)
- [Drift audit](#drift-audit)
- [Parallel work](#parallel-work)
- [Changing the structure](#changing-the-structure)

## Authority order

Use this order when structure sources disagree:

1. The latest owner-approved handbook information-architecture spec that is
   not superseded.
2. The canonical typed handbook manifest used by the website.
3. The public route and redirect configuration.
4. Content frontmatter and source directories.
5. Rendered navigation, search output, and generated pages.
6. Historical plans, legacy numbered folders, card collections, and old page
   links.

The approved spec defines intent. The manifest defines the currently shipped
graph. Differences between them are migration drift to record, not a reason to
silently rewrite the spec from current files.

Do not copy the complete current tree into this skill. The structure changes as
the product evolves; the skill owns the discovery and governance method.

## Find the current structure

Before proposing or changing handbook structure:

1. Locate candidate handbook specs and their status:

   ```text
   rg -n "Handbook.*Information Architecture|Status:|Superseded" ../specs specs
   ```

2. Read the latest approved, non-superseded structure completely. Follow its
   explicit supersession links and preserve active detailed requirements from
   partially superseded specs.
3. Locate the runtime manifest and all consumers:

   ```text
   rg -n "handbookSections|handbookManifest|previous|next|breadcrumb|redirect" web/src
   ```

4. Inventory public content and routes:

   ```text
   rg --files web/src/content web/src/pages/handbook web/src/pages/harness
   ```

5. Inventory public packages, adapters, examples, CLI/starter output, and
   generated API modules. Join them to the coverage matrix.
6. Report four states separately:
   - approved target;
   - currently shipped;
   - legacy but still reachable;
   - missing or conflicting.

Do not describe a proposed target as current behavior. Do not describe the
rendered current hierarchy as approved merely because it builds.

## Structural manifest

Maintain one machine-readable manifest for the public handbook. Each canonical
topic should expose at least:

| Field | Purpose |
| --- | --- |
| `topicId` | Stable identity independent of title or route |
| `product` | Framework or Harness ownership |
| `chapterId` | Product-local chapter ownership |
| `parentTopicId` | Hierarchy and breadcrumb parent |
| `order` | Product-local reading order |
| `canonicalRoute` | One public canonical URL |
| `source` | Canonical content source |
| `pageRole` | Tutorial, concept, task, hub, adapter, operations, migration, or reference |
| `status` | Canonical, deprecated, redirected, or intentionally private. Keep planned work in the approved spec or plan rather than shipping it in the public manifest. |
| `redirects` | Historical public routes targeting this topic |
| `availabilityOwner` | Page responsible for default/enablement guidance when applicable |

Derive these consumers from the manifest:

- handbook landing and product landing pages;
- sidebar and mobile navigation;
- breadcrumbs;
- previous/next navigation;
- search product/chapter facets;
- canonical URL and OpenGraph metadata;
- Markdown endpoints where supported;
- redirect tables; and
- structural audit expectations.

Content frontmatter may supply topic metadata, or the manifest may reference
content. Do not let two sources independently define ordering or canonical
routes.

## Required invariants

- Topic IDs and canonical routes are unique.
- Every non-root topic has an existing parent in the same product.
- Framework and Harness have independent previous/next graphs.
- A shared handbook landing page links into products but is not part of either
  product's sequential graph.
- AI-powered PURISTA services are Framework-owned service documentation;
  standalone model, tool, skill, MCP, plugin, memory, guardrail, and evaluation
  details remain Harness-owned.
- Every canonical manifest entry resolves to a source page or an explicit
  redirect. Missing content fails validation; it never renders a public
  placeholder.
- Every canonical page has a meaningful inbound path and focused next step.
- A chapter landing page or capability hub contains orientation and decision
  guidance; it is not an empty wrapper or card index.
- A visible chapter has a distinct reader job and sufficient verified material
  for a first useful path, decisions or configuration, and a next step. Merge
  or redirect pointer-only, duplicate, or empty chapters instead of retaining
  them for taxonomy symmetry.
- Each material adapter/provider has one focused guide, and every public
  package/adapter has a coverage owner.
- Old public routes remain redirects until intentionally retired through an
  approved migration.
- Framework and Harness keep separate API, configuration, package,
  compatibility, and migration reference scopes.

## Drift audit

A structural audit should produce both a human summary and machine-readable
findings. Check:

1. approved spec topics versus manifest topics;
2. manifest sources versus content files;
3. content files not owned by the manifest;
4. duplicate IDs, routes, titles that claim the same job, and redirect targets;
5. missing/invalid parents and cycles;
6. cross-product previous/next edges;
7. sidebar, landing, breadcrumbs, search, Markdown, canonical, and OpenGraph
   routes against the manifest;
8. redirects for legacy and externally linked routes;
9. public package, adapter, provider, CLI, configuration, example, and API
   coverage; and
10. feature availability owners and missing enablement guidance.

Classify findings:

| Severity | Meaning |
| --- | --- |
| Blocking | Broken route, missing canonical content, duplicate canonical job, cross-product sequence, unsafe or incorrect guidance |
| High | Public capability/adapter missing, optional feature cannot be enabled, stale source ownership |
| Medium | Weak hub, missing decision guidance, orphan legacy content, incomplete redirect metadata |
| Low | Label, ordering, or presentation inconsistency that does not misroute the reader |

Run the structural audit with the repository skill and knowledge audits. A
content migration is incomplete while unexplained blocking or high findings
remain.

## Parallel work

For parallel handbook refactors:

- assign content agents disjoint product/chapter directories;
- reserve manifest, schema, redirect, shared layout, and audit files for named
  integration agents;
- establish route IDs and target paths before parallel authoring;
- let each content agent record legacy dispositions without deleting shared
  legacy sources;
- merge and redirect legacy content only after all owning chapters are ready;
- use one integration pass for search, breadcrumbs, canonical metadata, and
  previous/next behavior; and
- finish with an independent coverage, link, rendered-page, and security review.

An agent must not opportunistically reorganize a sibling chapter while writing
one assigned chapter. Record the proposal as a drift finding or follow-up.

## Changing the structure

An intentional structural change updates, in order:

1. the approved information-architecture spec and its supersession notes;
2. the canonical manifest and topic IDs;
3. content source/frontmatter and coverage ownership;
4. redirects and canonical metadata;
5. landing, sidebar, breadcrumbs, previous/next, and search through manifest
   consumers;
6. structural audit fixtures or expectations; and
7. internal links, examples, and API-to-handbook links.

Preserve stable routes when the reader job is unchanged. When the job or
ownership changes, merge unique value into the new canonical page and add a
redirect in the same change.
