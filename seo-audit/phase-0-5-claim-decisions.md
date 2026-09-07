# Phase 0.5 — Claim Decisions

Internal. Every claim listed in the Phase 0/1 report was investigated for evidence in the repository and on the rendered site. **No replacement numbers were invented.** Design/CSS untouched. Branch `local-seo-revamp`, **not deployed**.

Status key: **REMOVED** · **SOFTENED** (reframed to factual, non-numeric) · **CORRECTED** (stale fact, real value known) · **FLAGGED** (needs owner decision, not changed).

---

## 1. AggregateRating (4.9 / 63 reviews) — **REMOVED**

**Evidence search:** the sitewide Organization JSON-LD asserted `"aggregateRating": {"ratingValue":"4.9","reviewCount":"63"}` on 131 pages. Searched the repository and rendered pages for supporting evidence:

- No link anywhere to a Clutch, Google Business Profile, Trustpilot, or UpCity profile.
- No review content, review widget, or review feed on the site.
- The visible "4.9★", "4.9/5 Google", "4.9/5 Client Rating", "Clutch Rating" figures are marketing copy only, with nothing behind them.
- `AggregateRating` on an `Organization` node, with no collectable review evidence, is a Google structured-data policy risk.

**Decision:** removed `aggregateRating` from the Organization JSON-LD on all **131 pages**. Not replaced with any value. All JSON-LD on every affected page re-parsed and validated after the edit (0 errors). If the owner can show 63+ genuine, visible reviews on a real platform, this can be reinstated with a link to that platform.

## 2. "200+ brands / clients" — **SOFTENED** (+ 3 pages FLAGGED)

**Inventory (visible occurrences, after Phase 0/1):**

| Location | Exact claim | Status | Action |
|---|---|---|---|
| Shared proof card on 57 location + 9 industry pages | `"Across 200+ brands in 20+ industries … we've generated over $40M …"` | no evidence | Quote replaced with a factual capability statement ("Every client is a local or home-service business, run through the same program: …"). Proof-stat boxes (`200+ / Brands scaled`) → `Weeks` / `2–4 mo` / `Monthly` (defensible directional labels). |
| 12 industry hero stat grids | `200+ / Brands scaled`, `20+ / Industries served` | no evidence | Replaced with "what the work is" tiles (The map pack / Your profile / Reviews / Local links). Same 2×2 grid. |
| `about.html` stat grid + prose + meta | `200+ / Brands Served`, "that conviction runs 200+ brands" | no evidence | Stat cells → `Local / & home-service focus`, `Senior-led / Every account`, `Remote / US-wide`. Prose and meta reworded. |
| `index.html` (homepage) — stat counter, credential strip, two trust bars | `200 Businesses Served`, `200+ Clients Served`, `200+ Brands Served`, `200+ Clients` | no evidence | Softened: counter → `3 / Ranking factors`; strip/bar items → factual descriptors (Senior-led, Remote US-wide, 50 local markets). |
| `case-studies.html`, `portfolio.html`, homepage portfolio/testimonials/awards | named clients + metrics | no evidence | **FLAGGED** — see §7. |

## 3. "$40M+ tracked client revenue" — **SOFTENED**

Same inventory as §2 (the number always appears alongside "200+ brands"). Everywhere it was a discrete claim in a component, it was replaced with factual copy — never a different number. Occurrences handled: shared proof quote (66 pages), industry hero grids (12), `about.html`, `index.html` (why-metric line, stat counter, two trust bars, final-CTA stat — ~6 spots). Remaining `$40M` on `case-studies.html` / `portfolio.html` / homepage portfolio cards is FLAGGED (§7).

## 4. Clutch / SOC 2 / CCPA / partner badges

