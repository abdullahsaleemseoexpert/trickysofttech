# Local Keyword Map

Internal working file. Built from Google Search Console data for `https://trickysofttech.com/`, last 90 days (data begins ~2026-08-22), pulled 2026-09-08. **No metrics are invented.** Impressions/clicks/position are GSC-reported; blank fields mean GSC has no data yet.

Property status: young domain in Google's evaluation phase. Total ~12 clicks / ~2,380 impressions across the window. Homepage is the only URL near page 1; almost everything else sits position 45-95. Treat this map as a demand signal and a routing table, not a ranking report.

## Intent groups

Queries GSC has recorded at least one impression for, grouped by intent:

- **commercial local (service+location)** — 86 queries, 276 impressions. e.g. "marketing agency waco", "best digital marketing agency tyler", "savannah digital marketing agency", "digital marketing agency in savannah"
- **service + location** — 83 queries, 385 impressions. e.g. "glendale seo", "digital marketing tyler tx", "savannah seo", "digital marketing waco tx"
- **implicit local** — 40 queries, 175 impressions. e.g. "it support for small businesses east texas", "ai agent voice search optimization", "locksmith seo", "marketing moving"
- **informational local** — 23 queries, 119 impressions. e.g. "how long does local seo take", "junk removal marketing strategies", "google business profile optimization checklist", "best marketing strategies for roofing companies"
- **commercial local** — 9 queries, 43 impressions. e.g. "auto detailing digital marketing", "digital marketing for car detailing", "marketing agency east texas", "digital marketing agency east texas"
- **near-me** — 9 queries, 34 impressions. e.g. "online marketing near me", "digital marketing agency near me", "near me website development waco", "best seo company near me"

## High-demand queries (>= 15 impressions)

These have the most recorded demand. `Action` reflects that the property is too young for on-page tweaks to move a position-70 ranking; the lever is off-page (GBP, citations, reviews, links) plus time.

| Query | Intent | Service | Location | Impr | Clicks | Avg pos | Best-fit URL | Action |
|---|---|---|---|--:|--:|--:|---|---|
| glendale seo | service + location | SEO (general) | Glendale | 35 | 0 | 72 | /locations/glendale-az | monitor; off-page + time |
| it support for small businesses east texas | implicit local | — | Texas (state) | 32 | 0 | 81 | /locations/texas | monitor; off-page + time |
| how long does local seo take | informational local | Local SEO | — | 31 | 0 | 58 | /services/local-seo | monitor; off-page + time |
| digital marketing tyler tx | service + location | Digital Marketing (hub) | Tyler | 30 | 0 | 70 | /locations/tyler-tx | monitor; off-page + time |
| savannah seo | service + location | SEO (general) | Savannah | 26 | 0 | 79 | /locations/savannah-ga | monitor; off-page + time |
| ai agent voice search optimization | implicit local | AI Voice | — | 23 | 0 | 88 | — | monitor; off-page + time |
| auto detailing digital marketing | commercial local | Digital Marketing (hub) | — | 23 | 0 | 76 | /services/ | monitor; off-page + time |
| digital marketing waco tx | service + location | Digital Marketing (hub) | Waco | 23 | 0 | 79 | /locations/waco-tx | monitor; off-page + time |
| online marketing near me | near-me | — | — | 19 | 0 | 24 | — | monitor; off-page + time |
| business website tyler tx | service + location | Website Dev / SEO | Tyler | 18 | 0 | 76 | /locations/tyler-tx | monitor; off-page + time |
| digital marketing waco tx address | service + location | Digital Marketing (hub) | Waco | 18 | 0 | 82 | /locations/waco-tx | monitor; off-page + time |
| get customers online tyler tx | service + location | — | Tyler | 18 | 0 | 66 | /locations/tyler-tx | monitor; off-page + time |
| locksmith seo | implicit local | SEO (general) | — | 18 | 0 | 63 | — | monitor; off-page + time |
| marketing agency waco | commercial local (service+location) | Digital Marketing (hub) | Waco | 18 | 0 | 84 | /locations/waco-tx | monitor; off-page + time |
| local seo savannah ga | service + location | Local SEO | Savannah | 17 | 0 | 45 | /locations/savannah-ga | monitor; off-page + time |

