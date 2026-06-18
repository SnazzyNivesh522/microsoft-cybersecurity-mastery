/* =====================================================================
   Microsoft Cybersecurity Mastery — Course data namespace
   ---------------------------------------------------------------------
   Every data file (mod-XX.js, interview.js, glossary.js) loads AFTER this
   file and pushes into the arrays below. The engine (app.js) loads LAST and
   reads from window.COURSE. This pattern works from a plain file:// URL with
   no web server because everything is loaded via <script> tags (no fetch).
   ===================================================================== */
window.COURSE = window.COURSE || {
  meta: {
    title: "Microsoft Cybersecurity Mastery",
    subtitle: "Windows · Active Directory · Entra ID · Microsoft 365 · Intune · PowerShell · Defender & Sentinel",
    tagline: "From zero to interview-ready — taught the way a 30-year Microsoft & cloud-security engineer actually thinks.",
    version: "1.0",
    updated: "June 2026",
    author: "Senior Microsoft / Azure Cloud / Network-Security Engineer"
  },
  // Sorted by `number` in the engine, so load order does not matter.
  modules: [],
  // Interview prep: array of { category, blurb, items:[{q, a:[blocks], level}] }
  interview: [],
  // Glossary: array of { term, def, tags:[] }
  glossary: [],
  // Cheat sheets: array of { id, icon, title, blurb, blocks:[...] }
  cheatsheets: []
};

// Convenience pushers (optional; data files may also push directly).
window.COURSE.addModule = function (m) { window.COURSE.modules.push(m); };