| Item | Where | Evidence | Decision |
|---|---|---|---|
| Footer badges `SOC 2 Compliant`, `CCPA Compliant`, `Clutch Top Agency` | sitewide footer, 143 pages | none | **SOFTENED** → `Founded 2021`, `Senior-Led`, `Remote, US-Wide`. Same 3 chips, same `.footer-badge` styling, footer layout identical. |
| `"4.9★ Clutch Rating"` stat cell | `about.html` | none | **SOFTENED** → `Remote / US-wide`. |
| `"Clutch 2024 Top 100"`, `"Google Certified Partner"` credential strip | homepage | none | **SOFTENED** → `GBP / managed as an asset`, `Est. / 2021`. |
| `"Clutch Rating"`, `"Average Clutch rating"` trust bars | homepage | none | **SOFTENED** → factual descriptors. |
| Partner-badge grid (`SEMrush Agency`, `Google Partner`, `Bing Ads Partner`, `Meta Blueprint`, `HubSpot Partner`, `LinkedIn Partner`, `UpCity Premier`, `Clutch Top 100`) | homepage — a dedicated section | none | **FLAGGED** — structural section, see §7. |
| CCPA in `privacy.html` / `terms.html` body text | 2 pages | legitimate — these pages explain CCPA rights | **kept** (correct legal content). |

## 5. Simultaneous-location / rollout claim — **already handled in Phase 0/1**

No `"50+ simultaneous locations"` or `"location rollout"` claims remain anywhere (0 hits). Phase 0/1 replaced the `services/local-seo` instances with capability language ("built to run across many locations at once"). Nothing further needed.

## 6. Stale "40 markets" — **CORRECTED**

- Phase 0/1 corrected `"40 local markets"` → `"50"` on 19 service/industry pages and the state-page prose.
- Phase 0.5 found one remaining instance: `locations/index.html` JSON-LD description `"across 40 cities in Texas, Arizona, …"` → **`"50 cities"`** (there are 50 city pages). JSON-LD re-validated.
- No other stale market counts remain.

## 7. Invented examples / named clients / result numbers

**Inventory:**

| Name / number | Where found | Decision |
|---|---|---|
| `Metro Plumbing Co.` / `Ray Delgado` | `industries/plumbing` proof + `services/ai-voice-optimization` proof + 5 blog posts | **SOFTENED.** Proof sections → factual panels. Blog narratives ("This is exactly the dynamic Metro Plumbing Co. ran into…") and an attributed pull-quote ("… (Ray Delgado, Owner, Metro Plumbing Co.)") reframed as explicit hypotheticals ("This is the dynamic a plumber runs into on expansion…"). Two blog posts used "Metro Plumbing" as a *hypothetical NAP example* — the name was changed to a clearly-invented one (`Rivertown Plumbing`). |
| `Summit Roofing & Restoration` | `industries/roofing` proof + 2 blog posts (`local-seo-ranking-factors-2026`, `roofing-marketing-guide`) | **SOFTENED.** Proof → factual panel. Blog narratives reframed as hypotheticals ("Picture a roofer doing excellent storm-restoration work whose Business Profile is a ghost listing…"). |
| `Evergreen HVAC Services` / `Marcus Boyd` / `Nathan Price` | `industries/hvac` proof + meta + hero grid + FAQ; 3 blog posts; homepage testimonials | **SOFTENED** on the industry page (meta description, hero grid, FAQ answer, proof) and the 3 blog posts. Homepage testimonial "Nathan Price, MD, Evergreen HVAC Services" (with an unrelated law-firm quote) is **FLAGGED** — see below. |
| `Todd Hargrove` / `Elena Cortez` / `Jordan Reyes` / `Priya Nair` / `Guardian Locksmith` / `ShineWorks` / `GreenScape` | `services/*` proof sections (ai-search-opt, geo, social-media, website-dev, website-seo) + `case-studies.html` + homepage | **SOFTENED** on the 5 service pages (proof → factual panels). `case-studies.html` + homepage FLAGGED. |
| `340%`, `95%`, `847`, `520%`, `+6,100%`, `410%`, `+280%`, `+365%`, `41K`, `5×`, `3.6-star`, `98% retention`, `4200% traffic growth`, `320%` | industry/service proof + hero grids + FAQ; homepage stat counters, proof bars, portfolio cards, testimonials; `case-studies.html`; `portfolio.html` | **SOFTENED** everywhere it was a discrete claim (industry hero grids, service/industry proof, hvac/roofing/plumbing FAQ + meta, homepage counters + proof bars + trust bars + final CTA). **FLAGGED** in the homepage portfolio-card section, homepage testimonials, `portfolio.html`, `case-studies.html`. |

