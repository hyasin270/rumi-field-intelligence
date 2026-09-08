/* Lohi Bher, 8 September — page behaviour. No dependencies. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- hero map: far → mid → near, by buttons and by scroll ---- */
  var map = document.querySelector('.hero-map');
  if (map) {
    var imgs = { far: map.querySelector('img.far'), mid: map.querySelector('img.mid'), near: map.querySelector('img.near') };
    var btns = map.querySelectorAll('.zoom button');
    function show(k) {
      Object.keys(imgs).forEach(function (key) { if (imgs[key]) imgs[key].style.opacity = key === k ? 1 : 0; });
      btns.forEach(function (b) { b.classList.toggle('on', b.dataset.zoom === k); });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.zoom); map.dataset.locked = '1'; }); });
    var order = ['far', 'mid', 'near'], t0 = null;
    function auto() {
      if (map.dataset.locked || reduce) return;
      var i = 0;
      t0 = setInterval(function () { i = (i + 1) % order.length; show(order[i]); }, 2600);
    }
    show('far'); auto();
    map.addEventListener('mouseenter', function () { if (t0) clearInterval(t0); });
  }

  /* ---- rail: which chapter is on screen, and how far through the day ---- */
  var chapters = Array.prototype.slice.call(document.querySelectorAll('.chapter[id]'));
  var stops = Array.prototype.slice.call(document.querySelectorAll('.rail .stop'));
  var fill = document.querySelector('.rail-fill');
  function setActive(id) {
    stops.forEach(function (s) { s.classList.toggle('on', s.getAttribute('href') === '#' + id); });
  }
  if (chapters.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    chapters.forEach(function (c) { io.observe(c); });
  }
  function railFill() {
    if (!fill || !chapters.length) return;
    var first = chapters[0].getBoundingClientRect().top + window.scrollY;
    var last = chapters[chapters.length - 1].getBoundingClientRect().top + window.scrollY;
    var p = (window.scrollY + window.innerHeight * 0.5 - first) / (last - first);
    p = Math.max(0, Math.min(1, p));
    var line = document.querySelector('.rail-line');
    if (line) fill.style.height = (p * line.getBoundingClientRect().height) + 'px';
  }
  window.addEventListener('scroll', railFill, { passive: true });
  window.addEventListener('resize', railFill);
  railFill();

  /* ---- reveal (from a visible resting state) ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    var vh = window.innerHeight;
    reveals.forEach(function (el) { if (el.getBoundingClientRect().top > vh) el.classList.add('pending'); });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pending'); ro.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* ---- audio clips: one plays at a time; lazy-created Audio objects ---- */
  var current = null;
  function fmt(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  document.querySelectorAll('.clip').forEach(function (c) {
    var btn = c.querySelector('button'), bar = c.querySelector('.bar i'), time = c.querySelector('.time');
    var a = null;
    function ensure() {
      if (a) return a;
      a = new Audio(c.dataset.src); a.preload = 'none';
      a.addEventListener('timeupdate', function () {
        if (a.duration) { bar.style.width = (a.currentTime / a.duration * 100) + '%'; time.textContent = fmt(a.currentTime) + ' / ' + fmt(a.duration); }
      });
      a.addEventListener('ended', function () { btn.classList.remove('playing'); btn.textContent = '▶'; bar.style.width = '0'; if (current === a) current = null; });
      a.addEventListener('loadedmetadata', function () { time.textContent = '0:00 / ' + fmt(a.duration); });
      return a;
    }
    btn.addEventListener('click', function () {
      var x = ensure();
      if (current && current !== x) { current.pause(); document.querySelectorAll('.clip button.playing').forEach(function (b) { b.classList.remove('playing'); b.textContent = '▶'; }); }
      if (x.paused) { x.play(); btn.classList.add('playing'); btn.textContent = '❚❚'; current = x; }
      else { x.pause(); btn.classList.remove('playing'); btn.textContent = '▶'; }
    });
  });
})();
