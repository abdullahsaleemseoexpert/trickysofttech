/* ZIP-code finder for trickysofttech.com. Self-contained: injects its own CSS (using the site's CSS variables,
 * so light/dark themes just work) and mounts itself into the hero of the home, /locations/, /services/* and
 * /industries/* pages. Data (lazy-loaded on first focus): /assets/zip-zips.json = { statePages, cities, zips: { "85201": [slug, miles, usps city, state] } }
 *
 * What happens for a ZIP (the rules the owner asked to see):
 *   exact   ZIP is inside a city that has a page      -> /locations/<city>
 *   near    no page, but a covered city is <= NEAR_MI -> suggest that city's page (shows the distance)
 *   state   no page nearby, but we cover that state   -> /locations/<state> hub + contact link
 *   none    state not covered / unknown ZIP           -> /contact link, no city page promised
 * Nothing redirects on its own except an exact match chosen by the visitor.
 */
(function () {
  'use strict';
  var NEAR_MI = 40;
  var SITE = 'trickysofttech.com';
  // Lead destination: the same FormSubmit.co ajax endpoint the site's /contact form and strategy popup already use
  // (owner confirmed 2026-10-09). If it is ever emptied, the form shows a mailto fallback instead of sending.
  var LEAD_ENDPOINT = 'https://formsubmit.co/ajax/abdullahsaleem12570@gmail.com';
  var DEBUG = !!window.ZIPW_DEBUG;
  var dl = (window.dataLayer = window.dataLayer || []);
  var log = [];

  var path = location.pathname.replace(/\/+$/, '') || '/';
  var SERVICE_NAMES = { geo: 'GEO', 'ai-search-optimization': 'AI Search Optimization', 'ai-voice-optimization': 'AI Voice Optimization' };
  var INDUSTRY_NAMES = { hvac: 'HVAC', 'landscaping-lawn-care': 'Landscaping & Lawn Care' };
  var titleCase = function (s) {
    return s.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }).replace(/\b(Seo|Ai|Gbp)\b/g, function (w) { return w.toUpperCase(); });
  };

  function context() {
    var m;
    if (path === '/') return { mode: 'home', title: 'Get Local SEO Service for your Zip Code', anchor: '#hero .hero-body', where: 'afterend' };
    if (path === '/locations') return { mode: 'hub', title: 'Find your local page by Zip Code', anchor: '.loc-search-wrap', where: 'beforebegin' };
    if ((m = path.match(/^\/services(?:\/([^/]+))?$/))) {
      var svc = m[1] ? (SERVICE_NAMES[m[1]] || titleCase(m[1])) : 'Local SEO Service';
      return { mode: 'service', service: svc, title: 'Get ' + svc + ' for your Zip Code', anchor: 'h1', where: 'sub' };
    }
    if ((m = path.match(/^\/industries(?:\/([^/]+))?$/))) {
      var ind = m[1] ? (INDUSTRY_NAMES[m[1]] || titleCase(m[1])) : '';
      return { mode: 'industry', industry: ind, title: ind ? 'Get Local SEO for ' + ind + ' in your Zip Code' : 'Get Local SEO for your Zip Code', anchor: 'h1', where: 'sub' };
    }
    return null;
  }

  function track(name, data) {
    var e = Object.assign({ event: name }, data || {});
    dl.push(e);
    log.unshift(new Date().toLocaleTimeString() + '  ' + name + '  ' + JSON.stringify(data || {}));
    var box = document.getElementById('zipw-log');
    if (box) { box.textContent = log.slice(0, 10).join('\n'); }
  }
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  var CSS =
    '.zipw{--zw-bg:var(--ink-void,#fff);--zw-bd:var(--border-emphasis,rgba(15,15,35,.16));--zw-tx:var(--text-primary,#14141F);--zw-mu:var(--text-secondary,#55597A);--zw-ac:var(--spectrum-core,#5B5FEF);' +
    'font-family:Inter,system-ui,sans-serif;color:var(--zw-tx);max-width:640px;margin:0 0 28px;text-align:left}' +
    '.zipw *{box-sizing:border-box}' +
    '.zipw-title{display:block;font-weight:700;font-size:.98rem;margin:0 0 10px;font-family:Sora,Inter,sans-serif}' +
    '.zipw-row{display:flex;gap:10px;flex-wrap:wrap;position:relative}' +
    '.zipw-field{position:relative;flex:1 1 200px;min-width:0}' +
    '.zipw-input{width:100%;height:52px;border-radius:14px;border:1.5px solid var(--zw-bd);background:var(--zw-bg);color:var(--zw-tx);font:inherit;font-size:1.05rem;padding:0 16px 0 44px;outline:none;box-shadow:0 1px 2px rgba(15,15,35,.04)}' +
    '.zipw-input:focus{border-color:var(--zw-ac);box-shadow:0 0 0 4px rgba(91,95,239,.16)}' +
    '.zipw-pin{position:absolute;left:15px;top:16px;width:18px;height:18px;color:var(--zw-mu);pointer-events:none}' +
    '.zipw-btn{height:52px;padding:0 22px;border:0;border-radius:14px;background:var(--grad-brand,linear-gradient(135deg,#5B5FEF,#A855F7));color:#fff;font:inherit;font-weight:600;font-size:.98rem;cursor:pointer;white-space:nowrap;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}' +
    '.zipw-btn:hover{filter:brightness(1.06)}' +
    '.zipw-btn.ghost{background:transparent;color:var(--zw-ac);border:1.5px solid var(--border-accent-strong,rgba(91,95,239,.45))}' +
    '.zipw-list{position:absolute;left:0;right:0;top:58px;z-index:30;margin:0;padding:6px;list-style:none;background:var(--zw-bg);border:1px solid var(--zw-bd);border-radius:14px;box-shadow:0 18px 40px rgba(15,15,35,.18)}' +
    '.zipw-list li{padding:9px 12px;border-radius:9px;cursor:pointer;display:flex;gap:8px;align-items:baseline;font-size:.95rem}' +
    '.zipw-list li b{font-variant-numeric:tabular-nums}' +
    '.zipw-list li small{margin-left:auto;color:var(--zw-mu);font-size:.8rem;text-align:right}' +
    '.zipw-list li.on,.zipw-list li:hover{background:var(--ink-raised,#F1F1F7)}' +
    '.zipw-res{margin-top:12px;padding:16px;border-radius:14px;border:1.5px solid var(--zw-bd);background:var(--zw-bg);display:grid;gap:10px}' +
    '.zipw-res[hidden]{display:none}' +
    '.zipw-res.ok{border-color:rgba(21,128,61,.45)}' +
    '.zipw-res.warn{border-color:rgba(184,132,42,.5)}' +
    '.zipw-h{margin:0;font-weight:700;font-size:1rem}' +
    '.zipw-p{margin:0;color:var(--zw-mu);font-size:.92rem;line-height:1.5}' +
    '.zipw-dest{margin:0;font-size:.8rem;color:var(--zw-mu);font-family:"JetBrains Mono",ui-monospace,monospace;word-break:break-all}' +
    '.zipw-acts{display:flex;gap:10px;flex-wrap:wrap}' +
    '.zipw-res.lead{border-color:var(--border-accent-strong,rgba(91,95,239,.45))}' +
    '.zipw-lead{display:grid;gap:10px}.zipw-lead-grid{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}' +
    '.zipw-input.zipw-sm{height:46px;padding:0 14px;font-size:.95rem}.zipw-err{margin:0;color:var(--text-error,#DC2626);font-size:.85rem}' +
    '.zipw-hint{margin:8px 2px 0;font-size:.85rem;color:var(--zw-mu);min-height:1.1em}' +
    '#zipw-logbox{position:fixed;left:10px;bottom:10px;z-index:99998;max-width:min(520px,calc(100vw - 90px));background:#0B0C1B;color:#9EA3D6;border-radius:10px;font:11px/1.45 ui-monospace,Consolas,monospace;padding:7px 10px;opacity:.96;cursor:pointer}' +
    '#zipw-logbox b{color:#fff}#zipw-logbox em{color:#7FE9F0;font-style:normal}#zipw-log{white-space:pre-wrap;margin:6px 0 0;max-height:130px;overflow:auto;display:none}#zipw-logbox.open #zipw-log{display:block}';

  function injectCss() {
    var s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function mount(ctx) {
    var host = document.createElement('div');
    host.className = 'zipw';
    host.dataset.mode = ctx.mode;
    var anchor, where = ctx.where;
    if (where === 'sub') {
      var h1 = document.querySelector('h1');
      var sec = h1 && h1.closest('section');
      anchor = sec && sec.querySelector('p.section-sub');
      where = 'afterend';
      if (anchor) host.style.marginTop = '4px';
    } else {
      anchor = document.querySelector(ctx.anchor);
    }
    if (!anchor) { console.warn('[zip-widget] no anchor for', path); return null; }
    anchor.insertAdjacentElement(where, host);
    return host;
  }

  function resolve(data, zip) {
    var z = data.zips[zip];
    if (!z) return { kind: 'none', zip: zip };
    var slug = z[0], miles = z[1], uspsCity = z[2], state = z[3];
    var c = data.cities[slug];
    if (miles === 0) return { kind: 'exact', zip: zip, slug: slug, city: c.city, state: c.state, from: uspsCity };
    if (miles <= NEAR_MI) return { kind: 'near', zip: zip, slug: slug, city: c.city, state: c.state, miles: miles, from: uspsCity, fromState: state };
    return { kind: 'state', zip: zip, from: uspsCity, fromState: state, statePage: data.statePages[state] };
  }

  var STATE_NAMES = { TX: 'Texas', AZ: 'Arizona', GA: 'Georgia', NC: 'North Carolina', TN: 'Tennessee', SC: 'South Carolina', FL: 'Florida' };

  function init(host, ctx) {
    var id = 'zipw-zip';
    host.innerHTML =
      '<form autocomplete="off" novalidate>' +
      '<label class="zipw-title" for="' + id + '">' + esc(ctx.title) + '</label>' +
      '<div class="zipw-row">' +
      '<div class="zipw-field"><svg class="zipw-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>' +
      '<input id="' + id + '" class="zipw-input" inputmode="numeric" maxlength="5" placeholder="Enter your ZIP code" role="combobox" aria-expanded="false" aria-controls="zipw-list" />' +
      '<ul id="zipw-list" class="zipw-list" role="listbox" hidden></ul></div>' +
      '<button class="zipw-btn" type="submit">Find my area</button>' +
      '</div>' +
      '<p class="zipw-hint" aria-live="polite"></p>' +
      '</form>' +
      '<div class="zipw-res" hidden aria-live="polite"></div>';

    var form = host.querySelector('form');
    var input = host.querySelector('.zipw-input');
    var list = host.querySelector('.zipw-list');
    var hint = host.querySelector('.zipw-hint');
    var res = host.querySelector('.zipw-res');
    var rows = [];
    var active = -1;
    var started = false;
    var data = null;
    var loading = null;

    // The ZIP data (~360 KB) is fetched only when the visitor touches the field, so page load / Core Web Vitals are unaffected.
    function ensureData() {
      if (data) return Promise.resolve(data);
      if (!loading) {
        loading = fetch(window.ZIPW_DATA_URL || '/assets/zip-zips.json').then(function (r) { return r.json(); }).then(function (d) { data = d; return d; })
          .catch(function (e) { loading = null; hint.textContent = 'Could not load ZIP lookup. Please try again.'; throw e; });
      }
      return loading;
    }

    function placeName(r) { return r.from ? r.from + ', ' + (r.fromState || r.state) : 'ZIP ' + r.zip; }

    function label(r) {
      if (r.kind === 'exact') return '<b>' + r.zip + '</b> ' + esc(r.from) + ', ' + r.state + '<small>Local page: ' + esc(r.city) + '</small>';
      return '<b>' + r.zip + '</b> ' + (r.from ? esc(r.from) + ', ' + r.fromState : '') + '<small>Free local audit</small>';
    }

    function showList() {
      list.hidden = rows.length === 0;
      input.setAttribute('aria-expanded', String(rows.length > 0));
      list.innerHTML = rows.map(function (r, i) {
        return '<li role="option" data-i="' + i + '" class="' + (i === active ? 'on' : '') + '">' + label(r) + '</li>';
      }).join('');
    }

    function dest(path2) { return '<p class="zipw-dest">Opens: ' + SITE + path2 + '</p>'; }

    // No local page for this ZIP: do not mention that. Offer the audit for their area and capture the lead right here.
    function leadForm(r) {
      var place = placeName(r);
      var subject = 'New ZIP-widget lead: ' + place + ' (' + r.zip + ') | Tricky Soft Tech';
      return '<p class="zipw-h">Free local visibility audit for ' + esc(place) + '</p>' +
        '<p class="zipw-p">Tell us where to send it. We will look at how your business shows up in Google Maps and AI answers ' + (r.from ? 'around ' + esc(r.from) : 'in your area') + '.</p>' +
        '<form class="zipw-lead" novalidate>' +
        '<input type="hidden" name="_subject" value="' + esc(subject) + '">' +
        '<input type="hidden" name="_captcha" value="false"><input type="hidden" name="_template" value="table">' +
        '<input type="hidden" name="_cc" value="info@trickysofttech.com">' +
        '<input type="hidden" name="ZIP Searched" value="' + r.zip + '">' +
        '<input type="hidden" name="Area" value="' + esc(place) + '">' +
        '<input type="hidden" name="ZIP Match Type" value="' + r.kind + '">' +
        '<input type="hidden" name="Source Page" value="' + esc(location.pathname) + '">' +
        '<input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;opacity:0;height:0">' +
        '<div class="zipw-lead-grid">' +
        '<input class="zipw-input zipw-sm" name="Full Name" type="text" autocomplete="name" placeholder="Your name" required>' +
        '<input class="zipw-input zipw-sm" name="Business Email" type="email" autocomplete="email" placeholder="you@company.com" required>' +
        '<input class="zipw-input zipw-sm" name="Phone" type="tel" autocomplete="tel" placeholder="Phone (optional)">' +
        '<input class="zipw-input zipw-sm" name="Business Website" type="text" autocomplete="url" placeholder="yoursite.com (optional)">' +
        '</div>' +
        '<p class="zipw-err" hidden></p>' +
        '<div class="zipw-acts"><button class="zipw-btn" type="submit">Send me my free audit</button></div>' +
        '</form>';
    }

    function showResult(r) {
      list.hidden = true;
      res.hidden = false;
      res.className = 'zipw-res ' + (r.kind === 'exact' ? 'ok' : 'lead');
      if (r.kind === 'exact') {
        var p = '/locations/' + r.slug;
        res.innerHTML = '<p class="zipw-h">' + r.zip + ' is ' + esc(r.from) + ', ' + r.state + '. We have a local page for you.</p>' + dest(p) +
          '<div class="zipw-acts"><a class="zipw-btn" data-go="exact" href="' + p + '">Go to ' + esc(r.city) + ' page</a></div>';
      } else {
        res.innerHTML = leadForm(r);
        res.querySelector('input[name="Full Name"]').focus({ preventScroll: true });
      }
      track('zip_result', { zip: r.zip, result: r.kind, city: r.city || '', miles: r.miles || 0, page: path, mode: ctx.mode, service: ctx.service || '', industry: ctx.industry || '' });
    }

    res.addEventListener('submit', function (e) {
      var f = e.target.closest('form.zipw-lead');
      if (!f) return;
      e.preventDefault();
      var err = f.querySelector('.zipw-err');
      var name = f.elements['Full Name'].value.trim();
      var mail = f.elements['Business Email'].value.trim();
      if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) { err.hidden = false; err.textContent = 'Please add your name and a valid email.'; return; }
      err.hidden = true;
      var btn = f.querySelector('button');
      btn.disabled = true; btn.textContent = 'Sending...';
      var fd = new FormData(f);
      var done = function () {
        res.className = 'zipw-res ok';
        res.innerHTML = '<p class="zipw-h">Thank you, ' + esc(name.split(' ')[0]) + '. Your audit request is in.</p>' +
          '<p class="zipw-p">We will review your area and email you at ' + esc(mail) + '.' + (DEBUG ? ' <i>(Preview mode: nothing was actually sent.)</i>' : '') + '</p>';
        track('zip_lead_submit', { zip: input.value, page: path, mode: ctx.mode, sent: !DEBUG });
      };
      if (DEBUG) { console.info('[zip-widget] DRY RUN lead payload', Array.from(fd.entries()).filter(function (kv) { return kv[0][0] !== '_'; })); return done(); }
      if (!LEAD_ENDPOINT) return Promise.reject(new Error('no endpoint')).catch(function () {
        btn.disabled = false; btn.textContent = 'Send me my free audit';
        err.hidden = false; err.innerHTML = 'Could not send. Please email <a href="mailto:info@trickysofttech.com">info@trickysofttech.com</a>.';
      });
      fetch(LEAD_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: fd })
        .then(function (r) { return r.json(); })
        .then(function (d) { if (d.success === 'true' || d.success === true) done(); else throw new Error('rejected'); })
        .catch(function () {
          btn.disabled = false; btn.textContent = 'Send me my free audit';
          err.hidden = false; err.innerHTML = 'Could not send. Please email <a href="mailto:info@trickysofttech.com">info@trickysofttech.com</a>.';
          track('zip_lead_error', { zip: input.value, page: path });
        });
    });

    function onInput() {
      var v = input.value.replace(/\D/g, '').slice(0, 5);
      input.value = v;
      res.hidden = true;
      hint.textContent = '';
      if (v.length && !started) { started = true; track('zip_widget_start', { page: path, mode: ctx.mode }); }
      active = -1;
      if (!data) { ensureData().then(onInput, function () {}); return; }
      if (v.length === 5) { var r = resolve(data, v); rows = [r]; active = 0; showList(); if (r.kind === 'none') showResult(r); return; }
      rows = v.length >= 3 ? Object.keys(data.zips).filter(function (z) { return z.indexOf(v) === 0; }).slice(0, 6).map(function (z) { return resolve(data, z); }) : [];
      showList();
    }

    function pick(r) {
      input.value = r.zip;
      if (r.kind === 'exact') {
        track('zip_go', { zip: r.zip, result: 'exact', to: '/locations/' + r.slug, page: path, mode: ctx.mode });
        location.href = '/locations/' + r.slug;
      } else showResult(r);
    }

    input.addEventListener('input', onInput);
    input.addEventListener('keydown', function (e) {
      if (!rows.length) return;
      if (e.key === 'ArrowDown') active = (active + 1) % rows.length;
      else if (e.key === 'ArrowUp') active = (active - 1 + rows.length) % rows.length;
      else if (e.key === 'Escape') { list.hidden = true; return; }
      else return;
      e.preventDefault();
      list.querySelectorAll('li').forEach(function (li, i) { li.classList.toggle('on', i === active); });
    });
    list.addEventListener('mousedown', function (e) {
      var li = e.target.closest('li');
      if (li) { e.preventDefault(); pick(rows[Number(li.dataset.i)]); }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value;
      if (v.length < 5) { hint.textContent = 'Enter all 5 digits of your ZIP code.'; return; }
      ensureData().then(function () { pick(active >= 0 && rows[active] ? rows[active] : resolve(data, v)); }, function () {});
    });
    input.addEventListener('focus', function () { ensureData().catch(function () {}); }, { once: true });
    res.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-go]');
      if (a) track('zip_go', { zip: input.value, result: a.dataset.go, to: a.getAttribute('href'), page: path, mode: ctx.mode });
    });
    document.addEventListener('click', function (e) { if (!host.contains(e.target)) list.hidden = true; });
  }

  function debugUi() {
    var box = document.createElement('div');
    box.id = 'zipw-logbox';
    box.innerHTML = '<b>PREVIEW</b> copy of <em>trickysofttech.com</em> + ZIP widget. Live site unchanged. <span id="zipw-tog">[events ▸]</span><pre id="zipw-log">none yet</pre>';
    box.addEventListener('click', function () { box.classList.toggle('open'); });
    document.body.appendChild(box);
  }

  function start() {
    var ctx = context();
    if (DEBUG) debugUi();
    if (!ctx) return;
    injectCss();
    var host = mount(ctx);
    if (host) init(host, ctx);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
