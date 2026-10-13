/* Taleemabad × Fab Inc — meeting companion. Renders the open sections from window.PAGE and, after the password,
   the children's recordings from a sealed bundle (AES-GCM, PBKDF2 key; see workbench/seal.py). Nothing sealed is
   decrypted until the visitor types the password; each clip is decrypted only when its play button is pressed. */
(function () {
  const P = window.PAGE;
  const $ = (s, el) => (el || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const isUrdu = (s) => /[؀-ۿ]/.test(s || '');
  const mmss = (s) => { s = Math.round(+s || 0); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

  // theme toggle (remembered per viewer; the page works without storage)
  const themeBtn = $('#theme');
  const setTheme = (t) => { document.documentElement.setAttribute('data-theme', t); themeBtn.textContent = t === 'dark' ? 'Light' : 'Dark'; };
  try { const t = localStorage.getItem('fab-theme'); if (t) setTheme(t); } catch (e) {}
  themeBtn.addEventListener('click', () => {
    const now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(now); try { localStorage.setItem('fab-theme', now); } catch (e) {}
  });

  function scoreLine(scores) {
    if (!scores) return '';
    const parts = Array.isArray(scores) ? scores : Object.entries(scores).map(([k, v]) => ({ label: k, value: v }));
    return '<div class="scores">' + parts.filter((p) => p && p.value !== undefined && p.value !== null && p.value !== '')
      .map((p) => `<span class="score"><em>${esc(p.label)}</em>${esc(typeof p.value === 'object' ? JSON.stringify(p.value) : p.value)}</span>`).join('') + '</div>';
  }

  function card(c, sealed) {
    const tags = [c.lang, c.grade_or_level, c.task].filter(Boolean).map(esc).join(' · ');
    const txt = c.transcript_excerpt && c.transcript_excerpt !== 'None' ? c.transcript_excerpt : '';
    const tx = (txt || c.transcript_en) ? `<details class="tx"><summary>${esc(c.transcript_label || 'What is said')}</summary>
      ${txt ? `<p class="${isUrdu(txt) ? 'ur' : ''}">${esc(txt)}</p>` : ''}${c.transcript_en ? `<p class="en-tr">${esc(c.transcript_en)}</p>` : ''}</details>` : '';
    const title = c.title ? `<h4 class="clip-title">${esc(c.title)}</h4>` : '';
    const ai = c.ai_said ? `<div class="ai"><b>${esc(c.ai_said_label || 'What the AI coach told the teacher')}</b>
      <p class="${isUrdu(c.ai_said) ? 'ur' : ''}">${esc(c.ai_said)}</p></div>` : '';
    const audio = sealed ? `<audio controls preload="none" data-sealed="${esc(c.file)}"></audio>`
                         : `<audio controls preload="none" src="${esc(c.file)}"></audio>`;
    return `<article class="clip"><div class="clip-head"><span class="tag">${tags}</span><span class="dur">${mmss(c.duration_s)}</span></div>
      ${title}${audio}<p class="cap">${esc(c.caption)}</p>${scoreLine(c.scores)}${ai}${tx}
      ${c.why ? `<p class="why">${esc(c.why)}</p>` : ''}<p class="src muted small">${esc(c.source || '')}</p></article>`;
  }

  function renderGroups(target, groups, clips, sealed) {
    target.innerHTML = groups.map((g) => {
      const mine = clips.filter((c) => c.group === g.key);
      if (!mine.length) return '';
      return `<div class="group"><h3>${esc(g.title)}</h3><p class="lede2">${esc(g.blurb)}</p>
        <div class="clips">${mine.map((c) => card(c, sealed)).join('')}</div></div>`;
    }).join('');
  }

  // open sections
  $('#stats').innerHTML = (P.stats || []).map((s) => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('');
  renderGroups($('#classroom-clips'), P.adultGroups.filter((g) => g.section === 'classroom'), P.adultClips, false);
  renderGroups($('#debrief-clips'), P.adultGroups.filter((g) => g.section === 'debrief'), P.adultClips, false);
  $('#collab').innerHTML = (P.collab || []).map((x, i) => `<article class="idea"><div class="num">${i + 1}</div><div>
      <h3>${esc(x.title)}</h3><p>${esc(x.why)}</p>
      <div class="two"><div><em>Fab Inc brings</em><p>${esc(x.fab)}</p></div><div><em>Taleemabad brings</em><p>${esc(x.tb)}</p></div></div>
      <p class="first"><b>First step:</b> ${esc(x.first)}</p></div></article>`).join('');
  $('#child-stats').innerHTML = (P.childStats || []).map((s) => `<div class="kv"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('');

  // sealed section
  const S = P.sealed;
  let key = null;
  async function deriveKey(pw) {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
    const salt = Uint8Array.from(atob(S.salt), (c) => c.charCodeAt(0));
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: S.iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  }
  const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  async function openBytes(buf) {
    const u = new Uint8Array(buf);
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: u.slice(0, 12) }, key, u.slice(12));
  }
  async function unlock(ev) {
    ev.preventDefault();
    const msg = $('#lock-msg'); msg.textContent = 'Opening…';
    try {
      key = await deriveKey($('#pw').value.trim());
      const ok = new TextDecoder().decode(await openBytes(b64(S.check)));
      if (ok !== 'ok') throw new Error('check');
    } catch (e) { key = null; msg.textContent = 'That password did not open it. Check with Haroon.'; return; }
    try {
      const res = await fetch(S.manifest); const data = JSON.parse(new TextDecoder().decode(await openBytes(await res.arrayBuffer())));
      renderGroups($('#child-clips'), P.childGroups.filter((g) => g.key !== 'classroom'), data.clips, true);
      renderGroups($('#classroom-sealed'), P.childGroups.filter((g) => g.key === 'classroom'), data.clips, true);
      $('#lock').hidden = true; $('#child-clips').hidden = false; $('#classroom-lock').hidden = true;
      document.querySelectorAll('audio[data-sealed]').forEach((a) => {
        a.addEventListener('play', async function onPlay() {
          if (a.dataset.ready) return;
          a.pause();
          const r = await fetch(a.dataset.sealed);
          const blob = new Blob([await openBytes(await r.arrayBuffer())], { type: 'audio/mpeg' });
          a.src = URL.createObjectURL(blob); a.dataset.ready = '1'; a.play();
        });
      });
    } catch (e) { msg.textContent = 'Opened, but the recordings did not load. Try again in a moment.'; }
  }
  if (S && $('#lock-form')) $('#lock-form').addEventListener('submit', unlock);
})();
