# Phase 0 + 1 — Before-State Record

Internal. Captured before any code change. Design system is locked; every change is content, structure, internal linking, or metadata.

Scope is **only** Phase 0 + Phase 1. No industry-page rewrite (Phase 6), no location-value audit (Phase 7). Pages in those groups are touched **only** to add the new Local SEO relationship, with the minimum content change that makes the link read naturally.

---

## Pages being modified

### A. Rebuilt as substantive pages

| Page | Current primary topic | New primary topic | Current parent → child | New parent → child |
|---|---|---|---|---|
| `services/local-seo` | "Own the map pack" — thin commercial page (~700w), templated H2s, fabricated stats/testimonial | **The Local SEO commercial pillar.** Explains the discipline end to end and is the semantic parent of the whole Local SEO ecosystem | child of `services/` | **Pillar.** Parent of: GBP service page, GBP/map-pack/ranking/how-long/ROI/citations/reviews/links/schema blog content, all 13 industry pages, all 58 location pages |
| `services/` (index) | "Eight services. One obsession." — 8 co-equal services | Local SEO positioned as the **primary discipline**; the other seven framed as supporting capabilities. Still commercially visible | flat list | Local SEO featured; others grouped as support |
| `industries/` (index) | 161w stub, "Twelve trades. One playbook" | A real overview: how Local SEO differs by trade, why the trade matters, links into each industry page and up to the pillar | thin hub | proper hub, linked to pillar |
| `services/google-business-profile` | "Turn your GBP into your highest-converting asset" (~683w), same templated skeleton | Deepened GBP management page; the commercial center of the GBP cluster, explicitly a child of the Local SEO pillar | child of `services/` | child of `services/local-seo`; parent/sibling of the 5 GBP blog resources |

### B. Touched for internal linking only (minimal content change)

| Group | Pages | Change |
|---|---|---|
| Industry pages | all 13 in `industries/` | Add one contextual link to the matching `blog/*-marketing-guide` where it genuinely extends the topic; add one contextual link up to `services/local-seo`. Varied anchor text. No restructure. |
| Local-SEO-core blog posts | `how-local-seo-works`, `local-seo-ranking-factors-2026`, `rank-in-google-map-pack`, `how-long-does-local-seo-take`, `track-local-seo-roi`, `nap-consistency-local-rankings`, `local-link-building-home-service-businesses`, `how-to-get-google-reviews`, `entity-seo-for-local-businesses`, `service-area-pages-vs-city-pages` | Add one contextual link up to `services/local-seo` (the commercial parent) where the article already discusses hiring help / going deeper. Not a "related" block dump. |
| GBP cluster | `google-business-profile-checklist`, `google-business-profile-suspended-reinstatement`, `google-business-profile-not-showing-up`, `report-fake-google-business-listings-map-spam`, `rank-in-google-map-pack` | Ensure each links to `services/google-business-profile` and, where relevant, to a sibling GBP article. Contextual. |
| New city pages | `scottsdale-az`, `chandler-az`, `tempe-az`, `marietta-ga`, `sandy-springs-ga`, `cary-nc`, `concord-nc`, `lakeland-fl`, `ocala-fl`, `lubbock-tx` | Add each into the "nearby markets" section of 2–3 geographically adjacent existing city pages, and confirm the parent state page lists them. |
| Service/industry pages with "40 local markets" | pages touched this phase | Correct to **50**. (Full mechanical sweep of the phrase across all service/industry pages is noted as a follow-up, not done blind this phase.) |

## Internal links being added (summary — full list in the final report)

- `services/local-seo` → contextual links to: `../blog/how-local-seo-works`, `../blog/local-seo-ranking-factors-2026`, `../blog/rank-in-google-map-pack`, `google-business-profile`, `../blog/how-long-does-local-seo-take`, `../blog/track-local-seo-roi`, `../blog/nap-consistency-local-rankings`, `../blog/how-to-get-google-reviews`, `../blog/local-link-building-home-service-businesses`, `../blog/entity-seo-for-local-businesses`, `../blog/service-area-pages-vs-city-pages`, plus the existing industry/location grids.
- ~10 blog posts → `../services/local-seo` (contextual, one each).
- 13 industry pages → their marketing guide + `../services/local-seo`.
- 5 GBP cluster pages → `../services/google-business-profile` + siblings.
- ~25 city-page "nearby markets" edits to surface the 10 new city pages.

## Internal links being removed

None planned. Default action is preserve (rule 21).

## New pages

Decision on `gbp-categories` and `gbp-for-service-area-businesses` is made **after** mapping the existing GBP pages' search intents (Phase 1). Created only if a distinct intent/gap is confirmed. Documented in the final report either way.

## Claims affected

See `claim-review.md`. On `services/local-seo` and `services/index`: fabricated result numbers and the unverifiable named testimonial are removed or softened. The sitewide Organization `aggregateRating`, footer badges, and proof-card copy on untouched pages are **flagged for owner decision, not changed** this phase.

## Metadata / schema

Titles, descriptions, OG, and JSON-LD are reviewed on the 4 rebuilt pages. `Service` schema `description` on `services/local-seo` and `services/google-business-profile` is updated to match the new copy. FAQPage schema is regenerated to match the rewritten visible FAQs. No schema is added purely for keywords; no invented entities.
