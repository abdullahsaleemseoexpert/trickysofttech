/* =============================================================================
   Tricky Soft Tech — guided smart chat + lead capture (v1)
   -----------------------------------------------------------------------------
   One shared file, referenced sitewide (assets/tst-chat.js). Adds a floating
   "Chat with us" launcher. Clicking it opens a branded, guided chat panel:
   pick a topic (or "Something Else"), describe the need, leave an email, send.

   • Opens ONLY on click — never auto-opens (the Phase 15 strategy popup owns
     the timed interruption).
   • Reuses the existing FormSubmit.co lead endpoint (same as contact.html and
     the Phase 15 popup) — not a second email system.
   • No framework, no UI library, no AI API. Design tokens come from the page's
     own :root; the logo is the repo asset assets/logo-symbol.png.
============================================================================= */
(function () {
  'use strict';

  if (window.__tstChatInit) return;
  window.__tstChatInit = true;
  window.__tstChatOpen = false;

  var ENDPOINT = 'https://formsubmit.co/ajax/abdullahsaleem12570@gmail.com';
  var SS_KEY = 'tst_chat'; // sessionStorage, UI state only ('submitted') — never message content

  var TOPICS = [
    'Local SEO',
    'Google Business Profile',
    'Website SEO',
    'Website Development',
    'AI Search / GEO',
    'Something Else'
  ];

  function ss(method, val) {
    try {
      if (method === 'get') return window.sessionStorage.getItem(SS_KEY);
      if (method === 'set') window.sessionStorage.setItem(SS_KEY, val);
      if (method === 'del') window.sessionStorage.removeItem(SS_KEY);
    } catch (e) { /* storage disabled — degrade quietly */ }
    return null;
  }

  // asset dir resolved from this script's own URL → works at any directory depth
  var selfScript = document.currentScript || document.querySelector('script[data-tst-chat]');
  var ASSETS = selfScript ? selfScript.src.replace(/[^/]+$/, '') : '/assets/';

  var launcher, panel, body, inputArea, closeBtn, lastFocused, keydownHandler;
  var state = { topic: null, built: false };
  var submitting = false;

  /* ---------- styles ---------- */
  function injectStyles() {
    if (document.getElementById('tst-chat-style')) return;
    var css = [
      /* keep the existing back-to-top control from colliding with the launcher */
      '.back-to-top{bottom:84px}',
      '@media (max-width:640px){.back-to-top{bottom:74px}}',

      '#tst-chat-launcher{position:fixed;right:24px;bottom:24px;z-index:99990;display:inline-flex;align-items:center;gap:9px;',
      'height:48px;padding:0 20px 0 16px;border:1px solid rgba(255,255,255,0.16);border-radius:999px;cursor:pointer;',
      'font-family:\'Inter\',system-ui,sans-serif;font-size:14px;font-weight:600;letter-spacing:0.01em;color:#fff;',
      'background:var(--grad-brand,linear-gradient(135deg,#5B5FEF,#7B6FF0 50%,#A855F7));',
      'box-shadow:0 12px 30px rgba(91,95,239,0.34),0 4px 10px rgba(15,15,35,0.16);',
      'transition:transform 220ms var(--ease-premium,cubic-bezier(0.16,1,0.3,1)),box-shadow 220ms,opacity 200ms}',
      '#tst-chat-launcher:hover{transform:translateY(-2px);box-shadow:0 16px 38px rgba(91,95,239,0.42)}',
      '#tst-chat-launcher:focus-visible{outline:none;box-shadow:0 0 0 2px var(--ink-void,#fff),0 0 0 4px var(--spectrum-core,#5B5FEF)}',
      '#tst-chat-launcher svg{flex-shrink:0}',
      '#tst-chat-launcher .tst-chat-x{display:none}',
      '#tst-chat-launcher.is-open .tst-chat-ico{display:none}',
      '#tst-chat-launcher.is-open .tst-chat-x{display:block}',
      '#tst-chat-launcher.is-open .tst-chat-label{display:none}',
      '#tst-chat-launcher.is-open{height:48px;width:48px;padding:0;justify-content:center}',
      /* stand down while the Phase 15 strategy modal is up */
      'body.tst-sp-active #tst-chat-launcher{opacity:0;pointer-events:none}',
      '@media (max-width:640px){#tst-chat-launcher{right:16px;bottom:16px}#tst-chat-launcher.is-open{display:none}}',

      '#tst-chat-panel{position:fixed;right:24px;bottom:84px;z-index:99991;width:380px;max-width:calc(100vw - 32px);',
      'max-height:min(600px,calc(100dvh - 120px));display:flex;flex-direction:column;overflow:hidden;',
      'background:var(--ink-void,#fff);color:var(--text-primary,#14141F);border:1px solid var(--border-default,rgba(15,15,35,0.10));',
      'border-radius:18px;box-shadow:0 28px 70px rgba(15,15,35,0.24),0 8px 20px rgba(15,15,35,0.12);',
      'opacity:0;transform:translateY(12px) scale(0.98);transform-origin:bottom right;',
      'transition:opacity 220ms var(--ease-silk,cubic-bezier(0.4,0,0.2,1)),transform 240ms var(--ease-premium,cubic-bezier(0.16,1,0.3,1))}',
      '#tst-chat-panel.is-open{opacity:1;transform:none}',
      '#tst-chat-panel[hidden]{display:none}',
      ':root[data-theme="dark"] #tst-chat-panel{background:var(--ink-raised,#151827)}',
      '@media (max-width:640px){#tst-chat-panel{right:0;left:0;bottom:0;width:100%;max-width:100%;',
      'max-height:92dvh;border-radius:18px 18px 0 0;transform:translateY(16px)}}',

      '#tst-chat-head{display:flex;align-items:center;gap:11px;padding:14px 14px 13px 16px;',
      'border-bottom:1px solid var(--border-subtle,rgba(15,15,35,0.06));flex-shrink:0}',
      '#tst-chat-head .tst-chat-avatar{width:34px;height:34px;border-radius:10px;flex-shrink:0;object-fit:contain;',
      'background:rgba(91,95,239,0.10);padding:3px}',
      ':root[data-theme="dark"] #tst-chat-head .tst-chat-avatar{background:rgba(129,132,255,0.14)}',
      '#tst-chat-head .tst-chat-h{flex:1;min-width:0}',
      '#tst-chat-title{font-family:\'Sora\',sans-serif;font-size:14px;font-weight:700;line-height:1.2;color:var(--text-primary,#14141F);margin:0}',
      '#tst-chat-head .tst-chat-sub{font-size:12px;color:var(--text-muted,#6B6F8C);line-height:1.3;margin-top:1px}',
      '#tst-chat-close{width:32px;height:32px;flex-shrink:0;border-radius:9px;border:1px solid transparent;background:transparent;',
      'cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-muted,#6B6F8C);',
      'transition:background 150ms,color 150ms,border-color 150ms}',
      '#tst-chat-close:hover{background:rgba(15,15,35,0.05);color:var(--text-primary,#14141F);border-color:var(--border-default,rgba(15,15,35,0.10))}',
      ':root[data-theme="dark"] #tst-chat-close:hover{background:rgba(255,255,255,0.06)}',
      '#tst-chat-close:focus-visible{outline:2px solid var(--spectrum-core,#5B5FEF);outline-offset:2px}',

      '#tst-chat-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:16px;display:flex;flex-direction:column;gap:10px}',
      '.tst-chat-msg{max-width:84%;font-size:13.5px;line-height:1.55;padding:10px 13px;border-radius:13px;white-space:pre-wrap;word-wrap:break-word}',
      '.tst-chat-msg.bot{align-self:flex-start;background:var(--ink-float,#EAEAF3);color:var(--text-primary,#14141F);border-bottom-left-radius:5px}',
      ':root[data-theme="dark"] .tst-chat-msg.bot{background:rgba(255,255,255,0.06)}',
      '.tst-chat-msg.user{align-self:flex-end;background:var(--grad-brand,linear-gradient(135deg,#5B5FEF,#7B6FF0 50%,#A855F7));color:#fff;border-bottom-right-radius:5px}',

      '.tst-chat-opts{display:flex;flex-wrap:wrap;gap:8px;margin-top:2px}',
      '.tst-chat-opt{font-family:\'Inter\',sans-serif;font-size:13px;font-weight:600;padding:9px 14px;border-radius:10px;cursor:pointer;',
      'background:rgba(91,95,239,0.10);color:var(--spectrum-core,#5B5FEF);border:1px solid var(--border-accent,rgba(91,95,239,0.24));',
      'transition:background 160ms,transform 160ms,box-shadow 160ms}',
      '.tst-chat-opt:hover{background:rgba(91,95,239,0.17);transform:translateY(-1px);box-shadow:0 6px 16px rgba(91,95,239,0.16)}',
      '.tst-chat-opt:focus-visible{outline:2px solid var(--spectrum-core,#5B5FEF);outline-offset:2px}',
      ':root[data-theme="dark"] .tst-chat-opt{background:rgba(129,132,255,0.14)}',
      ':root[data-theme="dark"] .tst-chat-opt:hover{background:rgba(129,132,255,0.22)}',

      '#tst-chat-input{flex-shrink:0;border-top:1px solid var(--border-subtle,rgba(15,15,35,0.06));padding:12px 14px 14px;background:var(--ink-void,#fff)}',
      ':root[data-theme="dark"] #tst-chat-input{background:var(--ink-raised,#151827)}',
      '#tst-chat-form{display:flex;flex-direction:column;gap:9px}',
      '.tst-chat-field{display:flex;flex-direction:column;gap:4px}',
      '.tst-chat-label{font-family:\'JetBrains Mono\',monospace;font-size:10.5px;font-weight:600;letter-spacing:0.04em;',
      'text-transform:uppercase;color:var(--text-muted,#6B6F8C)}',
      '.tst-chat-in{width:100%;font-family:\'Inter\',sans-serif;font-size:13.5px;color:var(--text-primary,#14141F);',
      'background:rgba(15,15,35,0.04);border:1px solid var(--border-default,rgba(15,15,35,0.10));border-radius:10px;',
      'padding:10px 12px;outline:none;transition:border-color 0.18s,background 0.18s}',
      ':root[data-theme="dark"] .tst-chat-in{background:rgba(255,255,255,0.05)}',
      '.tst-chat-in::placeholder{color:var(--text-muted,#6B6F8C)}',
      '.tst-chat-in:focus{border-color:var(--border-accent-strong,rgba(91,95,239,0.45));background:rgba(91,95,239,0.06)}',
      'textarea.tst-chat-in{resize:none;min-height:62px;line-height:1.5}',
      '#tst-chat-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}',
      '#tst-chat-err{display:none;font-size:12px;color:#ef4444;line-height:1.4}',

      '#tst-chat-send{display:inline-flex;align-items:center;justify-content:center;gap:7px;width:100%;',
      'font-family:\'Inter\',sans-serif;font-size:13.5px;font-weight:600;letter-spacing:0.01em;color:#fff;cursor:pointer;',
      'background:var(--grad-brand,linear-gradient(135deg,#5B5FEF,#7B6FF0 50%,#A855F7));',
      'border:1px solid rgba(255,255,255,0.15);border-radius:11px;padding:11px 18px;',
      'transition:transform 200ms var(--ease-premium,cubic-bezier(0.16,1,0.3,1)),box-shadow 200ms,opacity 200ms}',
      '#tst-chat-send:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(91,95,239,0.32)}',
      '#tst-chat-send:disabled{cursor:default;transform:none;box-shadow:none}',
      '#tst-chat-send:focus-visible{outline:none;box-shadow:0 0 0 2px var(--ink-void,#fff),0 0 0 4px var(--spectrum-core,#5B5FEF)}',
      '#tst-chat-back{background:none;border:none;padding:0;margin-top:2px;font-family:\'Inter\',sans-serif;font-size:12px;',
      'color:var(--text-muted,#6B6F8C);cursor:pointer;align-self:flex-start;text-decoration:underline}',
      '#tst-chat-back:focus-visible{outline:2px solid var(--spectrum-core,#5B5FEF);outline-offset:2px}',
      '.tst-chat-fine{font-size:11px;color:var(--text-muted,#6B6F8C);line-height:1.4;text-align:center;margin-top:1px}',

      '@media (prefers-reduced-motion:reduce){#tst-chat-launcher,#tst-chat-panel,#tst-chat-send,#tst-chat-opt{transition:none}',
      '#tst-chat-panel{transform:none}}'
    ].join('');
    var s = document.createElement('style');
    s.id = 'tst-chat-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ---------- launcher ---------- */
  function buildLauncher() {
    launcher = document.createElement('button');
    launcher.id = 'tst-chat-launcher';
    launcher.type = 'button';
    launcher.setAttribute('aria-haspopup', 'dialog');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', 'Chat with us');
    launcher.innerHTML =
      '<svg class="tst-chat-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.7 8.7 0 0 1-3.9-.9L3 20l1.4-4.6a8.7 8.7 0 0 1-.9-3.9A8.38 8.38 0 0 1 12 3a8.38 8.38 0 0 1 9 8.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<svg class="tst-chat-x" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      '<span class="tst-chat-label">Chat with us</span>';
    launcher.addEventListener('click', function () {
      if (document.body.classList.contains('tst-sp-active')) return; // strategy modal owns the screen
      window.__tstChatOpen ? closePanel() : openPanel();
    });
    document.body.appendChild(launcher);
  }

  /* ---------- panel shell ---------- */
  function buildPanel() {
    injectStyles();
    panel = document.createElement('div');
    panel.id = 'tst-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'tst-chat-title');
    panel.setAttribute('tabindex', '-1');
    panel.setAttribute('hidden', '');
    panel.innerHTML = [
      '<div id="tst-chat-head">',
        '<img class="tst-chat-avatar" src="' + ASSETS + 'logo-symbol.png" alt="Tricky Soft Tech">',
        '<div class="tst-chat-h">',
          '<p id="tst-chat-title">Tricky Soft Tech</p>',
          '<div class="tst-chat-sub">How can we help?</div>',
        '</div>',
        '<button type="button" id="tst-chat-close" aria-label="Close chat">',
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
        '</button>',
      '</div>',
      '<div id="tst-chat-body" aria-live="polite"></div>',
      '<div id="tst-chat-input"></div>'
    ].join('');
    document.body.appendChild(panel);

    body = panel.querySelector('#tst-chat-body');
    inputArea = panel.querySelector('#tst-chat-input');
    closeBtn = panel.querySelector('#tst-chat-close');
    closeBtn.addEventListener('click', closePanel);

    state.built = true;
  }

  /* ---------- conversation helpers ---------- */
  function addMsg(text, who) {
    var m = document.createElement('div');
    m.className = 'tst-chat-msg ' + (who === 'user' ? 'user' : 'bot');
    m.textContent = text;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m;
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function renderStart() {
    body.innerHTML = '';
    inputArea.innerHTML = '';
    state.topic = null;
    addMsg('Hi! How can we help your business?', 'bot');
    var wrap = document.createElement('div');
    wrap.className = 'tst-chat-opts';
    TOPICS.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tst-chat-opt';
      b.textContent = t;
      b.addEventListener('click', function () { chooseTopic(t); });
      wrap.appendChild(b);
    });
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  function chooseTopic(topic) {
    state.topic = topic;
    // drop the option buttons, keep the transcript
    var opts = body.querySelector('.tst-chat-opts');
    if (opts) opts.remove();
    addMsg(topic, 'user');
    addMsg(
      topic === 'Something Else'
        ? 'No problem — tell us what you\'re looking for, and the best email to reach you.'
        : 'Great. Tell us a little about what you need help with, and the best email to reach you.',
      'bot'
    );
    renderForm();
  }

  function renderForm() {
    inputArea.innerHTML = [
      '<form id="tst-chat-form" novalidate>',
        '<input type="text" id="tst-chat-hp" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">',
        '<div class="tst-chat-field">',
          '<label class="tst-chat-label" for="tst-chat-name">Your Name (optional)</label>',
          '<input class="tst-chat-in" id="tst-chat-name" name="Name" type="text" autocomplete="name" placeholder="Jane Smith">',
        '</div>',
        '<div class="tst-chat-field">',
          '<label class="tst-chat-label" for="tst-chat-email">Business Email</label>',
          '<input class="tst-chat-in" id="tst-chat-email" name="Business Email" type="email" autocomplete="email" placeholder="you@company.com" required>',
        '</div>',
        '<div class="tst-chat-field">',
          '<label class="tst-chat-label" for="tst-chat-message">Your Message</label>',
          '<textarea class="tst-chat-in" id="tst-chat-message" name="Message" placeholder="A sentence or two about what you need." required></textarea>',
        '</div>',
        '<div id="tst-chat-err" role="alert"></div>',
        '<button type="submit" id="tst-chat-send">Send Message',
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        '</button>',
        '<button type="button" id="tst-chat-back">&larr; Pick a different topic</button>',
        '<p class="tst-chat-fine">We reply by email within 4 business hours.</p>',
      '</form>'
    ].join('');
    var form = inputArea.querySelector('#tst-chat-form');
    form.addEventListener('submit', handleSend);
    inputArea.querySelector('#tst-chat-back').addEventListener('click', renderStart);
    var first = inputArea.querySelector('#tst-chat-name');
    if (first) first.focus();
  }

  function handleSend(e) {
    e.preventDefault();
    var form = e.target;
    if (submitting) return;
    if (form.querySelector('#tst-chat-hp').value) return; // honeypot

    var emailEl = form.querySelector('#tst-chat-email');
    var msgEl = form.querySelector('#tst-chat-message');
    var errBox = form.querySelector('#tst-chat-err');
    errBox.style.display = 'none';

    if (!emailEl.value.trim() || !emailEl.checkValidity()) {
      errBox.textContent = 'Please enter a valid email address.';
      errBox.style.display = 'block';
      emailEl.focus();
      return;
    }
    if (!msgEl.value.trim()) {
      errBox.textContent = 'Please add a short message.';
      errBox.style.display = 'block';
      msgEl.focus();
      return;
    }

    submitting = true;
    var btn = form.querySelector('#tst-chat-send');
    var originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.textContent = 'Sending…';

    var fd = new FormData();
    fd.append('_subject', 'New Website Chat Lead - ' + (state.topic || 'General'));
    fd.append('_captcha', 'false');
    fd.append('_template', 'table');
    fd.append('_cc', 'info@trickysofttech.com');
    if (form.querySelector('#tst-chat-name').value.trim()) fd.append('Name', form.querySelector('#tst-chat-name').value.trim());
    fd.append('Email', emailEl.value.trim());
    fd.append('Topic', state.topic || 'General');
    fd.append('Message', msgEl.value.trim());
    fd.append('Page', location.href);
    fd.append('Time', new Date().toString());

    fetch(ENDPOINT, { method: 'POST', headers: { 'Accept': 'application/json' }, body: fd })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success === 'true' || data.success === true) {
          ss('set', 'submitted');
          renderDone();
        } else {
          throw new Error('submit failed');
        }
      })
      .catch(function () {
        submitting = false;
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.innerHTML = originalHTML;
        errBox.textContent = 'Something went wrong while sending your message. Please try again.';
        errBox.style.display = 'block';
      });
  }

  function renderDone() {
    addMsg('Thanks! We’ve received your message. Someone from our team will reach out to you via email shortly.', 'bot');
    inputArea.innerHTML =
      '<button type="button" id="tst-chat-send" style="background:transparent;color:var(--text-primary,#14141F);border:1px solid var(--border-default,rgba(15,15,35,0.10))">Close Chat</button>';
    var b = inputArea.querySelector('#tst-chat-send');
    b.addEventListener('click', closePanel);
    b.focus();
  }

  /* ---------- open / close ---------- */
  function focusables() {
    return Array.prototype.slice.call(panel.querySelectorAll(
      'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled])'
    )).filter(function (el) { return el.offsetParent !== null; });
  }

  function openPanel() {
    if (!state.built) buildPanel();
    lastFocused = document.activeElement;
    window.__tstChatOpen = true;
    launcher.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    launcher.setAttribute('aria-label', 'Close chat');

    panel.dataset.prevOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
    panel.removeAttribute('hidden');
    void panel.offsetWidth;
    panel.classList.add('is-open');

    // (re)build the conversation: thank-you if already submitted this session, else the topic menu
    if (ss('get') === 'submitted') {
      body.innerHTML = ''; inputArea.innerHTML = '';
      addMsg('Thanks! We’ve received your message. Someone from our team will reach out to you via email shortly.', 'bot');
      inputArea.innerHTML = '<button type="button" id="tst-chat-send" style="background:transparent;color:var(--text-primary,#14141F);border:1px solid var(--border-default,rgba(15,15,35,0.10))">Close Chat</button>';
      inputArea.querySelector('#tst-chat-send').addEventListener('click', closePanel);
    } else if (!body.children.length) {
      renderStart();
    }

    keydownHandler = function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closePanel(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keydownHandler, true);
    panel.focus();
  }

  function closePanel() {
    if (!window.__tstChatOpen) return;
    window.__tstChatOpen = false;
    panel.classList.remove('is-open');
    launcher.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', 'Chat with us');
    document.removeEventListener('keydown', keydownHandler, true);
    document.body.style.overflow = panel.dataset.prevOverflow || '';

    var finish = function () {
      panel.setAttribute('hidden', '');
      if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur();
      // the launcher is the persistent anchor for this widget — send focus back to it,
      // unless the caller was elsewhere on the page and is still there
      var target = (lastFocused && lastFocused !== document.body && document.contains(lastFocused)
        && !panel.contains(lastFocused) && lastFocused.offsetParent !== null) ? lastFocused : launcher;
      try { target.focus(); } catch (e) {}
    };
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) finish();
    else setTimeout(finish, 220);
  }

  /* ---------- init (launcher only; panel is lazy) ---------- */
  function init() {
    injectStyles();
    buildLauncher();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
