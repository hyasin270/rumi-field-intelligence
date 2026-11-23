/* slack-status · shot 2B1 (v2-screens). Slack #team-product. The agent says where things stand;
   the product manager answers. Two messages arrive in turn, one at a time.
   Point words: "Where things stand: the plan is written. Mockups next." / "Okay, let me know when you're done." (14) */
SCREEN.define({
  id: "slack-status",
  dur: 10000,
  // m1: Rumi's status lands. type: the manager starts typing. m2: the reply lands.
  events: { m1: 1200, type: 4300, m2: 6400 },
  build(root) {
    const S = (root._S = SL.build(root, { channel: "team-product" }));
    SL.earlier(S, [
      { who: "Data lead", time: "09:48", text: "This week's numbers are in the sheet." },
      { who: "Content lead", time: "10:05", text: "Story cards are ready for a look." },
      { who: "Engineer", time: "10:21", text: "The release went out this morning." },
      { who: "Designer", time: "10:40", text: "The new icons are in the shared folder." },
      { who: "Rumi", time: "10:52", text: "Thanks. Starting on the coaching tip now." },
    ]);
    root._m = [
      SL.msg(S.msgs, { who: "Rumi", time: "11:05", text: "<b>Where things stand:</b> the plan is written. Mockups next." }),
      SL.msg(S.msgs, { who: "Product manager", time: "11:07", text: "Okay, let me know when you're done." }),
    ];
  },
  render(root, t, ev) {
    const S = root._S, [m1, m2] = root._m;
    SL.grow(m1, t, ev.m1);
    // the reply is typed in the composer, then sent
    SL.typeInto(S, "Okay, let me know when you're done.", t, ev.type, ev.m2, 17);
    SL.grow(m2, t, ev.m2);
  },
});
