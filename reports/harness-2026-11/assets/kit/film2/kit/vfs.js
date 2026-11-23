/* vfs.js (show player): a stand-in XMLHttpRequest that serves the film shots' synchronous reads (shared libs, snippets, the
   timing spine) from window.__VFS, so nothing is fetched on file:// (live-show gotcha 25). Paths resolve against film2/kit/. */
(function () {
  "use strict";
  function resolve(u) {
    u = String(u).split("?")[0].split("#")[0];
    if (/^[a-z]+:/i.test(u)) {
      u = decodeURIComponent(u);
      const l = u.indexOf("/outputs/lanes/"); if (l >= 0) return "ext/" + u.slice(l + 15);   // a film lane's tool file, copied into kit/ext/
      const i = u.indexOf("/film2/"); return i >= 0 ? u.slice(i + 1) : u;
    }
    const parts = []; ("film2/kit/" + u).split("/").forEach((s) => { if (s === "..") parts.pop(); else if (s && s !== ".") parts.push(s); });
    return parts.join("/");
  }
  function X() { this.readyState = 0; this.status = 0; this.responseText = ""; this.response = ""; }
  X.prototype.open = function (m, u) { this._u = resolve(u); this.readyState = 1; };
  X.prototype.send = function () {
    const V = window.__VFS || {}, v = V[this._u];
    this.readyState = 4;
    if (v != null) { this.status = 200; this.responseText = this.response = v; }
    else { this.status = 404; this.responseText = this.response = ""; console.warn("vfs: no file " + this._u); }
    const self = this; if (this.onreadystatechange) this.onreadystatechange(); if (this.onload) this.onload({ target: self });
  };
  X.prototype.setRequestHeader = function () {}; X.prototype.overrideMimeType = function () {}; X.prototype.abort = function () {};
  X.prototype.addEventListener = function (n, f) { if (n === "load") this.onload = f; if (n === "readystatechange") this.onreadystatechange = f; };
  X.prototype.getResponseHeader = function () { return null; };
  window.XMLHttpRequest = X;
})();
