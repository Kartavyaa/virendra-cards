/* Virendra Cards: site behaviour. No dependencies. */
(function () {
  'use strict';

  var doc = document.documentElement;
  doc.classList.add('js');

  var WA_NUMBER = '918826076950';
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  function waLink(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  // Opening through a real anchor keeps popup blockers quiet.
  function openExternal(url) {
    var a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  }

  /* header shadow once the page moves */
  var head = $('[data-head]');
  if (head) {
    var onScroll = function () { head.classList.toggle('is-stuck', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* active link fallback, in case a page is renamed */
  var page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  if (page === 'index') page = 'home';
  $$('[data-nav="' + page + '"]').forEach(function (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'page'); });

  /* mobile drawer */
  var drawer = $('[data-drawer]');
  var burger = $('[data-burger]');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var x = $('.drawer__x', drawer); x && x.focus(); } else { burger.focus({ preventScroll: true }); }
  }
  burger && burger.addEventListener('click', function () { setDrawer(true); });
  $$('[data-drawer-close]').forEach(function (el) { el.addEventListener('click', function () { setDrawer(false); }); });
  drawer && $$('a', drawer).forEach(function (a) {
    a.addEventListener('click', function () { if (drawer.classList.contains('is-open')) setDrawer(false); });
  });
  $$('[data-acc]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.acc');
      var open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1080 && drawer && drawer.classList.contains('is-open')) setDrawer(false); });

  /* reveal on scroll */
  var reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* collection filter */
  $$('[data-filters]').forEach(function (bar) {
    var grid = $(bar.getAttribute('data-filters'));
    if (!grid) return;
    var cards = $$('[data-cat]', grid);
    var buttons = $$('[data-filter]', bar);

    function apply(cat, scroll) {
      var known = buttons.some(function (b) { return b.dataset.filter === cat; });
      if (!known) cat = 'all';
      buttons.forEach(function (b) {
        var on = b.dataset.filter === cat;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      cards.forEach(function (c) { c.hidden = !(cat === 'all' || c.dataset.cat === cat); });
      if (scroll) bar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        apply(b.dataset.filter, false);
        if (bar.hasAttribute('data-hash')) history.replaceState(null, '', b.dataset.filter === 'all' ? location.pathname : '#' + b.dataset.filter);
      });
    });

    if (bar.hasAttribute('data-hash')) {
      var fromHash = function (scroll) { apply(location.hash.replace('#', '') || 'all', scroll); };
      fromHash(!!location.hash);
      window.addEventListener('hashchange', function () { fromHash(true); });
    } else {
      apply('all', false);
    }
  });

  /* card enquiry modal */
  var modal = $('[data-modal]');
  if (modal) {
    var title = $('[data-modal-title]', modal);
    var go = $('[data-modal-go]', modal);
    var lastFocus = null;
    var close = function () {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lastFocus && lastFocus.focus();
    };
    $$('[data-enquire]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        lastFocus = btn;
        var name = btn.getAttribute('data-enquire');
        title.textContent = name;
        go.href = waLink('Hello Virendra Cards, I liked the "' + name + '" design on your website. Could you share the price and paper options?');
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(function () { go.focus(); }, 60);
      });
    });
    $$('[data-modal-close]', modal).forEach(function (el) { el.addEventListener('click', close); });
    go.addEventListener('click', function () { setTimeout(close, 200); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (drawer && drawer.classList.contains('is-open')) setDrawer(false);
    if (modal && modal.classList.contains('is-open')) $('[data-modal-close]', modal).click();
  });

  /* enquiry form: hands the message to WhatsApp, nothing is stored */
  var form = $('[data-wa-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var ok = true;
      ['name', 'phone'].forEach(function (k) {
        var field = f[k].closest('.field');
        var bad = !f[k].value.trim() || (k === 'phone' && f[k].value.replace(/\D/g, '').length < 10);
        field.classList.toggle('is-bad', bad);
        if (bad && ok) { f[k].focus(); ok = false; }
      });
      if (!ok) return;
      var lines = [
        'Hello Virendra Cards, I would like to enquire.',
        '',
        'Name: ' + f.name.value.trim(),
        'Phone: ' + f.phone.value.trim(),
        'Looking for: ' + f.occasion.value
      ];
      if (f.date.value) lines.push('Function date: ' + f.date.value);
      if (f.qty.value) lines.push('Approx. quantity: ' + f.qty.value);
      if (f.message.value.trim()) lines.push('', f.message.value.trim());
      openExternal(waLink(lines.join('\n')));
    });
  }

  /* store hours, worked out in India time whatever the visitor's clock says */
  var OPEN = 11 * 60, CLOSE = 19 * 60 + 30, OFF_DAY = 2; // Tuesday
  function indiaNow() {
    var now = new Date();
    var utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 330 * 60000);
  }
  var ist = indiaNow();
  var day = ist.getDay();
  var mins = ist.getHours() * 60 + ist.getMinutes();
  var isOpen = day !== OFF_DAY && mins >= OPEN && mins < CLOSE;
  var statusText;
  if (isOpen) statusText = 'Open now · closes at 7:30 PM';
  else if (day === OFF_DAY) statusText = 'Closed today (Tuesday) · open tomorrow at 11:00 AM';
  else if (mins < OPEN) statusText = 'Closed now · opens today at 11:00 AM';
  else statusText = (day + 1) % 7 === OFF_DAY ? 'Closed now · opens Wednesday at 11:00 AM' : 'Closed now · opens tomorrow at 11:00 AM';
  $$('[data-hours-line]').forEach(function (el) { el.textContent = statusText; });
  $$('[data-hours-status]').forEach(function (el) {
    el.textContent = isOpen ? 'Open now' : 'Closed now';
    el.classList.add(isOpen ? 'is-open' : 'is-closed');
  });
  $$('[data-day]').forEach(function (row) { if (+row.getAttribute('data-day') === day) row.classList.add('is-today'); });

  /* FAQ page: highlight the topic in view */
  var topicLinks = $$('.faqx__nav a');
  if (topicLinks.length && 'IntersectionObserver' in window) {
    var topicIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        topicLinks.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    $$('.faqx__group').forEach(function (g) { topicIO.observe(g); });
  }

  /* year */
  $$('[data-year]').forEach(function (el) { el.textContent = ist.getFullYear(); });

  /* google map: only when the page is the top window, so previews stay clean */
  $$('[data-map]').forEach(function (box) {
    var inFrame;
    try { inFrame = window.self !== window.top; } catch (err) { inFrame = true; }
    if (inFrame) return;
    var mount = function () {
      var f = document.createElement('iframe');
      f.src = box.getAttribute('data-map');
      f.loading = 'lazy';
      f.title = 'Virendra Cards on Google Maps';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      box.appendChild(f);
    };
    if ('IntersectionObserver' in window) {
      var mo = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { mount(); mo.disconnect(); } }, { rootMargin: '300px' });
      mo.observe(box);
    } else { mount(); }
  });

  /* a little depth on the hero cards for mouse users */
  var stage = $('[data-stage]');
  if (stage && window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
    var cards = $$('.inv', stage);
    stage.parentElement.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      var dx = (e.clientX - r.left - r.width / 2) / r.width;
      var dy = (e.clientY - r.top - r.height / 2) / r.height;
      cards.forEach(function (c, i) {
        var depth = [10, 18, 12][i] || 10;
        c.style.translate = (dx * depth).toFixed(1) + 'px ' + (dy * depth).toFixed(1) + 'px';
      });
    });
  }
})();
