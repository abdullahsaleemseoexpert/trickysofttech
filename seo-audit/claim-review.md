# Claim Review — unverified / stale marketing claims

Internal. Compiled during the Phase 0/1 Local SEO revamp. No supporting evidence exists in the repository for the "results" numbers below; they must not be repeated or invented on new/rewritten pages.

Status key: **VERIFIED** (repo/site supports it) · **STALE** (was true, now wrong — safe to correct to the real value) · **NEEDS OWNER CONFIRMATION** (may be real, but unprovable from here) · **SAFE TO SOFTEN** (reframe without a number).

| Claim | Where it appears | Status | Action taken in Phase 0/1 |
|---|---|---|---|
| "40 local markets" / "across 40 local markets" | Every service page (9), every industry page (13), `services/local-seo` locations section | **STALE** — there are 50 city pages + 7 state pages | Corrected to **50** on pages touched this phase (services/local-seo, services/index, industries/index). Remaining service/industry pages get it in Phase 6 or a mechanical sweep — flagged below. |
| "50+ simultaneous locations" / "50+ location rollouts" | `services/local-seo` (hero sub, meta, Service schema, FAQ, hero stat), `services/index` Local SEO card | **NEEDS OWNER CONFIRMATION** | Softened on `services/local-seo` to capability language ("built to run across many locations at once") pending a real figure. Left on other pages for Phase 6. |
| "340% avg call volume increase" | `services/local-seo` hero stat + proof stat | **NEEDS OWNER CONFIRMATION** | Removed from `services/local-seo` hero; proof section de-numbered (see below). |
| "95% Map Pack presence achieved" | `services/local-seo` hero stat; `industries/plumbing` meta ("took one plumber to 95% Map Pack presence across five cities") | **NEEDS OWNER CONFIRMATION** | Removed from `services/local-seo` hero. `industries/plumbing` meta left for Phase 6 — flagged. |
| "847 citation data points corrected" | `services/local-seo` hero stat + proof stat | **NEEDS OWNER CONFIRMATION** | Removed from `services/local-seo`. |
| Testimonial: "Ray Delgado, Owner, Metro Plumbing Co." + quote | `services/local-seo` proof section | **NEEDS OWNER CONFIRMATION** — no case study for "Metro Plumbing Co." exists in `/case-studies` or `/portfolio` | Proof section on `services/local-seo` reworked to a factual "what changes when local SEO is working" panel with **no named person and no invented numbers**. A real testimonial/case study should replace it. |
| "200+ brands scaled" | `services/index` hero stat; sitewide proof-card copy ("Across 200+ brands…"); homepage | **NEEDS OWNER CONFIRMATION** | `services/index` hero stat reframed. Sitewide proof-card copy is in many files — flagged, not touched this phase. |
| "$40M+ revenue generated" | `services/index` hero stat; sitewide proof-card copy | **NEEDS OWNER CONFIRMATION** | `services/index` hero stat reframed. Sitewide copy flagged. |
| "4.9★ / reviewCount 63" in `AggregateRating` Organization schema | **Every page** (in the shared Organization JSON-LD) | **NEEDS OWNER CONFIRMATION** — `AggregateRating` on `Organization` without collectable review evidence is a Google structured-data policy risk | **Not changed this phase** (it is in the shared head block on 140+ files; changing it is its own task). Flagged for owner decision: confirm 63 real reviews exist and are visible, or remove `aggregateRating` from the Organization node. |
| "4.9★ Clutch rating" / "Clutch Top Agency" badge | `services/index` hero; footer badge (sitewide) | **NEEDS OWNER CONFIRMATION** | Hero reference softened on `services/index`. Footer badge is sitewide — flagged. |
| "SOC 2 Compliant", "CCPA Compliant" footer badges | Footer (sitewide) | **NEEDS OWNER CONFIRMATION** | Not touched (sitewide footer). Flagged. |

## Recommended owner decisions

1. **AggregateRating in Organization schema** — the highest-priority item. Either (a) confirm 63+ genuine reviews exist on a platform and are shown on the site, or (b) authorise removing `aggregateRating` from the sitewide Organization JSON-LD. Leaving an unverifiable rating in schema across 140 pages is a real risk.
2. Provide one or two **real** local-SEO client results (even anonymised — "a five-location plumbing company", real percentages) so the proof sections can carry genuine evidence instead of being softened to generalities.
3. Confirm or drop the **Clutch / SOC 2 / CCPA** footer badges.
4. Confirm the largest simultaneous-location rollout count so multi-location claims can use a real number.
