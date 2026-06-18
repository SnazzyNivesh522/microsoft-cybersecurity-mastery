/* =====================================================================
   Microsoft Cybersecurity Mastery — Engine (vanilla JS, no dependencies)
   Loads LAST. Reads window.COURSE (populated by the data files).
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------- tiny helpers ---------------- */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const C  = window.COURSE;

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function stripTags(html) {
    return String(html || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z#0-9]+;/gi, " ")
      .replace(/\s+/g, " ").trim();
  }
  function readMinutes(mod) {
    if (mod.estMinutes) return mod.estMinutes;
    let words = 0;
    (mod.lessons || []).forEach(l => (l.blocks || []).forEach(b => words += blockText(b).split(" ").length));
    return Math.max(5, Math.round(words / 200));
  }

  /* ---------------- data accessors ---------------- */
  const modules = () => (C.modules || []).slice().sort((a, b) => a.number - b.number);
  const findModule = id => modules().find(m => m.id === id);
  const lessonKey = (mid, lid) => mid + "::" + lid;
  const quizKey   = mid => mid + "::__quiz";

  // Ordered list of navigable items (lessons + module quiz) across the course.
  function flatNav() {
    const out = [];
    modules().forEach(m => {
      (m.lessons || []).forEach(l =>
        out.push({ type: "lesson", mid: m.id, lid: l.id, title: l.title, key: lessonKey(m.id, l.id), hash: "#/m/" + m.id + "/" + l.id }));
      if (m.quiz && m.quiz.length)
        out.push({ type: "quiz", mid: m.id, title: m.title + " — Quiz", key: quizKey(m.id), hash: "#/quiz/" + m.id });
    });
    return out;
  }

  /* ---------------- progress (localStorage) ---------------- */
  const PKEY = "mcm_progress_v1";
  let progress = { completed: {}, quiz: {}, lastHash: "" };
  function loadProgress() {
    try {
      const r = JSON.parse(localStorage.getItem(PKEY));
      if (r && typeof r === "object") progress = Object.assign({ completed: {}, quiz: {}, lastHash: "" }, r);
      if (!progress.completed || typeof progress.completed !== "object") progress.completed = {};
      if (!progress.quiz || typeof progress.quiz !== "object") progress.quiz = {};
    } catch (e) {}
  }
  function saveProgress() { try { localStorage.setItem(PKEY, JSON.stringify(progress)); } catch (e) {} }
  const isDone = k => !!progress.completed[k];
  function setDone(k, v) { if (v) progress.completed[k] = true; else delete progress.completed[k]; saveProgress(); }
  function computeProgress() {
    const nav = flatNav();
    const total = nav.length || 1;
    const done = nav.filter(n => isDone(n.key)).length;
    return { done, total, pct: Math.round(done / total * 100) };
  }
  function moduleProgress(m) {
    const items = (m.lessons || []).map(l => lessonKey(m.id, l.id));
    if (m.quiz && m.quiz.length) items.push(quizKey(m.id));
    const done = items.filter(isDone).length;
    return { done, total: items.length, pct: items.length ? Math.round(done / items.length * 100) : 0 };
  }

  /* ---------------- block renderer ---------------- */
  const CALLOUTS = {
    info:      { icon: "ℹ️", title: "Note" },
    tip:       { icon: "💡", title: "Pro tip" },
    warn:      { icon: "⚠️", title: "Watch out" },
    danger:    { icon: "🛑", title: "Security risk" },
    interview: { icon: "🎯", title: "Interview angle" },
    lab:       { icon: "🧪", title: "Try it yourself" },
    analogy:   { icon: "🔗", title: "Analogy" }
  };

  function blockText(b) {
    if (!b) return "";
    switch (b.type) {
      case "p": case "h": case "h3": case "quote": return stripTags(b.html || b.text || "");
      case "list": case "olist": case "steps": return (b.items || []).map(stripTags).join(" ");
      case "callout": return stripTags(b.title || "") + " " + stripTags(b.html || "");
      case "code": return (Array.isArray(b.code) ? b.code.join(" ") : String(b.code || ""));
      case "table": return (b.headers || []).join(" ") + " " + (b.rows || []).map(r => r.map(stripTags).join(" ")).join(" ");
      case "kv": return (b.items || []).map(i => i.k + " " + stripTags(i.v)).join(" ");
      default: return "";
    }
  }

  function renderCode(b) {
    const lines = Array.isArray(b.code) ? b.code : String(b.code || "").split("\n");
    const body = lines.map(line => {
      const esc = escapeHtml(line);
      const t = line.trimStart();
      if (t.startsWith("#") || t.startsWith("REM ") || t.startsWith("::") || t.startsWith("//"))
        return '<span class="cmt">' + esc + "</span>";
      return esc;
    }).join("\n");
    const cap = b.caption ? '<div class="code-caption">' + (b.lang ? '<span class="lang-tag">' + escapeHtml(b.lang) + "</span>" : "") + escapeHtml(b.caption) + "</div>"
                          : (b.lang ? '<div class="code-caption"><span class="lang-tag">' + escapeHtml(b.lang) + "</span></div>" : "");
    return '<div class="codewrap">' + cap +
           '<button class="copy-btn" type="button">Copy</button>' +
           '<pre class="code"><code>' + body + "</code></pre></div>";
  }

  function renderBlock(b) {
    if (!b || !b.type) return "";
    switch (b.type) {
      case "p":   return '<p class="block-p">' + (b.html || "") + "</p>";
      case "h":   return '<h2 class="block-h">' + escapeHtml(b.text || "") + "</h2>";
      case "h3":  return '<h3 class="block-h3">' + escapeHtml(b.text || "") + "</h3>";
      case "list":  return "<ul>" + (b.items || []).map(i => "<li>" + i + "</li>").join("") + "</ul>";
      case "olist": return "<ol>" + (b.items || []).map(i => "<li>" + i + "</li>").join("") + "</ol>";
      case "steps": return '<ol class="steps">' + (b.items || []).map(i => "<li>" + i + "</li>").join("") + "</ol>";
      case "quote": return '<blockquote class="quote">' + (b.html || "") + "</blockquote>";
      case "divider": return '<hr class="divider" />';
      case "callout": {
        const meta = CALLOUTS[b.variant] || CALLOUTS.info;
        const title = b.title || meta.title;
        return '<div class="callout callout-' + (b.variant || "info") + '">' +
               '<div class="callout-title">' + meta.icon + " " + escapeHtml(title) + "</div>" +
               (b.html || "") + "</div>";
      }
      case "code": return renderCode(b);
      case "table": {
        const head = "<tr>" + (b.headers || []).map(h => "<th>" + h + "</th>").join("") + "</tr>";
        const body = (b.rows || []).map(r => "<tr>" + r.map(c => "<td>" + c + "</td>").join("") + "</tr>").join("");
        return '<div class="table-wrap"><table class="data"><thead>' + head + "</thead><tbody>" + body + "</tbody></table></div>";
      }
      case "kv":
        return '<dl class="kv">' + (b.items || []).map(i => "<dt>" + i.k + "</dt><dd>" + i.v + "</dd>").join("") + "</dl>";
      default: return "";
    }
  }
  const renderBlocks = blocks => (blocks || []).map(renderBlock).join("");

  /* ---------------- views ---------------- */
  const content = $("#content");
  function setContent(html) {
    content.innerHTML = '<div class="content-inner">' + html + "</div>";
    content.scrollTop = 0;
    window.scrollTo({ top: 0 });
  }

  function renderHome() {
    const mods = modules();
    const prog = computeProgress();
    const quizzesTaken = Object.keys(progress.quiz).length;
    const totalLessons = mods.reduce((a, m) => a + (m.lessons || []).length, 0);
    const cont = progress.lastHash && progress.lastHash !== "#/home"
      ? '<a class="btn btn-primary" href="' + progress.lastHash + '">▶ Continue where you left off</a>'
      : (mods[0] && mods[0].lessons && mods[0].lessons[0]
          ? '<a class="btn btn-primary" href="#/m/' + mods[0].id + "/" + mods[0].lessons[0].id + '">▶ Start the course</a>'
          : "");

    const hero =
      '<section class="hero">' +
        "<h1>" + escapeHtml(C.meta.title) + "</h1>" +
        '<p class="sub">' + escapeHtml(C.meta.tagline) + "</p>" +
        '<div class="pills">' +
          ["Windows", "Active Directory", "Microsoft Entra ID", "Microsoft 365", "Intune", "PowerShell", "Defender XDR", "Sentinel", "Zero Trust"]
            .map(p => '<span class="pill">' + p + "</span>").join("") +
        "</div>" +
        '<div class="btn-row">' + cont +
          ' <a class="btn btn-ghost" href="#/interview">🎯 Interview prep</a>' +
          ' <a class="btn btn-ghost" href="#/cheatsheets">📋 Cheat sheets</a></div>' +
      "</section>";

    const stats =
      '<div class="dash-stats">' +
        '<div class="stat-card"><div class="num">' + mods.length + '</div><div class="lbl">Modules</div></div>' +
        '<div class="stat-card"><div class="num">' + totalLessons + '</div><div class="lbl">Lessons</div></div>' +
        '<div class="stat-card"><div class="num">' + prog.pct + '%</div><div class="lbl">Course complete</div></div>' +
        '<div class="stat-card"><div class="num">' + quizzesTaken + "/" + mods.length + '</div><div class="lbl">Quizzes attempted</div></div>' +
      "</div>";

    const cards = mods.map(m => {
      const mp = moduleProgress(m);
      const first = (m.lessons && m.lessons[0]) ? "#/m/" + m.id + "/" + m.lessons[0].id : "#/home";
      return '<a class="mcard" href="' + first + '">' +
        '<div class="mcard-top"><span class="mcard-emoji">' + (m.icon || "📦") + "</span>" +
        '<div><div class="mcard-num">Module ' + m.number + "</div><h3>" + escapeHtml(m.title) + "</h3></div></div>" +
        "<p>" + escapeHtml(m.tagline || m.summary || "") + "</p>" +
        '<div class="mini-bar"><span style="width:' + mp.pct + '%"></span></div>' +
        '<div class="mcard-foot"><span>' + (m.lessons || []).length + " lessons" + ((m.quiz && m.quiz.length) ? " · quiz" : "") + "</span>" +
        "<span>" + mp.pct + "%</span></div></a>";
    }).join("");

    setContent(hero + stats +
      '<h2 class="section-title">📚 Course modules</h2><div class="module-grid">' + cards + "</div>" +
      '<div style="margin-top:34px" class="callout callout-tip"><div class="callout-title">💡 How to use this course</div>' +
      "<p>Work top-to-bottom — each module builds on the last. Read a lesson, then hit <b>Mark&nbsp;complete</b>; take the <b>module quiz</b> to lock it in. Use <b>Flashcards</b> for spaced repetition and the <b>Interview Prep</b> tab the week before an interview. Everything you click is saved in your browser, so your progress survives a refresh.</p></div>");
  }

  function lessonNumberInfo(mid, lid) {
    const m = findModule(mid);
    if (!m) return { m: null, idx: -1, total: 0, lesson: null };
    const idx = (m.lessons || []).findIndex(l => l.id === lid);
    return { m, idx, total: (m.lessons || []).length, lesson: idx >= 0 ? m.lessons[idx] : null };
  }

  function renderLesson(mid, lid) {
    const info = lessonNumberInfo(mid, lid);
    if (!info.m || !info.lesson) return renderNotFound();
    const { m, idx, total, lesson } = info;
    const key = lessonKey(mid, lid);
    progress.lastHash = "#/m/" + mid + "/" + lid; saveProgress();

    const nav = flatNav();
    const pos = nav.findIndex(n => n.key === key);
    const prev = pos > 0 ? nav[pos - 1] : null;
    const next = pos < nav.length - 1 ? nav[pos + 1] : null;
    const done = isDone(key);

    const crumb = '<div class="breadcrumb"><a href="#/home">Home</a> › <span>' + escapeHtml(m.icon + " " + m.title) +
                  "</span> › <span>Lesson " + (idx + 1) + " of " + total + "</span></div>";
    const head = "<h1 class='page-title'>" + escapeHtml(lesson.title) + "</h1>" +
      '<div class="lesson-meta"><span><b>Module ' + m.number + "</b> · " + escapeHtml(m.title) + "</span>" +
      "<span>📖 Lesson " + (idx + 1) + "/" + total + "</span>" +
      (lesson.subtitle ? "<span>" + escapeHtml(lesson.subtitle) + "</span>" : "") + "</div>";

    const objectives = (idx === 0 && Array.isArray(m.objectives) && m.objectives.length)
      ? "<div class='callout callout-info objectives'><div class='callout-title'>🎯 What you'll learn in this module</div><ul>" +
        m.objectives.map(o => "<li>" + o + "</li>").join("") + "</ul></div>"
      : "";
    const body = objectives + renderBlocks(lesson.blocks);

    const navBtns = '<div class="lesson-nav">' +
      (prev ? '<a class="btn" href="' + prev.hash + '">‹ ' + escapeHtml(trim(prev.title, 30)) + "</a>"
            : '<span class="btn disabled">‹ Start</span>') +
      '<div class="btn-row" style="margin:0">' +
        '<button class="btn btn-ghost" id="completeBtn">' + (done ? "✓ Completed — undo" : "Mark as complete") + "</button>" +
        (next ? '<a class="btn btn-primary" href="' + next.hash + '">' + (next.type === "quiz" ? "Take the quiz" : escapeHtml(trim(next.title, 30))) + " ›</a>"
              : '<a class="btn btn-primary" href="#/home">Finish ›</a>') +
      "</div></div>";

    setContent(crumb + head + body + navBtns);

    $("#completeBtn").addEventListener("click", () => {
      const nowDone = !isDone(key);
      setDone(key, nowDone);
      $("#completeBtn").innerHTML = nowDone ? "✓ Completed — undo" : "Mark as complete";
      toast(nowDone ? "Lesson marked complete ✓" : "Marked incomplete");
      updateNav(); updateProgressUI();
    });
  }

  function renderQuiz(mid) {
    const m = findModule(mid);
    if (!m || !m.quiz || !m.quiz.length) return renderNotFound();
    const key = quizKey(mid);

    const crumb = '<div class="breadcrumb"><a href="#/home">Home</a> › <span>' + escapeHtml(m.icon + " " + m.title) + "</span> › <span>Quiz</span></div>";
    const head = "<h1 class='page-title'>📝 Quiz — " + escapeHtml(m.title) + "</h1>" +
      '<div class="lesson-meta"><span>' + m.quiz.length + " questions</span><span>Pick an answer, then submit to see explanations.</span></div>";

    const qs = m.quiz.map((q, i) =>
      '<div class="quiz-q" data-qi="' + i + '" data-ans="' + q.answer + '">' +
        '<div class="qnum">Question ' + (i + 1) + "</div>" +
        '<div class="qtext">' + q.q + "</div>" +
        q.options.map((opt, oi) =>
          '<label class="quiz-opt"><input type="radio" name="q' + i + '" value="' + oi + '"><span>' + opt + "</span></label>").join("") +
        '<div class="quiz-explain"><b>Why:</b> ' + (q.explain || "") + "</div>" +
      "</div>").join("");

    setContent(crumb + head + '<div id="quizForm">' + qs + "</div>" +
      '<div class="lesson-nav"><span></span><button class="btn btn-primary" id="submitQuiz">Submit answers</button></div>' +
      '<div id="quizResultZone"></div>');

    $("#submitQuiz").addEventListener("click", () => gradeQuiz(m, key));
  }

  function gradeQuiz(m, key) {
    const cards = $$(".quiz-q");
    if (cards.filter(c => c.querySelector("input:checked")).length < cards.length) {
      toast("Answer all " + cards.length + " questions before submitting");
      return;
    }
    let correct = 0;
    cards.forEach(card => {
      const ans = parseInt(card.getAttribute("data-ans"), 10);
      const picked = card.querySelector("input:checked");
      $$(".quiz-opt", card).forEach((opt, oi) => {
        opt.classList.add("disabled");
        opt.querySelector("input").disabled = true;
        if (oi === ans) { opt.classList.add("correct"); opt.insertAdjacentHTML("beforeend", "<span class='opt-mark'>✓</span>"); }
        if (picked && parseInt(picked.value, 10) === oi && oi !== ans) { opt.classList.add("wrong"); opt.insertAdjacentHTML("beforeend", "<span class='opt-mark'>✗</span>"); }
      });
      $(".quiz-explain", card).classList.add("show");
      if (picked && parseInt(picked.value, 10) === ans) correct++;
    });
    const total = m.quiz.length;
    const pct = Math.round(correct / total * 100);
    const pass = pct >= 70;
    progress.quiz[m.id] = { score: correct, total: total, pct: pct };
    setDone(key, true);
    updateNav(); updateProgressUI();

    const nav = flatNav();
    const pos = nav.findIndex(n => n.key === key);
    const next = pos < nav.length - 1 ? nav[pos + 1] : null;

    const res = '<div class="quiz-result ' + (pass ? "pass" : "fail") + '">' +
      '<div class="score">' + correct + " / " + total + "</div>" +
      "<p>" + (pass ? "🎉 Passed! You scored " + pct + "%. Solid." : "Keep going — you scored " + pct + "%. Re-read, then retry. 70% is passing.") + "</p>" +
      '<div class="btn-row" style="justify-content:center">' +
        '<button class="btn" id="retryQuiz">↺ Retry</button>' +
        (next ? '<a class="btn btn-primary" href="' + next.hash + '">Next ›</a>' : '<a class="btn btn-primary" href="#/home">Back to dashboard ›</a>') +
      "</div></div>";
    $("#quizResultZone").innerHTML = res;
    $("#submitQuiz").disabled = true;
    $("#retryQuiz").addEventListener("click", () => renderQuiz(m.id));
    $("#quizResultZone").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* ---------------- flashcards ---------------- */
  let fcDeck = [], fcIdx = 0, fcFilter = "all";
  function buildDeck() {
    const all = [];
    modules().forEach(m => (m.flashcards || []).forEach(c =>
      all.push({ front: c.front, back: c.back, tag: m.icon + " " + m.title, mid: m.id })));
    fcDeck = fcFilter === "all" ? all : all.filter(c => c.mid === fcFilter);
    if (fcIdx >= fcDeck.length) fcIdx = 0;
  }
  function shuffleDeck() {
    for (let i = fcDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fcDeck[i], fcDeck[j]] = [fcDeck[j], fcDeck[i]];
    }
    fcIdx = 0;
  }
  function renderFlashcards(skipBuild) {
    if (!skipBuild) buildDeck();
    const opts = '<option value="all">All modules (' + fcDeck.length + " cards)</option>" +
      modules().filter(m => (m.flashcards || []).length)
        .map(m => '<option value="' + m.id + '"' + (fcFilter === m.id ? " selected" : "") + ">" + escapeHtml(m.icon + " " + m.title) + "</option>").join("");

    if (!fcDeck.length) { setContent("<h1 class='page-title'>🃏 Flashcards</h1><p class='empty'>No cards in this set yet.</p>"); return; }
    const card = fcDeck[fcIdx];
    setContent(
      "<h1 class='page-title'>🃏 Flashcards</h1>" +
      '<p class="block-p">Active recall beats re-reading. Read the prompt, answer out loud, then flip. Shuffle for a real test.</p>' +
      '<div class="fc-controls"><select id="fcFilter">' + opts + "</select>" +
        '<button class="btn" id="fcShuffle">🔀 Shuffle</button></div>' +
      '<div class="fc-counter">Card ' + (fcIdx + 1) + " of " + fcDeck.length + "</div>" +
      '<div class="flashcard" id="fcCard" role="button" tabindex="0" aria-label="Flashcard — press Enter or Space to flip"><div class="flashcard-inner">' +
        '<div class="fc-face fc-front"><span class="fc-tag">' + escapeHtml(card.tag) + "</span>" + card.front + '<span class="fc-hint">click to flip ⟳</span></div>' +
        '<div class="fc-face fc-back"><span class="fc-tag">Answer</span><div>' + card.back + "</div></div>" +
      "</div></div>" +
      '<div class="fc-nav"><button class="btn" id="fcPrev">‹ Prev</button><button class="btn" id="fcFlip">⟳ Flip</button><button class="btn btn-primary" id="fcNext">Next ›</button></div>'
    );
    const cardEl = $("#fcCard");
    cardEl.addEventListener("click", () => cardEl.classList.toggle("flipped"));
    cardEl.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); cardEl.classList.toggle("flipped"); } });
    $("#fcFlip").addEventListener("click", e => { e.stopPropagation(); cardEl.classList.toggle("flipped"); });
    $("#fcPrev").addEventListener("click", () => { fcIdx = (fcIdx - 1 + fcDeck.length) % fcDeck.length; renderFlashcards(true); });
    $("#fcNext").addEventListener("click", () => { fcIdx = (fcIdx + 1) % fcDeck.length; renderFlashcards(true); });
    $("#fcShuffle").addEventListener("click", () => { shuffleDeck(); renderFlashcards(true); toast("Deck shuffled 🔀"); });
    $("#fcFilter").addEventListener("change", e => { fcFilter = e.target.value; fcIdx = 0; renderFlashcards(); });
  }

  /* ---------------- glossary ---------------- */
  function renderGlossary() {
    const terms = (C.glossary || []).slice().sort((a, b) => a.term.localeCompare(b.term));
    setContent(
      "<h1 class='page-title'>📖 Glossary</h1>" +
      '<p class="block-p">' + terms.length + ' terms you will hear in interviews and on the job. Filter as you type.</p>' +
      '<input class="glossary-search" id="gSearch" type="search" placeholder="Filter terms… (e.g. Kerberos, Conditional Access, SPN)" />' +
      '<div id="gList">' + glossaryHtml(terms) + "</div>"
    );
    $("#gSearch").addEventListener("input", e => {
      const v = e.target.value.toLowerCase().trim();
      const f = !v ? terms : terms.filter(t =>
        t.term.toLowerCase().includes(v) || stripTags(t.def).toLowerCase().includes(v) || (t.tags || []).join(" ").toLowerCase().includes(v));
      $("#gList").innerHTML = f.length ? glossaryHtml(f) : '<p class="empty">No matching terms.</p>';
    });
  }
  function glossaryHtml(terms) {
    return terms.map(t =>
      '<div class="gterm"><h4>' + escapeHtml(t.term) + "</h4><p>" + t.def + "</p>" +
      ((t.tags || []).length ? '<div class="gtags">' + t.tags.map(x => '<span class="gtag">' + escapeHtml(x) + "</span>").join("") + "</div>" : "") +
      "</div>").join("");
  }

  /* ---------------- interview prep ---------------- */
  function renderInterview() {
    const cats = C.interview || [];
    const total = cats.reduce((a, c) => a + (c.items || []).length, 0);
    const body = cats.map((cat, ci) =>
      '<section class="iv-cat">' +
        '<h2 class="iv-cat-head">' + (cat.icon || "🎯") + " " + escapeHtml(cat.category) + "</h2>" +
        (cat.blurb ? '<p class="iv-cat-blurb">' + cat.blurb + "</p>" : "") +
        (cat.items || []).map((it, ii) =>
          '<div class="qa" data-qa="' + ci + "-" + ii + '">' +
            '<button class="qa-q" aria-expanded="false">' + (it.level ? '<span class="qa-level">' + escapeHtml(it.level) + "</span> " : "") +
              "<span>" + it.q + '</span><span class="qa-chev">›</span></button>' +
            '<div class="qa-a">' + (Array.isArray(it.a) ? renderBlocks(it.a) : (it.a || "")) + "</div>" +
          "</div>").join("") +
      "</section>").join("");

    setContent(
      "<h1 class='page-title'>🎯 Interview Preparation</h1>" +
      '<p class="block-p">' + total + ' real-world questions with model answers — the way a senior interviewer wants to hear them. Click a question to reveal the answer. Tip: answer out loud first, <em>then</em> check.</p>' +
      '<input class="glossary-search" id="ivSearch" type="search" placeholder="Filter questions… (e.g. Kerberoasting, Conditional Access, NTFS)" />' +
      '<div id="ivList">' + body + "</div>"
    );
    $("#ivList").addEventListener("click", e => {
      const btn = e.target.closest(".qa-q"); if (!btn) return;
      const open = btn.parentElement.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $("#ivSearch").addEventListener("input", e => {
      const v = e.target.value.toLowerCase().trim();
      $$(".qa", $("#ivList")).forEach(qa => {
        const txt = qa.textContent.toLowerCase();
        qa.style.display = (!v || txt.includes(v)) ? "" : "none";
      });
      $$(".iv-cat", $("#ivList")).forEach(sec => {
        const anyVisible = $$(".qa", sec).some(q => q.style.display !== "none");
        sec.style.display = anyVisible ? "" : "none";
      });
    });
  }

  /* ---------------- search ---------------- */
  let searchIndex = null, searchQuery = "";
  function buildIndex() {
    if (searchIndex) return searchIndex;
    const idx = [];
    modules().forEach(m => {
      (m.lessons || []).forEach(l => idx.push({
        kind: "Lesson", crumb: m.icon + " " + m.title, title: l.title,
        hash: "#/m/" + m.id + "/" + l.id,
        text: l.title + " " + (l.blocks || []).map(blockText).join(" ")
      }));
      if (m.quiz && m.quiz.length) idx.push({ kind: "Quiz", crumb: m.icon + " " + m.title, title: "Module quiz", hash: "#/quiz/" + m.id, text: "quiz test " + m.title });
    });
    (C.glossary || []).forEach(t => idx.push({ kind: "Glossary", crumb: "📖 Glossary", title: t.term, hash: "#/glossary", text: t.term + " " + stripTags(t.def) }));
    (C.interview || []).forEach(c => (c.items || []).forEach(it => idx.push({
      kind: "Interview", crumb: "🎯 " + c.category, title: stripTags(it.q), hash: "#/interview",
      text: stripTags(it.q) + " " + (Array.isArray(it.a) ? it.a.map(blockText).join(" ") : stripTags(it.a))
    })));
    (C.cheatsheets || []).forEach(cs => idx.push({
      kind: "Cheat sheet", crumb: "📋 Cheat Sheets", title: cs.title, hash: "#/cheatsheets",
      text: cs.title + " " + (cs.blurb || "") + " " + (cs.blocks || []).map(blockText).join(" ")
    }));
    idx.forEach(r => { r.textLower = r.text.toLowerCase(); });
    searchIndex = idx; return idx;
  }
  function snippet(text, q) {
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return escapeHtml(text.slice(0, 140)) + "…";
    const start = Math.max(0, i - 50), end = Math.min(text.length, i + q.length + 90);
    const seg = (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
    const re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
    return escapeHtml(seg).replace(new RegExp("(" + escapeHtml(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>");
  }
  function renderSearch() {
    const q = searchQuery.trim();
    if (q.length < 2) { setContent("<h1 class='page-title'>🔍 Search</h1><p class='empty'>Type at least 2 characters to search the whole course.</p>"); return; }
    const ql = q.toLowerCase();
    const res = buildIndex().filter(r => r.textLower.includes(ql)).slice(0, 60);
    const list = res.length ? res.map(r =>
      '<a class="sr-item" href="' + r.hash + '"><div class="sr-crumb">' + escapeHtml(r.kind) + " · " + escapeHtml(r.crumb) + "</div>" +
      '<div class="sr-title">' + escapeHtml(r.title) + "</div><div style='font-size:13px;color:var(--text-dim);margin-top:4px'>" + snippet(r.text, q) + "</div></a>").join("")
      : "<p class='empty'>No results for “" + escapeHtml(q) + "”.</p>";
    setContent("<h1 class='page-title'>🔍 Results for “" + escapeHtml(q) + "”</h1><div class='search-results'>" + list + "</div>");
  }

  function renderNotFound() {
    setContent("<h1 class='page-title'>Hmm — nothing here</h1><p class='empty'>That page doesn't exist. <a href='#/home'>Go home</a>.</p>");
  }

  function gotoModule(mid) {
    const m = findModule(mid);
    if (m && m.lessons && m.lessons[0]) {
      renderLesson(mid, m.lessons[0].id);
      history.replaceState(null, "", "#/m/" + mid + "/" + m.lessons[0].id);
    } else renderNotFound();
  }

  /* ---------------- cheat sheets ---------------- */
  function renderCheatsheets() {
    const sheets = C.cheatsheets || [];
    if (!sheets.length) { setContent("<h1 class='page-title'>📋 Cheat Sheets</h1><p class='empty'>No cheat sheets yet.</p>"); return; }
    const jump = '<div class="cs-jump">' + sheets.map(s =>
      "<button type='button' class='cs-chip' data-cs='cs-" + s.id + "'>" + (s.icon || "📋") + " " + escapeHtml(s.title) + "</button>").join("") + "</div>";
    const body = sheets.map(s =>
      "<section class='cs-card' id='cs-" + s.id + "'>" +
        "<h2 class='cs-card-title'>" + (s.icon || "📋") + " " + escapeHtml(s.title) + "</h2>" +
        (s.blurb ? "<p class='cs-blurb'>" + escapeHtml(s.blurb) + "</p>" : "") +
        renderBlocks(s.blocks) +
      "</section>").join("");
    setContent(
      "<h1 class='page-title'>📋 Cheat Sheets</h1>" +
      "<p class='block-p'>Quick-reference cards for last-minute cram and on-the-job lookups. Jump to a card, and use the copy button on any command block.</p>" +
      jump + body);
    $$(".cs-chip").forEach(b => b.addEventListener("click", () => {
      const el = document.getElementById(b.getAttribute("data-cs"));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
  }

  /* ---------------- sidebar nav ---------------- */
  const openModules = new Set();
  function buildNav() {
    const wrap = $("#moduleNav");
    wrap.innerHTML = modules().map(m => {
      const lessons = (m.lessons || []).map(l =>
        '<a class="lesson-link" data-key="' + lessonKey(m.id, l.id) + '" href="#/m/' + m.id + "/" + l.id + '">' +
        '<span class="dot">✓</span><span>' + escapeHtml(l.title) + "</span></a>").join("");
      const quiz = (m.quiz && m.quiz.length)
        ? '<a class="lesson-link quiz" data-key="' + quizKey(m.id) + '" href="#/quiz/' + m.id + '"><span class="dot">✓</span><span>📝 Module quiz</span></a>'
        : "";
      return '<div class="mod-group" data-mid="' + m.id + '">' +
        '<button class="mod-head" type="button"><span class="mod-emoji">' + (m.icon || "📦") + "</span>" +
        '<span class="mod-title">' + escapeHtml(m.number + ". " + m.title) + '</span><span class="mod-badge"></span><span class="chev">›</span></button>' +
        '<div class="lesson-list">' + lessons + quiz + "</div></div>";
    }).join("");

    $$(".mod-head", wrap).forEach(btn => btn.addEventListener("click", () => {
      const id = btn.parentElement.getAttribute("data-mid");
      if (openModules.has(id)) openModules.delete(id); else openModules.add(id);
      btn.parentElement.classList.toggle("open");
    }));
  }
  function updateNav() {
    let hash = location.hash || "#/home";
    if (hash === "#/" || hash === "#") hash = "#/home";
    // static links
    $$(".navlink").forEach(a => a.classList.toggle("active", a.getAttribute("href") === hash));
    // modules
    $$(".mod-group").forEach(g => {
      const m = findModule(g.getAttribute("data-mid"));
      const mp = moduleProgress(m);
      g.classList.toggle("done", mp.total > 0 && mp.done === mp.total);
      $(".mod-badge", g).textContent = mp.done + "/" + mp.total;
      let active = false;
      $$(".lesson-link", g).forEach(a => {
        const k = a.getAttribute("data-key");
        a.classList.toggle("complete", isDone(k));
        const isActive = a.getAttribute("href") === hash;
        a.classList.toggle("active", isActive);
        if (isActive) active = true;
      });
      if (active) { openModules.add(m.id); }
      g.classList.toggle("open", openModules.has(m.id));
    });
  }
  function updateProgressUI() {
    const p = computeProgress();
    $("#progressFill").style.width = p.pct + "%";
    $("#progressText").textContent = p.pct + "%";
  }

  /* ---------------- router ---------------- */
  function route() {
    const h = (location.hash || "").replace(/^#\/?/, "");
    const parts = h.split("/").filter(Boolean);
    closeMobileNav();
    if (parts.length === 0 || parts[0] === "home") renderHome();
    else if (parts[0] === "m" && parts[1] && parts[2]) renderLesson(parts[1], parts[2]);
    else if ((parts[0] === "module" || parts[0] === "mod") && parts[1]) gotoModule(parts[1]);
    else if (parts[0] === "quiz" && parts[1]) renderQuiz(parts[1]);
    else if (parts[0] === "flashcards") renderFlashcards();
    else if (parts[0] === "glossary") renderGlossary();
    else if (parts[0] === "interview") renderInterview();
    else if (parts[0] === "cheatsheets") renderCheatsheets();
    else if (parts[0] === "search") renderSearch();
    else renderNotFound();
    updateNav(); updateProgressUI();
    if (document.activeElement !== $("#searchInput")) content.focus({ preventScroll: true });
  }

  /* ---------------- misc UI ---------------- */
  function trim(s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1) + "…" : s; }
  let toastTimer;
  function toast(msg) {
    let t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
  }
  function closeMobileNav() { document.body.classList.remove("nav-open"); }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    $("#themeToggle").textContent = theme === "dark" ? "🌙" : "☀️";
    try { localStorage.setItem("mcm_theme", theme); } catch (e) {}
  }

  /* ---------------- copy-to-clipboard (delegated) ---------------- */
  document.addEventListener("click", e => {
    const btn = e.target.closest(".copy-btn");
    if (!btn) return;
    const pre = btn.parentElement.querySelector("pre.code");
    const text = pre ? pre.textContent : "";
    const done = () => { btn.textContent = "Copied!"; btn.classList.add("copied"); setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1400); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
    else fallbackCopy(text, done);
  });
  function fallbackCopy(text, done) {
    try {
      const ta = document.createElement("textarea"); ta.value = text;
      ta.style.position = "fixed"; ta.style.top = "-1000px"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.focus(); ta.select();
      const ok = document.execCommand("copy"); document.body.removeChild(ta);
      if (ok) done(); else toast("Press Ctrl/Cmd+C to copy");
    } catch (e) { toast("Select the text and press Ctrl/Cmd+C"); }
  }

  /* ---------------- init ---------------- */
  function init() {
    loadProgress();
    try { applyTheme(localStorage.getItem("mcm_theme") || "dark"); } catch (e) { applyTheme("dark"); }

    buildNav();

    // global listeners
    $("#themeToggle").addEventListener("click", () =>
      applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"));
    $("#menuToggle").addEventListener("click", () => document.body.classList.toggle("nav-open"));
    $("#backdrop").addEventListener("click", closeMobileNav);
    $("#resetProgress").addEventListener("click", () => {
      if (confirm("Reset all progress, quiz scores, and bookmarks? This cannot be undone.")) {
        progress = { completed: {}, quiz: {}, lastHash: "" }; saveProgress();
        updateNav(); updateProgressUI(); toast("Progress reset"); route();
      }
    });

    const si = $("#searchInput");
    si.addEventListener("input", () => {
      searchQuery = si.value;
      const len = searchQuery.trim().length;
      if (len >= 2) {
        if (location.hash === "#/search") renderSearch(); else location.hash = "#/search";
      } else if (location.hash === "#/search") {
        if (len === 0) location.hash = "#/home"; else renderSearch();
      }
    });
    si.addEventListener("keydown", e => { if (e.key === "Enter") { searchQuery = si.value; if (location.hash !== "#/search") location.hash = "#/search"; else renderSearch(); } });

    // keyboard: "/" focuses search; arrows for prev/next lesson
    document.addEventListener("keydown", e => {
      const ae = document.activeElement;
      const typing = ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName);
      if (e.key === "/" && !typing) { e.preventDefault(); si.focus(); return; }
      const navOK = !typing && !e.metaKey && !e.ctrlKey && !e.altKey && (!ae || ae === document.body || ae === content);
      if (navOK && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        const h = (location.hash || "").replace(/^#\/?/, "").split("/").filter(Boolean);
        if (h[0] === "m" && h[1] && h[2]) {
          const nav = flatNav(); const pos = nav.findIndex(n => n.key === lessonKey(h[1], h[2]));
          const t = e.key === "ArrowLeft" ? nav[pos - 1] : nav[pos + 1];
          if (t) location.hash = t.hash;
        }
      }
    });

    window.addEventListener("hashchange", route);
    route();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
