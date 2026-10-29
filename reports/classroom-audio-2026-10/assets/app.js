/* Can Rumi hear the classroom? (artefact lane, round 6). One static page: no network, works from file:// and from the
   Pages folder. Data arrives as script files (assets/data/site.js sets window.WAVE; each lesson file calls
   window.WAVE_LESSON(obj)) because file:// cannot fetch JSON. Audio is always set as assets/clips/audio/<id>.mp3 so the
   published copy's seal shim can swap a sealed clip for its decrypted blob. */
(function () {
  "use strict";
  var W = window.WAVE || {};
  var META = W.meta || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var COL = { teacher: "#001F3F", child: "#F06E42", chorus: "#F06E42", silence: "#E5E7EB", chatter: "#A3A9B6",
    T: "#4A5A78", S: "#E89A7C", line: "#E3E6EC", quiet: "#5B6475", ink: "#1D2025" };
  var CLASS_NAME = { teacher: "Teacher", child: "One child", chorus: "Chorus", silence: "Silence", chatter: "Chatter / far talk" };

  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "text") e.textContent = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else if (k === "class") e.className = attrs[k];
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== null && attrs[k] !== undefined && attrs[k] !== false) e.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  function fmt(t) {
    t = Math.max(0, t || 0);
    var m = Math.floor(t / 60), s = Math.floor(t % 60);
    if (m >= 60) return Math.floor(m / 60) + ":" + pad(m % 60) + ":" + pad(s);
    return m + ":" + pad(s);
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function clipSrc(id) { return "assets/clips/audio/" + id + ".mp3"; }
  function sealedLocked(a) { return !!(window.__seal && !window.__seal.unlocked() && a.getAttribute("data-sealed")); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function isRTL(s) { return /[؀-ۿ]/.test(s || ""); }

  /* ---------- small clip player shared by cards, grid, evidence ---------- */
  var clipAudio = new Audio();
  clipAudio.preload = "none";
  var clipBtn = null;
  function stopClip() { clipAudio.pause(); if (clipBtn) clipBtn.classList.remove("playing"); clipBtn = null; }
  clipAudio.addEventListener("ended", stopClip);
  function clipButton(c, label) {
    if (!c || !c.id) return null;
    var b = el("button", { class: "clip" + (c.child ? " child" : ""), type: "button", "data-src": clipSrc(c.id),
      "data-lesson": c.lesson || null, "data-start": c.start != null ? c.start : null, "data-end": c.end != null ? c.end : null },
      [el("span", { class: "pi", "aria-hidden": "true" }), el("span", { text: label || c.label || "Play" }),
       c.lesson ? el("small", { text: c.lesson + (c.start != null ? " " + fmt(c.start) : "") }) : null]);
    b.setAttribute("aria-label", "Play: " + (label || c.label || "clip") + (c.lesson ? ", lesson " + c.lesson : ""));
    b.addEventListener("click", function () {
      if (clipBtn === b) { stopClip(); return; }
      stopClip(); Ex.pause();
      clipAudio.src = clipSrc(c.id);
      clipBtn = b; b.classList.add("playing");
      if (sealedLocked(clipAudio)) { b.classList.remove("playing"); clipBtn = null; flashSeal(); return; }
      var p = clipAudio.play(); if (p && p.catch) p.catch(function () { b.classList.remove("playing"); });
    });
    return b;
  }
  function flashSeal() {
    var bar = $("#seal-bar"); if (!bar) return;
    bar.scrollIntoView({ block: "start" }); var i = $("#seal-pw"); if (i) i.focus();
  }

  /* ---------- header and (a) ---------- */
  function renderHeader() {
    if (W.hero && W.hero.sub) $("#hero-sub").textContent = W.hero.sub;
    var chips = $("#hero-chips");
    (W.answers || []).forEach(function (a, i) {
      chips.appendChild(el("a", { class: "chip", href: a.link || "#d" }, [el("span", { class: "dot " + (a.status || "tbd"), "aria-hidden": "true" }),
        el("b", { text: a.short || ("Q" + (i + 1)) }), el("span", { text: a.chip || statusWord(a.status) })]));
    });
    $("#copy-note").textContent = META.copy === "published"
      ? "This copy plays short windows only, with spoken names muted. Children's sound is sealed: type the password you were sent."
      : "Laptop copy: it plays whole lessons from the drive. Do not share this folder.";
    if (META.built) $("#foot-txt").textContent = "Rumi, classroom audio study, round 6. Build " + META.built + ".";
  }
  function statusWord(s) { return s === "yes" ? "yes" : s === "no" ? "no" : s === "ns" ? "not shown" : ""; }
  function renderAnswers() {
    var box = $("#answer-cards");
    (W.answers || []).forEach(function (a) {
      box.appendChild(el("article", { class: "card" }, [
        el("p", { class: "q" }, [el("b", { text: a.short + ". " }), "“" + a.quote + "”"]),
        el("p", { class: "ans" }, [el("span", { class: "dot " + (a.status || "tbd"), "aria-hidden": "true" }),
          el("span", { text: a.answer || "" })]),
        a.number ? el("p", { class: "num", html: a.number }) : null,
        el("div", { class: "row" }, [clipButton(a.clip, a.clip && a.clip.label), el("a", { class: "more", href: a.link || "#d", text: "See the evidence" })])
      ]));
    });
  }

  /* ---------- (b) explorer ---------- */
  var Ex = (function () {
    var audio = $("#ex-audio");
    var S = { lesson: null, data: null, mode: "raw", zoom: 0, v0: 0, v1: 1, t: 0, playing: false, seg: null, want: null,
      rate: 1, recon: null, pitchBy: null, follow: true, lineIdx: -1, phIdx: -1 };
    var cache = {}, tiles = {}, pending = {};
    var trk = {}; $$(".trk").forEach(function (d) { trk[d.getAttribute("data-trk")] = { box: d, cv: $("canvas", d) }; });
    var tracksEl = $("#tracks"), ph = $("#playhead"), tip = $("#hover-tip");
    var hatch = null;

    function lessons() { return W.lessons || []; }
    function segs() { var L = S.lesson; return (L && L.audio && L.audio[S.mode]) || []; }
    function segAt(t) { var a = segs(); for (var i = 0; i < a.length; i++) if (t >= a[i].start - 0.01 && t < a[i].end) return a[i]; return null; }
    function nextSeg(t) { var a = segs(); for (var i = 0; i < a.length; i++) if (a[i].start >= t - 0.01) return a[i]; return null; }

    function load(id) {
      var L = lessons().filter(function (x) { return x.id === id; })[0]; if (!L) return;
      pause();
      S.lesson = L; S.data = null; S.t = 0; S.seg = null; S.lineIdx = -1; S.phIdx = -1;
      $$(".lp").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-id") === id ? "true" : "false"); });
      $("#ex-why").textContent = (L.why || "") + (L.pubnote ? " " + L.pubnote : "");
      var lifted = (L.audio && L.audio.lifted && L.audio.lifted.length);
      $("#ex-lifted").disabled = !lifted;
      $("#ex-lifted").title = lifted ? "" : "The lifted sound for this lesson is not on this copy";
      if (!lifted && S.mode === "lifted") setMode("raw", true);
      store("wave.lesson", id);
      if (cache[id]) return ready(cache[id]);
      $("#ex-status").textContent = "Loading lesson…";
      pending[id] = true;
      var s = document.createElement("script"); s.src = "assets/data/lesson/" + id + ".js";
      s.onerror = function () { $("#ex-status").textContent = "This lesson's data is not on this copy."; };
      document.body.appendChild(s);
    }
    window.WAVE_LESSON = function (d) { cache[d.id] = d; if (S.lesson && S.lesson.id === d.id) ready(d); };
    function ready(d) {
      S.data = d; S.dur = d.duration || S.lesson.duration;
      var inputs = Object.keys(d.recon || {});
      S.recon = inputs.indexOf("TA") >= 0 ? "TA" : inputs[0] || null;
      S.pitchBy = (d.lanes && d.lanes.acoustic && d.lanes.acoustic.length) ? "acoustic" : "soniox";
      setZoom(S.zoom, true);
      renderTranscript(); renderRecon(); renderLegend();
      $("#ex-status").textContent = "";
      jumpState();
      draw(); placeHead();
    }

    /* audio */
    function setSrcFor(t, autoplay) {
      var sg = segAt(t);
      if (!sg) { S.seg = null; return false; }
      if (!S.seg || S.seg.id !== sg.id) {
        S.seg = sg; S.want = t - sg.start;
        audio.src = clipSrc(sg.id); audio.playbackRate = S.rate;
        if (sealedLocked(audio)) { S.seg = null; $("#ex-status").textContent = "Sealed: type the password at the top of the page to hear the children."; return false; }
        audio.load();
      } else {
        try { audio.currentTime = t - sg.start; } catch (e) { S.want = t - sg.start; }
      }
      if (autoplay) { var p = audio.play(); if (p && p.catch) p.catch(function () { setPlaying(false); }); }
      return true;
    }
    audio.addEventListener("loadedmetadata", function () {
      if (S.want != null) { try { audio.currentTime = S.want; } catch (e) {} S.want = null; }
      audio.playbackRate = S.rate;
    });
    audio.addEventListener("ended", function () {
      if (!S.seg) return;
      var nx = nextSeg(S.seg.end);
      if (nx && S.playing) { S.t = nx.start; S.seg = null; setSrcFor(nx.start, true); }
      else setPlaying(false);
    });
    audio.addEventListener("pause", function () { if (!audio.ended && S.playing && !S.switching) setPlaying(false); });
    function setPlaying(p) {
      S.playing = p; var b = $("#ex-play"); b.textContent = p ? "Pause" : "Play"; b.setAttribute("aria-label", p ? "Pause" : "Play");
      if (p) requestAnimationFrame(tick);
    }
    function play() {
      if (!S.data) return;
      stopClip();
      var t = S.t;
      if (!segAt(t)) { var nx = nextSeg(t) || segs()[0]; if (!nx) { $("#ex-status").textContent = "No sound for this lesson on this copy."; return; }
        if (nx.start > t + 0.5) $("#ex-status").textContent = "No sound for that stretch on this copy; playing the next window.";
        t = nx.start; S.t = t; }
      S.switching = true;
      var ok = setSrcFor(t, true);
      S.switching = false;
      if (ok) setPlaying(true);
    }
    function pause() { if (S.playing) { S.playing = false; audio.pause(); setPlaying(false); } }
    function toggle() { S.playing ? pause() : play(); }
    function seek(t) {
      if (!S.data) return;
      t = Math.max(0, Math.min(S.dur - 0.05, t)); S.t = t;
      if (segAt(t)) { S.switching = true; setSrcFor(t, S.playing); S.switching = false; $("#ex-status").textContent = ""; }
      else if (S.playing) { pause(); $("#ex-status").textContent = "No sound for this stretch on this copy. Press play for the next window."; }
      else { $("#ex-status").textContent = segs().length ? "" : "No sound for this lesson on this copy."; }
      ensureVisible(true); placeHead(); syncSide();
    }
    function tick() {
      if (!S.playing) return;
      if (S.seg && !audio.seeking && audio.readyState >= 1) S.t = S.seg.start + audio.currentTime;
      ensureVisible(false); placeHead(); syncSide();
      requestAnimationFrame(tick);
    }
    function setMode(m, quiet) {
      if (m === S.mode) return;
      S.mode = m;
      $$("[data-mode]").forEach(function (b) { var on = b.getAttribute("data-mode") === m; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
      if (quiet || !S.data) return;
      var was = S.playing; S.seg = null; S.switching = true;
      if (segAt(S.t)) setSrcFor(S.t, was); else if (was) { pause(); }
      S.switching = false;
      $("#ex-status").textContent = m === "lifted" ? "Child lifted: same seconds; only the quiet single answers are raised (marked on the waveform). Machines heard no more words in them; your ears decide in section (e)." : "";
    }

    /* view */
    function setZoom(z, keep) {
      S.zoom = z;
      $$("[data-zoom]").forEach(function (b) { b.classList.toggle("on", +b.getAttribute("data-zoom") === z); });
      if (!S.data) return;
      var span = z ? Math.min(z, S.dur) : S.dur;
      var v0 = z ? S.t - span / 2 : 0;
      setView(v0, span);
    }
    function setView(v0, span) {
      span = Math.max(5, Math.min(S.dur, span));
      v0 = Math.max(0, Math.min(S.dur - span, v0));
      S.v0 = v0; S.v1 = v0 + span; draw(); placeHead();
    }
    function ensureVisible(center) {
      var span = S.v1 - S.v0;
      if (S.t < S.v0 || S.t > S.v1 - span * 0.04) {
        setView(center ? S.t - span / 2 : S.t - span * 0.08, span);
      }
    }
    function xOf(t, w) { return (t - S.v0) / (S.v1 - S.v0) * w; }
    function tOf(x, w) { return S.v0 + x / w * (S.v1 - S.v0); }
    function placeHead() {
      var w = tracksEl.clientWidth;
      var x = xOf(S.t, w);
      ph.style.display = (x < 0 || x > w) ? "none" : "block";
      ph.style.transform = "translateX(" + Math.round(x - 1) + "px)";
      $("#ex-clock").textContent = fmt(S.t) + " / " + fmt(S.dur || 0);
    }

    function prep(c) {
      var cv = c.cv, r = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
      if (cv.width !== Math.round(w * r) || cv.height !== Math.round(h * r)) { cv.width = Math.round(w * r); cv.height = Math.round(h * r); }
      var g = cv.getContext("2d"); g.setTransform(r, 0, 0, r, 0, 0); g.clearRect(0, 0, w, h);
      return { g: g, w: w, h: h };
    }
    function note(g, w, h, s) { g.fillStyle = COL.quiet; g.font = "12px Inter, sans-serif"; g.textAlign = "center"; g.fillText(s, w / 2, h / 2 + 8); g.textAlign = "left"; }
    function laneAt(arr, t) {
      if (!arr) return null;
      var lo = 0, hi = arr.length - 1;
      while (lo <= hi) { var m = (lo + hi) >> 1; if (arr[m][1] <= t) lo = m + 1; else if (arr[m][0] > t) hi = m - 1; else return arr[m]; }
      return null;
    }

    function draw() {
      if (!S.data) return;
      drawWave(); drawSpec(); drawPitch(); drawLanes(); drawPhases(); drawAxis();
    }
    function drawWave() {
      var c = prep(trk.wave), g = c.g, w = c.w, h = c.h, p = S.data.peaks; if (!p) return note(g, w, h, "No waveform");
      var hop = p.hop, v = p.v, mid = h / 2 + 6, amp = (h - 22) / 2, ac = S.data.lanes && S.data.lanes.acoustic;
      var sg = segs(), cover = sg.reduce(function (a, s) { return a + s.end - s.start; }, 0);
      if (sg.length && cover < S.dur * 0.95) {      // published copy: mark the playable windows
        g.fillStyle = "rgba(240,110,66,.12)";
        sg.forEach(function (s) { var x0 = xOf(s.start, w), x1 = xOf(s.end, w); if (x1 > 0 && x0 < w) { g.fillRect(x0, 0, Math.max(2, x1 - x0), h); } });
        g.fillStyle = COL.child; g.font = "10px Inter, sans-serif";
        sg.forEach(function (s) { var x0 = xOf(s.start, w); if (x0 > -40 && x0 < w - 60) g.fillText("plays here", Math.max(2, x0 + 3), h - 3); });
      }
      for (var x = 0; x < w; x++) {
        var a = tOf(x, w), b = tOf(x + 1, w), i0 = Math.floor(a / hop), i1 = Math.max(i0 + 1, Math.ceil(b / hop)), m = 0;
        for (var i = i0; i < i1 && i < v.length; i++) if (v[i] > m) m = v[i];
        if (!m) continue;
        var cls = ac && ac.length ? laneAt(ac, (a + b) / 2) : null;
        g.fillStyle = cls ? (cls[2] === "child" || cls[2] === "chorus" ? COL.child : cls[2] === "teacher" ? COL.teacher : COL.chatter) : COL.teacher;
        var hh = Math.max(1, m / 255 * amp); g.fillRect(x, mid - hh, 1, hh * 2);
      }
      var lf = (S.data.lanes && S.data.lanes.lifted) || [];      // the seconds the lift touches (enhance lane)
      g.font = "10px Inter, sans-serif";
      lf.forEach(function (s) {
        if (s[1] < S.v0 || s[0] > S.v1) return;
        var x0 = xOf(s[0], w), x1 = Math.max(x0 + 3, xOf(s[1], w));
        g.fillStyle = S.mode === "lifted" ? COL.child : "rgba(240,110,66,.55)"; g.fillRect(x0, 14, x1 - x0, 4);
        if (x1 - x0 > 30 || S.v1 - S.v0 <= 60) g.fillText("lifted +" + Math.round(s[2]) + " dB", x0, 11);
      });
    }
    function drawSpec() {
      var c = prep(trk.spec), g = c.g, w = c.w, h = c.h, sp = S.data.spec; if (!sp) return note(g, w, h, "No spectrogram");
      var id = S.data.id, top = 18, hh = h - top;
      g.fillStyle = "#FFFFFF"; g.fillRect(0, top, w, hh);
      var k0 = Math.max(0, Math.floor(S.v0 / sp.tile)), k1 = Math.min(sp.n - 1, Math.floor(S.v1 / sp.tile));
      for (var k = k0; k <= k1; k++) {
        var key = id + "/" + k, im = tiles[key];
        if (!im) { im = tiles[key] = new Image(); im.onload = function () { if (S.data && S.data.id === id) drawSpec(); }; im.src = "assets/spec/" + id + "/" + ("00" + k).slice(-3) + ".png"; }
        if (!im.complete || !im.naturalWidth) continue;
        var t0 = k * sp.tile, t1 = t0 + im.naturalWidth / sp.pxs;
        var a = Math.max(t0, S.v0), b = Math.min(t1, S.v1); if (b <= a) continue;
        var sx = (a - t0) * sp.pxs, sw = (b - a) * sp.pxs, dx = xOf(a, w), dw = xOf(b, w) - dx;
        g.drawImage(im, sx, 0, Math.max(0.5, sw), im.naturalHeight, dx, top, dw + 0.5, hh);
      }
    }
    var FMIN = 70, FMAX = 600;
    function yHz(f, h) { var top = 18, bot = h - 4; return bot - (Math.log(f / FMIN) / Math.log(FMAX / FMIN)) * (bot - top); }
    function drawPitch() {
      var c = prep(trk.pitch), g = c.g, w = c.w, h = c.h, P = S.data.pitch; if (!P) return note(g, w, h, "No pitch track");
      (h >= 80 ? [100, 200, 400] : [100, 400]).forEach(function (f) { var y = yHz(f, h); g.strokeStyle = COL.line; g.lineWidth = 1; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke();
        g.fillStyle = COL.quiet; g.font = "10px Inter, sans-serif"; g.fillText(f + " Hz", w - 42, y + (f === 100 ? -2 : 10)); });
      var B = S.data.bands;
      if (B) [["teacher", "rgba(0,31,63,.10)", COL.teacher], ["child", "rgba(240,110,66,.14)", COL.child]].forEach(function (z) {
        var q = B[z[0]]; if (!q) return;
        var ya = yHz(q[2], h), yb = yHz(q[0], h); g.fillStyle = z[1]; g.fillRect(0, ya, w, yb - ya);
        g.strokeStyle = z[2]; g.setLineDash([4, 3]); g.beginPath(); g.moveTo(0, yHz(q[1], h)); g.lineTo(w, yHz(q[1], h)); g.stroke(); g.setLineDash([]);
      });
      var hop = P.hop, f0 = P.f0, i0 = Math.max(0, Math.floor(S.v0 / hop)), i1 = Math.min(f0.length, Math.ceil(S.v1 / hop));
      var lanes = S.data.lanes || {}, by = S.pitchBy === "acoustic" ? lanes.acoustic : lanes.soniox;
      var n = i1 - i0, step = Math.max(1, Math.floor(n / (w * 3))), r = n / w > 4 ? 1 : 1.6;
      g.globalAlpha = n / w > 4 ? 0.45 : 0.85;
      for (var i = i0; i < i1; i += step) {
        var f = f0[i]; if (!f) continue;
        var t = i * hop, L = by && laneAt(by, t), k = L ? L[2] : null;
        g.fillStyle = !k ? "#7A8396" : (k === "teacher" || k === "T") ? COL.teacher : (k === "S" || k === "child" || k === "chorus") ? COL.child : COL.chatter;
        g.fillRect(xOf(t, w) - r / 2, yHz(Math.min(FMAX, Math.max(FMIN, f)), h) - r / 2, r, r);
      }
      g.globalAlpha = 1;
    }
    function hatchPat(g) {
      if (hatch) return hatch;
      var c = document.createElement("canvas"); c.width = c.height = 8; var x = c.getContext("2d");
      x.fillStyle = "#FBD3C4"; x.fillRect(0, 0, 8, 8); x.strokeStyle = COL.child; x.lineWidth = 2.2;
      x.beginPath(); x.moveTo(-2, 10); x.lineTo(10, -2); x.moveTo(-2, 2); x.lineTo(2, -2); x.moveTo(6, 10); x.lineTo(10, 6); x.stroke();
      hatch = g.createPattern(c, "repeat"); return hatch;
    }
    function rows(h) {
      var top = 18, rowsH = h - top - 4, u = rowsH / 8.6;
      return { teacher: [top, u], child: [top + u * 1.05, u], chorus: [top + u * 2.1, u], other: [top + u * 3.15, u],
        soniox: [top + u * 4.55, u * 1.1], disagree: [top + u * 5.85, u * 1.1], named: [top + u * 7.15, u * 1.1] };
    }
    function drawLanes() {
      var c = prep(trk.lanes), g = c.g, w = c.w, h = c.h, L = S.data.lanes || {}, R = rows(h);
      g.font = "10px Inter, sans-serif";
      function band(arr, rowOf, colOf) {
        for (var i = 0; i < arr.length; i++) {
          var s = arr[i]; if (s[1] < S.v0 || s[0] > S.v1) continue;
          var rr = rowOf(s[2]); if (!rr) continue;
          var x0 = xOf(s[0], w), x1 = xOf(s[1], w); g.fillStyle = colOf(s[2], g); g.fillRect(x0, rr[0], Math.max(1, x1 - x0), rr[1]);
        }
      }
      var ac = L.acoustic || [];
      g.fillStyle = "#F4F5F8"; ["teacher", "child", "chorus", "other"].forEach(function (k) { g.fillRect(0, R[k][0], w, R[k][1]); });
      if (ac.length) band(ac, function (k) { return R[k === "silence" || k === "chatter" ? "other" : k]; },
        function (k, gg) { return k === "chorus" ? hatchPat(gg) : COL[k] || COL.chatter; });
      else { g.fillStyle = COL.quiet; g.font = "11px Inter, sans-serif"; g.fillText("No waveform lanes for this lesson", 8, R.child[0] + R.child[1]); g.font = (h < 120 ? "9px" : "10px") + " Inter, sans-serif"; }
      band(L.soniox || [], function () { return R.soniox; }, function (k) { return COL[k] || COL.chatter; });
      // where the voice and today's transcript disagree (R6-C3): where a person's ear is worth most
      g.fillStyle = "#B5451F";
      ac.forEach(function (s) { if (s[1] < S.v0 || s[0] > S.v1 || !disagrees(s, L.soniox || [])) return; var x0 = xOf(s[0], w); g.fillRect(x0, R.disagree[0], Math.max(2, xOf(s[1], w) - x0), R.disagree[1]); });
      g.fillStyle = COL.child;
      (L.named || []).forEach(function (s) { if (s[1] < S.v0 || s[0] > S.v1) return; var x0 = xOf(s[0], w); g.fillRect(x0, R.named[0], Math.max(2, xOf(s[1], w) - x0), R.named[1]); });
      // row labels with a white halo
      [["teacher", "Teacher"], ["child", "One child"], ["chorus", "Chorus"], ["other", "Silence / chatter"], ["soniox", "Transcript says"], ["disagree", "They disagree: listen here"], ["named", "Named child"]].forEach(function (z) {
        var y = R[z[0]][0] + R[z[0]][1] / 2 + 3.5;
        g.lineWidth = 3; g.strokeStyle = "rgba(255,255,255,.9)"; g.strokeText(z[1], w - 4 - g.measureText(z[1]).width, y);
        g.fillStyle = COL.quiet; g.fillText(z[1], w - 4 - g.measureText(z[1]).width, y);
      });
    }
    var PH_COL = ["#DCE3EE", "#C3CEDF", "#E8ECF3", "#B3C1D6", "#D0D9E7", "#EEF1F6"];
    var EV_COL = { question: COL.teacher, "wrong answer": COL.child, "child answers child": COL.child, "name called": "#B5451F", "switch": "#7A8396" };
    function drawPhases() {
      var c = prep(trk.phases), g = c.g, w = c.w, h = c.h, R = S.recon && S.data.recon && S.data.recon[S.recon];
      if (!R) return note(g, w, h, "The LLM's timeline arrives with the infer lane");
      var top = 18, ph = (R.phases || []);
      g.font = "11px Inter, sans-serif";
      ph.forEach(function (p, i) {
        if (p[1] < S.v0 || p[0] > S.v1) return;
        var x0 = Math.max(0, xOf(p[0], w)), x1 = Math.min(w, xOf(p[1], w));
        g.fillStyle = PH_COL[i % PH_COL.length]; g.fillRect(x0, top, x1 - x0 - 1, h - top - 26);
        g.fillStyle = COL.teacher;
        var name = p[2]; if (g.measureText(name).width < x1 - x0 - 8) g.fillText(name, x0 + 4, top + 14);
      });
      (R.events || []).forEach(function (e) {
        if (e[0] < S.v0 || e[0] > S.v1) return;
        var x = xOf(e[0], w), y = h - 20, ty = String(e[1]);
        g.fillStyle = /question/.test(ty) ? COL.teacher : /chorus|child|answer|wrong/.test(ty) ? COL.child : /name/.test(ty) ? "#B5451F" : "#7A8396";
        g.beginPath(); g.moveTo(x, y); g.lineTo(x - 4, y + 9); g.lineTo(x + 4, y + 9); g.closePath(); g.fill();
      });
    }
    function drawAxis() {
      var ax = $("#axis"), w = tracksEl.clientWidth, span = S.v1 - S.v0;
      var steps = [1, 2, 5, 10, 15, 30, 60, 120, 300, 600], st = steps.filter(function (s) { return span / s <= Math.max(4, w / 90); })[0] || 600;
      ax.textContent = "";
      for (var t = Math.ceil(S.v0 / st) * st; t <= S.v1; t += st) { var x = xOf(t, w); if (x < 14 || x > w - 14) continue; ax.appendChild(el("span", { text: fmt(t) })).style.left = x + "px"; }
    }

    /* side panels */
    function renderTranscript() {
      var box = $("#tx"); box.textContent = "";
      var T = S.data.transcript || [];
      if (!T.length) { box.appendChild(el("div", { class: "tx-empty", text: META.copy === "published" ? "On this copy the transcript shows only the lines inside the playable windows." : "No transcript for this lesson." })); return; }
      T.forEach(function (r, i) {
        var who = r[2] || "", child = who !== "Teacher";
        box.appendChild(el("div", { class: "ln", "data-i": i, tabindex: "-1", onclick: function () { seek(r[0]); } }, [
          el("span", { class: "t", text: fmt(r[0]) }),
          el("div", null, [el("div", { class: "who" + (child ? " s" : ""), text: who }),
            el("div", { class: "tx", dir: isRTL(r[3]) ? "rtl" : "ltr", lang: isRTL(r[3]) ? (S.lesson.lang || "ur") : null, text: r[3] }),
            r[4] ? el("div", { class: "gl", text: r[4] }) : null])
        ]));
      });
    }
    function renderRecon() {
      var tabs = $("#rc-inputs"), body = $("#rc-body"); tabs.textContent = ""; body.textContent = "";
      var R = S.data.recon || {}, keys = ["TA", "TA2", "T", "A"].filter(function (k) { return R[k]; });
      if (!keys.length) { body.appendChild(el("div", { class: "tx-empty", text: "The LLM's account of this lesson (phases, events, a one-line summary per phase) arrives with the infer lane." })); return; }
      var NAMES = { TA: "Transcript + sound's numbers", TA2: "Transcript + voice per line", T: "Transcript only", A: "A model hearing the audio" };
      keys.forEach(function (k) {
        tabs.appendChild(el("button", { class: "seg-b" + (k === S.recon ? " on" : ""), type: "button", onclick: function () { S.recon = k; renderRecon(); drawPhases(); } }, [NAMES[k]]));
      });
      var cur = R[S.recon];
      if (cur.summary) body.appendChild(el("p", { class: "rc-sum", text: cur.summary }));
      (cur.phases || []).forEach(function (p, i) {
        body.appendChild(el("div", { class: "ph", "data-i": i, onclick: function () { seek(p[0]); } }, [
          el("b", { text: p[2] }), el("span", { class: "t", text: fmt(p[0]) + " to " + fmt(p[1]) }), p[3] ? el("p", { text: p[3] }) : null]));
      });
      if ((cur.events || []).length) {
        body.appendChild(el("p", { class: "rc-sum", html: "<b>Moments it marked</b>" }));
        cur.events.forEach(function (e) {
          body.appendChild(el("div", { class: "ln", onclick: function () { seek(e[0]); } }, [el("span", { class: "t", text: fmt(e[0]) }),
            el("div", null, [el("div", { class: "who", text: e[1] }), el("div", { class: "tx", text: e[2] || "" })])]));
        });
      }
      S.phIdx = -1;
    }
    // Measured from the box, not the page; a jump longer than the box lands at once (a seek), short steps glide.
    function followLine(box, cur) {
      var d = cur.getBoundingClientRect().top - box.getBoundingClientRect().top - (cur.offsetHeight > box.clientHeight * 2 / 3 ? 8 : box.clientHeight / 3);
      box.scrollTo({ top: box.scrollTop + d, behavior: Math.abs(d) > box.clientHeight ? "instant" : "smooth" });
    }
    function syncSide() {
      if (!S.data) return;
      var T = S.data.transcript || [], t = S.t, lo = 0, hi = T.length - 1, idx = -1;
      while (lo <= hi) { var m = (lo + hi) >> 1; if (T[m][0] <= t) { idx = m; lo = m + 1; } else hi = m - 1; }
      if (idx !== S.lineIdx) {
        var box = $("#tx"), old = $(".ln.cur", box); if (old) old.classList.remove("cur");
        var cur = idx >= 0 ? box.querySelector('.ln[data-i="' + idx + '"]') : null;
        if (cur) { cur.classList.add("cur"); if (S.follow && !box.hidden) followLine(box, cur); }
        S.lineIdx = idx;
      }
      var R = S.recon && S.data.recon && S.data.recon[S.recon], pi = -1;
      if (R) (R.phases || []).forEach(function (p, i) { if (t >= p[0] && t < p[1]) pi = i; });
      if (pi !== S.phIdx) { $$("#rc-body .ph").forEach(function (d) { d.classList.toggle("cur", +d.getAttribute("data-i") === pi); }); S.phIdx = pi; }
    }
    function renderLegend() {
      var lg = $("#legend"); lg.textContent = "";
      var by = S.pitchBy === "acoustic" ? "the waveform lanes" : "the transcript's label";
      [["teacher", "Teacher"], ["child", "One child"], ["chorus", "Chorus (hatched)"], ["silence", "Silence"], ["chatter", "Chatter / far talk"]].forEach(function (z) {
        lg.appendChild(el("span", null, [el("i", { class: z[0] === "chorus" ? "hatch" : "", style: z[0] === "chorus" ? null : "background:" + COL[z[0]] }), z[1]]));
      });
      var sw = el("button", { class: "btn ghost", type: "button", style: "min-height:30px;padding:3px 10px;font-size:13px",
        title: "Switch what colours the pitch dots",
        onclick: function () { if (S.data.lanes.acoustic && S.data.lanes.acoustic.length) { S.pitchBy = S.pitchBy === "acoustic" ? "soniox" : "acoustic"; renderLegend(); drawPitch(); } } },
        ["Pitch dots coloured by " + by]);
      if (!(S.data.lanes.acoustic && S.data.lanes.acoustic.length)) sw.disabled = true;
      lg.appendChild(sw);
      lg.appendChild(el("span", { text: "Transcript row: dark = Teacher, light coral = Student." }));
      lg.appendChild(el("span", null, [el("i", { style: "background:#B5451F" }), "They disagree: the voice and today's transcript give different speakers. Where they agree they are right 90 times in 100; where they disagree, this is where a person's ear is worth most."]));
    }

    /* jumps */
    function jumpState() {
      var ac = (S.data && S.data.lanes && S.data.lanes.acoustic) || [], lf = (S.data && S.data.lanes && S.data.lanes.lifted) || [];
      $$("[data-jump]").forEach(function (b) {
        var ok = b.getAttribute("data-jump") === "lifted" ? lf.length : ac.length;
        b.disabled = !ok; b.title = ok ? "" : b.getAttribute("data-jump") === "lifted" ? "The lift touches no seconds in this lesson" : "Needs the waveform lanes (acoustics lane)"; });
    }
    function jump(kind) {
      var L = S.data.lanes, ac = L.acoustic || [], t = S.t + 0.5;
      if (kind === "lifted") {
        var lf = L.lifted || [];
        for (var j = 0; j < lf.length; j++) if (lf[j][0] > t) {
          seek(Math.max(0, lf[j][0] - 1.5)); if (S.zoom === 0) setZoom(30);
          $("#ex-status").textContent = "A quiet answer lifted " + Math.round(lf[j][2]) + " dB at " + fmt(lf[j][0]) + (S.mode === "lifted" ? "" : ": switch to Child lifted to hear the difference");
          return;
        }
        $("#ex-status").textContent = "None after this point."; return;
      }
      for (var i = 0; i < ac.length; i++) {
        var s = ac[i]; if (s[0] <= t) continue;
        var hit = kind === "disagree" ? disagrees(s, L.soniox) : s[2] === kind;
        if (hit) { seek(Math.max(0, s[0] - 0.5)); if (S.zoom === 0) setZoom(30); $("#ex-status").textContent = (kind === "disagree" ? "Waveform says " + CLASS_NAME[s[2]].toLowerCase() + ", transcript says " + (sonAt(L.soniox, s) === "T" ? "Teacher" : "Student") : CLASS_NAME[s[2]]) + " at " + fmt(s[0]); return; }
      }
      $("#ex-status").textContent = "None after this point.";
    }
    function sonAt(son, s) { var x = laneAt(son, (s[0] + s[1]) / 2); return x ? x[2] : null; }
    function disagrees(s, son) {
      if (s[1] - s[0] < 1) return false;
      var k = sonAt(son, s); if (!k) return false;
      return (s[2] === "teacher" && k === "S") || ((s[2] === "child" || s[2] === "chorus") && k === "T");
    }

    /* pointer: click seeks, drag pans, two fingers pinch */
    var pts = {}, drag = null;
    tracksEl.addEventListener("pointerdown", function (e) {
      pts[e.pointerId] = e.clientX; tracksEl.setPointerCapture(e.pointerId);
      var ids = Object.keys(pts);
      if (ids.length === 2) { var xs = ids.map(function (k) { return pts[k]; }); drag = { pinch: true, d0: Math.abs(xs[0] - xs[1]) || 1, span: S.v1 - S.v0, mid: tOf((xs[0] + xs[1]) / 2 - tracksEl.getBoundingClientRect().left, tracksEl.clientWidth) }; }
      else drag = { x: e.clientX, v0: S.v0, moved: false };
    });
    tracksEl.addEventListener("pointermove", function (e) {
      var r = tracksEl.getBoundingClientRect(), x = e.clientX - r.left, w = tracksEl.clientWidth;
      if (S.data && x >= 0 && x <= w) {
        var t = tOf(x, w), ac = laneAt(S.data.lanes.acoustic, t), so = laneAt(S.data.lanes.soniox, t);
        tip.hidden = false; tip.style.left = Math.min(w - 150, Math.max(0, x + 8)) + "px";
        tip.textContent = fmt(t) + (ac ? " · waveform: " + CLASS_NAME[ac[2]] : "") + (so ? " · transcript: " + (so[2] === "T" ? "Teacher" : "Student") : "");
      }
      if (!drag || !(e.pointerId in pts)) return;
      pts[e.pointerId] = e.clientX;
      if (drag.pinch) {
        var ids = Object.keys(pts); if (ids.length < 2) return;
        var d = Math.abs(pts[ids[0]] - pts[ids[1]]) || 1, span = drag.span * drag.d0 / d;
        setView(drag.mid - span / 2, span); S.zoom = -1; $$("[data-zoom]").forEach(function (b) { b.classList.remove("on"); });
        return;
      }
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      if (drag.moved && S.data) setView(drag.v0 - dx / w * (S.v1 - S.v0), S.v1 - S.v0);
    });
    function up(e) {
      var was = drag; delete pts[e.pointerId];
      if (!Object.keys(pts).length) drag = null;
      if (was && !was.pinch && !was.moved && S.data && e.type === "pointerup") { var r = tracksEl.getBoundingClientRect(); seek(tOf(e.clientX - r.left, tracksEl.clientWidth)); }
    }
    tracksEl.addEventListener("pointerup", up); tracksEl.addEventListener("pointercancel", up);
    tracksEl.addEventListener("pointerleave", function () { tip.hidden = true; });

    /* controls */
    function init() {
      var pick = $("#ex-pick");
      lessons().forEach(function (L) {
        pick.appendChild(el("button", { class: "lp", role: "tab", type: "button", "data-id": L.id, "aria-selected": "false", onclick: function () { load(L.id); } },
          [el("b", { text: L.id + " · " + (L.label || "") }), el("span", { text: [L.langWord, Math.round((L.duration || 0) / 60) + " min", L.children ? L.children + " children" : null].filter(Boolean).join(" · ") })]));
      });
      $("#ex-play").addEventListener("click", toggle);
      $$("[data-mode]").forEach(function (b) { b.addEventListener("click", function () { if (!b.disabled) setMode(b.getAttribute("data-mode")); }); });
      $$("[data-zoom]").forEach(function (b) { b.addEventListener("click", function () { setZoom(+b.getAttribute("data-zoom")); }); });
      $$("[data-rate]").forEach(function (b) { b.addEventListener("click", function () { S.rate = +b.getAttribute("data-rate"); audio.playbackRate = S.rate; $$("[data-rate]").forEach(function (x) { x.classList.toggle("on", x === b); }); }); });
      $$("[data-jump]").forEach(function (b) { b.addEventListener("click", function () { if (S.data) jump(b.getAttribute("data-jump")); }); });
      $$(".side-t").forEach(function (b) { b.addEventListener("click", function () {
        $$(".side-t").forEach(function (x) { var on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-selected", on ? "true" : "false"); });
        $$(".side-p").forEach(function (p) { p.hidden = p.id !== b.getAttribute("data-side"); }); S.lineIdx = -1; syncSide(); }); });
      document.addEventListener("keydown", function (e) {
        var tg = e.target, tag = (tg && tg.tagName) || "";
        if (/INPUT|TEXTAREA|SELECT/.test(tag) || e.metaKey || e.ctrlKey || e.altKey) return;
        if (!S.data || !inExplorer()) return;
        if (e.key === " " && tag !== "BUTTON") { e.preventDefault(); toggle(); }
        else if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); seek(S.t + (e.key === "ArrowRight" ? 1 : -1) * (e.shiftKey ? 30 : 5)); }
      });
      var ro = window.ResizeObserver ? new ResizeObserver(function () { draw(); placeHead(); }) : null;
      if (ro) ro.observe(tracksEl); else window.addEventListener("resize", function () { draw(); placeHead(); });
      var first = store("wave.lesson"); if (!lessons().some(function (l) { return l.id === first; })) first = lessons()[0] && lessons()[0].id;
      if (first) load(first);
    }
    function inExplorer() {
      if ($("#explorer").contains(document.activeElement)) return true;
      var r = $("#tracks").getBoundingClientRect(); return r.top < window.innerHeight - 60 && r.bottom > 60;
    }
    function seekLesson(id, t) { var go = function () { seek(t); }; if (S.lesson && S.lesson.id === id && S.data) go(); else { load(id); var iv = setInterval(function () { if (S.data && S.data.id === id) { clearInterval(iv); go(); } }, 100); setTimeout(function () { clearInterval(iv); }, 8000); } }
    return { init: init, pause: pause, seek: seek, seekLesson: seekLesson, state: function () { return { lesson: S.lesson && S.lesson.id, t: S.t, playing: S.playing, mode: S.mode, v0: S.v0, v1: S.v1, src: audio.currentSrc }; } };
  })();

  /* ---------- (c) side by side ---------- */
  function miniWave(cv, peaks, colr) {
    var r = window.devicePixelRatio || 1, w = cv.clientWidth || 200, h = cv.clientHeight || 44;
    cv.width = w * r; cv.height = h * r; var g = cv.getContext("2d"); g.setTransform(r, 0, 0, r, 0, 0);
    if (!peaks || !peaks.length) return;
    g.fillStyle = colr;
    for (var x = 0; x < w; x++) { var i = Math.floor(x / w * peaks.length), v = peaks[i] / 255 * (h / 2 - 2); g.fillRect(x, h / 2 - v, 1, Math.max(1, v * 2)); }
  }
  function renderGrid() {
    var G = W.gallery, box = $("#grid4");
    if (!G || !G.classes) { box.appendChild(el("div", { class: "empty", style: "grid-column:1/-1", text: "No excerpts in this copy." })); return; }
    box.appendChild(el("div"));
    G.classes.forEach(function (k) { box.appendChild(el("div", { class: "g-h" }, [CLASS_NAME[k.id] || k.id, el("small", { text: k.listen || "" })])); });
    var cells = {};
    ["raw", "lifted"].forEach(function (row) {
      box.appendChild(el("div", { class: "g-rl", text: row === "raw" ? "Raw" : "Lifted" }));
      G.classes.forEach(function (k) { var c = el("div", { class: "cell" }); cells[row + k.id] = c; box.appendChild(c); });
    });
    function fill(k, item, drawn) {
      ["raw", "lifted"].forEach(function (row) {
        var c = cells[row + k.id]; c.textContent = "";
        if (!item) { c.appendChild(el("div", { class: "empty", text: "Not on this copy yet." })); return; }
        var clip = item[row];
        if (!clip && row === "lifted") { c.appendChild(el("div", { class: "empty", text: item.lift_same ? "The lift leaves these seconds as they are: it only raises quiet single answers." : "No lifted version of this lesson." })); return; }
        c.appendChild(el("span", { class: "tag" + (drawn ? " drawn" : ""), text: drawn ? "Drawn at random" : "Chosen to show" }));
        var cv = el("canvas", { "aria-hidden": "true" }); c.appendChild(cv);
        var sp = row === "lifted" ? item.spec_lifted : item.spec, pk = row === "lifted" ? item.peaks_lifted : item.peaks;
        if (sp) c.appendChild(el("img", { class: "spec", src: sp, alt: "Spectrogram of this excerpt, " + row, loading: "lazy" }));
        c.appendChild(el("div", { class: "meta" }, [el("span", { text: item.lesson + " " + fmt(item.start) }), el("span", { text: item.pitch ? "pitch " + item.pitch + " Hz" : "" })]));
        if (clip) c.appendChild(clipButton({ id: clip, child: k.id !== "teacher" }, row === "raw" ? "Play raw" : "Play lifted"));
        else c.appendChild(el("span", { class: "meta", text: row === "lifted" ? "Lifted version not made yet" : "" }));
        requestAnimationFrame(function () { miniWave(cv, pk, k.id === "teacher" ? COL.teacher : k.id === "chatter" ? COL.chatter : COL.child); });
      });
    }
    G.classes.forEach(function (k) { var ch = (G.chosen || {})[k.id], pl = (G.pool || {})[k.id] || []; if (ch) fill(k, ch, false); else fill(k, pl[0] || null, true); });
    var dr = el("div", { class: "g-draw" });
    G.classes.forEach(function (k) {
      var pool = (G.pool || {})[k.id] || [];
      dr.appendChild(el("button", { class: "btn ghost", type: "button", disabled: pool.length ? null : "disabled",
        onclick: function () { fill(k, pool[Math.floor(Math.random() * pool.length)], true); } }, ["Draw another: " + (CLASS_NAME[k.id] || k.id).toLowerCase() + " (" + pool.length + ")"]));
    });
    box.appendChild(el("div", { class: "g-rl" })); box.appendChild(dr);
    if (G.note) $("#c-lede").textContent = G.note;
  }

  /* ---------- (d) evidence ---------- */
  function renderEvidence() {
    var box = $("#evidence");
    (W.evidence || []).forEach(function (b) {
      var figs = el("div", { class: "figs" });
      (b.figs || []).forEach(function (f) {
        figs.appendChild(el("figure", { class: "fig", "data-figure": f.key + " n=" + f.n }, [
          el("img", { src: f.src, alt: f.alt || f.caption || "" }),
          el("figcaption", null, [f.caption ? f.caption + " " : "", el("span", { class: "fk", text: f.key + ", n=" + f.n })])]));
      });
      var hear = el("div", { class: "hear" }, [el("span", { class: "h", text: "Hear it" })]);
      (b.hear || []).forEach(function (c) { hear.appendChild(clipButton(c, c.label)); if (c.note) hear.appendChild(el("div", { class: "note", text: c.note })); });
      var how = el("details", { class: "how" }, [el("summary", { text: "How this was measured" })]);
      if (b.rule) how.appendChild(el("p", null, [el("span", { class: "rule " + b.rule.status, text: b.rule.status === "met" ? "Rule met" : b.rule.status === "notmet" ? "Rule not met" : "No rule" }), b.rule.text || ""]));
      (b.method || []).forEach(function (p) { how.appendChild(el("p", { html: p })); });
      box.appendChild(el("article", { class: "ev", id: b.id }, [
        el("div", { class: "ev-k", text: b.kicker || "" }),
        b.headline ? el("h3", { text: b.headline }) : null,
        el("div", { class: "ev-g" + ((b.figs || []).length ? "" : " solo") }, [(b.figs || []).length ? figs : null, el("div", null, [
          b.number ? el("p", { class: "ev-num", html: b.number }) : null,
          b.floor ? el("p", { class: "ev-floor", html: b.floor }) : null,
          (b.hear || []).length ? hear : null, how])])
      ]));
    });
  }

  /* ---------- (e) label mode ---------- */
  function renderLab() {
    var LS = W.labelset, box = $("#lab");
    if (!LS || !(LS.clips || []).length) { box.appendChild(el("div", { class: "empty", text: "No clips to label in this copy." })); return; }
    var KEY = "wave.labels.v1", st = store(KEY) || { labeller: "", answers: {} }, idx = 0;
    var clips = LS.clips, main = el("div", { class: "lab-main" }), side = el("div", { class: "lab-side" });
    box.appendChild(main); box.appendChild(side);
    var a = new Audio(); a.preload = "none";
    function save() { store(KEY, st); }
    function firstOpen() { for (var i = 0; i < clips.length; i++) if (!st.answers[clips[i].id]) return i; return 0; }
    idx = firstOpen();
    var WHO = [["teacher", "Teacher"], ["one child", "One child"], ["many children", "Many children"], ["other", "Other"], ["cannot tell", "Cannot tell"]];
    function show() {
      a.pause(); main.textContent = "";
      var c = clips[idx], ans = st.answers[c.id] || {}, draft = { plays: ans.plays || 0, secs: ans.secs || 0 };
      var top = el("div", { class: "lab-top" }, [el("label", { for: "lab-who", text: "Your initials" }),
        el("input", { id: "lab-who", type: "text", value: st.labeller || "", maxlength: "12", autocomplete: "off", oninput: function (e) { st.labeller = e.target.value.trim(); save(); } }),
        el("span", { class: "meta", text: "Clip " + (idx + 1) + " of " + clips.length })]);
      main.appendChild(top);
      var card = el("div", { class: "lab-clip" }); main.appendChild(card);
      card.appendChild(el("h4", { text: c.kind === "pair" ? "Which is clearer?" : c.kind === "phase" ? "Mark the lesson's phases" : "Who is speaking?" }));
      card.appendChild(el("p", { class: "ins", text: c.kind === "pair" ? "The same seconds, raw and lifted, in random order. Audio models could not tell these apart (they answered “same” or picked by position), so yours are the first real ears on the lift. Play each up to three times." : c.kind === "phase" ? "Open the lesson in the explorer above, play it, and press the button for each phase as it starts." : "Play the clip (up to three times) and choose." }));
      var played = el("span", { class: "cnt" }), t0 = 0;
      function playBtn(id, label) {
        return el("button", { class: "btn", type: "button", onclick: function () {
          if (draft.plays >= 3 && !ans.saved) { played.textContent = "Three plays used."; return; }
          stopClip(); Ex.pause(); a.src = clipSrc(id);
          if (sealedLocked(a)) { flashSeal(); return; }
          draft.plays++; t0 = Date.now(); a.play(); played.textContent = "Plays: " + draft.plays + " of 3";
        } }, [label]);
      }
      a.onpause = a.onended = function () { if (t0) { draft.secs += (Date.now() - t0) / 1000; t0 = 0; } };
      var pr = el("div", { class: "lab-play" });
      if (c.kind === "pair") { pr.appendChild(playBtn(c.a, "Play 1")); pr.appendChild(playBtn(c.b, "Play 2")); }
      else if (c.kind === "phase") pr.appendChild(el("button", { class: "btn", type: "button", onclick: function () { location.hash = "#b"; Ex.seekLesson(c.lesson, 0); } }, ["Open " + c.lesson + " in the explorer"]));
      else pr.appendChild(playBtn(c.audio, "Play"));
      played.textContent = "Plays: " + draft.plays + " of 3"; if (c.kind !== "phase") pr.appendChild(played);
      card.appendChild(pr);
      var pick = { v: ans.answer || null, sure: ans.sure || null };
      function opts(list, keyName) {
        var row = el("div", { class: "opts", role: "group" });
        list.forEach(function (o) { row.appendChild(el("button", { class: "opt", type: "button", "aria-pressed": pick[keyName] === o[0] ? "true" : "false",
          onclick: function () { pick[keyName] = o[0]; $$(".opt", row).forEach(function (b) { b.setAttribute("aria-pressed", b === this ? "true" : "false"); }, this); } }, [o[1]])); });
        return row;
      }
      var said = null, phases = ans.phases || {};
      if (c.kind === "pair") { card.appendChild(opts([["1", "1 is clearer"], ["2", "2 is clearer"], ["same", "About the same"]], "v"));
        card.appendChild(el("label", { class: "ins", text: "What did the child say? (optional)" })); said = el("input", { type: "text", value: ans.said || "" }); card.appendChild(said); }
      else if (c.kind === "phase") {
        var PH = ["warm-up", "explanation", "guided practice", "independent practice", "exit ticket"], list = el("div");
        PH.forEach(function (p) { var tv = el("span", { class: "meta", text: phases[p] != null ? fmt(phases[p]) : "not set" });
          list.appendChild(el("div", { class: "opts" }, [el("button", { class: "opt", type: "button", onclick: function () { var s = Ex.state(); if (s.lesson !== c.lesson) { tv.textContent = "open " + c.lesson + " first"; return; } phases[p] = Math.round(s.t); tv.textContent = fmt(phases[p]); } }, [p + " starts now"]), tv])); });
        list.appendChild(el("div", { class: "opts" }, [el("button", { class: "opt", type: "button", onclick: function () { var s = Ex.state(); if (s.lesson === c.lesson) phases.none = (phases.none || []).concat([Math.round(s.t)]); } }, ["This phase did not happen"])]));
        card.appendChild(list);
      }
      else { card.appendChild(opts(WHO, "v")); }
      if (c.kind !== "phase") card.appendChild(opts([["sure", "Sure"], ["unsure", "Not sure"]], "sure"));
      var nt = el("textarea", { rows: "2", placeholder: "Note (optional)", "aria-label": "Note" }); nt.value = ans.note || ""; card.appendChild(nt);
      var msg = el("span", { class: "meta" });
      card.appendChild(el("div", { class: "lab-act" }, [
        el("button", { class: "btn", type: "button", onclick: function () {
          if (c.kind !== "phase" && !pick.v) { msg.textContent = "Choose an answer first."; return; }
          if (c.kind !== "phase" && !draft.plays) { msg.textContent = "Play the clip first."; return; }
          if (t0) { draft.secs += (Date.now() - t0) / 1000; t0 = 0; a.pause(); }
          st.answers[c.id] = { answer: pick.v, sure: pick.sure, note: nt.value.trim(), said: said ? said.value.trim() : undefined, phases: c.kind === "phase" ? phases : undefined,
            plays: draft.plays, secs: Math.round(draft.secs * 10) / 10, ts: new Date().toISOString(), saved: true };
          save(); show(); renderSide();
        } }, ["Save"]),
        el("button", { class: "btn ghost", type: "button", onclick: function () { idx = (idx + 1) % clips.length; show(); renderSide(); } }, ["Skip"]), msg]));
      if (ans.saved && c.system) card.appendChild(el("div", { class: "reveal" }, [el("b", { text: "What the machines said: " }), c.system.label + (c.system.source ? " (" + c.system.source + ")" : ""),
        el("div", { class: "meta", text: "You said: " + (ans.answer || "phases marked") + (ans.sure === "unsure" ? ", not sure" : "") }),
        el("button", { class: "btn ghost", type: "button", style: "margin-top:8px", onclick: function () { idx = (idx + 1) % clips.length; show(); renderSide(); } }, ["Next clip"])]));
      else if (ans.saved) card.appendChild(el("div", { class: "reveal", text: "Saved." }));
    }
    function agree() {
      var n = 0, k = 0, map = { "teacher": "teacher", "one child": "child", "many children": "chorus" };
      clips.forEach(function (c) { var x = st.answers[c.id]; if (!x || !x.saved || c.kind !== "who" || !c.system || !c.system.cls) return; n++; if (map[x.answer] === c.system.cls) k++; });
      return { n: n, k: k };
    }
    function renderSide() {
      side.textContent = "";
      var done = clips.filter(function (c) { return st.answers[c.id] && st.answers[c.id].saved; }).length;
      side.appendChild(el("h4", { text: "Your progress" }));
      side.appendChild(el("div", { class: "prog" }, [el("i", { style: "width:" + Math.round(done / clips.length * 100) + "%" })]));
      side.appendChild(el("div", { class: "meta", text: done + " of " + clips.length + " saved, kept in this browser" }));
      var ag = agree();
      if (done >= 10 && ag.n) side.appendChild(el("p", { text: "You and the model agree on " + ag.k + " of " + ag.n + " who-is-speaking clips so far." }));
      var ul = el("ul", { class: "lab-list" });
      clips.forEach(function (c, i) { ul.appendChild(el("li", { class: i === idx ? "cur" : "", onclick: function () { idx = i; show(); renderSide(); } },
        [el("span", { text: (i + 1) + ". " + c.id + ", " + (c.kind === "pair" ? "which is clearer" : c.kind === "phase" ? "phases, " + c.lesson : "who is speaking") }), el("span", { class: "d", text: st.answers[c.id] && st.answers[c.id].saved ? "✓" : "" })])); });
      side.appendChild(ul);
      side.appendChild(el("div", { class: "lab-act" }, [
        el("button", { class: "btn", type: "button", onclick: exportJSON }, ["Export my labels"]),
        el("label", { class: "btn ghost", style: "display:inline-flex;align-items:center" }, ["Import", el("input", { type: "file", accept: "application/json,.json", style: "display:none", onchange: importJSON })])]));
      side.appendChild(el("p", { class: "meta", text: "Send the exported file to the person who sent you this page. It holds your initials, the clip codes and your answers; nothing else." }));
    }
    function exportJSON() {
      var out = [], ex = new Date().toISOString();          // flat rows: what listen's score_gold.py reads
      clips.forEach(function (c) { var x = st.answers[c.id]; if (x && x.saved) out.push({ labeller: st.labeller || "", labelset: LS.version || "", clip: c.id, kind: c.kind, answer: x.answer, clearer: c.kind === "pair" ? x.answer : undefined, sure: x.sure, note: x.note, said: x.said, phases: x.phases, plays: x.plays, seconds_listened: x.secs, ts: x.ts }); });
      var blob = new Blob([JSON.stringify(out, null, 1)], { type: "application/json" }), u = URL.createObjectURL(blob);
      var aa = el("a", { href: u, download: "labels_" + (st.labeller || "anon").replace(/[^A-Za-z0-9]/g, "") + "_" + ex.slice(0, 10) + ".json" });
      document.body.appendChild(aa); aa.click(); setTimeout(function () { URL.revokeObjectURL(u); aa.remove(); }, 500);
    }
    function importJSON(e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader(); r.onload = function () { try { var d = JSON.parse(r.result), rows = Array.isArray(d) ? d : (d.answers || []); if (d.labeller || (rows[0] && rows[0].labeller)) st.labeller = d.labeller || rows[0].labeller;
        rows.forEach(function (x) { st.answers[x.clip] = { answer: x.answer, sure: x.sure, note: x.note, said: x.said, phases: x.phases, plays: x.plays, secs: x.seconds_listened, ts: x.ts, saved: true }; });
        save(); idx = firstOpen(); show(); renderSide(); } catch (err) { alert("That file is not a labels export."); } };
      r.readAsText(f);
    }
    show(); renderSide();
  }

  /* ---------- (f) and (g) ---------- */
  function renderRollout() {
    var R = W.rollout, box = $("#rollout");
    if (!R) { box.appendChild(el("div", { class: "empty", text: "The cost and the plan are written when the numbers are final." })); return; }
    if (R.headline) box.appendChild(el("p", { class: "ev-num", html: R.headline }));
    var tb = el("table", { class: "ro" }), hd = el("tr");
    ["Method", "What it adds to the coach's report", "US cents a lesson", "Minutes a lesson", "Runs on", "Its rule"].forEach(function (h) { hd.appendChild(el("th", { scope: "col", text: h })); });
    tb.appendChild(el("thead", null, [hd])); var bd = el("tbody"); tb.appendChild(bd);
    (R.rows || []).forEach(function (r) { bd.appendChild(el("tr", null, [el("td", { html: "<b>" + r.method + "</b>" }), el("td", { text: r.adds }), el("td", { class: "n", text: r.cents }), el("td", { class: "n", text: r.minutes }), el("td", { text: r.where }), el("td", { text: r.rule })])); });
    box.appendChild(el("div", { class: "tbl-wrap" }, [tb]));
    var ul = el("ul", { class: "plain" }); (R.lines || []).forEach(function (l) { ul.appendChild(el("li", { html: l })); }); box.appendChild(ul);
    if (R.fleet) box.appendChild(el("p", { class: "plain", html: R.fleet }));
  }
  function renderMethod() {
    var M = W.method, box = $("#method");
    if (!M) { box.appendChild(el("div", { class: "empty", text: "Written with the numbers." })); return; }
    (M.sections || []).forEach(function (s) {
      if (s.copy && W.meta && s.copy !== W.meta.copy) return;
      var d = el("div", { class: "plain" }, [el("h3", { text: s.h })]);
      (s.paras || []).forEach(function (p) { d.appendChild(el("p", { html: p })); });
      if (s.list) { var ul = el("ul"); s.list.forEach(function (l) { ul.appendChild(el("li", { html: l })); }); d.appendChild(ul); }
      box.appendChild(d);
    });
    if ((M.figs || []).length) {
      var figs = el("div", { class: "figs" });
      M.figs.forEach(function (f) {
        figs.appendChild(el("figure", { class: "fig", "data-figure": f.key + " n=" + f.n }, [
          el("img", { src: f.src, alt: f.alt || f.caption || "" }),
          el("figcaption", null, [f.caption ? f.caption + " " : "", el("span", { class: "fk", text: f.key + ", n=" + f.n })])]));
      });
      box.appendChild(figs);
      if ((M.hear || []).length) { var hr = el("div", { class: "hear" }, [el("span", { class: "h", text: "Hear it" })]); M.hear.forEach(function (c) { hr.appendChild(clipButton(c, c.label)); if (c.note) hr.appendChild(el("div", { class: "note", text: c.note })); }); box.appendChild(hr); }
    }
  }

  /* ---------- nav highlight ---------- */
  function navSpy() {
    if (!window.IntersectionObserver) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) $$(".rail a, .tabbar a").forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id); }); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    $$("main .sec").forEach(function (s) { io.observe(s); });
  }

  renderHeader(); renderAnswers(); Ex.init(); renderGrid(); renderEvidence(); renderLab(); renderRollout(); renderMethod(); navSpy();
  window.WAVE_UI = { explorer: Ex };
})();
