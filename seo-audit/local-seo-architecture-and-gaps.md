# Local SEO Topical Authority Revamp — Architecture & Gap Analysis

Internal working document. Companion to `current-site-inventory.md`.
Design system is **locked** — every change here is content, structure, internal linking, and metadata only.

---

## 1. Where the site stands today

**143 indexable pages:** 10 root · 9 services · 13 industries · 53 blog · 58 locations.

Technical baseline is clean: unique titles/descriptions/canonicals, valid JSON-LD everywhere, no broken internal links, correct noindex on `404` and `location-template`.

**Positioning today:** "Eight services. One obsession." The homepage and `/services/` frame Tricky Soft Tech as a broad AI-era digital marketing agency where Local SEO is one of eight equal offerings. `services/local-seo` already has the most inbound internal links of any service page (79), so the foundation for a pillar exists — it is just not built out.

### Template-content problem (the prompt's #1 prohibition)

Every **service page** (9) and **industry page** (13) is built on an identical H2 skeleton:

> `{Topic}, handled end to end.` → `A {process} built for scale.` → `Real work. Real numbers.` → `{Topic}, answered.` → `Related services.` → `{Topic} for every local trade.` → `{Topic} across 40 local markets.` → `Ready to {CTA}?`

- Industry pages average **571 words** and reuse generic paragraphs with the trade name swapped in. `industries/plumbing` and `services/local-seo` share the same H1 ("Own the map pack in every city you serve").
- `industries/index` is **161 words**.
- "**40 local markets**" is stated on every service and industry page — stale; there are now **50** city pages.

### Cluster coverage vs the target architecture

| Cluster | Existing pages | State | Priority |
|---|---|---|---|
| **Local SEO core** | `services/local-seo`, `how-local-seo-works`, `local-seo-ranking-factors-2026`, `how-long-does-local-seo-take`, `rank-in-google-map-pack`, `track-local-seo-roi`, `seo-vs-paid-ads`, `seo-vs-geo` | Good spine, pillar page thin, ~4 topic gaps | 1 |
| **Google Business Profile** | `services/google-business-profile`, `google-business-profile-checklist`, `-suspended-reinstatement`, `-not-showing-up`, `report-fake-google-business-listings-map-spam`, `rank-in-google-map-pack` | **Strongest existing cluster** (~6 pages). Needs connective linking + service-page depth; 1–2 real gaps | 2 |
| **Local keyword research** | none dedicated | **Missing entirely** | 3 |
| **Local content / landing pages** | `service-area-pages-vs-city-pages`, `how-many-locations-to-list-online`, `how-many-pages-should-a-website-have` | Partial; no hub | 4 |
| **Local citations** | `nap-consistency-local-rankings` | 1 page, no hub | 5 |
| **Local link building** | `local-link-building-home-service-businesses` | 1 page, no hub | 6 |
| **Reviews & reputation** | `how-to-get-google-reviews` | 1 page | 7 |
| **Local schema / entity** | `entity-seo-for-local-businesses`, `structured-data-for-ai-search` | 2 pages, AI-framed not local-framed | 8 |
| **Multi-location SEO** | mentioned on `services/local-seo` only | **Missing entirely** — and this is a stated differentiator ("50+ simultaneous locations") | 9 |
| **Industry-specific Local SEO** | 13 industry pages | Present but templated and thin (~571w) | 10 |
| **Location-specific Local SEO** | 58 location pages | Mixed. 10 new city pages + 5 city-guide blogs are strong; ~40 older city pages need per-city value review | 11 |

### Internal-linking gaps found

- The 12 **industry marketing-guide blog posts** link *to* their industry service page, but no industry service page links *back* — so the guides sit at 1 inbound link each.
- The **10 new location pages** (Scottsdale, Chandler, Tempe, Marietta, Sandy Springs, Cary, Concord, Lakeland, Ocala, Lubbock) have only 1 inbound link (from `locations/`), because the older cities' "nearby markets" sections predate them.
- No pillar → cluster → pillar linking exists. `services/local-seo` links to industries and locations but not to the supporting blog clusters.

### Claims to resolve before deepening pages

Pre-existing marketing claims that the revamp should either substantiate or soften (flagged, not yet changed): "200+ brands", "$40M+ tracked client revenue", "4.9★ / 63 reviews" (in Organization schema sitewide), "took one plumber to 95% Map Pack presence across five cities", "50+ simultaneous locations". Decision needed from the owner.

