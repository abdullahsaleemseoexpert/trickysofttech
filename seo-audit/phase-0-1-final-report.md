# Phase 0 + 1 — Final Report

Local SEO topical-authority revamp. Design system untouched. On branch `local-seo-revamp`. **Not deployed, not merged.**

Companion docs: `phase-0-1-before-state.md`, `claim-review.md`, `current-site-inventory.md`, `local-seo-architecture-and-gaps.md`.

---

## Implementation summary

The site now has a real Local SEO spine. `services/local-seo` is a substantive commercial pillar that explains the discipline end to end and links contextually into nine supporting topics; every one of those topics links back up. The services and industries hubs reposition Local SEO as the core rather than one of eight equal offerings. The Google Business Profile page is deepened into the explicit centre of the GBP cluster. Fabricated result numbers and an invented testimonial were removed from the two rebuilt service pages. Two internal-linking gaps the audit found — 12 orphaned industry guides and 10 near-orphan city pages — are closed.

## Localhost

`http://localhost:3000` (dev server `gfv-preview`, PowerShell HttpListener, clean-URL routing).

Verified pages: `/`, `/services/`, `/services/local-seo`, `/services/google-business-profile`, `/industries/`, `/industries/plumbing`, `/industries/roofing`, `/locations/arizona`, `/locations/gilbert-az`, `/locations/roswell-ga`, `/blog/how-local-seo-works`, `/blog/google-business-profile-checklist`, `/blog/rank-in-google-map-pack`.

## Pages modified — count + URLs

**60 files changed** (~1,200 line insertions). No design/CSS changes.

### A. Rebuilt (4)
| URL | What changed |
|---|---|
| `/services/local-seo` | Full rebuild into the pillar. New hero (H1 "Local SEO, run as one connected program"); fabricated stat grid → four concept tiles; new prose section "What local SEO is actually doing"; "What's included" (6 generic cards) → "The program" (8 sub-discipline cards, 6 with contextual links); new "Measurement & ROI" section; fabricated testimonial/stat "proof" section → factual "how the change shows up"; FAQ rewritten 4 → 6, schema regenerated; templated section headings replaced; "40 markets" → "50". ~700 → ~1,600 words. Contextual links out to 10 cluster resources. |
| `/services/` | Hero "Eight services. One obsession." → "One core service. The rest support it." with a link to the pillar; fabricated stat grid → four concept tiles; grid reordered so Local SEO + GBP lead; Local SEO card relabelled "Core discipline" and softened ("50+ location rollouts" removed); section intro added establishing the order of operations; process-section heading de-templated; title/description reframed around Local SEO. |
| `/services/google-business-profile` | Deepened into the GBP cluster hub. New hero ("The profile the map pack is built from") linking the pillar; fabricated stat grid → concept tiles; new prose section "The map pack is your profile, ranked" linking 4 GBP articles; "What's included" → "What we manage" (6 cards, 3 with cluster links); fabricated testimonial/stats → factual "how the change shows up" linking the timeline article; FAQ rewritten 4 → 6, schema regenerated, `Service` schema gains `isRelatedTo` the pillar; headings de-templated; "40" → "50". ~680 → ~1,300 words. |
| `/industries/` | 161-word stub → real hub. New hero ("Local SEO, tuned to how your trade gets found") linking the pillar; fabricated stat grid → four search-behaviour tiles; new prose section "Same three ranking factors. Different weights." linking the ranking-factors article and the pillar; a genuine one-line descriptor added to each of the 12 trade cards; grid + CTA headings de-templated; CTA reframed off past-work implication. ~160 → ~570 words. |

### B. Touched for internal linking only (minimum change)

