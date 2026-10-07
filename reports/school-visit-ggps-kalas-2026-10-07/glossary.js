/* School-visit report: plain-words glossary.
   One entry per code the chapters may wrap in <abbr class="ind" data-ind="KEY">.
   `name` is the official label. `plain` is one sentence a sixth grader can read.
   Moves m1..mN live in glossary_moves.js (generated). */
window.RUMI_GLOSSARY = {
  /* ---- HOTS (Rawalpindi): the five goals and the sixteen indicators the AI coach scores ---- */
  HOTS: { name: "Higher-Order Thinking Skills framework",
         plain: "The scoring sheet Rumi uses in Rawalpindi: five goals, sixteen things to look for, each marked 0 to 3." },
  G1:  { name: "Goal 1, Assessment and feedback",
         plain: "Do children check their own or each other's work, and does the teacher's feedback help them think, not just get the right answer?" },
  G2:  { name: "Goal 2, Student engagement",
         plain: "Do children work together, try more than one way, and talk about ideas, or only answer the teacher?" },
  G3:  { name: "Goal 3, Lesson planning and content",
         plain: "Does the lesson aim at thinking skills, plan for analysis, and link to real life?" },
  G4:  { name: "Goal 4, Instructional strategies",
         plain: "Does the teacher ask open questions, model problem solving, and build support step by step?" },
  G5:  { name: "Goal 5, Classroom environment",
         plain: "Is the room set up for discussion and group work, with clear expectations for hard tasks?" },
  MGLP: { name: "Multigrade lesson plan",
         plain: "One lesson plan for two grades sitting in one room, with timed turns for each grade." },
  LP:  { name: "Lesson plan", plain: "The written plan a teacher follows for one lesson." },
  AEO: { name: "Assistant Education Officer", plain: "The government officer who looks after a group of schools and visits their classrooms." },
  TM:  { name: "Training Manager", plain: "A Taleemabad coach who oversees several AEOs and observes lessons in person." },
  EMIS: { name: "Education Management Information System code", plain: "The government's ID number for a school." },

  /* ---- B: did the lesson follow its plan ---- */
  B1:  { name: "Instructional Clarity & Learning Objectives",
         plain: "Did the teacher say clearly what the children would learn today, and did the lesson stick to it?" },
  B2:  { name: "Lesson Structure & Sequence",
         plain: "Did the lesson go in a sensible order, with a start, a middle and an end?" },
  B3:  { name: "Activities & Tasks Alignment",
         plain: "Did the tasks the children did actually help them reach the lesson's goal?" },
  B4:  { name: "Activation of Prior Knowledge",
         plain: "Did the teacher first remind children of what they already knew before adding something new?" },
  B5:  { name: "Meaningful & Real-World Connections",
         plain: "Did the teacher link the lesson to real life, like things children see at home or outside?" },
  B6:  { name: "Differentiation / Catering to Learning Levels",
         plain: "Did the teacher give easier or harder work to children who needed it, instead of one task for everyone?" },
  B7:  { name: "Use of Taleemabad Lesson Plan",
         plain: "Did the teacher actually use the Taleemabad lesson plan in class, not just have it?" },
  B8:  { name: "Use of Prescribed Resources",
         plain: "Did the teacher use the things the plan asked for, like the textbook page, pictures or cards?" },
  B9:  { name: "Time on Task / Time on Learning",
         plain: "How much of the period was spent actually learning, rather than waiting or settling down?" },
  B10: { name: "Lesson Closure & Consolidation",
         plain: "Did the lesson end with a short wrap-up that pulled the main idea together?" },

  /* ---- C: teaching moves that make a big difference ---- */
  C1:  { name: "Quality Questioning (Bloom's Aligned)",
         plain: "Did the teacher ask questions that make children think, not only remember?" },
  C2:  { name: "Responsive Re-explanation & Adaptive Teaching",
         plain: "When children did not get it, did the teacher explain it again in a new way?" },
  C3:  { name: "Effective Feedback",
         plain: "Did the teacher tell children what they did well and what to fix, not just say right or wrong?" },
  C4:  { name: "Equitable Participation",
         plain: "Did every child get a turn, or only the few at the front who always raise their hands?" },
  C5:  { name: "Student Agency & Voice",
         plain: "Did children get to share their own ideas and make some choices in the lesson?" },
  C6:  { name: "Classroom Management & Routines",
         plain: "Was the class calm and organised, with clear routines so little time was lost?" },
  C7:  { name: "Positive & Supportive Learning Environment",
         plain: "Did children feel safe to try, and did the teacher stay kind and encouraging?" },
  C8:  { name: "Modeling, Scaffolding & Problem-Solving",
         plain: "Did the teacher show how to do it first, then help step by step, then let children try alone?" },
  C9:  { name: "Collaborative Learning",
         plain: "Did children work together in pairs or groups in a way that really helped them learn?" },
  C10: { name: "Integration of Taleemabad Technology",
         plain: "Did the teacher use Taleemabad's videos, quizzes or app in the lesson?" },
  C11: { name: "Self & Peer Assessment Facilitation",
         plain: "Did children check their own work or a partner's work, instead of only the teacher checking?" },
  C12: { name: "Classroom Resources & Space for Collaboration",
         plain: "Was the room set up with materials and seating that let children work together?" },

  /* ---- D: what the children were doing ---- */
  D1:  { name: "Active Participation Rate",
         plain: "How many of the children were joining in, answering, or working, rather than sitting quietly?" },
  D2:  { name: "Cognitive Engagement Level (Bloom's)",
         plain: "Were children only repeating facts, or also explaining, comparing and creating?" },
  D3:  { name: "Student-to-Student Interaction",
         plain: "Did children talk to each other about the work, not only to the teacher?" },
  D4:  { name: "Student Confidence & Risk-Taking",
         plain: "Were children brave enough to try an answer even when they were not sure?" },
  D5:  { name: "On-Task Behavior During Independent Work",
         plain: "When children worked alone, did they keep working or drift off?" },
  D6:  { name: "Student Use of Learning Materials",
         plain: "Did children actually use the books, cards or tools in front of them?" },
  D7:  { name: "Inclusivity of Engagement",
         plain: "Were quieter children, girls and boys, and children who struggle all included?" },

  /* ---- F: does the teacher know the subject ---- */
  F1:  { name: "Content Accuracy",
         plain: "Was everything the teacher taught correct?" },
  F2:  { name: "Use of Academic Language",
         plain: "Did the teacher use the proper subject words, like 'noun' or 'fraction', and explain them?" },
  F3:  { name: "Anticipation of Student Misconceptions",
         plain: "Did the teacher spot the mistakes children usually make and deal with them?" },
  F4:  { name: "Depth of Explanation",
         plain: "Did the teacher explain why something is true, not only what the answer is?" },
  F5:  { name: "Subject-Specific Pedagogy: Math",
         plain: "Did the teacher use good ways of teaching maths, like showing with objects before numbers?" },
  F6:  { name: "Subject-Specific Pedagogy: Science",
         plain: "Did the teacher use good ways of teaching science, like letting children observe and test?" },
  F7:  { name: "Subject-Specific Pedagogy: Literacy/Language",
         plain: "Did the teacher use good ways of teaching reading and words, like sounding out and reading aloud?" },
  F8:  { name: "Cross-Curricular Connections",
         plain: "Did the teacher link this subject to another one, like using maths in a science lesson?" },

  /* ---- moves m1..mN: generated per visit by `post_visit.py build` into glossary_moves.js from
     build/fidelity_moves_by_session.json (one line per lesson, from the prescribed-move catalogue).
     Edit site/glossary_moves.js by hand if the generated wording is clumsy; build keeps an existing file. ---- */

  /* ---- other codes ---- */
  FICO: { name: "FICO observation rubric",
          plain: "The 37-point checklist NIETE coaches in Islamabad use when they watch a lesson, in four parts: B did the lesson follow its plan, C strong teaching moves, D how children took part, F how well the teacher knows the subject, each point scored 1 to 4." },
  NPS:  { name: "Net promoter score",
          plain: "A score from minus 100 to plus 100 that answers one question, would you recommend this to a colleague?" },
  SLO:  { name: "Student learning outcome",
          plain: "The goal for the lesson, what children should be able to do by the end." },
  LP:   { name: "Lesson plan",
          plain: "The written plan for one lesson, with the steps the teacher will follow." },
  ICT:  { name: "Islamabad Capital Territory",
          plain: "The federal schools in and around Islamabad." },
  NIETE: { name: "National Institute of Excellence in Teacher Education",
          plain: "The federal teacher-training institute that runs this programme." },
  FDE:  { name: "Federal Directorate of Education",
          plain: "The government office that runs the federal schools and sets the exam." },
  MCP:  { name: "Governed data connection",
          plain: "The safe, rule-checked way our team asks the database for numbers, so everyone gets the same answer." },
  fidelity: { name: "Lesson-plan fidelity",
          plain: "How closely the lesson followed its plan, the B score, worked out from the moves." },

  /* ---- verdicts on a move ---- */
  done:      { name: "Done", plain: "The teacher did this step the way the plan asked." },
  partly:    { name: "Partly", plain: "The teacher did some of this step but not all of it." },
  not_done:  { name: "Not done", plain: "This step did not happen." },
  substituted_better: { name: "Substituted better",
          plain: "The teacher did something different that served the same goal at least as well." },
  cant_judge: { name: "Can't judge",
          plain: "The recording cannot show it, for example something written on the board before class." }
};
/* aliases so either spelling of a verdict key works */
window.RUMI_GLOSSARY.executed = window.RUMI_GLOSSARY.done;
window.RUMI_GLOSSARY.partial = window.RUMI_GLOSSARY.partly;
window.RUMI_GLOSSARY.not_adjudicable = window.RUMI_GLOSSARY.cant_judge;