---

## 2. Target architecture

`services/local-seo` becomes the **commercial pillar**. Everything else is a supporting cluster that links up to it, and the pillar links down to each cluster hub. Other services (Website SEO, Web Dev, Social, AI Search, GEO, Voice) stay, repositioned as *supporting capabilities* rather than co-equal offerings.

```
services/local-seo  (PILLAR — commercial)
├── Local SEO fundamentals ......... what-is-local-seo*, how-local-seo-works, local-seo-audit*,
│                                    ranking-factors, local-search-intent*, how-long, track-roi
├── Google Business Profile ........ services/google-business-profile, gbp-checklist, map-pack,
│                                    not-showing-up, suspension, map-spam, (+ gbp-categories* / SAB*)
├── Local keyword research ......... local-keyword-research* (hub), near-me-searches*,
│                                    service-city-keywords*
├── Local content ................. local-landing-pages* (hub), service-area-pages-vs-city-pages,
│                                    how-many-locations, multi-location-content*
├── Local citations ............... local-citations* (hub), nap-consistency, citation-cleanup*
├── Local link building ........... local-link-building (rename/expand to hub), local-pr-community*
├── Reviews & reputation .......... how-to-get-google-reviews, responding-to-reviews*,
│                                    review-generation-system*
├── Local schema & entity ......... localbusiness-schema* (hub), entity-seo-for-local-businesses
├── Multi-location SEO ............ multi-location-local-seo* (hub), location-page-architecture*,
│                                    franchise-enterprise-local-seo*
├── Industries (13) ............... deepened, genuinely trade-specific
└── Locations (58) ............... audited; enriched or consolidated
```
`*` = new page needed. ~18–22 new pages total, all built from existing components.

---

## 3. Phased execution plan

Each phase = one branch, localhost review, then deploy — the cadence we've used. Ordered by ROI and risk, not by the cluster list.

| Phase | Scope | New pages | Rewrites | Risk |
|---|---|---:|---:|---|
| **0 — Foundation** | Rebuild `services/local-seo` as the real pillar; reposition `services/`; fix `industries/index`; "40→50 markets" sitewide; internal-linking pass 1 (industry↔guide, new-city nearby sections, pillar↔clusters) | 0 | 3 + link edits | Low |
| **1 — GBP cluster** | Deepen `services/google-business-profile`; wire the 6 GBP pages into a cluster; add `gbp-for-service-area-businesses` + `gbp-categories` if the gap is real | 0–2 | 1 | Low |
| **2 — Local SEO core gaps** | `what-is-local-seo`, `local-seo-audit`, `local-search-intent`; deepen `how-local-seo-works` | 3 | 1 | Low |
| **3 — Keyword research cluster** | `local-keyword-research` (hub), `near-me-searches`, `service-city-keywords` | 3 | 0 | Low |
| **4 — Citations / links / reviews** | Hubs + gap pages for the three thinnest clusters | 5–6 | 2 | Low |
| **5 — Schema/entity + multi-location** | `localbusiness-schema`, `multi-location-local-seo` (hub), `location-page-architecture`, `franchise-enterprise-local-seo` | 4 | 1 | Low |
| **6 — Industry depth** | Rewrite all 13 industry pages to ~1,400w genuinely trade-specific (search behavior, GBP nuance, competition, conversion, content strategy per trade) | 0 | 13 | **Medium** — large content change on indexed pages |
| **7 — Location audit** | Per-city value assessment of the ~40 older city pages; enrich the keepers, consolidate/redirect the weak ones | 0 | ~40 assessed | **Medium** |
| **8 — Metadata sweep + QA + migration maps** | Title/description/schema pass on everything touched; full technical QA; `final-local-seo-migration-map.md` + `final-local-seo-audit.md` | 0 | metadata | Low |

**Recommended start: Phase 0 + Phase 1.** GBP is already the strongest cluster and finishing it plus building the pillar gives the site a real Local SEO spine with almost no risk to existing rankings.

**On timing:** the property is ~2 weeks into Google's evaluation. Phases 6–7 (rewriting 50+ indexed pages) should wait until the earlier phases have settled and GSC shows how the site is trending, or be split into smaller batches.
