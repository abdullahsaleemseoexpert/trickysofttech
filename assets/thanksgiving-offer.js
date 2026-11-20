/* =============================================================================
   Tricky Soft Tech — Thanksgiving Day offer: top slider bar + offer popup
   -----------------------------------------------------------------------------
   Loaded on demand by assets/strategy-popup.js, which owns the offer settings
   (window.TST_OFFER) and only loads this file while the offer is running.
   To end the offer early or late: change `end` in assets/strategy-popup.js.
   - Slider bar: fixed strip above the nav, 3 rotating slides, pauses on hover/focus,
     can be closed for the session.
   - Popup: shown once per session ~6s in (and not again for 24h after it is
     closed), never over a form the visitor is typing in.
   - Its button opens the normal strategy-call form, pre-filled with the offer.
   No framework, no dependencies.
============================================================================= */
(function () {
  'use strict';
  var O = window.TST_OFFER;
  if (!O || window.__tstOfferInit) return;
  window.__tstOfferInit = true;
  var endMs = new Date(O.end).getTime();
  if (!(Date.now() < endMs)) return;

  var BAR_KEY = 'tst_offer_bar';          // sessionStorage: bar closed this session
  var POP_SESSION = 'tst_offer_pop';      // sessionStorage: popup already handled this session
  var POP_SNOOZE = 'tst_offer_pop_ts';    // localStorage: last time popup was closed
  var SNOOZE_MS = 24 * 60 * 60 * 1000;
  var POP_DELAY = 6000;
  var SLIDE_MS = 4800;

  function sget(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) {} }
  function lget(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lset(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }

  var path = (location.pathname || '').replace(/\/+$/, '').toLowerCase();
  var onContact = path === '/contact' || path === '/contact.html';
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches);

  // ---------------------------------------------------------------- styles
  function injectStyles() {
    if (document.getElementById('tst-of-style')) return;
    var css = [
      ':root{--tst-of-h:38px}',
      '@media (max-width:640px){:root{--tst-of-h:50px}}',

      /* slider bar */
      '#tst-of-bar{position:fixed;top:0;left:0;right:0;height:var(--tst-of-h);z-index:1100;display:flex;align-items:center;',
      'background:linear-gradient(90deg,#3F43D6 0%,#5B5FEF 45%,#A855F7 100%);color:#fff;font-family:Inter,system-ui,sans-serif;',
      'box-shadow:0 2px 14px rgba(40,40,120,0.28)}',
      '#tst-of-bar[hidden]{display:none}',
      '#tst-of-track{position:relative;flex:1;height:100%;overflow:hidden;margin:0 44px}',
      '.tst-of-slide{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:10px;width:100%;',
      'padding:0 6px;border:0;background:transparent;color:inherit;cursor:pointer;text-align:center;font:inherit;',
      'font-size:13.5px;font-weight:600;line-height:1.25;letter-spacing:0.005em;',
      'opacity:0;transform:translateY(100%);transition:opacity 420ms ease,transform 420ms cubic-bezier(0.16,1,0.3,1);pointer-events:none}',
      '.tst-of-slide.tst-of-on{opacity:1;transform:none;pointer-events:auto}',
      '.tst-of-slide.tst-of-out{opacity:0;transform:translateY(-100%)}',
      '.tst-of-slide:focus-visible{outline:2px solid #fff;outline-offset:-3px;border-radius:6px}',
      '.tst-of-tag{flex-shrink:0;font:700 10.5px/1 "JetBrains Mono",monospace;letter-spacing:0.08em;text-transform:uppercase;',
      'background:#fff;color:#4B3FD8;border-radius:999px;padding:5px 9px}',
      '.tst-of-txt b{font-weight:800}',
      '.tst-of-short{display:none}',
      '.tst-of-cta{flex-shrink:0;text-decoration:underline;text-underline-offset:3px;font-weight:700;white-space:nowrap}',
      '#tst-of-bar-close{position:absolute;top:50%;right:6px;transform:translateY(-50%);width:34px;height:34px;display:flex;',
      'align-items:center;justify-content:center;border:0;border-radius:8px;background:transparent;color:#fff;cursor:pointer;opacity:0.85}',
      '#tst-of-bar-close:hover{opacity:1;background:rgba(255,255,255,0.16)}',
      '#tst-of-bar-close:focus-visible{outline:2px solid #fff;outline-offset:-2px}',
      '@media (max-width:640px){#tst-of-track{margin:0 40px 0 8px}.tst-of-slide{font-size:12px;gap:8px;padding:0 2px}',
      '.tst-of-tag,.tst-of-cta,.tst-of-full{display:none}.tst-of-short{display:inline}',
      '.tst-of-txt{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}}',

      /* push the page and the fixed nav down by the bar height */
      'body.tst-of-on{padding-top:var(--tst-of-h)}',
      'body.tst-of-on #main-nav{top:var(--tst-of-h)!important}',
      'body.tst-of-on #scroll-progress{top:var(--tst-of-h)!important}',
      'body.tst-of-on #mobile-menu{top:var(--tst-of-h)!important}',
      '@media print{#tst-of-bar,#tst-of-overlay{display:none!important}body.tst-of-on{padding-top:0}}',

      /* popup */
      '#tst-of-overlay{position:fixed;inset:0;z-index:100001;display:flex;align-items:center;justify-content:center;padding:24px 16px;',
      'background:rgba(10,11,18,0.55);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);opacity:0;',
      'transition:opacity 260ms cubic-bezier(0.4,0,0.2,1)}',
      '#tst-of-overlay.tst-of-open{opacity:1}',
      '#tst-of-overlay[hidden]{display:none}',
      '#tst-of-overlay:not(.tst-of-open){pointer-events:none}',
      '#tst-of-dialog{position:relative;width:100%;max-width:470px;max-height:calc(100dvh - 48px);overflow-y:auto;-webkit-overflow-scrolling:touch;',
      'background:var(--ink-void,#fff);color:var(--text-primary,#14141F);border:1px solid var(--border-default,rgba(15,15,35,0.10));',
      'border-radius:20px;box-shadow:0 32px 80px rgba(15,15,35,0.32),0 8px 24px rgba(15,15,35,0.16);',
      'transform:translateY(14px) scale(0.98);transition:transform 280ms cubic-bezier(0.16,1,0.3,1)}',
      '#tst-of-overlay.tst-of-open #tst-of-dialog{transform:none}',
      ':root[data-theme="dark"] #tst-of-dialog{background:var(--ink-raised,#151827)}',
      '#tst-of-head{background:linear-gradient(135deg,#3F43D6 0%,#5B5FEF 50%,#A855F7 100%);color:#fff;padding:26px 26px 22px;border-radius:19px 19px 0 0;position:relative}',
      '#tst-of-close{position:absolute;top:10px;right:10px;width:36px;height:36px;border:0;border-radius:10px;background:rgba(255,255,255,0.14);color:#fff;',
      'display:flex;align-items:center;justify-content:center;cursor:pointer}',
      '#tst-of-close:hover{background:rgba(255,255,255,0.26)}',
      '#tst-of-close:focus-visible{outline:2px solid #fff;outline-offset:2px}',
      '.tst-of-eyebrow{display:inline-block;max-width:calc(100% - 46px);font:700 11px/1.35 "JetBrains Mono",monospace;letter-spacing:0.07em;text-transform:uppercase;',
      'background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.32);border-radius:14px;padding:6px 11px;margin-bottom:14px}',
      '#tst-of-title{font-family:Sora,sans-serif;font-weight:800;font-size:25px;line-height:1.18;letter-spacing:-0.02em;margin:0 0 6px;padding-right:30px}',
      '#tst-of-sub{font-size:14px;line-height:1.55;margin:0;color:rgba(255,255,255,0.9)}',
      '#tst-of-body{padding:22px 26px 24px}',
      '.tst-of-price{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap;margin:0 0 4px}',
      '.tst-of-now{font-family:Sora,sans-serif;font-weight:800;font-size:46px;line-height:1;letter-spacing:-0.03em;color:var(--text-primary,#14141F)}',
      '.tst-of-was{font-size:20px;font-weight:600;color:var(--text-muted,#6B6F8C);text-decoration:line-through;padding-bottom:6px}',
      '.tst-of-note{font-size:13px;color:var(--text-secondary,#55597A);margin:0 0 16px}',
      '.tst-of-stack{list-style:none;margin:0 0 18px;padding:0;border:1px solid var(--border-default,rgba(15,15,35,0.10));border-radius:14px;overflow:hidden}',
      '.tst-of-stack li{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;font-size:14px;color:var(--text-primary,#14141F)}',
      '.tst-of-stack li+li{border-top:1px solid var(--border-default,rgba(15,15,35,0.10))}',
      '.tst-of-stack .tst-of-free{font:700 11px/1 "JetBrains Mono",monospace;letter-spacing:0.06em;text-transform:uppercase;color:#0B7A45;',
      'background:rgba(22,163,74,0.12);border:1px solid rgba(22,163,74,0.35);border-radius:999px;padding:5px 9px;white-space:nowrap}',
      '.tst-of-stack .tst-of-val{font-size:13px;color:var(--text-muted,#6B6F8C);white-space:nowrap}',
      '.tst-of-stack li.tst-of-total{background:rgba(91,95,239,0.07);font-weight:700}',
      '#tst-of-cta{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;border:1px solid rgba(255,255,255,0.15);cursor:pointer;',
      'background:var(--grad-brand,linear-gradient(135deg,#5B5FEF,#7B6FF0 50%,#A855F7));color:#fff;font:600 15px Inter,sans-serif;',
      'padding:15px 22px;border-radius:12px;min-height:48px;transition:transform 200ms,box-shadow 200ms}',
      '#tst-of-cta:hover{transform:translateY(-1px);box-shadow:0 8px 26px rgba(91,95,239,0.38)}',
      '#tst-of-cta:focus-visible{outline:none;box-shadow:0 0 0 2px var(--ink-void,#fff),0 0 0 4px var(--spectrum-core,#5B5FEF)}',
      '#tst-of-later{display:block;margin:12px auto 0;background:none;border:0;color:var(--text-muted,#6B6F8C);font:500 13px Inter,sans-serif;',
      'cursor:pointer;padding:8px 12px;text-decoration:underline;text-underline-offset:3px;min-height:36px}',
      '#tst-of-later:hover{color:var(--text-primary,#14141F)}',
      '.tst-of-fine{font-size:11.5px;color:var(--text-muted,#6B6F8C);text-align:center;margin:10px 0 0}',
      '@media (max-width:420px){#tst-of-head{padding:22px 18px 18px}#tst-of-body{padding:18px 18px 20px}#tst-of-title{font-size:21px}.tst-of-now{font-size:40px}}',
      '@media (prefers-reduced-motion:reduce){.tst-of-slide,#tst-of-overlay,#tst-of-dialog,#tst-of-cta{transition:none}}'
    ].join('');
    var st = document.createElement('style');
    st.id = 'tst-of-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  // ------------------------------------------------------------ slider bar
  var slides = [], idx = 0, timer = null, paused = false, bar;
  function buildBar() {
    if (sget(BAR_KEY) || document.getElementById('tst-of-bar')) return;
    injectStyles();
    var data = [
      { tag: 'Thanksgiving Offer', full: 'Google Business Profile Optimization from <b>$149</b> (regular $349)', short: 'GBP Optimization from <b>$149</b> (was $349)', cta: 'Claim offer' },
      { tag: 'Free Bonus', full: '<b>AI Optimization Service FREE</b>: a $600 value for just <b>$149</b>', short: '<b>FREE AI Optimization</b> included: $600 value for <b>$149</b>', cta: 'See what you get' },
      { tag: 'Limited Time', full: 'This offer ends <b>' + O.endLabel + '</b>. Claim yours today', short: 'Offer ends <b>' + O.endLabel + '</b>. Claim yours', cta: 'Claim offer' }
    ];
    bar = document.createElement('div');
    bar.id = 'tst-of-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Thanksgiving Day offer');
    var track = document.createElement('div');
    track.id = 'tst-of-track';
    data.forEach(function (d, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tst-of-slide' + (i === 0 ? ' tst-of-on' : '');
      b.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
      b.tabIndex = i === 0 ? 0 : -1;
      b.setAttribute('data-track', 'offer-bar-slide-' + (i + 1));
      b.innerHTML = '<span class="tst-of-tag">' + d.tag + '</span>' +
        '<span class="tst-of-txt"><span class="tst-of-full">' + d.full + '</span><span class="tst-of-short">' + d.short + '</span></span>' +
        '<span class="tst-of-cta">' + d.cta + ' &rarr;</span>';
      b.addEventListener('click', function () { openPopup(true); });
      track.appendChild(b);
      slides.push(b);
    });
    var x = document.createElement('button');
    x.type = 'button';
    x.id = 'tst-of-bar-close';
    x.setAttribute('aria-label', 'Close offer banner');
    x.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    x.addEventListener('click', closeBar);
    bar.appendChild(track);
    bar.appendChild(x);
    document.body.insertBefore(bar, document.body.firstChild);
    document.body.classList.add('tst-of-on');
    bar.addEventListener('mouseenter', function () { paused = true; });
    bar.addEventListener('mouseleave', function () { paused = false; });
    bar.addEventListener('focusin', function () { paused = true; });
    bar.addEventListener('focusout', function () { paused = false; });
    timer = setInterval(function () { if (!paused && !document.hidden) show((idx + 1) % slides.length); }, SLIDE_MS);
  }
  function show(n) {
    if (n === idx) return;
    var prev = slides[idx], next = slides[n];
    prev.classList.remove('tst-of-on'); prev.classList.add('tst-of-out');
    prev.setAttribute('aria-hidden', 'true'); prev.tabIndex = -1;
    // new slide enters from below: reset it without a transition first
    next.classList.remove('tst-of-out');
    next.classList.add('tst-of-on');
    next.setAttribute('aria-hidden', 'false'); next.tabIndex = 0;
    idx = n;
    setTimeout(function () { prev.classList.remove('tst-of-out'); }, 450);
  }
  function closeBar() {
    sset(BAR_KEY, '1');
    clearInterval(timer);
    if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
    document.body.classList.remove('tst-of-on');
  }

  // ----------------------------------------------------------------- popup
  var overlay, dialog, lastFocused, keyHandler, prevOverflow = '';
  function buildPopup() {
    if (overlay) return;
    injectStyles();
    overlay = document.createElement('div');
    overlay.id = 'tst-of-overlay';
    overlay.setAttribute('hidden', '');
    dialog = document.createElement('div');
    dialog.id = 'tst-of-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'tst-of-title');
    dialog.setAttribute('aria-describedby', 'tst-of-sub');
    dialog.setAttribute('tabindex', '-1');
    dialog.innerHTML = [
      '<div id="tst-of-head">',
        '<button type="button" id="tst-of-close" aria-label="Close offer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>',
        '<span class="tst-of-eyebrow">Thanksgiving Day Offer &middot; Limited Time</span>',
        '<h2 id="tst-of-title">Google Business Profile Optimization from $149</h2>',
        '<p id="tst-of-sub">Get our Google Business Profile Optimization and a free AI Optimization Service together, for one low price.</p>',
      '</div>',
      '<div id="tst-of-body">',
        '<div class="tst-of-price"><span class="tst-of-now">$149</span><span class="tst-of-was" aria-label="Regular price $349"><span aria-hidden="true">$349</span></span></div>',
        '<p class="tst-of-note">Regular price $349 for Google Business Profile Optimization.</p>',
        '<ul class="tst-of-stack">',
          '<li><span>Google Business Profile Optimization</span><span class="tst-of-val">$349 value</span></li>',
          '<li><span>AI Optimization Service</span><span class="tst-of-free">Free</span></li>',
          '<li class="tst-of-total"><span>Total value $600</span><span>You pay $149</span></li>',
        '</ul>',
        '<button type="button" id="tst-of-cta">Claim this offer <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>',
        '<button type="button" id="tst-of-later">Maybe later</button>',
        '<p class="tst-of-fine">Limited-time offer. Ends ' + O.endLabel + ', ' + O.endYear + '.</p>',
      '</div>'
    ].join('');
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    dialog.querySelector('#tst-of-close').addEventListener('click', function () { closePopup(); });
    dialog.querySelector('#tst-of-later').addEventListener('click', function () { closePopup(); });
    dialog.querySelector('#tst-of-cta').addEventListener('click', function () {
      closePopup(true);
      if (typeof window.tstOpenStrategy === 'function') {
        window.tstOpenStrategy({
          subject: 'Thanksgiving Offer: GBP Optimization $149 + free AI Optimization | Tricky Soft Tech',
          message: 'I would like to claim the Thanksgiving offer: Google Business Profile Optimization for $149 with the AI Optimization Service included free.'
        });
      } else {
        location.href = (O.contactHref || '/contact');
      }
    });
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) closePopup(); });
  }
  function focusables() {
    return Array.prototype.slice.call(dialog.querySelectorAll('button:not([disabled]),a[href]')).filter(function (el) { return el.offsetParent !== null; });
  }
  function openPopup(manual) {
    if (window.__tstSPOpen || window.__tstOfferOpen) return;
    buildPopup();
    lastFocused = document.activeElement;
    window.__tstOfferOpen = true;
    document.body.classList.add('tst-sp-active');
    overlay.removeAttribute('hidden');
    prevOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
    void overlay.offsetWidth;
    overlay.classList.add('tst-of-open');
    keyHandler = function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closePopup(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keyHandler, true);
    dialog.focus();
    sset(POP_SESSION, '1');
  }
  function closePopup(toForm) {
    if (!overlay || overlay.hasAttribute('hidden')) return;
    overlay.classList.remove('tst-of-open');
    document.removeEventListener('keydown', keyHandler, true);
    document.body.style.overflow = prevOverflow;
    window.__tstOfferOpen = false;
    document.body.classList.remove('tst-sp-active');
    lset(POP_SNOOZE, String(Date.now()));
    var finish = function () {
      overlay.setAttribute('hidden', '');
      if (toForm === true) return;   // the form modal is taking focus
      var target = (lastFocused && document.contains(lastFocused) && lastFocused.offsetParent !== null) ? lastFocused : document.body;
      try { target.focus(); } catch (e) {}
    };
    if (reduced) finish(); else setTimeout(finish, 260);
  }

  function formBusy() {
    try {
      var TEXTY = 'input:not([type]),input[type=text],input[type=email],input[type=tel],input[type=url],input[type=number],input[type=search],textarea';
      var a = document.activeElement;
      if (a && a.matches && a.matches(TEXTY + ',select')) return true;
      var els = document.querySelectorAll(TEXTY);
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el.name === '_honey' || el.tabIndex === -1) continue;
        if (el.value && el.value.trim()) return true;
      }
    } catch (e) {}
    return false;
  }
  function armPopup(delay) {
    if (onContact || sget(POP_SESSION)) return;
    var last = parseInt(lget(POP_SNOOZE) || '0', 10);
    if (last && Date.now() - last < SNOOZE_MS) return;
    setTimeout(function () {
      if (sget(POP_SESSION) || window.__tstOfferOpen) return;
      if (window.__tstSPOpen || window.__tstChatOpen || formBusy()) { armPopup(8000); return; }
      try { openPopup(false); } catch (e) {}
    }, delay);
  }

  function start() {
    buildBar();
    armPopup(POP_DELAY);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
