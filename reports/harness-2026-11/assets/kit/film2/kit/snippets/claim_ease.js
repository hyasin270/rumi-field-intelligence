// claim_ease.js (v2-kit, 11 Nov 20:0xZ): shot-side, for the hashed set.js (v2-check 145707). PRE_SIGN 15, 300 ms for a
// change of state. Asked by v2-shots-b (181813 item 1): board.claim(i, t0) turns a card green and shows its tag in one frame.
//
//   claimEase(W.parts.board, { ms: 300 });   // once, after the board exists; covers every claim and ripple on it
//
// From claimAt the green frame grows out from behind the card (scale 0.86 to 1, io) and the tag grows from nothing
// (0 to 1, io), each over ms. The card's own small pop (the layer's 360 ms) is unchanged. Nothing changes before claimAt
// or after claimAt + ms, so a card claimed before frame 0 looks as it did.
//
// Load: (function(){const x=new XMLHttpRequest();x.open("GET","snippets/claim_ease.js",false);x.send();(0,eval)(x.responseText+";window.claimEase=claimEase;");})();
function claimEase(board, o) {
  o = o || {}; const ms = o.ms || 300, base = board.eval;
  board.eval = (t) => {
    base(t);
    board.userData.cards.forEach((c) => {
      const u = c.userData; if (u.claimAt == null || t < u.claimAt) return;
      const e = FILM.tw(t, u.claimAt, u.claimAt + ms, "io");
      u.fr.scale.set(0.86 + 0.14 * e, 0.86 + 0.14 * e, 1);
      const s0 = u.tag.userData.s0 || (u.tag.userData.s0 = u.tag.scale.clone());
      u.tag.scale.set(s0.x * e, s0.y * e, s0.z);
      if (e <= 0.001) u.tag.visible = false;
    });
  };
  return board;
}
