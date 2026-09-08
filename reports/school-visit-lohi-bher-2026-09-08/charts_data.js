/* IMCG Lohi Bher, 8 Sep 2026: the chart specs for charts.js (format: CHARTS_SPEC.md).
   Numbers copied from make_charts.py (charts 01-08, pulled 7 Sep 2026, rules v0.33.4)
   and make_charts_visit.py (charts 09-12, pulled 8 Sep 2026, rules v0.34.3).
   Every sentence the reader can see (tooltip "meaning", click-panel "explain") is precomputed here;
   the engine only formats numbers and looks codes up in window.RUMI_GLOSSARY when glossary: true. */
window.RUMI_CHARTS = (function () {
  var SRC1 = 'Source: Niete_Rumi_db (ICT/Islamabad), governed query rules v0.33.4. Window 27 Jul to 7 Sep 2026. Pulled 7 Sep 2026.';
  var SRC2 = 'Source: Niete_Rumi_db (ICT/Islamabad), governed rules v0.34.3. Pulled 8 Sep 2026.';

  return {
    '01_weekly_trend': {
      type: 'trend',
      title: 'This school woke up in the middle of August, when the lesson-plan menu arrived',
      how: 'Each dot is one week. Higher means more lesson plans were made that week. The last week is only one day.',
      source: SRC1,
      ylabel: 'Lesson plans',
      x: ['28 Jul', '4 Aug', '11 Aug', '18 Aug', '25 Aug', '1 Sep', '8 Sep*'],
      pointLabel: '{series}, week of {x}',
      series: [
        { name: 'Curriculum menu', color: 'teal', values: [0, 0, 0, 78, 42, 63, 15],
          meaning: ['0 plans picked from the curriculum menu that week.', '0 plans picked from the curriculum menu that week.',
            '0 plans picked from the curriculum menu that week.', '78 plans picked from the curriculum menu that week.',
            '42 plans picked from the curriculum menu that week.', '63 plans picked from the curriculum menu that week.',
            '15 plans picked from the curriculum menu that week.'] },
        { name: 'Free-text (typed request)', color: 'orange', values: [2, 5, 7, 15, 26, 23, 0],
          meaning: ['2 plans made by typing a request in words.', '5 plans made by typing a request in words.',
            '7 plans made by typing a request in words.', '15 plans made by typing a request in words.',
            '26 plans made by typing a request in words.', '23 plans made by typing a request in words.',
            '0 plans made by typing a request in words.'] }
      ],
      explain: {
        '28 Jul': { title: 'Week of 28 Jul', text: '0 from the curriculum menu and 2 free-text. The menu did not exist yet. The only way to get a plan was to type what you wanted.' },
        '4 Aug': { title: 'Week of 4 Aug', text: '0 from the curriculum menu and 5 free-text. Still only the typed route. Five plans in the whole week.' },
        '11 Aug': { title: 'Week of 11 Aug', text: '0 from the curriculum menu and 7 free-text. Slow growth on the typed route. The menu was still a week away.' },
        '18 Aug': { title: 'Week of 18 Aug', text: '78 from the curriculum menu and 15 free-text. The curriculum menu arrived this week, and the school had its biggest week: 93 plans in total.' },
        '25 Aug': { title: 'Week of 25 Aug', text: '42 from the curriculum menu and 26 free-text. The first rush settled. Free-text had its highest week, 26.' },
        '1 Sep': { title: 'Week of 1 Sep', text: '63 from the curriculum menu and 23 free-text. The menu still carries about two out of every three plans.' },
        '8 Sep': { title: 'Week of 8 Sep', text: '15 from the curriculum menu and 0 free-text. This is one day only, the Monday, so do not compare it with a full week.' }
      }
    },

    '02_teacher_volume': {
      type: 'bar_h',
      title: 'Three teachers make 6 out of every 10 lesson plans at this school',
      how: 'One bar per teacher. Longer means more lesson plans in six weeks. Orange marks the top three. Sixteen other teachers made none, so they have no bar.',
      source: SRC1,
      xlabel: 'Lesson plans, 27 Jul to 7 Sep',
      labels: ['Samina Saleem', 'Shazia Perveen', 'Saeeda Bibi', 'Saima Sajida', 'Asifa Rafique', 'Humaira Habib',
        'Khalida Sultana', 'Naheed Akhter', 'Raheela Safdar', 'Afia Arbab', 'Aqeela bibi', 'Amber Nosheen', 'Sadia Minhas'],
      values: [102, 33, 31, 26, 18, 17, 13, 9, 8, 6, 6, 4, 3],
      color: 'teal', highlight: [0, 1, 2], highlightColor: 'orange',
      meaning: ['102 lesson plans in six weeks, 37% of the school\'s total.', '33 lesson plans in six weeks, 12% of the school\'s total.',
        '31 lesson plans in six weeks, 11% of the school\'s total.', '26 lesson plans in six weeks, 9% of the school\'s total.',
        '18 lesson plans in six weeks, 7% of the school\'s total.', '17 lesson plans in six weeks, 6% of the school\'s total.',
        '13 lesson plans in six weeks, 5% of the school\'s total.', '9 lesson plans in six weeks, 3% of the school\'s total.',
        '8 lesson plans in six weeks, 3% of the school\'s total.', '6 lesson plans in six weeks, 2% of the school\'s total.',
        '6 lesson plans in six weeks, 2% of the school\'s total.', '4 lesson plans in six weeks, 1% of the school\'s total.',
        '3 lesson plans in six weeks, 1% of the school\'s total.'],
      explain: {
        'Samina Saleem': { title: 'Samina Saleem: 102 lesson plans', text: 'This counts the lesson plans Samina Saleem made on Rumi between 27 July and 7 September, six weeks. 102 is 37% of the 276 plans the whole school made. Samina Saleem is one of the three teachers who together make about 60% of the school\'s plans. Nobody else comes close: the next teacher made 33.' },
        'Shazia Perveen': { title: 'Shazia Perveen: 33 lesson plans', text: 'This counts the lesson plans Shazia Perveen made on Rumi between 27 July and 7 September, six weeks. 33 is 12% of the 276 plans the whole school made. Shazia Perveen is one of the three teachers who together make about 60% of the school\'s plans.' },
        'Saeeda Bibi': { title: 'Saeeda Bibi: 31 lesson plans', text: 'This counts the lesson plans Saeeda Bibi made on Rumi between 27 July and 7 September, six weeks. 31 is 11% of the 276 plans the whole school made. Saeeda Bibi is one of the three teachers who together make about 60% of the school\'s plans.' },
        'Saima Sajida': { title: 'Saima Sajida: 26 lesson plans', text: 'This counts the lesson plans Saima Sajida made on Rumi between 27 July and 7 September, six weeks. 26 is 9% of the 276 plans the whole school made.' },
        'Asifa Rafique': { title: 'Asifa Rafique: 18 lesson plans', text: 'This counts the lesson plans Asifa Rafique made on Rumi between 27 July and 7 September, six weeks. 18 is 7% of the 276 plans the whole school made.' },
        'Humaira Habib': { title: 'Humaira Habib: 17 lesson plans', text: 'This counts the lesson plans Humaira Habib made on Rumi between 27 July and 7 September, six weeks. 17 is 6% of the 276 plans the whole school made.' },
        'Khalida Sultana': { title: 'Khalida Sultana: 13 lesson plans', text: 'This counts the lesson plans Khalida Sultana made on Rumi between 27 July and 7 September, six weeks. 13 is 5% of the 276 plans the whole school made.' },
        'Naheed Akhter': { title: 'Naheed Akhter: 9 lesson plans', text: 'This counts the lesson plans Naheed Akhter made on Rumi between 27 July and 7 September, six weeks. 9 is 3% of the 276 plans the whole school made.' },
        'Raheela Safdar': { title: 'Raheela Safdar: 8 lesson plans', text: 'This counts the lesson plans Raheela Safdar made on Rumi between 27 July and 7 September, six weeks. 8 is 3% of the 276 plans the whole school made.' },
        'Afia Arbab': { title: 'Afia Arbab: 6 lesson plans', text: 'This counts the lesson plans Afia Arbab made on Rumi between 27 July and 7 September, six weeks. 6 is 2% of the 276 plans the whole school made.' },
        'Aqeela bibi': { title: 'Aqeela bibi: 6 lesson plans', text: 'This counts the lesson plans Aqeela bibi made on Rumi between 27 July and 7 September, six weeks. 6 is 2% of the 276 plans the whole school made.' },
        'Amber Nosheen': { title: 'Amber Nosheen: 4 lesson plans', text: 'This counts the lesson plans Amber Nosheen made on Rumi between 27 July and 7 September, six weeks. 4 is 1% of the 276 plans the whole school made.' },
        'Sadia Minhas': { title: 'Sadia Minhas: 3 lesson plans', text: 'This counts the lesson plans Sadia Minhas made on Rumi between 27 July and 7 September, six weeks. 3 is 1% of the 276 plans the whole school made.' }
      }
    },

    '03_dormant_by_level': {
      type: 'grouped_bar',
      title: 'The teachers who never started are mostly the ones who teach only primary',
      how: 'Teachers grouped by the classes they teach. Teal made at least one plan in six weeks, gray made none. The number in brackets is how many teachers are in the group.',
      source: SRC1,
      ylabel: 'Teachers',
      categories: ['Primary only (8)', 'Middle/high only (15)', 'Both (6)'],
      series: [
        { name: 'Made plans', color: 'teal', values: [1, 6, 6],
          meaning: ['1 of the 8 teachers who teach only primary classes, grades 1 to 5 made at least one plan.',
            '6 of the 15 teachers who teach only middle or high classes, grades 6 to 12 made at least one plan.',
            '6 of the 6 teachers who teach both primary and higher classes made at least one plan.'] },
        { name: 'Made none', color: 'gray', values: [7, 9, 0],
          meaning: ['7 of the 8 teachers who teach only primary classes, grades 1 to 5 made no plan at all.',
            '9 of the 15 teachers who teach only middle or high classes, grades 6 to 12 made no plan at all.',
            '0 of the 6 teachers who teach both primary and higher classes made no plan at all.'] }
      ],
      explain: {
        'Primary only (8) | Made plans': { title: 'Primary only: 1 made plans', text: '8 teachers at this school teach only primary classes, grades 1 to 5. 1 of them made a lesson plan in six weeks and 7 made none. That is the odd part. Rumi\'s library is mostly primary, so these teachers should find it the easiest to use.' },
        'Primary only (8) | Made none': { title: 'Primary only: 7 made none', text: '8 teachers at this school teach only primary classes, grades 1 to 5. 1 of them made a lesson plan in six weeks and 7 made none. That is the odd part. Rumi\'s library is mostly primary, so these teachers should find it the easiest to use.' },
        'Middle/high only (15) | Made plans': { title: 'Middle/high only: 6 made plans', text: '15 teachers at this school teach only middle or high classes, grades 6 to 12. 6 of them made a lesson plan in six weeks and 9 made none. Rumi had no grade 6 to 12 plans until 30 hours before our visit, so these teachers had little to pull.' },
        'Middle/high only (15) | Made none': { title: 'Middle/high only: 9 made none', text: '15 teachers at this school teach only middle or high classes, grades 6 to 12. 6 of them made a lesson plan in six weeks and 9 made none. Rumi had no grade 6 to 12 plans until 30 hours before our visit, so these teachers had little to pull.' },
        'Both (6) | Made plans': { title: 'Both: 6 made plans', text: '6 teachers at this school teach both primary and higher classes. 6 of them made a lesson plan in six weeks and 0 made none. Nobody in this group was dormant.' },
        'Both (6) | Made none': { title: 'Both: 0 made none', text: '6 teachers at this school teach both primary and higher classes. 6 of them made a lesson plan in six weeks and 0 made none. Nobody in this group was dormant.' }
      }
    },

    '04_grade_gap': {
      type: 'bar_v',
      title: 'Every lesson plan pulled here was for grades 1 to 5. Grades 6 to 12 got zero.',
      how: 'One bar per grade, counting curriculum-menu plans in six weeks. The orange bar is the empty one. Another 78 free-text plans carry no grade, so they are not here.',
      source: SRC1,
      ylabel: 'Lesson plans',
      labels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grades 6-12'],
      values: [21, 19, 22, 104, 32, 0],
      color: 'teal', highlight: 5, highlightColor: 'orange',
      meaning: ['21 curriculum-menu plans for grade 1 in six weeks.', '19 curriculum-menu plans for grade 2 in six weeks.',
        '22 curriculum-menu plans for grade 3 in six weeks.', '104 curriculum-menu plans for grade 4 in six weeks.',
        '32 curriculum-menu plans for grade 5 in six weeks.', '0 curriculum-menu plans for grades 6-12 in six weeks.'],
      explain: {
        'Grade 1': { title: 'Grade 1: 21 plans', text: 'Teachers at this school pulled 21 grade 1 plans from the curriculum menu between 27 July and 7 September.' },
        'Grade 2': { title: 'Grade 2: 19 plans', text: 'Teachers at this school pulled 19 grade 2 plans from the curriculum menu between 27 July and 7 September.' },
        'Grade 3': { title: 'Grade 3: 22 plans', text: 'Teachers at this school pulled 22 grade 3 plans from the curriculum menu between 27 July and 7 September.' },
        'Grade 4': { title: 'Grade 4: 104 plans', text: 'Teachers at this school pulled 104 grade 4 plans from the curriculum menu between 27 July and 7 September. That is more than half of the 198 menu plans at this school. The two heaviest users of grade 4 material teach middle or high classes.' },
        'Grade 5': { title: 'Grade 5: 32 plans', text: 'Teachers at this school pulled 32 grade 5 plans from the curriculum menu between 27 July and 7 September.' },
        'Grades 6-12': { title: 'Grades 6-12: 0 plans', text: 'Teachers at this school pulled 0 grades 6-12 plans from the curriculum menu between 27 July and 7 September. 21 of the 29 teachers here teach these grades. The grade 6 to 12 plans only went live 30 hours before our visit, and nobody at this school had tried them yet.' }
      }
    },

    '05_benchmark': {
      type: 'bar_h',
      title: 'This school makes far more plans than most. But the share of its teachers using Rumi is only average.',
      how: 'Lesson plans in six weeks. Orange is this school. Teal is the middle school in Sihala sector and the middle school in all of ICT.',
      source: SRC1,
      xlabel: 'Lesson plans, 27 Jul to 7 Sep',
      labels: ['IMCG Lohi Bher', 'Sihala sector (middle of 75 schools)', 'ICT (middle of 450 schools)'],
      values: [276, 74, 49],
      colors: ['orange', 'teal', 'teal'],
      meaning: ['276 plans, 3.7 times the Sihala middle school.',
        'Half of the 75 Sihala schools made more than 74, half made fewer.',
        'Half of the 450 ICT schools made more than 49, half made fewer.'],
      explain: {
        'IMCG Lohi Bher': { title: 'IMCG Lohi Bher: 276 plans', text: 'This school made 276 plans, 3.7 times the middle Sihala school. But only 44.8% of its teachers made any plan at all, against 50.4% across Sihala and 47.6% across ICT. A big total carried by a few people, with average reach.' },
        'Sihala sector (middle of 75 schools)': { title: 'Sihala sector: 74 plans', text: '74 is the median for the 75 schools in Sihala sector: half of them made more than 74 plans in six weeks and half made fewer. Lohi Bher is one of those schools.' },
        'ICT (middle of 450 schools)': { title: 'ICT: 49 plans', text: '49 is the median for all 450 federal schools in ICT. So the typical school made 49 plans in six weeks, and Lohi Bher made more than five times that.' }
      }
    },

    '06_coaching': {
      type: 'grouped_bar',
      title: 'Teachers use the AI coach. The human coach has reached 6 of them.',
      how: 'The left pair counts teachers, the right pair counts sessions. Teal is a teacher recording their own lesson for the AI coach. Orange is Moiz observing in person.',
      source: SRC1,
      ylabel: 'Count',
      categories: ['Teachers who used it', 'Sessions'],
      series: [
        { name: 'AI coach (self-recorded)', color: 'teal', values: [12, 68],
          meaning: ['12 teachers at this school recorded at least one lesson for the AI coach between 27 July and 7 September.',
            '68 recordings in six weeks.'] },
        { name: 'Coach observation (in person)', color: 'orange', values: [6, 6],
          meaning: ['6 teachers were observed in person by Moiz Khan, the NIETE coach.',
            '6 in-person observations, all on just two days, 20 and 31 August.'] }
      ],
      explain: {
        'Teachers who used it | AI coach (self-recorded)': { title: 'AI coach, teachers who used it: 12', text: '12 teachers at this school recorded at least one lesson for the AI coach between 27 July and 7 September.' },
        'Sessions | AI coach (self-recorded)': { title: 'AI coach, sessions: 68', text: '68 recordings in six weeks. A teacher presses record on their phone, and the AI writes feedback afterwards.' },
        'Teachers who used it | Coach observation (in person)': { title: 'Coach observation, teachers who used it: 6', text: '6 teachers were observed in person by Moiz Khan, the NIETE coach.' },
        'Sessions | Coach observation (in person)': { title: 'Coach observation, sessions: 6', text: '6 in-person observations, all on just two days, 20 and 31 August. All 6 got a debrief, a talk with the coach afterwards.' }
      }
    },

    '07_fico_gaps': {
      type: 'grouped_bar',
      glossary: true,
      title: 'The school\'s six weakest FICO scores are all a little below the ICT average',
      how: 'Each pair is one FICO indicator, scored as a percent of the top mark. Orange is this school over 71 observations. Gray is all of ICT. Click a bar to see what the indicator means.',
      source: SRC1 + ' F5 to F7 left out: they are scored on every lesson whatever the subject.',
      ylabel: '% of maximum',
      categories: ['C10', 'C11', 'B6', 'C9', 'D3', 'B7'],
      series: [
        { name: 'IMCG Lohi Bher', color: 'orange', values: [25, 34, 35, 43, 50, 54],
          meaning: ['This school scored 25% of the top mark.', 'This school scored 34% of the top mark.', 'This school scored 35% of the top mark.',
            'This school scored 43% of the top mark.', 'This school scored 50% of the top mark.', 'This school scored 54% of the top mark.'] },
        { name: 'ICT overall', color: 'gray', values: [28, 39, 41, 52, 54, 55],
          meaning: ['All of ICT scored 28% of the top mark.', 'All of ICT scored 39% of the top mark.', 'All of ICT scored 41% of the top mark.',
            'All of ICT scored 52% of the top mark.', 'All of ICT scored 54% of the top mark.', 'All of ICT scored 55% of the top mark.'] }
      ],
      explain: {
        'C10': 'This school scored 25.0% of the maximum across 71 observations. ICT as a whole scored 27.7%, so the school is 2.7 points behind here.',
        'C11': 'This school scored 33.5% of the maximum across 71 observations. ICT as a whole scored 39.3%, so the school is 5.8 points behind here.',
        'B6': 'This school scored 34.9% of the maximum across 71 observations. ICT as a whole scored 41.0%, so the school is 6.1 points behind here.',
        'C9': 'This school scored 42.6% of the maximum across 71 observations. ICT as a whole scored 51.6%, so the school is 9.0 points behind here.',
        'D3': 'This school scored 50.4% of the maximum across 71 observations. ICT as a whole scored 54.1%, so the school is 3.7 points behind here.',
        'B7': 'This school scored 53.5% of the maximum across 71 observations. ICT as a whole scored 55.4%, so the school is 1.9 points behind here.'
      }
    },

    '08_feedback': {
      type: 'bar_h',
      title: 'Teachers say the plans are useful. Only 1 in 3 say they taught one.',
      how: '67 feedback answers from 11 teachers. The "taught it" questions were only asked about curriculum-menu plans, 33 answers, so those bars are shorter.',
      source: SRC1,
      xlabel: 'Responses',
      labels: ['Rated useful', 'Taught it in class', 'Planned to teach it', 'Not yet taught', 'Rated not useful'],
      values: [64, 11, 13, 9, 3],
      colors: ['teal', 'green', 'sky', 'gray', 'orange'],
      meaning: ['64 of 67 answers said the plan was useful.', '11 of the 33 who were asked said they taught it.',
        '13 said they would teach it later.', '9 said they had not taught it.', '3 of 67 answers said the plan was not useful.'],
      explain: {
        'Rated useful': 'After a plan arrives, Rumi asks the teacher if it was useful. 64 of the 67 answers said yes. That is almost everyone.',
        'Taught it in class': 'On curriculum-menu plans Rumi also asks whether the teacher used the plan in class. 11 of the 33 answers said yes, about one in three. Saying a plan is useful and actually teaching it are two different things.',
        'Planned to teach it': '13 of the 33 answers said the teacher planned to teach the plan later. We do not know yet whether they did.',
        'Not yet taught': '9 of the 33 answers said the plan had not been taught. Together with the 13 "planned", that is 22 of 33 plans not yet used in a classroom when the teacher answered.',
        'Rated not useful': 'Only 3 of the 67 answers said the plan was not useful. Teachers rarely say no to this question.'
      }
    },

    '09_two_phones': {
      type: 'bar_v',
      title: 'The same lesson, recorded on two phones, got two different scores',
      how: 'Fidelity out of 40, meaning how closely the lesson followed its plan. Teal is the machine\'s score from each phone before anyone touched it. Orange is after a coach corrected it.',
      source: SRC2,
      ylabel: 'Lesson-plan fidelity (of 40)',
      ymax: 40,
      legend: [{ name: 'Machine score', color: 'teal' }, { name: 'After coach corrections', color: 'orange' }],
      labels: ['Raheela\nHaroon\'s phone', 'Raheela\nMoiz\'s phone', 'Raheela\nafter corrections',
        'Saima\nHaroon\'s phone', 'Saima\nMoiz\'s phone', 'Saima\nafter corrections'],
      values: [13, 10, 26, 25, 20, 24],
      colors: ['teal', 'teal', 'orange', 'teal', 'teal', 'orange'],
      meaning: ['13 out of 40. The machine\'s own score.', '10 out of 40. The machine\'s own score.', '26 out of 40. The score after a coach corrected it.',
        '25 out of 40. The machine\'s own score.', '20 out of 40. The machine\'s own score.', '24 out of 40. The score after a coach corrected it.'],
      explain: {
        'Raheela, Haroon\'s phone': { title: 'Raheela, Haroon\'s phone: 13 of 40', text: 'Haroon\'s phone recorded Raheela\'s Grade 3 English lesson. The machine scored it 13 out of 40 before anyone checked it.' },
        'Raheela, Moiz\'s phone': { title: 'Raheela, Moiz\'s phone: 10 of 40', text: 'Moiz\'s phone, same room, same lesson, same 40 minutes. The machine scored it 10. Three points apart for one lesson.' },
        'Raheela, after corrections': { title: 'Raheela, after corrections: 26 of 40', text: 'After Moiz went through the moves one by one and fixed the verdicts, Raheela\'s score rose from 10 to 26.' },
        'Saima, Haroon\'s phone': { title: 'Saima, Haroon\'s phone: 25 of 40', text: 'Haroon\'s phone recorded Saima\'s Grade 2 English lesson. The machine scored it 25 out of 40.' },
        'Saima, Moiz\'s phone': { title: 'Saima, Moiz\'s phone: 20 of 40', text: 'Moiz\'s phone recorded the same lesson. The machine scored it 20. Five points apart this time.' },
        'Saima, after corrections': { title: 'Saima, after corrections: 24 of 40', text: 'After both coaches corrected it, Saima\'s score settled at 24, close to what Haroon\'s phone got.' }
      }
    },

    '10_quiz_funnel': {
      type: 'bar_h',
      title: 'Two days after a quiet launch, 493 children had taken a quiz made from their teacher\'s lesson',
      how: 'Each bar is one step of the quiz journey, all of ICT, 6 to 8 September. Darker bars are earlier steps. Nobody announced the feature.',
      source: SRC2,
      xlabel: 'Count',
      labels: ['Quizzes offered to teachers', 'Teachers offered one', 'Quizzes the teacher sent on', 'Teachers who sent one',
        'Children who opened one', 'Children who completed one', 'Teachers whose students took it'],
      values: [1199, 797, 305, 268, 493, 391, 118],
      colors: ['navy', 'navy', 'blue', 'sky', 'sky', 'green', 'green'],
      meaning: ['Offered: the app offered the teacher a quiz after their recording.', '797 different teachers were offered at least one quiz.',
        'Sent on: the teacher chose to send the quiz to their students.', '268 different teachers sent at least one quiz on.',
        'Opened: a child opened a quiz link.', 'Completed: the child answered to the end.', '118 teachers had at least one student finish their quiz.'],
      explain: {
        'Quizzes offered to teachers': 'Offered: after a teacher records a lesson for the AI coach, the app builds a short quiz from what was taught and offers it to the teacher. 1,199 quizzes were offered across ICT in three days, with no announcement.',
        'Teachers offered one': '797 different teachers were offered at least one quiz. Some got several, one per recording.',
        'Quizzes the teacher sent on': 'Sent on: the teacher looked at the quiz and chose to send it to their students. 305 quizzes went out, about one in four of those offered.',
        'Teachers who sent one': '268 different teachers sent at least one quiz on to their class.',
        'Children who opened one': 'Opened: a child, or a parent\'s phone, opened the quiz link. 493 children opened one.',
        'Children who completed one': 'Completed: the child answered every question to the end. 391 of the 493 who opened a quiz finished it, about 8 in 10.',
        'Teachers whose students took it': '118 teachers had at least one student finish their quiz, so the recording earned them something beyond a score.'
      }
    },

    '11_correction_cost': {
      type: 'bar_h',
      title: 'Fixing one FICO observation properly takes a coach more than an hour',
      how: 'Four numbers side by side. Each bar has its own unit, so read the label. Orange is the total for today.',
      source: 'Source: FICO v2 rubric. Timings from the observer\'s own log, 8 Sep 2026.',
      labels: ['Indicators in one observation', 'Minutes per correction (about)', 'Observations Moiz did today', 'Minutes to correct all three (about)'],
      values: [37, 22, 3, 200],
      color: 'teal', highlight: 3, highlightColor: 'orange',
      meaning: ['A coach checks 37 separate points for every lesson.', 'Roughly 20 to 25 minutes of reading, listening again and rescoring.',
        'Three lessons observed in person on 8 September.', 'Over three hours of paperwork for one day of visits.'],
      explain: {
        'Indicators in one observation': { title: '37 indicators per observation', text: 'FICO has 37 indicators. Each one needs its own score from 1 to 4 and a reason. Correcting an observation means going through all 37.' },
        'Minutes per correction (about)': { title: 'About 22 minutes per correction', text: 'Haroon timed the corrections at roughly 20 to 25 minutes each: read the transcript, listen to the recording again, change the score and write why.' },
        'Observations Moiz did today': { title: '3 observations today', text: 'Moiz observed three lessons on 8 September: Raheela, Saima and one more. Each needs its own correction pass.' },
        'Minutes to correct all three (about)': { title: 'About 200 minutes for the day', text: 'Correcting all three observations properly takes about 200 minutes, more than three hours. Two coaches in one room spent the afternoon on paperwork, not with teachers.' }
      }
    },

    '12_b_indicators_two_phones': {
      type: 'grouped_bar',
      glossary: true,
      title: 'Two recordings of one lesson: the machine agreed on six scores and split on four',
      how: 'Ten fidelity indicators from Raheela\'s Grade 3 lesson, each scored 1 to 4 by the machine. Teal is Haroon\'s phone, orange is Moiz\'s phone. Click a bar to see what the indicator means.',
      source: SRC2,
      ylabel: 'Score (of 4)',
      ymax: 4,
      categories: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10'],
      series: [
        { name: 'Haroon\'s recording', color: 'teal', values: [3, 3, 3, 2, 4, 2, 3, 3, 3, 3],
          meaning: ['Haroon\'s phone: 3 out of 4.', 'Haroon\'s phone: 3 out of 4.', 'Haroon\'s phone: 3 out of 4.', 'Haroon\'s phone: 2 out of 4.',
            'Haroon\'s phone: 4 out of 4.', 'Haroon\'s phone: 2 out of 4.', 'Haroon\'s phone: 3 out of 4.', 'Haroon\'s phone: 3 out of 4.',
            'Haroon\'s phone: 3 out of 4.', 'Haroon\'s phone: 3 out of 4.'] },
        { name: 'Moiz\'s recording', color: 'orange', values: [2, 3, 3, 2, 3, 2, 3, 1, 3, 1],
          meaning: ['Moiz\'s phone: 2 out of 4.', 'Moiz\'s phone: 3 out of 4.', 'Moiz\'s phone: 3 out of 4.', 'Moiz\'s phone: 2 out of 4.',
            'Moiz\'s phone: 3 out of 4.', 'Moiz\'s phone: 2 out of 4.', 'Moiz\'s phone: 3 out of 4.', 'Moiz\'s phone: 1 out of 4.',
            'Moiz\'s phone: 3 out of 4.', 'Moiz\'s phone: 1 out of 4.'] }
      ],
      explain: {
        'B1': 'From Haroon\'s phone the machine gave 3 out of 4. From Moiz\'s phone it gave 2. Same lesson, 1 point apart, only because a different phone was listening.',
        'B2': 'From Haroon\'s phone the machine gave 3 out of 4. From Moiz\'s phone it gave 3. The two recordings agree here.',
        'B3': 'From Haroon\'s phone the machine gave 3 out of 4. From Moiz\'s phone it gave 3. The two recordings agree here.',
        'B4': 'From Haroon\'s phone the machine gave 2 out of 4. From Moiz\'s phone it gave 2. The two recordings agree here.',
        'B5': 'From Haroon\'s phone the machine gave 4 out of 4. From Moiz\'s phone it gave 3. Same lesson, 1 point apart, only because a different phone was listening.',
        'B6': 'From Haroon\'s phone the machine gave 2 out of 4. From Moiz\'s phone it gave 2. The two recordings agree here.',
        'B7': 'From Haroon\'s phone the machine gave 3 out of 4. From Moiz\'s phone it gave 3. The two recordings agree here.',
        'B8': 'From Haroon\'s phone the machine gave 3 out of 4. From Moiz\'s phone it gave 1. Same lesson, 2 points apart, only because a different phone was listening.',
        'B9': 'From Haroon\'s phone the machine gave 3 out of 4. From Moiz\'s phone it gave 3. The two recordings agree here.',
        'B10': 'From Haroon\'s phone the machine gave 3 out of 4. From Moiz\'s phone it gave 1. Same lesson, 2 points apart, only because a different phone was listening.'
      }
    }
  };
})();