## Pages with the most recorded impressions

| Page | Impr | Clicks | Avg pos |
|---|--:|--:|--:|
| /locations/tyler-tx | 659 | 0 | 65 |
| /locations/waco-tx | 373 | 0 | 72 |
| /locations/savannah-ga | 195 | 0 | 75 |
| /blog/quarterly-seo-audit-checklist | 94 | 0 | 93 |
| /services/ai-voice-optimization | 63 | 0 | 79 |
| /locations/glendale-az | 58 | 0 | 70 |
| /locations/athens-ga | 52 | 0 | 70 |
| /contact | 51 | 0 | 69 |
| /industries/towing | 48 | 0 | 80 |
| / | 47 | 8 | 6 |
| /blog/locksmith-marketing-guide | 45 | 0 | 62 |
| /about | 44 | 1 | 12 |
| /blog/how-long-does-local-seo-take | 39 | 0 | 57 |
| /blog/roofing-marketing-guide | 39 | 0 | 75 |
| /locations/charleston-sc | 32 | 0 | 68 |
| /locations/cape-coral-fl | 30 | 0 | 68 |
| /locations/gainesville-fl | 29 | 1 | 71 |
| /blog/google-business-profile-checklist | 29 | 0 | 81 |
| /locations/columbia-sc | 29 | 0 | 75 |
| /industries/car-detailing | 27 | 0 | 72 |

## Cannibalization review

High-confidence conflicts only. A conflict = two indexable URLs targeting the same primary query + location intent.

- **City-guide blog posts vs location pages.** Five `/blog/digital-marketing-{city}` posts exist for Knoxville, Chattanooga, Greenville SC, Savannah GA, Cape Coral, alongside `/locations/{city}` pages for the same cities. Both target "{service} {city}" commercial intent.
  - GSC (90d): `/locations/*` city pages carry the impressions (athens-ga 52, glendale-az 58, charleston-sc 32, cape-coral-fl 30). The `digital-marketing-*` blog posts register almost nothing.
  - **Preferred URL: the `/locations/{city}` page** in every case. It is the commercial page, it is in the site's location architecture, and it is the one Google is already showing.
  - **Recommendation (needs owner approval, do not action here):** repoint each `digital-marketing-{city}` post to a genuinely informational angle (a local market/marketing guide) or 301 it to the matching `/locations/{city}` page. Flagged for a later targeted batch.
- **`/blog/quarterly-seo-audit-checklist` vs `/blog/local-seo-audit` (new).** Different intent by design: quarterly = recurring website/technical maintenance; local-seo-audit = one-time local visibility diagnosis. Titles and H1s make the split explicit. Not a conflict, but worth watching that "seo audit checklist" (GSC: 94 impressions on the quarterly page, "checklist seo audit" query recorded) does not start splitting. Monitor.
- **No other high-confidence conflicts.** The new Phase 2A-2F cluster pages each target a distinct query and were checked against existing pages before creation.

## Recommended next content batch

Based on demand clusters GSC shows and gaps not yet filled by Phases 2A-2F:

1. **City marketing guides that do not compete with location pages.** The `digital-marketing-{city}` posts show the demand exists for local marketing content; re-angle them as genuine local guides (local search behaviour, seasonal demand, the local competitive picture) so they support rather than cannibalize the location pages.
2. **"near me" explainer is covered** (`local-search-intent`). No new page needed; add internal links from industry pages to it.
3. **Trade + local SEO intersection pages** — GSC shows "[trade] marketing" and "best marketing strategies for roofing companies" style queries. These map to the industry marketing-guide blog posts, which already exist. Phase 4 (industry page depth) is the right vehicle, not new pages.
4. **State-level local SEO pages** — queries like "[trade] [state]" and state-name searches appear. The 7 state pages exist; Phase 7 location work should confirm they carry state-level commercial content.
5. **Do not** create city-industry combination pages or programmatic keyword pages. GSC gives no signal that would justify the thin-content risk.