### FLAGGED — needs owner decision (not changed in Phase 0.5)

These are **structural** — whole sections or whole pages built on named clients and their metrics. There is no factual "softened" version of a fake award card or a fake testimonial; the only options are *verify* (if real) or *remove/rewrite* (if illustrative), both of which are structural changes the owner should authorise.

1. **`portfolio.html`** — entire page: 6+ portfolio cards (`Metro Plumbing Co. +410%`, `Evergreen HVAC 520%`, `Summit Roofing 12→847`, `ShineWorks 41K`, `Guardian Locksmith 5×`, `GreenScape +365%`).
2. **`case-studies.html`** — entire page: detailed case-study narratives for all of the above named clients, plus `Todd Hargrove`, `Ray Delgado`, `Elena Cortez`, `Jordan Reyes`, `Priya Nair`.
3. **Homepage portfolio-cards section** (`index.html`, ~line 3760–3900) — the same 6 fabricated client cards.
4. **Homepage testimonials** (`index.html`, ~line 3960–4070) — named people (`Nathan Price`, `Amelia Laurent`, `Catherine Voss`, `Daniel Kim`, `Dr. Rachel Park`, `Dr. Sarah Rhodes`, `James Mercer`, `Marcus Thompson`) with roles at invented companies (`Fortis Legal Group`, `AquaFlow Technologies`, `BrightPath Finance`, `PrimeCare Clinic`, `Pinnacle Dental Group`, `NovaBid Marketplace`, `StackedFit`). **At least one is broken** — "Nathan Price, MD, Evergreen HVAC Services" is attached to a quote that opens "As a law firm, trust and authority are everything…".
5. **Homepage awards section** (`index.html`, ~line 4090–4140) — `Best SEO Agency`, `Best Web Dev Agency / Clutch Global`, `Top Social Media Agency / Drum Awards`, `Fastest Growing Agency / Agency 100 Report`, `Excellence in Local SEO / Search Awards UK`, `Top GEO Innovator / US Search Awards`, `BrightonSEO Awards`.
6. **Homepage partner-badge grid** (`index.html`, ~line 2900–2960) — `SEMrush Agency`, `Google Partner`, `Bing Ads Partner`, `Meta Blueprint`, `HubSpot Partner`, `LinkedIn Partner`, `UpCity Premier`, `Clutch Top 100`.

**Recommendation:** a dedicated **Phase 0.6 — Homepage + portfolio + case-studies rewrite**, once the owner confirms:
- Which (if any) of these are real clients/awards/partnerships. Real ones stay and get a verification link; the rest are removed or converted to clearly-labelled illustrative examples.
- Whether the homepage hero repositions from "The AI-First Growth Agency … for ambitious brands" to a Local-SEO-for-local-business position (see §8).

## 8. Homepage positioning check (Phase 0.5 item 10)

`/services/` was repositioned in Phase 0/1 (Local SEO + GBP now lead, framed as "one core service, the rest support it"). The **homepage hero was not touched** and still reads: eyebrow "The AI-First Growth Agency", H1 "Dominate Search. Lead AI. Grow Revenue.", sub "Elite digital marketing powered by AI-first strategy. We engineer compounding growth systems for ambitious brands…". This does **not** communicate Local SEO = core. It is the largest remaining positioning gap and belongs in the Phase 0.6 homepage pass, not a piecemeal edit.

## 9. Introduced-template note (Phase 0.5 item 8)

Softening 75 proof sections at once required a shared replacement heading. The first pass used one identical heading (`"What an engagement looks like."`) on all 75 — a template. This was then split into three type-based variants (`"What working with us looks like."` on locations, `"What to expect from an engagement."` on industries, `"How results tend to show up."` on services). Still repeated within type; flagged in `template-content-audit.md` for the Phase 6/7 rewrites.
