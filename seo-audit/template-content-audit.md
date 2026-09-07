# Template / AI-Sound Content Audit

Internal. **Audit only — no page rewrites performed.** Generated from `<main>` content of all 9 service, 13 industry, and 58 location pages.

Severity: **High** = identical across most/all pages of a type and user-visible as a heading or opening; **Medium** = repeated supporting copy or CTA; **Low** = structural/nav repetition that is normal for a template.

---

## SERVICES (9 pages)

| Pattern | Occurrences | Affected pages | Severity | Recommended future action (Phase 6+) |
|---|---|---|---|---|
| H2 `"What an engagement looks like."` | 6 of 9 | every service page with a proof section | **High** | Introduced during the Phase 0.5 claim cleanup (replaced the equally-templated `"Real work. Real numbers."`). Give each service page a proof/measurement heading specific to that service. |
| H2 `"Related services."` | 6 of 9 | all with a related-services block | Medium | Vary ("Where GBP connects", "Pairs with", …) or fold into contextual links. |
| CTA button `"Book Free Audit"` | 13 instances | most service pages, often twice | Medium | Standardise to one primary label ("Get Your Free Local Visibility Audit", already used on the rebuilt pages) but vary the secondary/mid-page ones. |
| CTA `"See Case Studies"` | 7 | — | Medium | Depends on the case-studies decision (see `phase-0-5-claim-decisions.md`). |
| H2 `"Questions we get asked."` | 2 | rebuilt pages (local-seo, GBP) | Low | Acceptable; only 2. |

The 8 service pages **not rebuilt in Phase 0/1** (website-dev, website-seo, ai-search-optimization, ai-voice-optimization, geo, social-media-marketing, plus the two hubs) still carry the original templated skeleton: `{Topic}, handled end to end` → `A {process} built for scale` → `{Topic}, answered.` → `{Topic} for every local trade` → `{Topic} across 50 local markets`. Not in scope for Phase 0.5.

## INDUSTRIES (13 pages)

| Pattern | Occurrences | Affected pages | Severity | Recommended future action (Phase 6) |
|---|---|---|---|---|
| H2 `"What an engagement looks like."` | 12 of 13 | all industry pages | **High** | Same as services — a by-product of the Phase 0.5 proof-card cleanup. Phase 6 industry rewrite should give each a trade-specific proof/expectation heading. |
| H2 `"Related industries."` | 12 of 13 | all | Medium | Vary or make contextual. |
| CTA trust line `"✓ No commitment required ✓ Senior strategist on the call ✓ Actionable in 24 hours"` | 13 (verbatim, every page) | all industry pages | **High** | One identical reassurance line on all 13. Vary per trade or reduce to a single site-standard line used sparingly. |
| CTA `"Book Free Audit"` | 24 | all, twice each | Medium | As above. |
| Approach section: the H2 pair `"{Industry} search spans {X} and {Y}"` + a two-clause `section-sub` | ~11 | all non-rebuilt industry pages | **High** | The core Phase 6 rewrite — each industry page needs its own information architecture, not the shared `{trade} search spans panic and planning` frame with the noun swapped. |
| Identical 4-step process descriptions with the trade name substituted | ~11 | all | **High** | Phase 6 — genuine per-trade process. |

## LOCATIONS (58 pages)

| Pattern | Occurrences | Affected pages | Severity | Recommended future action (Phase 7) |
|---|---|---|---|---|
| H2 `"What an engagement looks like."` | 57 of 58 | every location page | **High** | Phase 0.5 by-product again. Phase 7 should localise or vary it. |
| Nearby-markets card blurb `"… Local SEO, GBP & AI search visibility built for the area."` | 127–185 | the ~40 older location pages' "nearby markets" sections | **High** | The single most-repeated string on the site. Each nearby card should carry a one-line market descriptor (the 10 new city pages and the Phase 0.5 state-page additions already do this). |
| CTA `"Learn More"` on industry mini-cards | 141 | most location pages | Medium | Vary or drop the label. |
| The 10 newest city pages share a section frame: eyebrow `"Why {City} businesses choose us"` + H2 `"Built for how {City} actually searches."` | 10 | scottsdale, chandler, tempe, marietta, sandy-springs, cary, concord, lakeland, ocala, lubbock | Medium | These are the strongest-content location pages; the shared frame is acceptable for now but Phase 7 should confirm each section body is genuinely city-specific (spot-check says yes). |
| `"We also serve these {State} markets."` H2 | per state (5–9x) | grouped by state | Low | Normal template repetition; fine. |
| The ~40 older city pages (knoxville-tn style) share the section order and several sentence frames with the city name swapped | ~40 | all pre-existing city pages | **High** | The core Phase 7 task — per-city value assessment and rewrite/consolidation of the weak ones. |

---

## Cross-cutting notes

1. **Phase 0.5 introduced one new repeated heading** — `"What an engagement looks like."` on ~75 pages — while removing the fabricated `"Real work. Real numbers."`. This was the lowest-risk way to de-fabricate 75 proof sections at once without a full rewrite, but it is itself templated and must be varied during Phases 6–7. A quick targeted pass (2–3 heading variants keyed to page type) could reduce it before then if desired.
2. The **industry and older-location pages** carry the bulk of the templating. Both are explicitly deferred to Phases 6 and 7.
3. The **4 rebuilt pages** (local-seo, services/, google-business-profile, industries/) have distinct, non-formulaic information architecture and are not flagged here except for the shared proof heading.
4. No obvious "AI-generated marketing" phrasing was found in the rebuilt pages (no "in today's landscape", "unlock", "supercharge", "seamless", "dive into"). The pre-existing "highest-leverage" was corrected sitewide in Phase 0.5.
