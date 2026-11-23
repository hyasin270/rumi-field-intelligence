// 5B2 · X · v2-shots-e (v2.3 06:00Z: carried card lineAt 0; v2.2 05:45Z: S5 carries 5B1's card to 0.7 s, board from 0.7 s; v2.1 05:05Z 13 Nov: opens on 5B1 v2.14 SHORT under ai_fast-4c, see S5; v2.0 09:25Z, visuals 080638 5B2: opens on 5B1's last frame, the same room, camera and team of
// four (was a reverse angle with five); the locator map on every room frame (check 16); the team board grows from the
// laptop straight to Full and goes back into it, never resting as a panel (15.75); a hard cut to W at the end (ruling 103 d),
// the room full again across it, so no crowd appears in frame and the camera does not whip; the W is 5C's first view with
// its base out of the band. Narration 5B2.1: "This film was made by an agent team. Its fault-finders sent this script back
// more than once." On "sent ... back" its challenge row is lit (the screen's own highlight).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_e/lib.js", false); x.send(); (0, eval)(x.responseText); })();
(function(){const x=new XMLHttpRequest();x.open("GET","snippets/locator.js",false);x.send();(0,eval)(x.responseText+";window.locator=locator;window.roomRing=roomRing;");})(); // VL 15.76 map
FILM.shot({
  id: "q5-5B2", type: "X", row: "5B2", dur: 9633, screens: ["q5-team-board"],
  setup(k) {
    const E = window.SE, D = k.dur, T = THREE, P = KIT.parts;
    k.breathe(); // VL 15.89 b
    const Wb = E.world(k, E.ALL);
    const y = E.roomY("teams"), cx = E.roomX("teams"), tz = -4.0, TX = 0.6;
    const r = k.row("5B2.1"), tBack = E.at(k, "5B2.1", "back");
    // v2.1 (ruling 165 b, v2-visuals 050300 item 12): under 8 s (ai_fast-4c, 5.73 s) the v10 rule put the board back in the laptop at
    // 2.73 s, before its "sent back" highlight (4.14 s); FAST holds the board at Full through the highlight 0.6 s, a 400 ms push-out,
    // and the cut to W at D-500, so W stands its last 0.5 s. v10, ai and op (9.17 s or more) read the v10 times
    const FAST = D < 8000, tUnfull = FAST ? D - 1000 : Math.min(r.end, D - 3000), tOutDur = FAST ? 400 : 600, tHome = tUnfull + tOutDur, tW = FAST ? D - 500 : tHome + 300; // the board back in the laptop, then the cut
    // the webhook box with its green light, as 5C draws it from its first frame (join 60)
    { const bx = E.alwaysOn(k, new T.Vector3(...E.BOX), { green: false, base: 1.1 }); const gl = new T.Mesh(new T.SphereGeometry(0.09, 20, 14), new T.MeshStandardMaterial({ color: 0xF5B301, emissive: 0xF5B301, emissiveIntensity: 1.2 })); gl.position.set(0, 0.78, 0.38); bx.add(gl); }
    // the crowd: the teams room empty of the crowd while we are in it; full again across the cut to W. Its clock ends where
    // 5C's starts (tShift -D), so 5B2's last frame is 5C's first
    E.crowd(k, Wb, { fitted: E.ALL, tShift: -D, clear: [{ room: "teams", x0: -99, x1: 99, to: tW }] });
    // 5B1's room as it ends (5B1 v2.0): the desk, the long job card, the four panels, the note board, the table 0.6 m east at
    // half height with the laptop, the team of four facing the table's near side. All of it gives way to the plain room at the cut
    const set = [];
    const desk = k.set.part("desk", { w: 0.9, d: 0.6 }); desk.position.set(cx + 0.3, y, -5.3); /* 5B1 v2.3 */ k.scene.add(desk); set.push(desk);
    const big = new T.Group(); k.scene.add(big); big.position.set(cx + 1.15, y + 2.2, -5.62); big.scale.x = 0.52; set.push(big);
    P.add(big, P.rbox(5.6, 0.9, 0.08, P.mat("slab"), 0.06, 0.03), 0, 0, 0); P.add(big, P.rbox(5.48, 0.8, 0.04, P.mat("card"), 0.05, 0.02), 0, 0, 0.05);
    for (let rr = 0; rr < 4; rr++) for (let c = 0; c < 6; c++) P.add(big, P.rbox(0.62 + 0.18 * FILM.noise(rr * 6 + c, 3), 0.045, 0.012, P.mat("grey"), 0.01, 0.005), -2.45 + c * 0.86 + 0.3, 0.27 - rr * 0.18, 0.08);
    const pan = E.panels(k, new T.Vector3(cx - 0.9, y + 1.05, -5.55), { times: [], red: { 2: [-1e9, -1e9 + 1] } });
    const nb = new T.Group(); k.scene.add(nb); nb.position.set(cx + 1.6, y - 0.7, -5.5); set.push(nb);
    P.add(nb, P.rbox(2.0, 0.8, 0.06, P.mat("slab"), 0.06, 0.02), 0, 1.25, 0);
    [0, 1, 2].forEach((i) => { const n = P.add(nb, P.rbox(0.5, 0.4, 0.03, P.mat("card"), 0.04, 0.01), -0.62 + i * 0.62, 1.25, 0.05); [0.08, -0.06].forEach((yy, j) => P.add(n, P.rbox(j ? 0.24 : 0.34, 0.035, 0.012, P.mat("ink"), 0.01, 0.005), -0.04, yy, 0.02)); });
    const lap = k.set.part("laptop", {}); lap.position.set(cx + TX, y - 0.35, tz + 0.1); k.scene.add(lap); set.push(lap);
    lap.traverse((m) => { if (m.isMesh && m.material && m.material.color && m.material.color.getHex() === 0x111418) m.material = P.mat("white"); });
    const look = [cx + TX, y + 0.8, tz + 2.5], yawTo = (s) => (s[0] > look[0] + 2 ? 0.0 /* the finder at the board's right end faces us, as 5B1 v2.3 ends */ : Math.atan2(look[0] - s[0], look[2] - s[1]));
    const team = [[cx + 0.0, tz - 0.6], [cx + 1.15, tz + 1.0], [cx + 0.15, tz + 1.35], [cx + 2.95, -5.0]] /* 5B1 v2.3 end: back left, the mender front right, the newcomer, the finder at the board's right end facing us */.map((s, i) => k.agent({ at: [s[0], y, s[1]], face: yawTo(s), name: "t" + i }));
    // v2.1 (05:05Z 13 Nov): when 5B1 ran SHORT (ai_fast-4c: under 5 s from its strike to its end, 5B1 v2.14), 5B1 ends with the
    // mender at the note (pad in front, yaw 0.25) and the finder side-on (yaw -1.3), the note sharp; 5B2 opens on that and walks the
    // mender back to its seat behind the board, so the room is as before when the board leaves. Same formula as 5B1's SHORT
    const S5 = (() => { try { const x = new XMLHttpRequest(); x.open("GET", E.TFILE, false); x.send(); const J = JSON.parse(x.responseText), s1 = (J.shots || []).find((q) => q.id === "5B1"), r = (J.rows || []).find((q) => q.id === "5B1.2"), w = r && (r.words || []).find((q) => /^faults/i.test(q.w)); if (!s1 || !w) return false; return (s1.end - s1.start) * 1000 - ((w.start - s1.start) * 1000 - 200 + 150) < 5000; } catch (e) { return false; } })();
    if (S5) { const mVia = [cx + 1.35, -3.55], mAt = [cx + 1.7, -4.9], seat = [cx + 1.15, tz + 1.0]; team[1].at(0, [mAt[0], y, mAt[1]], 0.25); team[1].walk(200, 2000, [mVia, seat], { face: -0.3 }); team[1].turn(2200, 300, yawTo(seat)); team[1].act(2190, "write", { blend: 300 }); team[3].at(0, [cx + 2.95, y, -5.0], -1.3); team[3].turn(250, 350, 0.0); }
    team[2].act(-2000, "write"); team[1].act(-2000, "write");
    // v2.2 (ruling 166): under S5 5B1's name card is whole on its last frame; 5B2 draws the same card on the same clock (its t0 is
    // 5B1's card time less 5B1's length), so f000 matches, and fades it out by 0.7 s, before the board starts (T0 0.7 s under S5)
    if (S5) { try { const x = new XMLHttpRequest(); x.open("GET", E.TFILE, false); x.send(); const J = JSON.parse(x.responseText), s1 = J.shots.find((q) => q.id === "5B1"), r = J.rows.find((q) => q.id === "5B1.2"); const tc = Math.round((r.name_end - s1.start) * 1000 + 50 - (s1.end - s1.start) * 1000); k.ui.nameCard(tc, { name: "an agent team", stamp: "For people, a project team", x: 96, y: 640, t1: 700, lineAt: 0 /* v2.3: as 5B1 v2.16 */ }); } catch (e) {} } // 5B1 v2.11: the mender holds its pad too // pre-read 1305: the newcomer holds its pad, as through 5B1
    // on "sent ... back" the team turns to the board as one, three-quarter at most, and back (the line is about them)
    team.forEach((a, i) => { a.turn(tBack - 200 + i * 60, 300, 0.0).turn(tBack + 1500 + i * 60, 300, yawTo([[cx + 0.0, tz - 0.6], [cx + 1.15, tz + 1.0], [cx + 0.15, tz + 1.35], [cx + 2.95, -5.0]] /* 5B1 v2.3 end: back left, the mender front right, the newcomer, the finder at the board's right end facing us */[i])); });
    k.each((t) => { const room = t < tW; set.forEach((o) => { o.visible = room; }); pan.visible = room; team.forEach((a) => { if (a.root) a.root.visible = room; });
      const tb = Wb.parts.teams; if (tb) { if (tb.userData.x0 == null) tb.userData.x0 = tb.position.x; tb.scale.y = room ? 0.5 : 1; tb.children.forEach((m) => { m.scale.x = m.scale.z = room ? 0.5 : 1; }); /* 5B1 v2.7's 0.5 m table */ tb.position.x = tb.userData.x0 + (room ? TX : 0); } });
    // the board: from the laptop straight to Full, read, back into the laptop (VL 15.75: Full only)
    const T0 = S5 ? 700 : 200 /* v2.2: after 5B1's carried card has gone */, sc = k.screen("q5-team-board", { t0: T0, t1: tHome + 30, to: "full", events: { scroll: Math.max(0, tBack - 1800) - T0, hl: tBack - T0 } });
    sc.pushIn(T0, 600, { from: lap }); sc.pushOut(tUnfull, tOutDur, { to: lap }); E.hardHide(sc);
    k.cue(tBack, "mark");
    locator(k, { room: "teams", from: 0, to: T0 + 100 }); /* pre-read 1305: gone before the board reaches it */ locator(k, { room: "teams", from: tUnfull + 150, to: tW }); // VL 15.76: the map on every room frame, never over the board at Full (pre-read 1030; as 5Dc splits it)
    roomRing(k, Wb, "teams", tW, tW + (FAST ? 400 : 600)); /* v2.1: FAST ends the ring 100 ms before the cut to 5C */ // pre-read 1030: the ring on the teams room for W's first 0.6 s
    const Lk = E.R("teams", -0.4, 1.15, -3.7); // 5B1's room frame
    const WL5C = { look: [3.8, -3.6, -2.2], dist: 63, yaw: -14, pitch: -12 }; // 5C's first view, base out of the band (5C v2.0 the same)
    k.cam.keys([
      { t: 0, view: k.cam.on(Lk, { size: "room", px: 270, focus: S5 ? [cx + 2.3, y + 0.6, -5.1] : [cx + TX - 0.2, y + 0.7, -3.0] }) },
      ...(S5 ? [{ t: T0 + 200, rack: [cx + TX - 0.2, y + 0.7, -3.0], dur: 500 }] : []), // v2.1: from 5B1 SHORT's focus on the note, back to the table behind the board
      { t: tW - 1, hold: true, drift: false },
      { t: tW, view: WL5C, cut: true }, // ruling 103 (d): the room to W is a hard cut; the room is full again across it
      { t: D + 1, hold: true, drift: false }, // 5C opens on this frame
    ]);
    return {};
  },
});
