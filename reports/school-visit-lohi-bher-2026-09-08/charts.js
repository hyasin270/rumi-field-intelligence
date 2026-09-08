/* Lohi Bher report: interactive, dependency-free charts.
   window.RumiCharts.render(el) draws the chart named in el.dataset.chart into el as inline SVG.
   Auto-runs on DOMContentLoaded for every .chart[data-chart].
   Data below is copied from make_charts.py (charts 01-08, pulled 7 Sep 2026, rules v0.33.4)
   and make_charts_visit.py (charts 09-12, pulled 8 Sep 2026, rules v0.34.3).
   Colour names map to the --ch-* tokens in charts.css (house palette from economist_chart.py). */
(function () {
  'use strict';

  var SRC1 = 'Source: Niete_Rumi_db (ICT/Islamabad), governed query rules v0.33.4. Window 27 Jul to 7 Sep 2026. Pulled 7 Sep 2026.';
  var SRC2 = 'Source: Niete_Rumi_db (ICT/Islamabad), governed rules v0.34.3. Pulled 8 Sep 2026.';
  var TEACHER_TOTAL = 276;

  function fmt(n) {
    if (n === null || n === undefined) return '';
    return Number(n).toLocaleString('en-US', { maximumFractionDigits: 1 });
  }
  function pct(a, b) { return Math.round(a / b * 100); }
  function gloss(key) {
    var g = (window.RUMI_GLOSSARY || {})[key];
    return g || { name: key, plain: '' };
  }
  function plural(n, one, many) { return n === 1 ? one : many; }

  /* ------------------------------------------------------------------ data */
  var CHARTS = {};

  CHARTS['01_weekly_trend'] = (function () {
    var weeks = ['28 Jul', '4 Aug', '11 Aug', '18 Aug', '25 Aug', '1 Sep', '8 Sep*'];
    var curric = [0, 0, 0, 78, 42, 63, 15];
    var gamma = [2, 5, 7, 15, 26, 23, 0];
    var why = [
      'The menu did not exist yet. The only way to get a plan was to type what you wanted.',
      'Still only the typed route. Five plans in the whole week.',
      'Slow growth on the typed route. The menu was still a week away.',
      'The curriculum menu arrived this week, and the school had its biggest week: 93 plans in total.',
      'The first rush settled. Free-text had its highest week, 26.',
      'The menu still carries about two out of every three plans.',
      'This is one day only, the Monday, so do not compare it with a full week.'
    ];
    return {
      type: 'trend',
      title: 'This school woke up in the middle of August, when the lesson-plan menu arrived',
      how: 'Each dot is one week. Higher means more lesson plans were made that week. The last week is only one day.',
      source: SRC1,
      x: weeks,
      yLabel: 'Lesson plans',
      series: [
        { name: 'Curriculum menu', color: 'teal', values: curric,
          meaning: function (i) { return fmt(curric[i]) + ' ' + plural(curric[i], 'plan', 'plans') + ' picked from the curriculum menu that week.'; } },
        { name: 'Free-text (typed request)', color: 'orange', values: gamma,
          meaning: function (i) { return fmt(gamma[i]) + ' ' + plural(gamma[i], 'plan', 'plans') + ' made by typing a request in words.'; } }
      ],
      explain: function (i) {
        return { title: 'Week of ' + weeks[i].replace('*', ''),
          text: fmt(curric[i]) + ' from the curriculum menu and ' + fmt(gamma[i]) + ' free-text. ' + why[i] };
      }
    };
  })();

  CHARTS['02_teacher_volume'] = (function () {
    var names = ['Samina Saleem', 'Shazia Perveen', 'Saeeda Bibi', 'Saima Sajida', 'Asifa Rafique',
      'Humaira Habib', 'Khalida Sultana', 'Naheed Akhter', 'Raheela Safdar',
      'Afia Arbab', 'Aqeela bibi', 'Amber Nosheen', 'Sadia Minhas'];
    var vals = [102, 33, 31, 26, 18, 17, 13, 9, 8, 6, 6, 4, 3];
    return {
      type: 'bar_h',
      title: 'Three teachers make 6 out of every 10 lesson plans at this school',
      how: 'One bar per teacher. Longer means more lesson plans in six weeks. Orange marks the top three. Sixteen other teachers made none, so they have no bar.',
      source: SRC1,
      xLabel: 'Lesson plans, 27 Jul to 7 Sep',
      items: names.map(function (n, i) {
        var v = vals[i], share = pct(v, TEACHER_TOTAL);
        return { label: n, value: v, color: i < 3 ? 'orange' : 'teal',
          meaning: fmt(v) + ' lesson ' + plural(v, 'plan', 'plans') + ' in six weeks, ' + share + '% of the school\'s total.',
          explain: { title: n + ': ' + fmt(v) + ' lesson ' + plural(v, 'plan', 'plans'),
            text: 'This counts the lesson plans ' + n + ' made on Rumi between 27 July and 7 September, six weeks. ' +
              fmt(v) + ' is ' + share + '% of the ' + TEACHER_TOTAL + ' plans the whole school made.' +
              (i < 3 ? ' ' + n + ' is one of the three teachers who together make about 60% of the school\'s plans.' : '') +
              (i === 0 ? ' Nobody else comes close: the next teacher made 33.' : '') } };
      })
    };
  })();

  CHARTS['03_dormant_by_level'] = (function () {
    var cats = ['Primary only (8)', 'Middle/high only (15)', 'Both (6)'];
    var made = [1, 6, 6], none = [7, 9, 0];
    var who = ['teach only primary classes, grades 1 to 5', 'teach only middle or high classes, grades 6 to 12', 'teach both primary and higher classes'];
    var extra = [
      'That is the odd part. Rumi\'s library is mostly primary, so these teachers should find it the easiest to use.',
      'Rumi had no grade 6 to 12 plans until 30 hours before our visit, so these teachers had little to pull.',
      'Nobody in this group was dormant.'
    ];
    return {
      type: 'grouped',
      title: 'The teachers who never started are mostly the ones who teach only primary',
      how: 'Teachers grouped by the classes they teach. Teal made at least one plan in six weeks, gray made none. The number in brackets is how many teachers are in the group.',
      source: SRC1,
      yLabel: 'Teachers',
      categories: cats,
      series: [
        { name: 'Made plans', color: 'teal', values: made },
        { name: 'Made none', color: 'gray', values: none }
      ],
      meaning: function (ci, si) {
        var v = si === 0 ? made[ci] : none[ci];
        return v + ' of the ' + (made[ci] + none[ci]) + ' teachers who ' + who[ci] + ' made ' + (si === 0 ? 'at least one plan.' : 'no plan at all.');
      },
      explain: function (ci, si) {
        var n = made[ci] + none[ci];
        return { title: cats[ci].replace(/ \(\d+\)/, '') + ': ' + (si === 0 ? made[ci] + ' made plans' : none[ci] + ' made none'),
          text: n + ' teachers at this school ' + who[ci] + '. ' + made[ci] + ' of them made a lesson plan in six weeks and ' + none[ci] + ' made none. ' + extra[ci] };
      }
    };
  })();

  CHARTS['04_grade_gap'] = (function () {
    var labels = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grades 6-12'];
    var vals = [21, 19, 22, 104, 32, 0];
    var notes = ['', '', '',
      'That is more than half of the 198 menu plans at this school. The two heaviest users of grade 4 material teach middle or high classes.',
      '',
      '21 of the 29 teachers here teach these grades. The grade 6 to 12 plans only went live 30 hours before our visit, and nobody at this school had tried them yet.'];
    return {
      type: 'bar_v',
      title: 'Every lesson plan pulled here was for grades 1 to 5. Grades 6 to 12 got zero.',
      how: 'One bar per grade, counting curriculum-menu plans in six weeks. The orange bar is the empty one. Another 78 free-text plans carry no grade, so they are not here.',
      source: SRC1,
      yLabel: 'Lesson plans',
      items: labels.map(function (l, i) {
        return { label: l, value: vals[i], color: i === 5 ? 'orange' : 'teal',
          meaning: fmt(vals[i]) + ' curriculum-menu ' + plural(vals[i], 'plan', 'plans') + ' for ' + l.toLowerCase() + ' in six weeks.',
          explain: { title: l + ': ' + fmt(vals[i]) + ' ' + plural(vals[i], 'plan', 'plans'),
            text: 'Teachers at this school pulled ' + fmt(vals[i]) + ' ' + l.toLowerCase() + ' ' + plural(vals[i], 'plan', 'plans') + ' from the curriculum menu between 27 July and 7 September. ' + notes[i] } };
      })
    };
  })();

  CHARTS['05_benchmark'] = {
    type: 'bar_h',
    title: 'This school makes far more plans than most. But the share of its teachers using Rumi is only average.',
    how: 'Lesson plans in six weeks. Orange is this school. Teal is the middle school in Sihala sector and the middle school in all of ICT.',
    source: SRC1,
    xLabel: 'Lesson plans, 27 Jul to 7 Sep',
    items: [
      { label: 'IMCG Lohi Bher', value: 276, color: 'orange',
        meaning: '276 plans, 3.7 times the Sihala middle school.',
        explain: { title: 'IMCG Lohi Bher: 276 plans',
          text: 'This school made 276 plans, 3.7 times the middle Sihala school. But only 44.8% of its teachers made any plan at all, against 50.4% across Sihala and 47.6% across ICT. A big total carried by a few people, with average reach.' } },
      { label: 'Sihala sector (middle of 75 schools)', value: 74, color: 'teal',
        meaning: 'Half of the 75 Sihala schools made more than 74, half made fewer.',
        explain: { title: 'Sihala sector: 74 plans',
          text: '74 is the median for the 75 schools in Sihala sector: half of them made more than 74 plans in six weeks and half made fewer. Lohi Bher is one of those schools.' } },
      { label: 'ICT (middle of 450 schools)', value: 49, color: 'teal',
        meaning: 'Half of the 450 ICT schools made more than 49, half made fewer.',
        explain: { title: 'ICT: 49 plans',
          text: '49 is the median for all 450 federal schools in ICT. So the typical school made 49 plans in six weeks, and Lohi Bher made more than five times that.' } }
    ]
  };

  CHARTS['06_coaching'] = (function () {
    var cats = ['Teachers who used it', 'Sessions'];
    var ai = [12, 68], human = [6, 6];
    var text = [
      ['12 teachers at this school recorded at least one lesson for the AI coach between 27 July and 7 September.',
       '68 recordings in six weeks. A teacher presses record on their phone, and the AI writes feedback afterwards.'],
      ['6 teachers were observed in person by Moiz Khan, the NIETE coach.',
       '6 in-person observations, all on just two days, 20 and 31 August. All 6 got a debrief, a talk with the coach afterwards.']
    ];
    return {
      type: 'grouped',
      title: 'Teachers use the AI coach. The human coach has reached 6 of them.',
      how: 'The left pair counts teachers, the right pair counts sessions. Teal is a teacher recording their own lesson for the AI coach. Orange is Moiz observing in person.',
      source: SRC1,
      yLabel: 'Count',
      categories: cats,
      series: [
        { name: 'AI coach (self-recorded)', color: 'teal', values: ai },
        { name: 'Coach observation (in person)', color: 'orange', values: human }
      ],
      meaning: function (ci, si) { return text[si][ci].split('. ')[0] + '.'; },
      explain: function (ci, si) {
        return { title: (si === 0 ? 'AI coach' : 'Coach observation') + ', ' + cats[ci].toLowerCase() + ': ' + (si === 0 ? ai : human)[ci], text: text[si][ci] };
      }
    };
  })();

  CHARTS['07_fico_gaps'] = (function () {
    var ind = ['C10', 'C11', 'B6', 'C9', 'D3', 'B7'];
    var school = [25.0, 33.5, 34.9, 42.6, 50.4, 53.5];
    var ict = [27.7, 39.3, 41.0, 51.6, 54.1, 55.4];
    return {
      type: 'grouped',
      title: 'The school\'s six weakest FICO scores are all a little below the ICT average',
      how: 'Each pair is one FICO indicator, scored as a percent of the top mark. Orange is this school over 71 observations. Gray is all of ICT. Click a bar to see what the indicator means.',
      source: SRC1 + ' F5 to F7 left out: they are scored on every lesson whatever the subject.',
      yLabel: '% of maximum',
      categories: ind,
      series: [
        { name: 'IMCG Lohi Bher', color: 'orange', values: school.map(Math.round) },
        { name: 'ICT overall', color: 'gray', values: ict.map(Math.round) }
      ],
      meaning: function (ci, si) {
        var g = gloss(ind[ci]);
        return ind[ci] + ' ' + g.name + '. ' + (si === 0 ? 'This school' : 'All of ICT') + ' scored ' + Math.round((si === 0 ? school : ict)[ci]) + '% of the top mark.';
      },
      explain: function (ci, si) {
        var g = gloss(ind[ci]);
        return { title: ind[ci] + ' ' + g.name,
          text: g.plain + ' This school scored ' + school[ci].toFixed(1) + '% of the maximum across 71 observations. ICT as a whole scored ' + ict[ci].toFixed(1) + '%, so the school is ' + (ict[ci] - school[ci]).toFixed(1) + ' points behind here.' };
      }
    };
  })();

  CHARTS['08_feedback'] = {
    type: 'bar_h',
    title: 'Teachers say the plans are useful. Only 1 in 3 say they taught one.',
    how: '67 feedback answers from 11 teachers. The "taught it" questions were only asked about curriculum-menu plans, 33 answers, so those bars are shorter.',
    source: SRC1,
    xLabel: 'Responses',
    items: [
      { label: 'Rated useful', value: 64, color: 'teal', meaning: '64 of 67 answers said the plan was useful.',
        explain: { title: 'Rated useful: 64', text: 'After a plan arrives, Rumi asks the teacher if it was useful. 64 of the 67 answers said yes. That is almost everyone.' } },
      { label: 'Taught it in class', value: 11, color: 'green', meaning: '11 of the 33 who were asked said they taught it.',
        explain: { title: 'Taught it in class: 11', text: 'On curriculum-menu plans Rumi also asks whether the teacher used the plan in class. 11 of the 33 answers said yes, about one in three. Saying a plan is useful and actually teaching it are two different things.' } },
      { label: 'Planned to teach it', value: 13, color: 'sky', meaning: '13 said they would teach it later.',
        explain: { title: 'Planned to teach it: 13', text: '13 of the 33 answers said the teacher planned to teach the plan later. We do not know yet whether they did.' } },
      { label: 'Not yet taught', value: 9, color: 'gray', meaning: '9 said they had not taught it.',
        explain: { title: 'Not yet taught: 9', text: '9 of the 33 answers said the plan had not been taught. Together with the 13 "planned", that is 22 of 33 plans not yet used in a classroom when the teacher answered.' } },
      { label: 'Rated not useful', value: 3, color: 'orange', meaning: '3 of 67 answers said the plan was not useful.',
        explain: { title: 'Rated not useful: 3', text: 'Only 3 of the 67 answers said the plan was not useful. Teachers rarely say no to this question.' } }
    ]
  };

  CHARTS['09_two_phones'] = (function () {
    var labels = ['Raheela\nHaroon\'s phone', 'Raheela\nMoiz\'s phone', 'Raheela\nafter corrections',
      'Saima\nHaroon\'s phone', 'Saima\nMoiz\'s phone', 'Saima\nafter corrections'];
    var vals = [13, 10, 26, 25, 20, 24];
    var colors = ['teal', 'teal', 'orange', 'teal', 'teal', 'orange'];
    var texts = [
      'Haroon\'s phone recorded Raheela\'s Grade 3 English lesson. The machine scored it 13 out of 40 before anyone checked it.',
      'Moiz\'s phone, same room, same lesson, same 40 minutes. The machine scored it 10. Three points apart for one lesson.',
      'After Moiz went through the moves one by one and fixed the verdicts, Raheela\'s score rose from 10 to 26.',
      'Haroon\'s phone recorded Saima\'s Grade 2 English lesson. The machine scored it 25 out of 40.',
      'Moiz\'s phone recorded the same lesson. The machine scored it 20. Five points apart this time.',
      'After both coaches corrected it, Saima\'s score settled at 24, close to what Haroon\'s phone got.'
    ];
    return {
      type: 'bar_v',
      title: 'The same lesson, recorded on two phones, got two different scores',
      how: 'Fidelity out of 40, meaning how closely the lesson followed its plan. Teal is the machine\'s score from each phone before anyone touched it. Orange is after a coach corrected it.',
      source: SRC2,
      yLabel: 'Lesson-plan fidelity (of 40)',
      yMax: 40,
      legend: [{ name: 'Machine score', color: 'teal' }, { name: 'After coach corrections', color: 'orange' }],
      items: labels.map(function (l, i) {
        return { label: l, value: vals[i], color: colors[i],
          meaning: vals[i] + ' out of 40. ' + (colors[i] === 'teal' ? 'The machine\'s own score.' : 'The score after a coach corrected it.'),
          explain: { title: l.replace('\n', ', ') + ': ' + vals[i] + ' of 40', text: texts[i] } };
      })
    };
  })();

  CHARTS['10_quiz_funnel'] = (function () {
    var labels = ['Quizzes offered to teachers', 'Teachers offered one', 'Quizzes the teacher sent on', 'Teachers who sent one',
      'Children who opened one', 'Children who completed one', 'Teachers whose students took it'];
    var vals = [1199, 797, 305, 268, 493, 391, 118];
    var colors = ['navy', 'navy', 'blue', 'sky', 'sky', 'green', 'green'];
    var meaning = [
      'Offered: the app offered the teacher a quiz after their recording.',
      '797 different teachers were offered at least one quiz.',
      'Sent on: the teacher chose to send the quiz to their students.',
      '268 different teachers sent at least one quiz on.',
      'Opened: a child opened a quiz link.',
      'Completed: the child answered to the end.',
      '118 teachers had at least one student finish their quiz.'
    ];
    var texts = [
      'Offered: after a teacher records a lesson for the AI coach, the app builds a short quiz from what was taught and offers it to the teacher. 1,199 quizzes were offered across ICT in three days, with no announcement.',
      '797 different teachers were offered at least one quiz. Some got several, one per recording.',
      'Sent on: the teacher looked at the quiz and chose to send it to their students. 305 quizzes went out, about one in four of those offered.',
      '268 different teachers sent at least one quiz on to their class.',
      'Opened: a child, or a parent\'s phone, opened the quiz link. 493 children opened one.',
      'Completed: the child answered every question to the end. 391 of the 493 who opened a quiz finished it, about 8 in 10.',
      '118 teachers had at least one student finish their quiz, so the recording earned them something beyond a score.'
    ];
    return {
      type: 'bar_h',
      title: 'Two days after a quiet launch, 493 children had taken a quiz made from their teacher\'s lesson',
      how: 'Each bar is one step of the quiz journey, all of ICT, 6 to 8 September. Darker bars are earlier steps. Nobody announced the feature.',
      source: SRC2,
      xLabel: 'Count',
      items: labels.map(function (l, i) {
        return { label: l, value: vals[i], color: colors[i], meaning: meaning[i],
          explain: { title: l + ': ' + fmt(vals[i]), text: texts[i] } };
      })
    };
  })();

  CHARTS['11_correction_cost'] = {
    type: 'bar_h',
    title: 'Fixing one FICO observation properly takes a coach more than an hour',
    how: 'Four numbers side by side. Each bar has its own unit, so read the label. Orange is the total for today.',
    source: 'Source: FICO v2 rubric. Timings from the observer\'s own log, 8 Sep 2026.',
    xLabel: '',
    items: [
      { label: 'Indicators in one observation', value: 37, color: 'teal', meaning: 'A coach checks 37 separate points for every lesson.',
        explain: { title: '37 indicators per observation', text: 'FICO has 37 indicators. Each one needs its own score from 1 to 4 and a reason. Correcting an observation means going through all 37.' } },
      { label: 'Minutes per correction (about)', value: 22, color: 'teal', meaning: 'Roughly 20 to 25 minutes of reading, listening again and rescoring.',
        explain: { title: 'About 22 minutes per correction', text: 'Haroon timed the corrections at roughly 20 to 25 minutes each: read the transcript, listen to the recording again, change the score and write why.' } },
      { label: 'Observations Moiz did today', value: 3, color: 'teal', meaning: 'Three lessons observed in person on 8 September.',
        explain: { title: '3 observations today', text: 'Moiz observed three lessons on 8 September: Raheela, Saima and one more. Each needs its own correction pass.' } },
      { label: 'Minutes to correct all three (about)', value: 200, color: 'orange', meaning: 'Over three hours of paperwork for one day of visits.',
        explain: { title: 'About 200 minutes for the day', text: 'Correcting all three observations properly takes about 200 minutes, more than three hours. Two coaches in one room spent the afternoon on paperwork, not with teachers.' } }
    ]
  };

  CHARTS['12_b_indicators_two_phones'] = (function () {
    var ind = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10'];
    var haroon = [3, 3, 3, 2, 4, 2, 3, 3, 3, 3];
    var moiz = [2, 3, 3, 2, 3, 2, 3, 1, 3, 1];
    return {
      type: 'grouped',
      title: 'Two recordings of one lesson: the machine agreed on six scores and split on four',
      how: 'Ten fidelity indicators from Raheela\'s Grade 3 lesson, each scored 1 to 4 by the machine. Teal is Haroon\'s phone, orange is Moiz\'s phone. Click a bar to see what the indicator means.',
      source: SRC2,
      yLabel: 'Score (of 4)',
      yMax: 4,
      categories: ind,
      series: [
        { name: 'Haroon\'s recording', color: 'teal', values: haroon },
        { name: 'Moiz\'s recording', color: 'orange', values: moiz }
      ],
      meaning: function (ci, si) {
        var g = gloss(ind[ci]);
        return ind[ci] + ' ' + g.name + '. ' + (si === 0 ? 'Haroon\'s' : 'Moiz\'s') + ' phone: ' + (si === 0 ? haroon : moiz)[ci] + ' out of 4.';
      },
      explain: function (ci) {
        var g = gloss(ind[ci]), d = Math.abs(haroon[ci] - moiz[ci]);
        return { title: ind[ci] + ' ' + g.name,
          text: g.plain + ' From Haroon\'s phone the machine gave ' + haroon[ci] + ' out of 4. From Moiz\'s phone it gave ' + moiz[ci] + '. ' +
            (d === 0 ? 'The two recordings agree here.' : 'Same lesson, ' + d + ' ' + plural(d, 'point', 'points') + ' apart, only because a different phone was listening.') };
      }
    };
  })();

  /* --------------------------------------------------------------- helpers */
  var NS = 'http://www.w3.org/2000/svg';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function svg(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function color(name) { return 'var(--ch-' + name + ')'; }
  function estW(str, size) { return String(str).length * (size || 12.5) * 0.56; }
  function wrap(str, maxChars) {
    var out = [];
    String(str).split('\n').forEach(function (line) {
      var words = line.split(' '), cur = '';
      words.forEach(function (w) {
        if (cur && (cur + ' ' + w).length > maxChars) { out.push(cur); cur = w; }
        else cur = cur ? cur + ' ' + w : w;
      });
      if (cur) out.push(cur);
    });
    return out;
  }
  function textLines(parent, lines, x, y, cls, anchor, lineH) {
    var t = svg('text', { x: x, y: y, 'text-anchor': anchor || 'start', 'class': cls }, parent);
    lines.forEach(function (l, i) {
      var ts = svg('tspan', { x: x, dy: i === 0 ? 0 : (lineH || 15) }, t);
      ts.textContent = l;
    });
    return t;
  }
  function niceStep(max, target) {
    var raw = max / (target || 5), p = Math.pow(10, Math.floor(Math.log10(raw)));
    var c = raw / p;
    var s = c <= 1 ? 1 : c <= 2 ? 2 : c <= 5 ? 5 : 10;
    return s * p;
  }
  function ticks(max, target) {
    var step = niceStep(max, target), top = Math.ceil(max / step) * step, out = [];
    if (max / top < 0.72 && (step / 2 >= 1 || max < 2)) { step = step / 2; top = Math.ceil(max / step) * step; }
    for (var v = 0; v <= top + 1e-9; v += step) out.push(+v.toFixed(6));
    return { step: step, top: top, values: out };
  }

  function bind(target, chart, item, opts) {
    target.setAttribute('tabindex', '0');
    target.setAttribute('role', 'img');
    target.setAttribute('aria-label', item.aria);
    target.addEventListener('mouseenter', function () { showTip(chart, target, item, opts); });
    target.addEventListener('mousemove', function () { showTip(chart, target, item, opts); });
    target.addEventListener('mouseleave', function () { hideTip(chart); });
    target.addEventListener('focus', function () { showTip(chart, target, item, opts); });
    target.addEventListener('blur', function () { hideTip(chart); });
    target.addEventListener('click', function (ev) { ev.preventDefault(); toggleExplain(chart, target, item); });
    target.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); toggleExplain(chart, target, item); }
      if (ev.key === 'Escape') { closeExplain(chart); }
    });
  }

  function showTip(chart, target, item, opts) {
    var tip = chart._tip;
    tip.innerHTML = '';
    var b = el('b', null, item.label); tip.appendChild(b);
    var v = el('span', 'v', item.valueText); tip.appendChild(v);
    if (item.meaning) tip.appendChild(el('span', 'm', item.meaning));
    tip.classList.add('show');
    var r = target.getBoundingClientRect(), c = chart.getBoundingClientRect();
    var ax = (opts && opts.anchor === 'end') ? Math.min(r.right, r.left + 140) : r.left + r.width / 2;
    ax -= c.left;
    var w = tip.offsetWidth, h = tip.offsetHeight, cw = chart.clientWidth;
    var left = Math.max(6, Math.min(cw - w - 6, ax - w / 2));
    var top = r.top - c.top - h - 12;
    tip.classList.remove('below');
    if (top < 0) { top = r.bottom - c.top + 12; tip.classList.add('below'); }
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
    tip.style.setProperty('--tip-arrow', Math.max(12, Math.min(w - 12, ax - left)) + 'px');
  }
  function hideTip(chart) { chart._tip.classList.remove('show'); }

  function toggleExplain(chart, target, item) {
    if (chart._open === target) { closeExplain(chart); return; }
    closeExplain(chart);
    var panel = chart._explain, ex = item.explain || { title: item.label, text: item.meaning || '' };
    panel.innerHTML = '';
    panel.appendChild(el('b', null, ex.title));
    panel.appendChild(el('span', null, ex.text));
    var hint = el('span', 'hint', 'Press Escape or the cross to close.');
    panel.appendChild(hint);
    var btn = el('button', null, '×');
    btn.setAttribute('aria-label', 'Close explanation');
    btn.addEventListener('click', function () { closeExplain(chart); target.focus(); });
    panel.appendChild(btn);
    panel.hidden = false;
    target.classList.add('is-open');
    chart._open = target;
  }
  function closeExplain(chart) {
    if (chart._open) chart._open.classList.remove('is-open');
    chart._open = null;
    chart._explain.hidden = true;
  }

  /* -------------------------------------------------------------- drawers */
  function drawBarH(chart, spec, W) {
    var items = spec.items, n = items.length;
    var maxChars = W < 480 ? 16 : W < 700 ? 24 : 34;
    var lines = items.map(function (it) { return wrap(it.label, maxChars); });
    var longest = 0;
    lines.forEach(function (ls) { ls.forEach(function (l) { longest = Math.max(longest, estW(l)); }); });
    var padL = Math.min(Math.ceil(longest) + 16, W * 0.45), padR = 64, padT = 8;
    var padB = spec.xLabel ? 34 : 14;
    var rowH = n > 9 ? 27 : 32;
    var rows = lines.map(function (ls) { return Math.max(rowH, ls.length * 15 + 10); });
    var H = padT + rows.reduce(function (a, b) { return a + b; }, 0) + padB;
    var plotW = W - padL - padR;
    var max = Math.max.apply(null, items.map(function (i) { return i.value; }));
    var tk = ticks(max, 4);
    var sx = function (v) { return padL + v / tk.top * plotW; };

    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H, role: 'presentation', 'aria-hidden': 'false' });
    var baseY = H - padB;
    tk.values.forEach(function (v) {
      svg('line', { x1: sx(v), x2: sx(v), y1: padT, y2: baseY, 'class': 'ch-grid' }, s);
      if (spec.xLabel) {
        var t = svg('text', { x: sx(v), y: baseY + 16, 'text-anchor': 'middle', 'class': 'ch-tick' }, s);
        t.textContent = fmt(v);
      }
    });
    svg('line', { x1: padL, x2: padL, y1: padT, y2: baseY, 'class': 'ch-base' }, s);
    if (spec.xLabel) {
      var xl = svg('text', { x: padL + plotW / 2, y: H - 2, 'text-anchor': 'middle', 'class': 'ch-axis-label' }, s);
      xl.textContent = spec.xLabel;
    }
    var y = padT;
    items.forEach(function (it, i) {
      var rh = rows[i], bh = Math.min(22, rh - 8), cy = y + rh / 2;
      var ls = lines[i];
      var t = textLines(s, ls, padL - 10, cy - (ls.length - 1) * 7.5 + 4, 'ch-cat', 'end', 15);
      var w = Math.max(0, sx(it.value) - padL);
      var r = svg('rect', { x: padL, y: cy - bh / 2, width: w, height: bh, rx: 2, fill: color(it.color), 'class': 'ch-bar h' }, s);
      var v = svg('text', { x: padL + w + 7, y: cy + 4.5, 'class': 'ch-val' }, s);
      v.textContent = fmt(it.value);
      bind(r, chart, { label: it.label.replace('\n', ' '), valueText: fmt(it.value), meaning: it.meaning, explain: it.explain,
        aria: it.label.replace('\n', ' ') + ': ' + fmt(it.value) }, { anchor: 'end' });
      y += rh;
    });
    return s;
  }

  function drawBarsV(chart, spec, W, categories, series, perItem) {
    var n = categories.length, k = series.length;
    var maxChars = Math.max(6, Math.floor(((W - 58) / n) / 7.6));
    var lines = categories.map(function (c) { return wrap(c, maxChars); });
    var maxLines = Math.max.apply(null, lines.map(function (l) { return l.length; }));
    var padL = 46, padR = 12, padT = 26, padB = 14 + maxLines * 15 + (spec.yLabel ? 4 : 0);
    var plotH = Math.max(200, Math.min(300, W * 0.4));
    var H = padT + plotH + padB;
    var plotW = W - padL - padR;
    var all = [];
    series.forEach(function (sr) { sr.values.forEach(function (v) { all.push(v); }); });
    var max = spec.yMax || Math.max.apply(null, all);
    var tk = spec.yMax ? { step: niceStep(spec.yMax, 4), top: spec.yMax, values: null } : ticks(max, 4);
    if (!tk.values) { tk.values = []; for (var q = 0; q <= tk.top + 1e-9; q += tk.step) tk.values.push(q); }
    var baseY = padT + plotH;
    var sy = function (v) { return baseY - v / tk.top * plotH; };

    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H, role: 'presentation' });
    tk.values.forEach(function (v) {
      svg('line', { x1: padL, x2: W - padR, y1: sy(v), y2: sy(v), 'class': v === 0 ? 'ch-base' : 'ch-grid' }, s);
      var t = svg('text', { x: padL - 8, y: sy(v) + 4, 'text-anchor': 'end', 'class': 'ch-tick' }, s);
      t.textContent = fmt(v);
    });
    if (spec.yLabel) {
      var yl = svg('text', { x: 0, y: 0, 'class': 'ch-axis-label', transform: 'translate(12 ' + (padT + plotH / 2) + ') rotate(-90)', 'text-anchor': 'middle' }, s);
      yl.textContent = spec.yLabel;
    }
    var groupW = plotW / n;
    var inner = Math.min(groupW * 0.78, k * 64 + (k - 1) * 4);
    var barW = (inner - (k - 1) * 4) / k;
    categories.forEach(function (c, ci) {
      var gx = padL + groupW * ci + (groupW - inner) / 2;
      textLines(s, lines[ci], padL + groupW * ci + groupW / 2, baseY + 18, 'ch-cat' + (lines[ci].length > 1 ? ' dim' : ''), 'middle', 15);
      series.forEach(function (sr, si) {
        var v = sr.values[ci], x = gx + si * (barW + 4);
        var top = sy(v), h = baseY - top;
        var itm = perItem(ci, si);
        var r = svg('rect', { x: x, y: top, width: barW, height: h, rx: 2, fill: color(itm.color), 'class': 'ch-bar v' }, s);
        var vt = svg('text', { x: x + barW / 2, y: top - 6, 'text-anchor': 'middle', 'class': 'ch-val' }, s);
        vt.textContent = fmt(v);
        if (k > 1) vt.style.fill = itm.color === 'gray' ? 'var(--ink-3)' : color(itm.color);
        bind(r, chart, itm);
      });
    });
    return s;
  }

  function drawBarV(chart, spec, W) {
    if (W < 560 && spec.items.length >= 5) {
      return drawBarH(chart, { items: spec.items, xLabel: spec.yLabel, yMax: spec.yMax }, W);
    }
    var cats = spec.items.map(function (i) { return i.label; });
    var series = [{ values: spec.items.map(function (i) { return i.value; }) }];
    return drawBarsV(chart, spec, W, cats, series, function (ci) {
      var it = spec.items[ci];
      return { color: it.color, label: it.label.replace('\n', ', '), valueText: fmt(it.value), meaning: it.meaning, explain: it.explain,
        aria: it.label.replace('\n', ', ') + ': ' + fmt(it.value) };
    });
  }

  function drawGrouped(chart, spec, W) {
    return drawBarsV(chart, spec, W, spec.categories, spec.series, function (ci, si) {
      var sr = spec.series[si], v = sr.values[ci];
      return { color: sr.color, label: spec.categories[ci] + ' · ' + sr.name, valueText: fmt(v),
        meaning: spec.meaning ? spec.meaning(ci, si) : '', explain: spec.explain ? spec.explain(ci, si) : null,
        aria: sr.name + ', ' + spec.categories[ci] + ': ' + fmt(v) };
    });
  }

  function drawTrend(chart, spec, W) {
    var n = spec.x.length;
    var padL = 46, padR = 28, padT = 26, padB = 52;
    var plotH = Math.max(200, Math.min(300, W * 0.4));
    var H = padT + plotH + padB, plotW = W - padL - padR;
    var all = [];
    spec.series.forEach(function (sr) { sr.values.forEach(function (v) { all.push(v); }); });
    var tk = ticks(Math.max.apply(null, all), 4);
    /* label side per point: above by default; when two series sit within 22px at the same x,
       the lower one goes below so the numbers never overlap */
    var side = spec.series.map(function (sr) { return sr.values.map(function () { return -1; }); });
    var baseY = padT + plotH;
    var sx = function (i) { return padL + (n === 1 ? plotW / 2 : i / (n - 1) * plotW); };
    var sy = function (v) { return baseY - v / tk.top * plotH; };

    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H, role: 'presentation' });
    tk.values.forEach(function (v) {
      svg('line', { x1: padL, x2: W - padR, y1: sy(v), y2: sy(v), 'class': v === 0 ? 'ch-base' : 'ch-grid' }, s);
      var t = svg('text', { x: padL - 8, y: sy(v) + 4, 'text-anchor': 'end', 'class': 'ch-tick' }, s);
      t.textContent = fmt(v);
    });
    if (spec.yLabel) {
      var yl = svg('text', { x: 0, y: 0, 'class': 'ch-axis-label', transform: 'translate(12 ' + (padT + plotH / 2) + ') rotate(-90)', 'text-anchor': 'middle' }, s);
      yl.textContent = spec.yLabel;
    }
    var skip = Math.max(1, Math.ceil(n * 50 / plotW));
    var show = spec.x.map(function (_, i) { return i % skip === 0; });
    if (skip > 1 && !show[n - 1]) { if ((n - 1) % skip < skip / 2) show[n - 1 - (n - 1) % skip] = false; show[n - 1] = true; }
    spec.x.forEach(function (lab, i) {
      if (!show[i]) return;
      var t = svg('text', { x: sx(i), y: baseY + 38, 'text-anchor': i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle', 'class': 'ch-cat dim' }, s);
      t.textContent = lab;
    });
    spec.x.forEach(function (_, i) {
      for (var a = 0; a < spec.series.length; a++) for (var b = a + 1; b < spec.series.length; b++) {
        var va = spec.series[a].values[i], vb = spec.series[b].values[i];
        if (Math.abs(sy(va) - sy(vb)) < 22) { if (va >= vb) side[b][i] = 1; else side[a][i] = 1; }
      }
    });
    spec.series.forEach(function (sr, si) {
      var d = sr.values.map(function (v, i) { return (i ? 'L' : 'M') + sx(i).toFixed(1) + ' ' + sy(v).toFixed(1); }).join(' ');
      svg('path', { d: d, stroke: color(sr.color), 'class': 'ch-line', pathLength: 1 }, s);
    });
    /* points drawn after all lines so they sit on top; labels above for series 0, below for series 1 */
    spec.series.forEach(function (sr, si) {
      sr.values.forEach(function (v, i) {
        var g = svg('g', { 'class': 'ch-pt' }, s);
        svg('circle', { cx: sx(i), cy: sy(v), r: 14, 'class': 'ch-hit' }, g);
        svg('circle', { cx: sx(i), cy: sy(v), r: 5.5, fill: color(sr.color) }, g);
        var lab = svg('text', { x: sx(i), y: sy(v) + (side[si][i] < 0 ? -11 : 20), 'text-anchor': 'middle', 'class': 'ch-val' }, s);
        lab.style.fill = color(sr.color);
        lab.textContent = fmt(v);
        bind(g, chart, { label: sr.name + ', week of ' + spec.x[i].replace('*', ''), valueText: fmt(v),
          meaning: sr.meaning ? sr.meaning(i) : '', explain: spec.explain ? spec.explain(i) : null,
          aria: sr.name + ', week of ' + spec.x[i].replace('*', '') + ': ' + fmt(v) });
      });
    });
    return s;
  }

  var DRAW = { trend: drawTrend, bar_h: drawBarH, bar_v: drawBarV, grouped: drawGrouped };

  /* -------------------------------------------------------------- render */
  function legendFor(spec) {
    if (spec.legend) return spec.legend;
    if (spec.series && spec.series.length > 1) return spec.series.map(function (s) { return { name: s.name, color: s.color, line: spec.type === 'trend' }; });
    return null;
  }

  function render(chart) {
    var id = chart.getAttribute('data-chart'), spec = CHARTS[id];
    Array.prototype.slice.call(chart.children).forEach(function (c) { if (c.tagName !== 'NOSCRIPT') c.remove(); });
    chart.classList.add('chart');
    if (!spec) { chart.appendChild(el('p', 'chart-sub', 'Missing chart: ' + id)); return; }
    if (!reduced) chart.classList.add('anim');
    chart.setAttribute('role', 'group');
    chart.setAttribute('aria-label', spec.title);

    chart.appendChild(el('h3', 'chart-title', spec.title));
    var sub = el('p', 'chart-sub');
    var hb = el('b', null, 'How to read this: '); sub.appendChild(hb);
    sub.appendChild(document.createTextNode(spec.how));
    chart.appendChild(sub);

    var lg = legendFor(spec);
    if (lg) {
      var ul = el('ul', 'chart-legend');
      ul.setAttribute('aria-label', 'Legend');
      lg.forEach(function (l) {
        var li = el('li'); var sw = el('i', l.line ? 'line' : ''); sw.style.background = color(l.color);
        li.appendChild(sw); li.appendChild(document.createTextNode(l.name)); ul.appendChild(li);
      });
      chart.appendChild(ul);
    }

    var plot = el('div', 'chart-plot'); chart.appendChild(plot);
    var explain = el('div', 'chart-explain'); explain.hidden = true; explain.setAttribute('aria-live', 'polite'); chart.appendChild(explain);
    chart.appendChild(el('p', 'chart-hint', 'Hover or tap a bar for the number. Click it, or press Enter, for what it means.'));
    chart.appendChild(el('p', 'chart-src', spec.source));
    var tip = el('div', 'chart-tip'); tip.setAttribute('role', 'tooltip'); chart.appendChild(tip);
    chart._tip = tip; chart._explain = explain; chart._open = null;

    var lastW = 0;
    function draw() {
      var w = Math.round(plot.clientWidth) || 720;
      w = Math.max(300, w);
      if (Math.abs(w - lastW) < 6) return;
      lastW = w;
      closeExplain(chart);
      plot.innerHTML = '';
      plot.appendChild(DRAW[spec.type](chart, spec, w));
      if (lastW && chart.classList.contains('anim') && chart._drawn) chart.classList.remove('anim');
      chart._drawn = true;
    }
    draw();
    if (window.ResizeObserver) {
      var t;
      new ResizeObserver(function () { clearTimeout(t); t = setTimeout(draw, 80); }).observe(plot);
    } else {
      window.addEventListener('resize', function () { clearTimeout(chart._rt); chart._rt = setTimeout(draw, 120); });
    }
  }

  function renderAll(root) {
    var nodes = (root || document).querySelectorAll('.chart[data-chart], [data-chart]');
    Array.prototype.forEach.call(nodes, function (n) { if (!n._rumiChart) { n._rumiChart = true; render(n); } });
  }

  window.RumiCharts = { render: render, renderAll: renderAll, charts: CHARTS };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { renderAll(); });
  else renderAll();
})();
