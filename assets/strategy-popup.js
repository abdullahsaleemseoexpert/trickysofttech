/* =============================================================================
   Tricky Soft Tech — "Book a Strategy Call" session popup
   -----------------------------------------------------------------------------
   One shared file, referenced sitewide (assets/strategy-popup.js). It injects a
   single accessible modal ~10s into the visit, then re-shows it 15s after each
   dismissal until the visitor submits (or the tab session ends).
   Reuses the existing FormSubmit.co lead mechanism used by contact.html — this
   is NOT a second lead system.
   No framework, no dependencies. Design tokens come from the page's own :root.
============================================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'tst_spopup';      // sessionStorage; only ever set to 'submitted' (hard stop)
  var DELAY_MS = 10000;                // first show ~10s into the visit
  var REPEAT_MS = 15000;               // then re-show 15s after each dismissal, until submitted
  var ENDPOINT = 'https://formsubmit.co/ajax/abdullahsaleem12570@gmail.com';

  // --- guard: run once, browser only ---------------------------------------
  if (window.__tstSPopupInit) return;
  window.__tstSPopupInit = true;

  function ss(method, val) {
    try {
      if (method === 'get') return window.sessionStorage.getItem(STORAGE_KEY);
      if (method === 'set') window.sessionStorage.setItem(STORAGE_KEY, val);
    } catch (e) { /* private mode / disabled storage — fail open (still show once, no persistence) */ }
    return null;
  }

  // Once the visitor has submitted, never show it again this session.
  if (ss('get') === 'submitted') return;

  // Don't show on the dedicated booking page itself.
  var path = (location.pathname || '').replace(/\/+$/, '').toLowerCase();
  if (path === '/contact' || path === '/contact.html') return;

  // Resolve the assets directory from this script's own URL so the logo path
  // works at any directory depth (root, /services/, /blog/, …).
  var selfScript = document.currentScript || document.querySelector('script[data-tst-spopup]');
  var ASSETS = selfScript ? selfScript.src.replace(/[^/]+$/, '') : '/assets/';

  var overlay, dialog, form, closeBtn, firstField, lastFocused, keydownHandler;

  // --- styles --------------------------------------------------------------
  function injectStyles() {
    if (document.getElementById('tst-sp-style')) return;
    var css = [
      '#tst-sp-overlay{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:24px 16px;',
      'background:rgba(10,11,18,0.48);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);',
      'opacity:0;transition:opacity 240ms var(--ease-silk,cubic-bezier(0.4,0,0.2,1))}',
      '#tst-sp-overlay.tst-sp-open{opacity:1}',
      '#tst-sp-overlay[hidden]{display:none}',
      '#tst-sp-overlay:not(.tst-sp-open){pointer-events:none}',

      '#tst-sp-dialog{position:relative;width:100%;max-width:460px;max-height:calc(100dvh - 48px);overflow-y:auto;',
      '-webkit-overflow-scrolling:touch;background:var(--ink-void,#fff);color:var(--text-primary,#14141F);',
      'border:1px solid var(--border-default,rgba(15,15,35,0.10));border-radius:18px;',
      'box-shadow:0 32px 80px rgba(15,15,35,0.28),0 8px 24px rgba(15,15,35,0.14);',
      'padding:26px 26px 24px;transform:translateY(14px) scale(0.98);',
      'transition:transform 260ms var(--ease-premium,cubic-bezier(0.16,1,0.3,1))}',
      '#tst-sp-overlay.tst-sp-open #tst-sp-dialog{transform:none}',
      ':root[data-theme="dark"] #tst-sp-dialog{background:var(--ink-raised,#151827)}',

      '#tst-sp-close{position:absolute;top:12px;right:12px;width:34px;height:34px;border-radius:9px;',
      'display:flex;align-items:center;justify-content:center;cursor:pointer;background:transparent;',
      'border:1px solid transparent;color:var(--text-muted,#6B6F8C);transition:background 150ms,border-color 150ms,color 150ms}',
      '#tst-sp-close:hover{background:rgba(15,15,35,0.05);border-color:var(--border-default,rgba(15,15,35,0.10));color:var(--text-primary,#14141F)}',
      ':root[data-theme="dark"] #tst-sp-close:hover{background:rgba(255,255,255,0.06)}',
      '#tst-sp-close:focus-visible{outline:2px solid var(--spectrum-core,#5B5FEF);outline-offset:2px}',

      '.tst-sp-logo{position:relative;display:inline-block;height:34px;line-height:0;margin-bottom:14px}',
      '.tst-sp-logo img{height:100%;width:auto;display:block}',
      '.tst-sp-logo .tst-sp-logo-dark{position:absolute;top:0;left:0;opacity:0}',
      ':root[data-theme="dark"] .tst-sp-logo .tst-sp-logo-light{opacity:0}',
      ':root[data-theme="dark"] .tst-sp-logo .tst-sp-logo-dark{opacity:1}',

      '#tst-sp-title{font-family:\'Sora\',sans-serif;font-weight:700;font-size:22px;line-height:1.2;',
      'letter-spacing:-0.02em;color:var(--text-primary,#14141F);margin:0 0 8px}',
      '#tst-sp-desc{font-size:14px;line-height:1.6;color:var(--text-secondary,#55597A);margin:0 0 20px}',

      '#tst-sp-form{display:flex;flex-direction:column;gap:14px}',
      '.tst-sp-row{display:flex;flex-direction:column;gap:6px}',
      '.tst-sp-label{font-family:\'JetBrains Mono\',monospace;font-size:11px;font-weight:600;letter-spacing:0.05em;',
      'text-transform:uppercase;color:var(--text-muted,#6B6F8C)}',
      '.tst-sp-input{width:100%;background:rgba(15,15,35,0.04);border:1px solid var(--border-default,rgba(15,15,35,0.10));',
      'border-radius:10px;padding:12px 14px;font-size:14px;font-family:\'Inter\',sans-serif;',
      'color:var(--text-primary,#14141F);outline:none;transition:border-color 0.2s,background 0.2s}',
      ':root[data-theme="dark"] .tst-sp-input{background:rgba(255,255,255,0.05)}',
      '.tst-sp-input::placeholder{color:var(--text-muted,#6B6F8C)}',
      '.tst-sp-input:focus{border-color:var(--border-accent-strong,rgba(91,95,239,0.45));background:rgba(91,95,239,0.06)}',
      'textarea.tst-sp-input{resize:vertical;min-height:74px;line-height:1.6}',
      'select.tst-sp-input{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%236B6F8C\' stroke-width=\'1.6\' fill=\'none\' stroke-linecap=\'round\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px}',
      ':root[data-theme="dark"] select.tst-sp-input option{background:var(--ink-raised,#151827);color:var(--text-primary,#F4F5FA)}',

      '.tst-sp-2col{display:grid;grid-template-columns:1fr 1fr;gap:14px}',
      '@media (max-width:400px){.tst-sp-2col{grid-template-columns:1fr}}',

      '#tst-sp-submit{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;',
      'margin-top:4px;background:var(--grad-brand,linear-gradient(135deg,#5B5FEF,#7B6FF0 50%,#A855F7));',
      'color:#fff;font-family:\'Inter\',sans-serif;font-size:14px;font-weight:600;letter-spacing:0.01em;',
      'padding:13px 22px;border-radius:11px;border:1px solid rgba(255,255,255,0.15);cursor:pointer;',
      'transition:transform 200ms var(--ease-premium,cubic-bezier(0.16,1,0.3,1)),box-shadow 200ms,opacity 200ms}',
      '#tst-sp-submit:hover{transform:translateY(-1px);box-shadow:0 8px 26px rgba(91,95,239,0.34)}',
      '#tst-sp-submit:disabled{cursor:default;transform:none;box-shadow:none}',
      '#tst-sp-submit:focus-visible{outline:none;box-shadow:0 0 0 2px var(--ink-void,#fff),0 0 0 4px var(--spectrum-core,#5B5FEF)}',

      '.tst-sp-fine{font-size:11.5px;color:var(--text-muted,#6B6F8C);text-align:center;margin:2px 0 0}',
      '#tst-sp-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}',

      '#tst-sp-success{display:none;text-align:center;padding:14px 4px 6px}',
      '#tst-sp-success .tst-sp-check{width:52px;height:52px;border-radius:50%;margin:0 auto 14px;display:flex;',
      'align-items:center;justify-content:center;background:linear-gradient(135deg,#4ADE80,#16A34A);color:#fff}',
      '#tst-sp-success h3{font-family:\'Sora\',sans-serif;font-size:18px;font-weight:700;margin:0 0 6px;color:var(--text-primary,#14141F)}',
      '#tst-sp-success p{font-size:13.5px;line-height:1.6;color:var(--text-secondary,#55597A);margin:0 0 18px}',
      '#tst-sp-success button{background:transparent;border:1px solid var(--border-default,rgba(15,15,35,0.10));',
      'color:var(--text-primary,#14141F);font-family:\'Inter\',sans-serif;font-size:13px;font-weight:600;',
      'padding:10px 22px;border-radius:10px;cursor:pointer}',
      '#tst-sp-error{display:none;font-size:12.5px;color:#ef4444;margin-top:2px}',

      '@media (prefers-reduced-motion:reduce){#tst-sp-overlay,#tst-sp-dialog,#tst-sp-submit{transition:none}',
      '#tst-sp-dialog{transform:none}}'
    ].join('');
    var style = document.createElement('style');
    style.id = 'tst-sp-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // --- markup --------------------------------------------------------------
  function buildModal() {
    injectStyles();

    overlay = document.createElement('div');
    overlay.id = 'tst-sp-overlay';
    overlay.setAttribute('hidden', '');

    dialog = document.createElement('div');
    dialog.id = 'tst-sp-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'tst-sp-title');
    dialog.setAttribute('aria-describedby', 'tst-sp-desc');
    dialog.setAttribute('tabindex', '-1');

    dialog.innerHTML = [
      '<button type="button" id="tst-sp-close" aria-label="Close dialog">',
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      '</button>',

      '<span class="tst-sp-logo">',
        '<img class="tst-sp-logo-light" src="' + ASSETS + 'logo-on-light-web.png" alt="Tricky Soft Tech">',
        '<img class="tst-sp-logo-dark" src="' + ASSETS + 'logo-on-dark-web.png" alt="" aria-hidden="true">',
      '</span>',

      '<h2 id="tst-sp-title">Book a Strategy Call</h2>',
      '<p id="tst-sp-desc">A 20-minute call on your local search, Google Business Profile, and where booked jobs are leaking. No pitch &mdash; you leave with a clear next step.</p>',

      '<form id="tst-sp-form" novalidate>',
        '<input type="hidden" name="_subject" value="New Strategy Call Request (site popup) | Tricky Soft Tech">',
        '<input type="hidden" name="_captcha" value="false">',
        '<input type="hidden" name="_template" value="table">',
        '<input type="hidden" name="_cc" value="info@trickysofttech.com">',
        '<input type="hidden" name="Source Page" id="tst-sp-source">',
        '<input type="text" name="_honey" id="tst-sp-hp" tabindex="-1" autocomplete="off" aria-hidden="true">',

        '<div class="tst-sp-row">',
          '<label class="tst-sp-label" for="tst-sp-name">Full Name</label>',
          '<input class="tst-sp-input" id="tst-sp-name" name="Full Name" type="text" autocomplete="name" placeholder="Your full name" required>',
        '</div>',

        '<div class="tst-sp-2col">',
          '<div class="tst-sp-row">',
            '<label class="tst-sp-label" for="tst-sp-email">Business Email</label>',
            '<input class="tst-sp-input" id="tst-sp-email" name="Business Email" type="email" autocomplete="email" placeholder="you@company.com" required>',
          '</div>',
          '<div class="tst-sp-row">',
            '<label class="tst-sp-label" for="tst-sp-phone">Phone</label>',
            '<input class="tst-sp-input" id="tst-sp-phone" name="Phone" type="tel" autocomplete="tel" placeholder="(555) 123-4567" required>',
          '</div>',
        '</div>',

        '<div class="tst-sp-row">',
          '<label class="tst-sp-label" for="tst-sp-site">Business Website</label>',
          '<input class="tst-sp-input" id="tst-sp-site" name="Business Website" type="text" autocomplete="url" placeholder="yoursite.com">',
        '</div>',

        '<div class="tst-sp-row">',
          '<label class="tst-sp-label" for="tst-sp-help">What do you need help with?</label>',
          '<textarea class="tst-sp-input" id="tst-sp-help" name="What do you need help with" placeholder="Rankings, Google Business Profile, reviews, calls that aren\'t converting&hellip;"></textarea>',
        '</div>',

        '<div class="tst-sp-row">',
          '<label class="tst-sp-label" for="tst-sp-timing">Preferred Call Timing</label>',
          '<select class="tst-sp-input" id="tst-sp-timing" name="Preferred Call Timing">',
            '<option value="No preference">No preference</option>',
            '<option value="Morning (ET)">Morning (ET)</option>',
            '<option value="Afternoon (ET)">Afternoon (ET)</option>',
            '<option value="Evening (ET)">Evening (ET)</option>',
          '</select>',
        '</div>',

        '<div id="tst-sp-error" role="alert">Something went wrong. Please try again, or email info@trickysofttech.com.</div>',

        '<button type="submit" id="tst-sp-submit">',
          'Request My Call',
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        '</button>',
        '<p class="tst-sp-fine">No spam. We reply within 4 business hours.</p>',
      '</form>',

      '<div id="tst-sp-success">',
        '<div class="tst-sp-check"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>',
        '<h3>Request received</h3>',
        '<p>We\'ll email you within 4 business hours to lock in a time that works.</p>',
        '<button type="button" id="tst-sp-success-close">Close</button>',
      '</div>'
    ].join('');

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    closeBtn = dialog.querySelector('#tst-sp-close');
    form = dialog.querySelector('#tst-sp-form');
    firstField = dialog.querySelector('#tst-sp-name');
    dialog.querySelector('#tst-sp-source').value = location.href;

    closeBtn.addEventListener('click', function () { close('dismissed'); });
    dialog.querySelector('#tst-sp-success-close').addEventListener('click', function () { close('submitted'); });
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close('dismissed'); });
    form.addEventListener('submit', handleSubmit);
  }

  // --- focus trap ---------------------------------------------------------
  function focusables() {
    return Array.prototype.slice.call(
      dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled])')
    ).filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
  }

  function open() {
    lastFocused = document.activeElement;
    window.__tstSPOpen = true;
    document.body.classList.add('tst-sp-active'); // lets the chat widget stand down while this modal is up
    overlay.removeAttribute('hidden');
    // lock scroll, remembering any prior inline value
    dialog.dataset.prevOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
    // force reflow so the transition runs
    void overlay.offsetWidth;
    overlay.classList.add('tst-sp-open');

    keydownHandler = function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close('dismissed'); return; }
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keydownHandler, true);

    // focus the dialog itself so assistive tech announces its title/purpose
    (dialog || closeBtn).focus();
  }

  function close(reason) {
    if (!overlay || overlay.hasAttribute('hidden')) return;
    overlay.classList.remove('tst-sp-open');
    document.removeEventListener('keydown', keydownHandler, true);
    document.body.style.overflow = dialog.dataset.prevOverflow || '';
    if (reason === 'submitted') ss('set', 'submitted');
    window.__tstSPOpen = false;
    document.body.classList.remove('tst-sp-active');
    var finish = function () {
      overlay.setAttribute('hidden', '');
      if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur();
      var target = (lastFocused && document.contains(lastFocused) && lastFocused.offsetParent !== null)
        ? lastFocused : document.body;
      try { target.focus(); } catch (e) { /* body may be non-focusable in some engines */ }
    };
    // wait for the fade-out unless motion is reduced
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) finish();
    else setTimeout(finish, 240);

    // not submitted → come back in 15s
    if (reason !== 'submitted') arm(REPEAT_MS);
  }

  // reset the dialog's UI state (not the typed values) before showing it again
  function resetUI() {
    submitting = false;
    if (!form) return;
    form.style.display = '';
    var ok = document.getElementById('tst-sp-success'); if (ok) ok.style.display = 'none';
    var err = document.getElementById('tst-sp-error'); if (err) err.style.display = 'none';
    var btn = document.getElementById('tst-sp-submit');
    if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
  }

  // --- submit (mirrors contact.html's FormSubmit.co flow) ----------------
  var submitting = false;
  function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;                                // re-entrancy / double-submit guard
    if (form.querySelector('#tst-sp-hp').value) return;    // honeypot tripped

    if (!form.checkValidity()) { form.reportValidity(); return; }
    submitting = true;

    var btn = document.getElementById('tst-sp-submit');
    var errBox = document.getElementById('tst-sp-error');
    var originalHTML = btn.innerHTML;
    errBox.style.display = 'none';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.textContent = 'Sending…';

    fetch(ENDPOINT, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success === 'true' || data.success === true) {
          ss('set', 'submitted');
          form.style.display = 'none';
          var ok = document.getElementById('tst-sp-success');
          ok.style.display = 'block';
          document.getElementById('tst-sp-success-close').focus();
        } else {
          throw new Error('submit failed');
        }
      })
      .catch(function () {
        submitting = false;
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.innerHTML = originalHTML;
        errBox.style.display = 'block';
      });
  }

  // --- schedule ---------------------------------------------------------
  function arm(delay) {
    delay = (typeof delay === 'number') ? delay : DELAY_MS;
    setTimeout(function () {
      if (ss('get') === 'submitted') return;   // already converted this session
      if (window.__tstSPOpen) return;          // already on screen
      // if the visitor is mid-conversation in the chat widget, wait and try later
      // rather than stacking a second overlay on top of it
      if (window.__tstChatOpen) { arm(REPEAT_MS); return; }
      try {
        if (!overlay) buildModal();
        else resetUI();
        open();
      } catch (err) { /* never let the popup break the page */ }
    }, delay);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { arm(); }, { once: true });
  } else {
    arm();
  }
})();