| Group | Files | Change |
|---|---|---|
| Industry pages | all 12 in `industries/` | One contextual line after the approach paragraph linking the trade's marketing guide (varied per-trade lead-in) + the pillar ("local SEO program"). |
| Local-SEO-core blog posts | `how-local-seo-works`, `local-seo-ranking-factors-2026`, `rank-in-google-map-pack`, `how-long-does-local-seo-take`, `track-local-seo-roi`, `nap-consistency-local-rankings`, `local-link-building-home-service-businesses`, `how-to-get-google-reviews`, `entity-seo-for-local-businesses`, `service-area-pages-vs-city-pages` | CTA-panel secondary button changed from generic "More Articles" → the pillar, with a distinct anchor per post. `how-local-seo-works`, `local-seo-ranking-factors-2026`, `google-business-profile-checklist`: pre-existing "highest-leverage" → "highest-impact" (banned-word rule). |
| GBP blog posts | `google-business-profile-checklist`, `google-business-profile-suspended-reinstatement`, `google-business-profile-not-showing-up`, `report-fake-google-business-listings-map-spam` | CTA-panel secondary button → `services/google-business-profile` (varied anchors). `checklist` + `not-showing-up`: one contextual body-paragraph link added to the GBP service page and/or pillar. |
| State pages | `locations/arizona`, `georgia`, `north-carolina`, `florida`, `texas` | The 10 new city cards added to the "Cities we serve" grid (AZ +3, GA +2, NC +2, FL +2, TX +1); stale city-count prose corrected (e.g. "six Arizona markets" → "nine"). |
| Adjacent city pages | `locations/gilbert-az` (+3), `locations/mesa-az` (+2), `locations/roswell-ga` (+2) | Genuinely-adjacent new cities added to "Nearby Markets". |
| Technical hygiene | 23 files sitewide (incl. 6 blog + 5 location + 6 service + 12 industry among those touched, plus `404.html`) | Appended the missing `</html>` closing tag. Pre-existing defect; every other page had it. |

## Pages created

**None.** See the GBP-new-page decision below.

## Pages removed / merged

**None.** Two *sections* were removed, both fabricated (rule 35): the named-testimonial "proof" blocks on `services/local-seo` and `services/google-business-profile`. Each was replaced in place with a factual panel of equal size, so no layout gap. No URLs removed; no redirects needed.

## Internal linking — major relationships established

- **Pillar → cluster (contextual, in prose/cards):** `services/local-seo` now links `how-local-seo-works`, `local-seo-ranking-factors-2026`, `rank-in-google-map-pack`, `services/google-business-profile`, `service-area-pages-vs-city-pages`, `nap-consistency-local-rankings`, `how-to-get-google-reviews`, `local-link-building-home-service-businesses`, `entity-seo-for-local-businesses`, `track-local-seo-roi`, `how-long-does-local-seo-take`, plus the existing 13-industry and 50-city grids.
- **Cluster → pillar:** ~14 blog posts + all 12 industry pages + both hub pages now link up to `services/local-seo`. Its inbound body-link count went **79 → 91**.
- **GBP cluster, both directions:** `services/google-business-profile` ↔ `google-business-profile-checklist`, `-suspended-reinstatement`, `-not-showing-up`, `report-fake-google-business-listings-map-spam`, `rank-in-google-map-pack`. Its inbound count went **71 → 74**.
- **Industry ↔ guide:** each of the 12 industry pages now links its `*-marketing-guide` (previously one-directional; the guides were near-orphans at 1 inbound).
- **New city pages:** now linked from their state page's city grid, the locations hub, the pillar's location grid, and (for the 3 with true adjacency) neighbouring city pages. No longer near-orphans.
- **Orphan check after the pass:** the only remaining low-inbound pages are utility pages (`privacy`, `terms`, `careers`, `404`, `location-template`) that are linked from the footer. Zero broken internal links across all 60 changed files.

## GBP cluster — final architecture

```
services/google-business-profile   (commercial hub — child of services/local-seo, isRelatedTo in schema)
├── blog/google-business-profile-checklist ......... intent: how to optimise a profile, field by field
├── blog/rank-in-google-map-pack ................... intent: how map-pack ranking works / how to rank
├── blog/google-business-profile-not-showing-up .... intent: troubleshooting an invisible profile (all causes)
├── blog/google-business-profile-suspended-reinstatement  intent: one cause — suspension — and recovery
└── blog/report-fake-google-business-listings-map-spam    intent: competitor spam / fake listings
```
All five now link to the hub and to at least one sibling. No overlap requiring consolidation — each has a distinct intent (checklist = build, map-pack = rank, not-showing-up = diagnose, suspension = recover, map-spam = competitors).

## GBP new-page decision (rule 13)

