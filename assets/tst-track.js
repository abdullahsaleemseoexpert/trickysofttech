/* Tricky Soft Tech: shared analytics events.
 * Sends GA4 events through the Google tag already loaded by Google Tag Manager (GTM-NRK3M5DM).
 * No personal data is ever sent: no names, emails, phone numbers or message text. Only event names,
 * the page section, button labels and the source of a lead.
 */
(function () {
  'use strict';
  if (window.__tstTrack) return;
  window.__tstTrack = true;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }

  function send(name, params) {
    try { window.gtag('event', name, params || {}); } catch (e) { /* analytics must never break the page */ }
  }
  window.tstTrack = send;

  var PATH = location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  var SEG = PATH.split('/').filter(Boolean);
  var SECTION = SEG[0] || 'home';
  var TOOL = (SEG[0] === 'tools' && SEG[1]) ? SEG[1] : '';

  function ssGet(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  function clean(s, n) { return String(s || '').replace(/\s+/g, ' ').trim().slice(0, n || 50); }

  /* ---------------------------------------------------------------- leads */
  // Every lead form on the site posts to FormSubmit. Watch those requests and report a
  // generate_lead event only when the server confirms the submission worked.
  function leadSource(subject) {
    var s = String(subject || '').toLowerCase();
    if (s.indexOf('site popup') > -1) return 'strategy_popup';
    if (s.indexOf('offer') > -1) return 'offer_popup';
    if (s.indexOf('chat lead') > -1) return 'chat';
    if (s.indexOf('zip-widget') > -1) return 'zip_widget';
    if (s.indexOf('strategy call request') > -1) return 'contact_page';
    if (TOOL === 'local-seo-audit') return 'audit_tool';
    return 'other';
  }
  function leadSent(subject) {
    var src = leadSource(subject);
    var p = { lead_source: src, page_section: SECTION };
    if (src === 'chat') {
      var m = /chat lead\s*-\s*(.+)$/i.exec(String(subject || ''));
      if (m) p.chat_topic = clean(m[1], 40);
    }
    send('generate_lead', p);
  }

  var realFetch = window.fetch;
  if (typeof realFetch === 'function') {
    window.fetch = function (input, init) {
      var p = realFetch.apply(this, arguments);
      try {
        var url = typeof input === 'string' ? input : ((input && input.url) || '');
        var method = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
        if (method === 'POST' && url.indexOf('formsubmit.co/ajax') > -1) {
          var subject = '';
          try {
            var body = init && init.body;
            if (body && typeof body.get === 'function') subject = body.get('_subject') || '';
          } catch (e) { /* ignore */ }
          p.then(function (res) {
            try {
              res.clone().json().then(function (d) {
                if (d && (d.success === true || d.success === 'true')) leadSent(subject);
              }).catch(function () { /* not JSON: not a confirmed lead */ });
            } catch (e) { /* ignore */ }
          }, function () { /* the page handles its own errors */ });
        }
      } catch (e) { /* never interfere with the page's own request */ }
      return p;
    };
  }

  /* --------------------------------------------------------------- clicks */
  var lastTrigger = null;
  var toolStarted = false;
  var toolActions = 0;

  function where(el) {
    if (el.closest('#tst-of-overlay,#tst-sp-overlay,#tst-chat-panel')) return 'popup';
    if (el.closest('header,nav,#main-nav,#mobile-menu')) return 'nav';
    if (el.closest('footer')) return 'footer';
    return 'content';
  }

  function onLink(a) {
    var href = a.getAttribute('href') || '';
    var loc = where(a);
    var text = clean(a.textContent, 50);
    if (/^mailto:/i.test(href)) { send('click_email', { link_location: loc, link_text: text }); return; }
    if (/^tel:/i.test(href)) { send('click_phone', { link_location: loc, link_text: text }); return; }
    var u;
    try { u = new URL(a.href, location.href); } catch (e) { return; }
    if (u.hostname.replace(/^www\./, '') !== location.hostname.replace(/^www\./, '')) return;   // outbound clicks are reported by GA itself
    var p = u.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
    if (/^\/contact\/?$/.test(p)) {
      send('cta_click', { cta_text: text, cta_destination: 'contact', link_location: loc });
      return;
    }
    var m = /^\/(services|tools|industries|case-study|locations|blog)\/([^\/]+)/.exec(p);
    if (m && p !== PATH) send('select_content', { content_type: m[1], item_id: m[2], link_location: loc });
  }

  function onButton(btn) {
    if (!TOOL || toolActions >= 30 || !btn.closest('main')) return;
    var label = clean(btn.getAttribute('aria-label') || btn.textContent, 60).replace(/\([^)]*\)|\d+/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    if (!label || label.length > 40) return;
    toolActions++;
    send('tool_action', { tool_name: TOOL, action_label: label });
  }

  function markToolStart(el) {
    if (!TOOL || toolStarted || !el || !el.closest || !el.closest('main')) return;
    toolStarted = true;
    send('tool_start', { tool_name: TOOL });
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    try {
      // offer slider bar and offer popup (promotion events)
      var slide = t.closest('.tst-of-slide');
      if (slide) send('select_promotion', { promotion_name: promoName(), creative_name: 'slider_bar', creative_slot: clean(slide.getAttribute('data-track'), 40) });
      if (t.closest('#tst-of-cta')) send('select_promotion', { promotion_name: promoName(), creative_name: 'popup_cta' });
      if (t.closest('#tst-of-bar-close')) send('offer_dismiss', { promotion_name: promoName(), creative_name: 'slider_bar' });
      if (t.closest('#tst-of-close')) send('offer_dismiss', { promotion_name: promoName(), creative_name: 'popup_close' });
      if (t.closest('#tst-of-later')) send('offer_dismiss', { promotion_name: promoName(), creative_name: 'popup_later' });
      if (t.closest('#tst-sp-tab')) lastTrigger = 'side_tab';

      var a = t.closest('a[href]');
      if (a) onLink(a);
      var btn = t.closest('button,[role=button],input[type=button],input[type=submit]');
      if (btn) onButton(btn);
      markToolStart(t);
    } catch (err) { /* ignore */ }
  }, true);

  ['input', 'change'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { try { markToolStart(e.target); } catch (err) { /* ignore */ } }, true);
  });

  /* ---------------------------------------- popups, chat and the offer bar */
  function promoName() {
    var b = document.getElementById('tst-of-bar');
    return clean((b && b.getAttribute('aria-label')) || 'Site offer', 60);
  }

  var barSeen = false;
  function checkBar() {
    if (barSeen || !document.getElementById('tst-of-bar')) return;
    barSeen = true;
    if (ssGet('tst_trk_barview')) return;               // one impression per session, not per page
    ssSet('tst_trk_barview', '1');
    send('view_promotion', { promotion_name: promoName(), creative_name: 'slider_bar' });
  }

  var prev = { sp: false, chat: false };
  function watchBody() {
    var cl = document.body.classList;
    var sp = cl.contains('tst-sp-active'), chat = cl.contains('tst-chat-active');
    if (sp && !prev.sp) {
      if (window.__tstOfferOpen) send('view_promotion', { promotion_name: promoName(), creative_name: 'popup' });
      else send('strategy_popup_open', { trigger: lastTrigger || 'timer' });
      lastTrigger = null;
    }
    if (chat && !prev.chat) send('chat_open', {});
    prev.sp = sp; prev.chat = chat;
    checkBar();
  }

  /* ---------------------------------------------------- scroll and engagement */
  var hit = {};
  var raf = 0;
  function scrollCheck() {
    raf = 0;
    var d = document.documentElement;
    var room = Math.max(d.scrollHeight, document.body.scrollHeight) - window.innerHeight;
    if (room < 200) return;
    var pct = Math.min(100, ((window.pageYOffset || d.scrollTop || 0) / room) * 100);
    [25, 50, 75, 100].forEach(function (m) {
      if (pct >= m - 0.5 && !hit[m]) { hit[m] = 1; send('scroll_depth', { percent: m, page_section: SECTION }); }
    });
  }
  function start() {
    try {
      new MutationObserver(watchBody).observe(document.body, { attributes: true, attributeFilter: ['class'], childList: true });
      watchBody();
    } catch (e) { /* ignore */ }

    window.addEventListener('scroll', function () { if (!raf) raf = window.setTimeout(scrollCheck, 150); }, { passive: true });

    // an engaged visit: a minute of visible time and at least halfway down the page
    var seconds = 0, engaged = false;
    var iv = setInterval(function () {
      if (document.hidden) return;
      seconds++;
      if (!engaged && seconds >= 60 && hit[50]) {
        engaged = true;
        clearInterval(iv);
        send('engaged_visit', { page_section: SECTION });
      }
      if (seconds > 600) clearInterval(iv);
    }, 1000);

    if (/^page not found/i.test(document.title)) {
      var ref = '';
      try { ref = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) { /* ignore */ }
      send('page_not_found', { referrer_host: ref });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}());
