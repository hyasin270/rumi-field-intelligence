/* Lohi Bher, 8 September — page behaviour. No dependencies. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raf = function (fn) { var t = false; return function () { if (t) return; t = true; requestAnimationFrame(function () { t = false; fn(); }); }; };

  /* ---- hero map: far → mid → near, by buttons and by time ---- */
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
    if (!reduce) { var i = 0; t0 = setInterval(function () { if (map.dataset.locked) return; i = (i + 1) % order.length; show(order[i]); }, 2600); }
    show('far');
    map.addEventListener('mouseenter', function () { if (t0) clearInterval(t0); });
  }

  /* ---- rail: which chapter is on screen, and how far through the day ---- */
  var chapters = Array.prototype.slice.call(document.querySelectorAll('.chapter[id]'));
  var stops = Array.prototype.slice.call(document.querySelectorAll('.rail .stop'));
  var fill = document.querySelector('.rail-fill');
  function setActive(id) { stops.forEach(function (s) { s.classList.toggle('on', s.getAttribute('href') === '#' + id); }); }
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

  /* ---- reveal (opacity only; from a visible resting state) ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    var vh = window.innerHeight;
    reveals.forEach(function (el) { if (el.getBoundingClientRect().top > vh) el.classList.add('pending'); });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pending'); ro.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* ---- folds: open the one a link points into; remember nothing ---- */
  function openFoldFor(hash) {
    if (!hash || hash.length < 2) return;
    var el = document.getElementById(hash.slice(1)); if (!el) return;
    var d = el.closest('details'); while (d) { d.open = true; d = d.parentElement && d.parentElement.closest('details'); }
  }
  openFoldFor(location.hash);
  window.addEventListener('hashchange', function () { openFoldFor(location.hash); });
  document.querySelectorAll('.fold').forEach(function (d) { d.addEventListener('toggle', function () { syncAll(); railFill(); }); });

  /* ---- the plan beside the room: one picture at a time, chosen by the entry at the reading line ---- */
  var splits = Array.prototype.slice.call(document.querySelectorAll('.split'));
  var syncers = splits.map(function (split) {
    var plan = split.querySelector('.plan'); if (!plan) return null;
    var segs = Array.prototype.slice.call(plan.querySelectorAll('.seg')); if (!segs.length) return null;
    var entries = Array.prototype.slice.call(split.querySelectorAll('.tl[data-seg]'));
    var head = document.createElement('div'); head.className = 'plan-head'; head.innerHTML = '<b></b><span class="min"></span>';
    var status = document.createElement('div'); status.className = 'plan-status';
    plan.insertBefore(head, plan.firstChild); plan.appendChild(status);
    var cur = null;
    function apply(seg, planState, note) {
      var key = seg + '|' + planState + '|' + (note || '');
      if (key === cur) return; cur = key;
      var fig = null;
      segs.forEach(function (f) { var on = f.dataset.seg === seg; f.classList.toggle('on', on); if (on) fig = f; });
      if (!fig) { fig = segs[0]; fig.classList.add('on'); }
      head.querySelector('b').textContent = fig.dataset.title || '';
      head.querySelector('.min').textContent = fig.dataset.min ? 'plan: ' + fig.dataset.min : '';
      var label = { missed: 'Skipped', tangent: 'Not in the plan', over: 'Running long', changed: 'Done differently', on: '' }[planState] || '';
      status.className = 'plan-status' + (label ? ' show ' + planState : '');
      status.innerHTML = label ? '<b>' + label + '</b>' + (note || '') : '';
    }
    function sync() {
      if (!entries.length) { apply(segs[0].dataset.seg, 'on', ''); return; }
      var line = window.innerHeight * (window.innerWidth < 960 ? 0.5 : 0.42);
      var pick = entries[0];
      for (var i = 0; i < entries.length; i++) { if (entries[i].getBoundingClientRect().top <= line) pick = entries[i]; else break; }
      apply(pick.dataset.seg, pick.dataset.plan || 'on', pick.dataset.planNote || '');
    }
    sync();
    return sync;
  }).filter(Boolean);
  function syncAll() { syncers.forEach(function (s) { s(); }); }
  var onScroll = raf(function () { railFill(); syncAll(); });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  railFill();

  /* ---- glossary tooltips on <abbr class="ind"> ---- */
  var tip = document.getElementById('ind-tip');
  var G = window.RUMI_GLOSSARY || {};
  function showTip(el) {
    var key = el.dataset.ind; var g = G[key]; if (!g || !tip) return;
    tip.innerHTML = '<b>' + key + (g.name ? ' · ' + g.name : '') + '</b>' + (g.plain || '');
    tip.hidden = false;
    var r = el.getBoundingClientRect(), w = Math.min(300, window.innerWidth - 24);
    var x = Math.max(12, Math.min(r.left, window.innerWidth - w - 12));
    var y = r.bottom + 8; if (y + 120 > window.innerHeight) y = r.top - tip.offsetHeight - 8;
    tip.style.left = x + 'px'; tip.style.top = Math.max(8, y) + 'px'; tip.style.maxWidth = w + 'px';
  }
  function hideTip() { if (tip) tip.hidden = true; }
  document.querySelectorAll('abbr.ind').forEach(function (el) {
    el.setAttribute('tabindex', '0');
    var g = G[el.dataset.ind]; if (g && g.name) el.title = g.name;
    el.addEventListener('mouseenter', function () { showTip(el); });
    el.addEventListener('mouseleave', hideTip);
    el.addEventListener('focus', function () { showTip(el); });
    el.addEventListener('blur', hideTip);
    el.addEventListener('click', function (e) { e.preventDefault(); if (tip && !tip.hidden && tip.dataset.for === el.dataset.ind + r(el)) hideTip(); else { showTip(el); if (tip) tip.dataset.for = el.dataset.ind + r(el); } });
  });
  function r(el) { return Math.round(el.getBoundingClientRect().top); }
  document.addEventListener('click', function (e) { if (!e.target.closest('abbr.ind')) hideTip(); });
  window.addEventListener('scroll', hideTip, { passive: true });

  /* ---- audio clips: one plays at a time; lazy-created Audio objects ---- */
  var current = null;
  function fmt(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  document.querySelectorAll('.clip').forEach(function (c) {
    var btn = c.querySelector('button'), bar = c.querySelector('.bar i'), time = c.querySelector('.time');
    var a = null;
    function ensure() {
      if (a) return a;
      a = new Audio(c.dataset.src); a.preload = 'none';
      a.addEventListener('timeupdate', function () { if (a.duration) { bar.style.width = (a.currentTime / a.duration * 100) + '%'; time.textContent = fmt(a.currentTime) + ' / ' + fmt(a.duration); } });
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

  /* ---- background: a quiet constellation of dots joined by small smiles (the Rumi mark) ---- */
  var cv = document.getElementById('bg');
  if (cv && cv.getContext) {
    var ctx = cv.getContext('2d'), dots = [], W = 0, H = 0, dark = false, last = 0, running = true;
    function theme() {
      var t = document.documentElement.getAttribute('data-theme');
      dark = t === 'dark' || (t !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    function size() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth; H = window.innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(48, (W * H) / 32000));
      while (dots.length < n) dots.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .12, vy: (Math.random() - .5) * .12, r: 1.2 + Math.random() * 1.8, p: Math.random() * 6.28 });
      dots.length = n;
    }
    function draw(t) {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      var col = dark ? '245,179,1' : '0,31,63';
      var dt = reduce ? 0 : Math.min(40, t - last); last = t;
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx * dt * .06; d.y += d.vy * dt * .06;
        if (d.x < -10) d.x = W + 10; if (d.x > W + 10) d.x = -10; if (d.y < -10) d.y = H + 10; if (d.y > H + 10) d.y = -10;
        var a = .18 + .12 * Math.sin(t / 1400 + d.p);
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fillStyle = 'rgba(' + col + ',' + a.toFixed(3) + ')'; ctx.fill();
      }
      // smiles: a curve under two dots that are close, fading with distance
      ctx.lineWidth = 1;
      for (var i = 0; i < dots.length; i++) for (var j = i + 1; j < dots.length; j++) {
        var a1 = dots[i], b1 = dots[j], dx = b1.x - a1.x, dy = b1.y - a1.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 150 || dist < 40) continue;
        var k = (1 - dist / 150) * .22;
        ctx.strokeStyle = 'rgba(' + col + ',' + k.toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.quadraticCurveTo((a1.x + b1.x) / 2, (a1.y + b1.y) / 2 + dist * .35, b1.x, b1.y); ctx.stroke();
      }
      if (!reduce) requestAnimationFrame(draw);
    }
    theme(); size(); requestAnimationFrame(draw);
    window.addEventListener('resize', function () { size(); if (reduce) requestAnimationFrame(draw); });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { theme(); if (reduce) requestAnimationFrame(draw); });
    document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running) { last = performance.now(); requestAnimationFrame(draw); } });
  }

  /* ---- sticky notes: shared, name required ---- */
  var cfg = window.RUMI_NOTES, form = document.getElementById('note-form'), wall = document.getElementById('wall'), fab = document.querySelector('.fab');
  if (form && wall && cfg && cfg.url && cfg.key) {
    var HDR = { 'apikey': cfg.key, 'Authorization': 'Bearer ' + cfg.key, 'Content-Type': 'application/json' };
    var chapterName = {}; form.querySelectorAll('select[name=chapter] option').forEach(function (o) { chapterName[o.value] = o.textContent; });
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function when(iso) { var d = new Date(iso); return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }); }
    function card(n, fresh) {
      var el = document.createElement('div'); el.className = 'sticky ' + (n.color || 'gold') + (fresh ? ' new' : '');
      el.innerHTML = '<div>' + esc(n.body) + '</div><div class="by"><b>' + esc(n.name) + '</b><span>' + (n.chapter && chapterName[n.chapter] ? esc(chapterName[n.chapter]) + ' · ' : '') + when(n.created_at) + '</span></div>';
      return el;
    }
    function load() {
      fetch(cfg.url + '/rest/v1/report_notes?report=eq.' + encodeURIComponent(cfg.report) + '&select=name,body,chapter,color,created_at&order=created_at.desc&limit=200', { headers: HDR })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (rows) {
          wall.innerHTML = '';
          if (!rows.length) { wall.innerHTML = '<p class="small">No notes yet. Yours will be the first.</p>'; return; }
          rows.forEach(function (n) { wall.appendChild(card(n, false)); });
        })
        .catch(function () { wall.innerHTML = '<p class="small">Notes could not be loaded right now. The rest of the page still works.</p>'; });
    }
    var loaded = false;
    if ('IntersectionObserver' in window) {
      var wo = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !loaded) { loaded = true; load(); wo.disconnect(); } }); }, { rootMargin: '400px 0px' });
      wo.observe(wall);
    } else { load(); }
    var body = form.querySelector('textarea[name=body]'), count = document.getElementById('note-count'), msg = document.getElementById('note-msg'), nameEl = form.querySelector('input[name=name]');
    try { var saved = localStorage.getItem('rumi-note-name'); if (saved) nameEl.value = saved; } catch (e) {}
    body.addEventListener('input', function () { count.textContent = body.value.length + ' / 280'; });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = nameEl.value.trim(), text = body.value.trim();
      if (name.length < 2) { msg.textContent = 'Please put your name on the note. It does not post without one.'; nameEl.focus(); return; }
      if (text.length < 2) { msg.textContent = 'Write something first.'; body.focus(); return; }
      var row = { report: cfg.report, chapter: form.chapter.value || null, name: name, body: text, color: form.color.value };
      var btn = form.querySelector('button[type=submit]'); btn.disabled = true; msg.textContent = 'Sticking it…';
      fetch(cfg.url + '/rest/v1/report_notes', { method: 'POST', headers: Object.assign({ 'Prefer': 'return=representation' }, HDR), body: JSON.stringify(row) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (rows) {
          var n = rows[0] || Object.assign({ created_at: new Date().toISOString() }, row);
          if (wall.querySelector('p')) wall.innerHTML = '';
          wall.insertBefore(card(n, true), wall.firstChild);
          body.value = ''; count.textContent = '0 / 280'; msg.textContent = 'Stuck. Thank you, ' + name + '.';
          try { localStorage.setItem('rumi-note-name', name); } catch (e2) {}
        })
        .catch(function () { msg.textContent = 'That did not post. Check your connection and try again.'; })
        .then(function () { btn.disabled = false; });
    });
    if (fab && 'IntersectionObserver' in window) {
      var fo = new IntersectionObserver(function (es) { es.forEach(function (e) { fab.classList.toggle('hide', e.isIntersecting); }); });
      fo.observe(form);
    }
  } else if (form) { form.hidden = true; if (wall) wall.innerHTML = '<p class="small">Notes are switched off on this copy of the page.</p>'; }
})();
