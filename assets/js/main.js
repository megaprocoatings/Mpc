/* MPC website — shared behaviour (no dependencies) */
(function () {
  'use strict';

  /* Mobile menu ---------------------------------------------------- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    var iconOpen = toggle.querySelector('[data-icon-open]');
    var iconClose = toggle.querySelector('[data-icon-close]');
    function setMenu(open) {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (iconOpen) iconOpen.classList.toggle('is-hidden', open);
      if (iconClose) iconClose.classList.toggle('is-hidden', !open);
    }
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
  }

  /* Filter chips (products, news) ----------------------------------- */
  document.querySelectorAll('[data-filter-group]').forEach(function (group) {
    var target = document.querySelector(group.getAttribute('data-filter-group'));
    if (!target) return;
    var items = target.querySelectorAll('[data-cat]');
    var count = document.querySelector(group.getAttribute('data-filter-count') || '#__none');
    group.querySelectorAll('[data-filter]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        group.querySelectorAll('[data-filter]').forEach(function (c) {
          var on = c === chip;
          c.classList.toggle('is-on', on);
          c.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        var shown = 0;
        items.forEach(function (it) {
          var show = f === 'all' || (' ' + it.getAttribute('data-cat') + ' ').indexOf(' ' + f + ' ') > -1;
          it.classList.toggle('is-hidden', !show);
          if (show) shown++;
        });
        if (count) count.textContent = shown + (shown === 1 ? ' result' : ' results');
      });
    });
  });

  /* Contact form: prefill subject from ?subject= (product & CTA links) */
  var subjSel = document.querySelector('select[name="subject"]');
  var msgBox = document.querySelector('textarea[name="message"]');
  var phone = document.querySelector('input[name="phone"]');
  function pickSubject(text) {
    var t = (text || '').toLowerCase();
    if (/callback|call back/.test(t)) return 'Callback request';
    if (/brochure|document|tds|sds|data sheet/.test(t)) return 'Brochure or documents request';
    if (/partner/.test(t)) return 'Partnership inquiry';
    if (/quality|certif|standard/.test(t)) return 'Quality question';
    if (/project|application|industry|building/.test(t)) return 'Project inquiry';
    return 'Product information';
  }
  function setCallback(on) {
    if (!phone) return;
    phone.required = on;
    var lbl = document.querySelector('label[for="' + phone.id + '"] .req');
    if (lbl) lbl.classList.toggle('is-hidden', !on);
  }
  if (subjSel && window.URLSearchParams) {
    var q = new URLSearchParams(window.location.search).get('subject');
    if (q) {
      q = q.slice(0, 120);
      subjSel.value = pickSubject(q);
      if (msgBox && !msgBox.value) msgBox.value = 'Regarding: ' + q + '\n\n';
      setCallback(subjSel.value === 'Callback request');
    }
    subjSel.addEventListener('change', function () { setCallback(subjSel.value === 'Callback request'); });
  }
  document.querySelectorAll('[data-callback]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      if (!subjSel || !phone) return;
      e.preventDefault();
      subjSel.value = 'Callback request';
      setCallback(true);
      var f = document.getElementById('contact-form');
      if (f) f.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      setTimeout(function () { phone.focus(); }, 300);
    });
  });

  /* Form validation ------------------------------------------------
     No backend is connected. A valid submit does NOT claim the message
     was sent: it prepares an email in the visitor's own mail app
     (data-mailto) and says so plainly. Replace with MPC's endpoint
     when one exists. */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE = /^[+()\d\s-]{7,20}$/;
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    var summary = form.querySelector('[data-error-summary]');
    var result = document.querySelector(form.getAttribute('data-result'));

    function fieldError(input) {
      var v = (input.value || '').trim();
      if (input.type === 'checkbox') return input.required && !input.checked ? input.getAttribute('data-msg') || 'Please confirm to continue.' : '';
      if (input.required && !v) return input.getAttribute('data-msg') || 'This field is required.';
      if (v && input.type === 'email' && !EMAIL.test(v)) return 'Enter a valid email address, e.g. name@company.com.';
      if (v && input.type === 'tel' && !PHONE.test(v)) return 'Enter a valid phone number, e.g. +966 5X XXX XXXX.';
      if (v && input.minLength > 0 && v.length < input.minLength) return 'Please write at least ' + input.minLength + ' characters.';
      return '';
    }
    function show(input, msg) {
      var id = input.id + '-err';
      var el = document.getElementById(id);
      input.classList.toggle('is-error', !!msg);
      if (msg) {
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', id);
        if (!el) {
          el = document.createElement('span');
          el.className = 'err'; el.id = id;
          (input.closest('.field') || input.closest('.check') || input.parentNode).appendChild(el);
        }
        el.textContent = msg;
      } else {
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
        if (el) el.remove();
      }
    }
    form.querySelectorAll('input, textarea, select').forEach(function (input) {
      input.addEventListener('blur', function () { if (input.classList.contains('is-error') || input.value) show(input, fieldError(input)); });
      input.addEventListener('input', function () { if (input.classList.contains('is-error')) show(input, fieldError(input)); });
      input.addEventListener('change', function () { if (input.classList.contains('is-error')) show(input, fieldError(input)); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = [];
      form.querySelectorAll('input, textarea, select').forEach(function (input) {
        if (input.type === 'hidden') return;
        var msg = fieldError(input); show(input, msg); if (msg) bad.push(input);
      });
      if (bad.length) {
        if (summary) {
          summary.classList.remove('is-hidden');
          summary.querySelector('[data-error-count]').textContent = bad.length === 1 ? '1 field needs' : bad.length + ' fields need';
        }
        bad[0].focus();
        return;
      }
      if (summary) summary.classList.add('is-hidden');
      var to = form.getAttribute('data-mailto');
      if (to) {
        var d = new FormData(form), lines = [];
        ['name', 'email', 'phone', 'company', 'subject'].forEach(function (k) {
          var v = (d.get(k) || '').toString().trim();
          if (v) lines.push(k.charAt(0).toUpperCase() + k.slice(1) + ': ' + v);
        });
        var body = lines.join('\n') + '\n\n' + (d.get('message') || '').toString().trim();
        var href = 'mailto:' + to + '?subject=' + encodeURIComponent('[MPC website] ' + (d.get('subject') || 'Inquiry')) + '&body=' + encodeURIComponent(body);
        if (result) {
          var link = result.querySelector('[data-mailto-link]');
          if (link) link.href = href;
          result.classList.remove('is-hidden');
          result.focus();
        }
        window.location.href = href;
      } else if (result) {
        result.classList.remove('is-hidden');
        result.focus();
      }
    });
  });

  /* News listing: search, category, status, sort -------------------- */
  var list = document.querySelector('[data-news-list]');
  if (list) {
    var cards = Array.prototype.slice.call(list.querySelectorAll('[data-cat]'));
    var search = document.getElementById('news-search');
    var cats = document.querySelectorAll('input[name="cat"]');
    var allBox = document.querySelector('input[name="cat-all"]');
    var status = document.getElementById('news-date');
    var sort = document.getElementById('news-sort');
    var count = document.querySelector('[data-news-count]');
    var empty = document.querySelector('[data-news-empty]');
    function apply() {
      var term = (search && search.value || '').trim().toLowerCase();
      var on = Array.prototype.filter.call(cats, function (c) { return c.checked; }).map(function (c) { return c.value; });
      if (allBox) allBox.checked = on.length === 0;
      var st = status ? status.value : 'all';
      var shown = 0;
      cards.forEach(function (c) {
        var ok = (!on.length || on.indexOf(c.getAttribute('data-cat')) > -1) &&
          (!term || c.textContent.toLowerCase().indexOf(term) > -1) &&
          (st === 'all' || c.getAttribute('data-status') === st);
        c.classList.toggle('is-hidden', !ok);
        if (ok) shown++;
      });
      var ord = sort ? sort.value : 'latest';
      cards.slice().sort(function (a, b) {
        var x = +a.getAttribute('data-order'), y = +b.getAttribute('data-order');
        if (ord === 'az') return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
        return ord === 'oldest' ? y - x : x - y;
      }).forEach(function (c) { list.appendChild(c); });
      if (count) count.textContent = shown ? 'Showing ' + shown + ' of ' + cards.length + (cards.length === 1 ? ' article' : ' articles') : 'No articles match your filters';
      if (empty) empty.classList.toggle('is-hidden', shown > 0);
    }
    if (search) search.addEventListener('input', apply);
    cats.forEach(function (c) { c.addEventListener('change', apply); });
    if (allBox) allBox.addEventListener('change', function () { cats.forEach(function (c) { c.checked = false; }); apply(); });
    if (status) status.addEventListener('change', apply);
    if (sort) sort.addEventListener('change', apply);
    document.querySelectorAll('[data-news-clear]').forEach(function (clear) { clear.addEventListener('click', function () {
      if (search) search.value = '';
      cats.forEach(function (c) { c.checked = false; });
      if (status) status.value = 'all';
      if (sort) sort.value = 'latest';
      apply();
    }); });
    var nf = document.getElementById('news-search-form');
    if (nf) nf.addEventListener('submit', function (e) { e.preventDefault(); apply(); });
    apply();
  }

  /* Newsletter: no mailing service is connected, so say so honestly -- */
  document.querySelectorAll('form[data-newsletter]').forEach(function (f) {
    var input = f.querySelector('input[type="email"]');
    var note = document.querySelector(f.getAttribute('data-note'));
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = (input.value || '').trim();
      if (!EMAIL.test(v)) {
        input.classList.add('is-error'); input.setAttribute('aria-invalid', 'true');
        note.className = 'form-note err';
        note.textContent = 'Enter a valid email address, e.g. name@company.com.';
        input.focus(); return;
      }
      input.classList.remove('is-error'); input.removeAttribute('aria-invalid');
      note.className = 'form-note small';
      note.textContent = 'Thank you. The MPC newsletter has not launched yet, so your address was not stored. Please check back here, or contact us to be told when it starts.';
    });
  });

  /* Motion: header shadow on scroll + one-time scroll reveals ---------
     Elements already on screen at load are never hidden. Elements below
     the fold get .rv, then .rv-in when they enter the viewport; both
     classes are removed after the transition so hover/other styles are
     untouched. Without IntersectionObserver nothing is hidden. */
  var hdr = document.querySelector('[data-header]');
  if (hdr) {
    var scrolled = false;
    var onScroll = function () {
      var s = window.scrollY > 8;
      if (s !== scrolled) { scrolled = s; hdr.classList.toggle('is-scrolled', s); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if ('IntersectionObserver' in window) {
    var GROUP = '.g2,.g3,.g4,.g5,.g-3-2,.icols,.steps,.glance,.logo-slots,.ilist-wrap > .ilist,.ftr-grid,.pd-top';
    var small = window.innerWidth < 640;
    var STEP = small ? 40 : 60, CAP = small ? 3 : 6;
    var seen = new Set(), items = [];
    function collect(el, delay) {
      if (seen.has(el) || el.matches('script,style,[hidden],.is-hidden')) return;
      seen.add(el);
      items.push([el, delay]);
    }
    var sources = document.querySelectorAll(
      'main section:not(.phero):not(.hhero) .wrap > *, main .bleed > *, main .cmap > *, .ftr .wrap > *');
    sources.forEach(function (el) {
      if (el.matches(GROUP)) {
        Array.prototype.forEach.call(el.children, function (c, i) { collect(c, Math.min(i, CAP) * STEP); });
      } else {
        collect(el, 0);
      }
    });
    var vh = window.innerHeight;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        requestAnimationFrame(function () { el.classList.add('rv-in'); });
        var done = function (e) {
          if (e && e.target !== el) return;
          el.classList.remove('rv', 'rv-in');
          el.style.removeProperty('--rv-d');
          el.removeEventListener('transitionend', done);
        };
        el.addEventListener('transitionend', done);
        setTimeout(done, 1600);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    items.forEach(function (it) {
      var el = it[0], r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) return; /* already visible: never hide it */
      if (it[1]) el.style.setProperty('--rv-d', it[1] + 'ms');
      el.classList.add('rv');
      io.observe(el);
    });
    /* Back/forward cache restores: make sure nothing stays hidden */
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('rv-in'); });
    });
  }
})();