`gbp-categories` and `gbp-for-service-area-businesses` were **not created**. Rationale:
- **Categories** is adequately covered as a section of `google-business-profile-checklist`, on the pillar, and on the GBP service page. A standalone page would overlap the checklist without a clearly distinct intent.
- **Service-area businesses** is the stronger candidate — a genuine gap (no page owns "GBP setup for a business with no storefront": address hiding, service-area radius, the SAB suspension trap, proximity effects). It is now covered as FAQ items on the GBP service page and as one cause in `not-showing-up`, which is enough for this phase. **Recommended as the first new page in Phase 2/4** if GSC shows demand for those queries and the existing coverage does not rank.

Creating a net-new indexed page was also held back deliberately per the instruction to preserve the current footprint while the spine settles.

## The Local SEO pillar — what was added

- A plain-language explanation of what Local SEO is and how the relevance/distance/prominence model works, with the three cluster links a reader would want next.
- "The program" — the eight sub-disciplines (GBP, keyword strategy, local content/landing pages, citations, reviews, local links, schema/entity, multi-location) each described in a sentence or two, six carrying a contextual link to the resource that goes deeper.
- A measurement section: what is reported (calls, direction requests, form fills, per location), the monthly cadence, honest timing, and the "nothing is guaranteed" qualifier.
- A four-step process rewritten to be specific rather than "whatever you start with, the process is the same".
- Contextual links to the GBP service page, and industry/location grids retained as the pillar → industry and pillar → location edges.
- Removed: the fabricated 340% / 95% / 847 / 50+ figures and the "Ray Delgado, Metro Plumbing Co." testimonial.

## Claims requiring owner confirmation

Full detail in `claim-review.md`. Held for your decision, **not changed** this phase:

1. **`aggregateRating` (4.9 / 63 reviews) in the sitewide Organization JSON-LD** — highest priority. An unverifiable rating in schema across ~140 pages is a structured-data policy risk. Confirm 63+ genuine, visible reviews exist, or authorise removing `aggregateRating` from the Organization node.
2. **Proof numbers on untouched pages** — "200+ brands", "$40M+ revenue", the "Summit Roofing" / "Metro Plumbing" examples still appear on the homepage, the other service pages, and the 12 industry pages (which are Phase 6). Provide one or two real (even anonymised) local-SEO results so proof sections can carry genuine evidence.
3. **Footer badges** — "SOC 2 Compliant", "CCPA Compliant", "Clutch Top Agency" (sitewide footer). Confirm or remove.
4. **Largest simultaneous-location count** — so multi-location claims can use a real number instead of the removed "50+".

## QA

| Check | Result |
|---|---|
| Build / dev server | `gfv-preview` starts, serves all routes, clean-URL routing works |
| Routes | All 13 tested pages return content, 200 |
| `<div>` / `<section>` / `<main>` / `<h1>` balance | Balanced on all 60 changed files |
| JSON-LD | Valid on every changed page; FAQPage schema matches visible FAQ on `services/local-seo` (6/6) and `services/google-business-profile` (6/6) |
| Broken internal links | None across the 60 changed files |
| Banned / AI phrasing | Clean (3 pre-existing "highest-leverage" fixed) |
| Em-dashes | None introduced |
| `</html>` closing tag | Was missing on 23 files sitewide; now present everywhere |
| Console errors | None on the pillar page (and no JS was changed) |
| Mobile (375px) | `services/local-seo` — no horizontal overflow, program grid stacks to one column, hero tiles 2-up, readable |
| Desktop (1280px) | No horizontal overflow on any rebuilt page; no empty sections; nav unchanged (`.nav-link` still 14px, header markup untouched) |
| Design system | No CSS, colour, component, font, spacing, or animation change. New sections use existing classes (`.inc-card`, `.proof-card`, `.section-headline`, `.eyebrow`, `.rel-card`, hero-tile pattern) only |

## Files created (this phase)

- `seo-audit/phase-0-1-before-state.md`
- `seo-audit/claim-review.md`
- `seo-audit/phase-0-1-final-report.md` (this file)

(`seo-audit/current-site-inventory.md` and `local-seo-architecture-and-gaps.md` were created in the audit step. `seo-audit/` is git-ignored from deploy.)

## Not done (deferred, as instructed)

Phase 2–8. Specifically **not** started: the 13 industry-page rewrites (Phase 6), the ~40 older location-page value audit (Phase 7), the keyword-research / citations / links / reviews / schema / multi-location cluster build-out (Phases 3–5), and any new pages.
