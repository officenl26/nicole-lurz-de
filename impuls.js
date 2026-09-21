// Impuls-Seiten: Zwei-Klick-Loesung fuer YouTube, Nav-Zustand, Reveal
document.addEventListener('DOMContentLoaded', function () {
  var yEl = document.getElementById('year');
  if (yEl) yEl.textContent = new Date().getFullYear();

  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 12); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Video laedt erst auf Klick. Vorher geht nichts an Google.
  document.querySelectorAll('.video[data-yt]').forEach(function (box) {
    var btn = box.querySelector('.video-play');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var id = box.getAttribute('data-yt');
      if (!id || id.indexOf('VIDEO-ID') === 0) {
        console.warn('Noch keine YouTube-ID hinterlegt.');
        return;
      }
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
      f.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.setAttribute('allowfullscreen', '');
      f.setAttribute('title', 'Video');
      box.innerHTML = '';
      box.appendChild(f);
    });
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8%' });
  document.querySelectorAll('[data-reveal]').forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
    io.observe(el);
  });
});
