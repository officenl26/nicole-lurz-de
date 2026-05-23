/* ════════════════════════════════════════════════════════════
   NICOLE LURZ · PREMIUM · JS
   Lenis · GSAP ScrollTrigger · Cursor · Aurora · Magnetic
   Gemeinsam für premium.html (Homepage) + blind-spot-check.html
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(init);

  function init() {
    if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
    initPreloader();
    initLenis();
    initCursor();
    initMagnetic();
    initNav();
    initScrollProgress();
    initReveals();
    initStaggerGroups();
    initMegaQuotes();
    initParallax();
    initAurora();
    initCounters();
    initFAQ();
    initPhotoReveals();
  }

  /* ─── 1 · PRELOADER ─────────────────────────────── */
  function initPreloader() {
    var pre = document.getElementById('preloader');
    if (!pre) { document.body.classList.remove('is-loading'); return; }
    var minDuration = reduceMotion ? 0 : 2700;
    var start = performance.now();
    function hide() {
      var wait = Math.max(0, minDuration - (performance.now() - start));
      setTimeout(function () {
        pre.classList.add('is-done');
        document.body.classList.remove('is-loading');
        document.dispatchEvent(new CustomEvent('preloader:done'));
        setTimeout(function () { if (pre.parentNode) pre.remove(); }, 950);
      }, wait);
    }
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
  }

  /* ─── 2 · LENIS SMOOTH SCROLL ───────────────────── */
  var lenis = null;
  function initLenis() {
    if (reduceMotion || !window.Lenis) return;
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      touchMultiplier: 1.6
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (id.length <= 1) return;
        var target = document.querySelector(id);
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -70, duration: 1.5 }); }
      });
    });
  }

  /* ─── 3 · CUSTOM CURSOR ─────────────────────────── */
  function initCursor() {
    if (isTouch || reduceMotion) return;
    var dot = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;
    var mx = innerWidth / 2, my = innerHeight / 2;
    var dx = mx, dy = my, rx = mx, ry = my;
    window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    window.addEventListener('mouseleave', function () { dot.classList.add('is-hidden'); ring.classList.add('is-hidden'); });
    window.addEventListener('mouseenter', function () { dot.classList.remove('is-hidden'); ring.classList.remove('is-hidden'); });
    (function loop() {
      dx += (mx - dx) * 0.6; dy += (my - dy) * 0.6;
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      dot.style.transform = 'translate(' + dx + 'px,' + dy + 'px) translate(-50%,-50%)';
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    var sel = 'a, button, .cta, .testi, .welt-card, .achse, .etappe, .faq-item summary, .fuerwen-col, .persona-item';
    document.querySelectorAll(sel).forEach(function (el) {
      el.addEventListener('mouseenter', function () { dot.classList.add('is-hover'); ring.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { dot.classList.remove('is-hover'); ring.classList.remove('is-hover'); });
    });
  }

  /* ─── 4 · MAGNETIC ──────────────────────────────── */
  function initMagnetic() {
    if (isTouch || reduceMotion) return;
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      var strength = parseFloat(el.dataset.magneticStrength) || 0.3;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * strength + 'px,' + y * strength + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .6s cubic-bezier(0.16,1,0.3,1)';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 600);
      });
      el.addEventListener('mouseenter', function () { el.style.transition = ''; });
    });
  }

  /* ─── 5 · NAVIGATION ────────────────────────────── */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    document.addEventListener('preloader:done', function () { nav.classList.add('is-ready'); });
    if (document.body.classList.contains('is-loading') === false) nav.classList.add('is-ready');

    var lastY = window.scrollY, ticking = false;
    function onScroll() {
      var y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 24);
      if (y > 240 && y > lastY) nav.classList.add('is-hidden');
      else nav.classList.remove('is-hidden');
      lastY = y; ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });

    var burger = document.getElementById('navBurger');
    var links = document.getElementById('navLinks');
    if (burger && links) {
      burger.addEventListener('click', function () {
        var open = links.classList.toggle('is-open');
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', open);
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          links.classList.remove('is-open');
          burger.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ─── 6 · SCROLL PROGRESS ───────────────────────── */
  function initScrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;
    function update() {
      var max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ─── 7 · TEXT REVEALS ──────────────────────────── */
  function splitWords(el) {
    var out = [];
    function walk(node, target) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/);
          parts.forEach(function (p) {
            if (p === '') return;
            if (/^\s+$/.test(p)) { target.appendChild(document.createTextNode(p)); return; }
            var line = document.createElement('span');
            line.className = 'split-line';
            var word = document.createElement('span');
            word.className = 'split-word';
            word.textContent = p;
            line.appendChild(word);
            target.appendChild(line);
            out.push(word);
          });
        } else if (child.nodeType === 1) {
          if (child.tagName === 'BR') { target.appendChild(child.cloneNode()); return; }
          var clone = child.cloneNode(false);
          target.appendChild(clone);
          walk(child, clone);
        }
      });
    }
    var frag = document.createElement('span');
    walk(el, frag);
    el.innerHTML = '';
    while (frag.firstChild) el.appendChild(frag.firstChild);
    return out;
  }

  function initReveals() {
    if (reduceMotion || !hasGSAP) {
      document.querySelectorAll('.reveal').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }
    /* Word-split headings */
    document.querySelectorAll('[data-reveal-words]').forEach(function (el) {
      var words = splitWords(el);
      gsap.set(words, { yPercent: 110, opacity: 0 });
      var inHero = el.closest('.hero, .lp-hero');
      function play() {
        gsap.to(words, { yPercent: 0, opacity: 1, duration: 1.05, ease: 'expo.out', stagger: 0.022 });
      }
      if (inHero) {
        document.addEventListener('preloader:done', function () { gsap.delayedCall(0.35, play); });
      } else {
        ScrollTrigger.create({ trigger: el, start: 'top 86%', once: true, onEnter: play });
      }
    });
    /* Simple fade-up reveals */
    document.querySelectorAll('.reveal').forEach(function (el) {
      var delay = parseFloat(el.dataset.delay) || 0;
      var inHero = el.closest('.hero, .lp-hero');
      function play() { gsap.to(el, { opacity: 1, y: 0, duration: 0.95, delay: delay, ease: 'expo.out' }); }
      if (inHero) {
        document.addEventListener('preloader:done', function () { gsap.delayedCall(0.35, play); });
      } else {
        ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: play });
      }
    });
  }

  /* ─── 8 · STAGGER GROUPS ────────────────────────── */
  function initStaggerGroups() {
    var staggerSel = '.persona-item,.welt-card,.testi,.achse,.ergebnis,.etappe,.fuerwen-col,.einwand';
    if (reduceMotion || !hasGSAP) {
      document.querySelectorAll(staggerSel).forEach(function (el) {
        el.style.opacity = 1; el.style.transform = 'none';
      });
      return;
    }
    var groups = [
      { parent: '.persona-list', items: '.persona-item', x: 0, y: 22 },
      { parent: '.welten-grid', items: '.welt-card', x: 0, y: 40 },
      { parent: '.testi-grid', items: '.testi', x: 0, y: 40 },
      { parent: '.achsen-grid', items: '.achse', x: 0, y: 34 },
      { parent: '.ergebnis-grid', items: '.ergebnis', x: 0, y: 36 },
      { parent: '.etappen', items: '.etappe', x: 0, y: 36 },
      { parent: '.fuerwen-grid', items: '.fuerwen-col', x: 0, y: 36 },
      { parent: '.einwand-list', items: '.einwand', x: 0, y: 30 }
    ];
    groups.forEach(function (g) {
      document.querySelectorAll(g.parent).forEach(function (parent) {
        var items = parent.querySelectorAll(g.items);
        if (!items.length) return;
        ScrollTrigger.create({
          trigger: parent, start: 'top 82%', once: true,
          onEnter: function () {
            gsap.to(items, { opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09 });
          }
        });
      });
    });
  }

  /* ─── 9 · MEGA QUOTES ───────────────────────────── */
  function initMegaQuotes() {
    if (reduceMotion || !hasGSAP) return;
    document.querySelectorAll('[data-mega]').forEach(function (el) {
      var inner = el.querySelector('.mega-quote-inner');
      if (!inner) return;
      gsap.set(inner, { scale: 0.86, opacity: 0, filter: 'blur(22px)' });
      ScrollTrigger.create({
        trigger: el, start: 'top 80%', once: true,
        onEnter: function () {
          gsap.to(inner, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.35, ease: 'expo.out' });
        }
      });
    });
  }

  /* ─── 10 · PARALLAX ─────────────────────────────── */
  function initParallax() {
    if (reduceMotion || !hasGSAP) return;
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var speed = parseFloat(el.dataset.parallax) || 0.12;
      gsap.to(el, {
        y: function () { return -innerHeight * speed; },
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.7 }
      });
    });
  }

  /* ─── 11 · AURORA CANVAS ────────────────────────── */
  function auroraCanvas(canvas, colors, count) {
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(devicePixelRatio || 1, 2);
    var w, h, orbs = [], t = 0, running = true, raf;

    function resize() {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    for (var i = 0; i < count; i++) {
      orbs.push({
        x: Math.random() * w, y: Math.random() * h,
        r: 200 + Math.random() * 260,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        color: colors[i % colors.length],
        phase: Math.random() * Math.PI * 2
      });
    }
    function draw() {
      if (!running) return;
      t += 0.005;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      orbs.forEach(function (o) {
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = w + o.r; if (o.x > w + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = h + o.r; if (o.y > h + o.r) o.y = -o.r;
        var r = o.r * (1 + Math.sin(t + o.phase) * 0.08);
        var g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
        g.addColorStop(0, o.color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(o.x, o.y, r, 0, Math.PI * 2); ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    window.addEventListener('resize', function () {
      cancelAnimationFrame(raf); resize();
      orbs.forEach(function (o) { o.x = Math.min(o.x, w); o.y = Math.min(o.y, h); });
      if (running) draw();
    });
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { if (!running) { running = true; draw(); } }
        else { running = false; cancelAnimationFrame(raf); }
      });
    }).observe(canvas);
    draw();
  }

  function initAurora() {
    if (reduceMotion) return;
    var deep = [
      'rgba(122,168,144,0.34)',
      'rgba(61,90,46,0.52)',
      'rgba(149,192,168,0.20)',
      'rgba(31,45,36,0.62)',
      'rgba(122,168,144,0.14)',
      'rgba(61,90,46,0.30)'
    ];
    auroraCanvas(document.getElementById('heroAurora'), deep, 6);
    auroraCanvas(document.getElementById('finalAurora'), deep, 5);
    auroraCanvas(document.getElementById('teaserAurora'), deep, 4);
  }

  /* ─── 12 · COUNTERS ─────────────────────────────── */
  function fmt(n) { return n >= 1000 ? n.toLocaleString('de-DE') : String(n); }
  function initCounters() {
    document.querySelectorAll('.counter').forEach(function (el) {
      var target = parseInt(el.dataset.target, 10);
      if (!target) return;
      if (reduceMotion) { el.textContent = fmt(target); return; }
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          obs.disconnect();
          var dur = 1900, start = performance.now();
          (function tick(now) {
            var p = Math.min(1, (now - start) / dur);
            var eased = 1 - Math.pow(1 - p, 4);
            el.textContent = fmt(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          })(start);
        });
      }, { threshold: 0.5 });
      obs.observe(el);
    });
  }

  /* ─── 13 · FAQ ──────────────────────────────────── */
  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var summary = item.querySelector('summary');
      var content = item.querySelector('.faq-content');
      if (!summary || !content) return;
      if (item.hasAttribute('open')) content.style.maxHeight = content.scrollHeight + 'px';
      summary.addEventListener('click', function (e) {
        e.preventDefault();
        if (item.hasAttribute('open')) {
          content.style.maxHeight = content.scrollHeight + 'px';
          requestAnimationFrame(function () { content.style.maxHeight = '0px'; });
          setTimeout(function () { item.removeAttribute('open'); }, 400);
        } else {
          item.setAttribute('open', '');
          content.style.maxHeight = '0px';
          requestAnimationFrame(function () { content.style.maxHeight = content.scrollHeight + 'px'; });
        }
      });
    });
  }

  /* ─── 14 · PHOTO REVEALS ────────────────────────── */
  function initPhotoReveals() {
    var hero = document.querySelector('.hero');
    if (hero) {
      document.addEventListener('preloader:done', function () {
        setTimeout(function () { hero.classList.add('is-in'); }, 150);
      });
    }
    var ueberPhoto = document.querySelector('.ueber-photo');
    if (ueberPhoto) {
      new IntersectionObserver(function (entries, o) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { ueberPhoto.classList.add('is-in'); o.disconnect(); }
        });
      }, { threshold: 0.25 }).observe(ueberPhoto);
    }
  }
})();
