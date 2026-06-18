/* Module 10 — Interview Bootcamp
   Mirrors the gold-standard format of mod-01.js:
   - JS strings use DOUBLE quotes "..."; HTML attributes inside use SINGLE quotes '...'.
   - Code blocks are arrays of lines; no backticks, no template literals; doubled backslashes.
   Block types: p, h, h3, list, olist, steps, quote, divider,
     callout {variant: info|tip|warn|danger|interview|lab|analogy},
     code {lang, caption, code:[...]}, table {headers, rows}, kv {items:[{k,v}]}. */
window.COURSE.modules.push({
  id: "mod-10",
  number: 10,
  icon: "🎤",
  title: "Interview Bootcamp",
  tagline: "Land the offer: behavioral & STAR, alert-triage reasoning, role tracks (SOC / IAM / cloud), mock drills, and closing strong.",
  estMinutes: 110,
  objectives: [
    "You can structure any technical answer with the 3-beat method and keep it to 60-90 seconds.",
    "You can tell a STAR story from a home lab or coursework even with no job history.",
    "You can walk an alert from queue to closure and justify true-positive vs false-positive calls.",
    "You can speak to role-specific depth for SOC, IAM, and cloud-security tracks.",
    "You can close an interview with sharp questions, salary basics, and a follow-up plan.",
    "You can self-score a mock interview against a hiring-manager rubric."
  ],
  lessons: [
    /* ---------------------------------------------------------------- */
    {
      id: "10-1",
      title: "How juniors are actually scored",
      subtitle: "What gets you hired vs. what gets you cut",
      blocks: [
        { type: "p", html: "Let me switch hats. For the rest of your modules I'm a senior engineer teaching you the craft. In this one I'm also the <strong>hiring manager on the other side of the table</strong> — the person who writes the thumbs-up or thumbs-down after your loop. I'm going to tell you exactly how I score you, because almost nobody does, and it's the difference between a smart candidate who keeps getting rejected and one who lands the offer." },
        { type: "p", html: "Here is the uncomfortable truth a review of this course surfaced: we teach you the <em>technical knowledge</em> well, but knowledge isn't what gets juniors hired. I have rejected candidates who knew more than the ones I hired. What separates them is whether they can <strong>reason out loud, tell a story, and behave like a teammate</strong> under mild pressure." },
        { type: "callout", variant: "analogy", html: "<p>A junior interview is a <strong>flight check, not a written exam</strong>. I'm not testing whether you've memorised the manual — I'm sitting in the co-pilot seat watching how you handle the controls when something beeps. Calm hands, a sane checklist, and saying what you're doing out loud beat a perfect recall of part numbers every time.</p>" },
        { type: "h", text: "The 3-beat answer — your default structure" },
        { type: "p", html: "When I ask any conceptual question, the best juniors answer in three beats. It sounds composed, it shows you understand <em>why</em> the thing exists, and it ties back to the job. Use it for almost everything." },
        { type: "olist", items: [
          "<strong>Define</strong> it in one clean sentence (prove you actually know what it is).",
          "<strong>How it works</strong> — one or two sentences on the mechanism (prove it's not memorised).",
          "<strong>Security / scenario tie-in</strong> — why a defender cares, or a time it mattered (prove you can apply it)."
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “What is multi-factor authentication?”</strong> 3-beat model answer: “<em>(Define)</em> MFA is requiring two or more independent factors to prove identity — something you know, have, or are. <em>(How)</em> So even if an attacker phishes your password, they still need the second factor, like a number-match push or a FIDO2 key. <em>(Tie-in)</em> That's why MFA is the single highest-ROI control against credential theft — though I'd add it's not a silver bullet, because MFA-fatigue and token theft can still get around weaker forms, which is why we push phishing-resistant MFA.” That last clause is what gets you the nod — it shows operational nuance.</p>" },
        { type: "h", text: "Brevity — talk for 60 to 90 seconds, then stop" },
        { type: "p", html: "The most common junior mistake is <strong>not knowing when to stop talking</strong>. You answer the question in 30 seconds, then keep going for two more minutes, and somewhere in there you say something wrong and dig the hole. Land your three beats, then stop and let me ask a follow-up. Silence is fine. A crisp 75-second answer reads as <em>confidence</em>; a rambling four-minute one reads as anxiety." },
        { type: "h", text: "The four signals I'm actually grading" },
        { type: "kv", items: [
          { k: "Operational reasoning", v: "Can you walk through a problem step by step — triage, evidence, decision — instead of just naming a tool? This is the #1 thing I score." },
          { k: "Curiosity", v: "Do you ask why, mention things you've read, tinker at home? Security is a field you can't stop learning in. I hire for trajectory." },
          { k: "Coachability", v: "When I push back or you don't know something, do you get defensive or do you say 'good point, here's how I'd find out'? Juniors are hired to be taught." },
          { k: "A home lab you can narrate", v: "The single biggest tell of a real candidate. If you can describe a lab you built and what you broke and fixed, you instantly outrank the resume-padder." }
        ]},
        { type: "callout", variant: "lab", html: "<p><strong>Rep:</strong> Right now, pick a tool you've actually used in this course (Microsoft Sentinel, Defender XDR, a KQL hunt, an Entra Conditional Access policy). Out loud, in 75 seconds, do the 3-beat answer for it: define it, how it works, why a defender cares. Record yourself on your phone. Listen back for filler words and for the moment you should have stopped.</p>" },
        { type: "h", text: "Things that instantly fail you" },
        { type: "p", html: "These are not theoretical. Each one has personally moved a candidate from 'maybe' to 'no' for me:" },
        { type: "list", items: [
          "<strong>Skipping the IR process.</strong> Asked to handle an incident and you jump straight to 'reimage it.' No scoping, no containment, no evidence. (We cover the right answer in 10-7.)",
          "<strong>“MFA stops all phishing.”</strong> It doesn't — adversary-in-the-middle proxies and token theft defeat weaker MFA. Absolutes signal shallow knowledge.",
          "<strong>Confusing authentication and authorization.</strong> Authn = who you are; authz = what you're allowed to do. Mixing these up on an identity-track interview is close to disqualifying.",
          "<strong>Trashing a past employer or teammate.</strong> If you badmouth them to me, I assume you'll badmouth us. Always frame conflict constructively.",
          "<strong>“I'd just reimage it.”</strong> Sometimes correct — but if it's your reflex before you've scoped what happened, you'll destroy evidence and miss the foothold that re-infects you next week."
        ]},
        { type: "callout", variant: "warn", title: "The confidence trap", html: "<p>Junior candidates over-correct in two directions. Some bluff — confidently stating wrong things, which is the worst possible signal because I now can't trust anything you say. Others freeze — apologising and shrinking at the first hard question. The move that beats both: <strong>“I'm not certain, but here's how I'd reason about it…”</strong> then think out loud. I'd rather hire someone honest who reasons well than someone who's confidently wrong.</p>" },
        { type: "callout", variant: "tip", html: "<p>Everything in this module is a rep. Read it once for the ideas, then come back and actually <em>say the answers out loud</em>. Interviewing is a motor skill — you're building muscle memory so the structure shows up automatically when your heart rate is at 110.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "10-2",
      title: "Phone-screen warm-ups (rapid-fire)",
      subtitle: "Say it in 20 seconds",
      blocks: [
        { type: "p", html: "The phone screen is a filter, not a deep-dive. A recruiter or junior engineer runs down a list of fundamentals and is mostly checking <strong>can this person speak the language fluently and not freeze</strong>. The trap is over-answering — these want a crisp 20-second answer, not a lecture. Below are the questions juniors get screened on with a tight model answer for each. The full depth lives in <strong>Module 0</strong>; here we drill the snappy version." },
        { type: "callout", variant: "tip", html: "<p>Phone-screen pacing: answer, then a one-line example, then <em>stop</em>. If they want more they'll ask. Filling silence is how you talk yourself into a wrong statement.</p>" },
        { type: "h", text: "The CIA triad" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “What is the CIA triad?”</strong> “The three goals of security: <strong>Confidentiality</strong> — only authorised people see data; <strong>Integrity</strong> — data isn't tampered with; <strong>Availability</strong> — it's there when you need it. Ransomware, for example, hits availability and sometimes confidentiality at once.”</p>" },
        { type: "h", text: "Encryption vs. hashing vs. encoding" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Difference between encryption, hashing, and encoding?”</strong> “<strong>Encryption</strong> is reversible with a key, for confidentiality. <strong>Hashing</strong> is one-way, for integrity and storing passwords — you can't get the input back. <strong>Encoding</strong> like Base64 is just a reversible format change with <em>no</em> security at all. The classic gotcha is treating Base64 as if it protects anything — it doesn't.”</p>" },
        { type: "h", text: "Symmetric vs. asymmetric" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Symmetric vs. asymmetric encryption?”</strong> “<strong>Symmetric</strong> uses one shared key — fast, good for bulk data (AES). <strong>Asymmetric</strong> uses a public/private key pair — slower, solves key exchange and enables signatures (RSA, ECC). In practice TLS uses both: asymmetric to exchange a session key, then symmetric for the actual traffic.”</p>" },
        { type: "h", text: "TCP vs. UDP and the 3-way handshake" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “TCP vs. UDP, and what's the 3-way handshake?”</strong> “<strong>TCP</strong> is connection-oriented and reliable — ordered, acknowledged delivery. <strong>UDP</strong> is connectionless and fast, no guarantees — good for DNS, video, VoIP. TCP opens with the handshake: <strong>SYN → SYN-ACK → ACK</strong>. A flood of half-open SYNs with no final ACK is a SYN-flood DoS.”</p>" },
        { type: "h", text: "Common ports" },
        { type: "table", headers: ["Port", "Service", "Note for a defender"], rows: [
          ["22", "SSH", "Remote admin — watch for brute force"],
          ["53", "DNS", "Often UDP; abused for tunnelling/exfil"],
          ["80 / 443", "HTTP / HTTPS", "443 should be the norm; plain 80 is a finding"],
          ["3389", "RDP", "Top ransomware entry point — never expose to internet"],
          ["445", "SMB", "File sharing; EternalBlue/lateral movement"],
          ["389 / 636", "LDAP / LDAPS", "Directory queries; 636 is the TLS-protected one"]
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Name some common ports.”</strong> Don't list fifty. Say: “22 SSH, 80/443 web, 3389 RDP, 445 SMB, 53 DNS, 25/587 mail, 389/636 LDAP. The ones I care about most as a defender are <strong>3389 and 445</strong> — those exposed to the internet are how a lot of breaches start.” Tying ports to risk beats reciting a chart.</p>" },
        { type: "h", text: "IDS vs. IPS" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “IDS vs. IPS?”</strong> “<strong>IDS</strong> detects and alerts — passive, out of band. <strong>IPS</strong> sits inline and can <em>block</em> the traffic. Trade-off: an IPS can stop attacks in real time but a false positive can break production, so it needs careful tuning.”</p>" },
        { type: "h", text: "Firewall vs. proxy vs. WAF" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Firewall vs. proxy vs. WAF?”</strong> “A <strong>firewall</strong> filters by IP/port/protocol (layers 3-4). A <strong>proxy</strong> brokers connections on a host's behalf — forward proxy for outbound users, reverse proxy in front of servers. A <strong>WAF</strong> is application-layer (layer 7), inspecting HTTP to stop SQL injection, XSS, and the OWASP Top 10. Different layers, used together.”</p>" },
        { type: "h", text: "Threat vs. vulnerability vs. risk" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Threat vs. vulnerability vs. risk?”</strong> “A <strong>vulnerability</strong> is a weakness (unpatched server). A <strong>threat</strong> is something that could exploit it (a ransomware crew). <strong>Risk</strong> is the likelihood and impact of that happening — roughly threat × vulnerability × impact. We patch to reduce vulnerability and add controls to reduce risk.”</p>" },
        { type: "h", text: "Defense in depth & least privilege" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Defense in depth and least privilege?”</strong> “<strong>Defense in depth</strong> is layering controls so no single failure is fatal — identity, network, endpoint, data, monitoring. <strong>Least privilege</strong> is giving every account and process only the access it needs and nothing more, so a compromise has a small blast radius. They work together: layers contain the breach, least privilege shrinks it.”</p>" },
        { type: "callout", variant: "warn", title: "Phone-screen red flags", html: "<p>The two things that fail a phone screen fast: <strong>long silences with no attempt</strong> (just say “I'd reason about it like this…”), and <strong>confusing the simplest pairs</strong> — encryption vs. hashing, authn vs. authz, IDS vs. IPS. If you can't separate those cleanly you won't reach the technical loop. Drill them until they're reflex.</p>" },
        { type: "callout", variant: "lab", html: "<p><strong>Rep:</strong> Have a friend read these ten questions in random order. Answer each in under 25 seconds. If you go over, you're lecturing. Run the set twice — once cold, once after you've heard your gaps. Target: clean, calm, done in twenty seconds each.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "10-3",
      title: "Behavioral & STAR",
      subtitle: "Stories, not adjectives",
      blocks: [
        { type: "p", html: "Half of a junior interview is behavioral, and it's where strong technical candidates quietly lose. When I ask “tell me about a time you…,” a weak candidate gives me an <em>adjective</em> (“I'm a hard worker”) and a strong one gives me a <strong>story with a result</strong>. The tool that turns rambling into a story is STAR." },
        { type: "h", text: "The STAR method" },
        { type: "kv", items: [
          { k: "S — Situation", v: "Set the scene in one sentence. Where, when, what was going on." },
          { k: "T — Task", v: "What was your specific responsibility or goal? Make it about YOU, not 'we'." },
          { k: "A — Action", v: "The steps YOU took. This is 60% of the answer — be concrete and sequential." },
          { k: "R — Result", v: "The outcome, ideally measurable. What changed, what you learned." }
        ]},
        { type: "callout", variant: "tip", html: "<p>Most juniors under-weight the <strong>Action</strong> and forget the <strong>Result</strong> entirely. If a story has no result and no “here's what I learned,” it's not a STAR answer — it's an anecdote. Always land the R.</p>" },
        { type: "h", text: "No job history? Your home lab IS your experience" },
        { type: "p", html: "“I've never had a security job” is not a blocker — it's a framing problem. Coursework, a home lab, a CTF, a capstone, a club, helping a small business: all of these are legitimate STAR material. I do not need you to have done it at a Fortune 500. I need to see you <strong>do the thing and reason about it</strong>." },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Tell me about a hands-on security project.”</strong> Lab-as-experience model: “<em>(S)</em> I built a home lab with a Windows VM, a Microsoft Sentinel trial, and a vulnerable VM to attack. <em>(T)</em> I wanted to generate real attack telemetry and detect it myself. <em>(A)</em> I ran failed sign-ins and a simulated brute force, shipped the logs into Sentinel, and wrote a KQL query to surface the spike of ResultType 50126 events, then built an analytics rule on it. <em>(R)</em> It fired correctly, and I learned the hard way that filtering on ResultType not-equal-zero is noisy because it catches MFA prompts too — so I scoped it to the actual bad-credential code. That debugging is what taught me triage.” That answer beats a year of unexplained job titles.</p>" },
        { type: "callout", variant: "lab", html: "<p><strong>Rep:</strong> Write down three STAR stories from this course before any interview: (1) a thing you built, (2) a thing you broke and fixed, (3) a thing you learned that changed how you work. Label each S/T/A/R explicitly. You'll reuse these to answer a dozen different behavioral questions.</p>" },
        { type: "h", text: "Scripted behavioral answers" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Why cybersecurity?”</strong> “I like problems where the answer isn't in a manual and an adversary is actively changing the rules. The first time I traced an attack through logs in my home lab and reconstructed what happened, it clicked — it's investigative work with real stakes. And the field never stops moving, which suits how I like to keep learning.” Concrete, not a cliché about “protecting people.”</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Why Microsoft / why this team?”</strong> “Microsoft's security stack — Entra ID, Defender XDR, Sentinel, Intune — is what a huge share of enterprises actually run, so the skills compound and the telemetry is enormous. I've already been hands-on with Sentinel and KQL, and I want to go deep on a platform that's central to how the industry defends, not niche.” Show you researched the actual stack.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Tell me about yourself.”</strong> The 3-sentence script: “I'm an early-career security person who came in through <em>(your path — IT support, a degree, self-study)</em>, and I've spent the last while going deep on the Microsoft security stack and building a home lab where I detect attacks I run myself. I'm strongest at log analysis and triage reasoning, and I'm looking for a SOC role where I can sharpen those on real volume. The short version: hands-on, curious, and I want to be in the alert queue.” Three sentences, present-tense, ends on what you want.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Tell me about a time you failed or were wrong.”</strong> “In my lab I tuned a detection so aggressively that it suppressed a real test alert — I'd over-fit it to reduce noise. <em>(A)</em> I caught it when a known-bad sign-in didn't fire, traced the filter, and loosened it with a documented reason. <em>(R)</em> The lesson stuck: tuning is a trade-off, and I now record <em>why</em> I changed a rule so the next person — including future me — can see the reasoning.” Pick a real, low-stakes failure with a learning. Never “I work too hard.”</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “A conflict with a teammate.”</strong> “On a group project a teammate and I disagreed on whether to block or just alert on a control. <em>(A)</em> Instead of pushing my view, I asked what risk he was worried about — turned out it was breaking a workflow — so we agreed to alert first, measure, then enforce. <em>(R)</em> We shipped it and avoided the outage he feared.” The signal I want: you disagree without making it personal, and you seek the other person's reasoning. Never badmouth them.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “A time you worked under pressure.”</strong> “During a timed CTF the clock was running and my first three approaches to a challenge failed. <em>(A)</em> I stopped flailing, wrote down what I actually knew, eliminated dead ends methodically, and found the path with ten minutes left. <em>(R)</em> We placed, but the real takeaway was that under pressure my edge is slowing down and being systematic, not going faster.” Pressure questions are really asking: do you panic or do you get methodical?</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “How do you stay current?”</strong> “A few feeds I read weekly — the Microsoft Security blog and MSRC, a couple of newsletters like a daily threat roundup, and I follow CISA advisories. When something big drops I try to reproduce a piece of it in my lab. I'm also working toward <em>(a relevant cert — SC-200 / AZ-500 / Security+)</em>.” Name <em>specific</em> sources. “I read articles” tells me nothing.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Greatest weakness?”</strong> Answer it honestly with a correction in motion — not a humblebrag. “Early on I'd dive into the technical detail of an alert before writing down the basic facts, and I'd lose the thread. I've started forcing myself to document the who/what/when first before going deep, and it's made my investigations cleaner.” A real weakness + a concrete fix shows self-awareness. “I'm a perfectionist” fails instantly.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Where do you see yourself in 3-5 years?”</strong> “I want to start in the SOC and get genuinely good at detection and response, then grow toward <em>(detection engineering / threat hunting / cloud security)</em>. I'm not in a rush to leave the queue — that's where the reps are. Five years out I'd like to be the person juniors come to for a triage call.” Show ambition that's grounded in doing the job well first.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “An ethics dilemma.”</strong> “In my lab I found a real misconfiguration on a free service I was testing against. <em>(A)</em> Rather than poke further, I stopped, confirmed I was out of scope, and reported it through their responsible-disclosure channel. <em>(R)</em> They fixed it.” The signal: you know <strong>scope and authorisation are the line</strong>, and you'd rather report than exploit. If you're asked a hypothetical like “a manager tells you to ignore a finding,” say you'd document it and escalate through the right channel — never just quietly comply.</p>" },
        { type: "callout", variant: "warn", title: "Behavioral red flags", html: "<p>What sinks behavioral answers: <strong>“we” with no “I”</strong> (I can't tell what you did), <strong>no result</strong> (anecdote, not STAR), <strong>blaming others</strong>, <strong>fake weaknesses</strong> (“too detail-oriented”), and <strong>memorised-robot delivery</strong>. Prepare the bones of each story but don't recite — I can hear a script, and it reads as inauthentic.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "10-4",
      title: "SOC analyst track",
      subtitle: "The judgment behind the queue",
      blocks: [
        { type: "p", html: "A SOC interview isn't testing whether you can name tools — it's testing your <strong>judgment under a stack of alerts</strong>. Can you take something from the queue, decide if it's real, and either close it or escalate it with a clear rationale? Let me walk you through what I probe for." },
        { type: "h", text: "Walk an alert from queue to closure" },
        { type: "olist", items: [
          "<strong>Acknowledge & scope.</strong> What fired, on which user/host, when, and how many times. Read the alert and the rule that made it.",
          "<strong>Gather context.</strong> Is this user/host normal for this behaviour? Pull related sign-ins, processes, network. Baseline first.",
          "<strong>Decide TP vs FP.</strong> Does the evidence support real malicious or risky activity, or is there a benign explanation?",
          "<strong>Contain if needed.</strong> If true positive, take the proportionate first action — disable the account, isolate the host — and preserve evidence.",
          "<strong>Escalate or close.</strong> Hand to Tier 2 with a written summary if it exceeds your scope; otherwise close with a documented reason.",
          "<strong>Document.</strong> Every call needs a one-paragraph why. The next analyst — and the audit — depends on it."
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Walk me through how you'd handle an alert.”</strong> Use the six steps above out loud, naming the evidence you'd pull at each stage. The thing I'm grading is whether you <strong>gather context before you act</strong> and whether you can say <em>why</em> you'd close vs. escalate. Candidates who jump straight to “disable the account” without scoping lose points even when disabling is ultimately right.</p>" },
        { type: "h", text: "True positive vs. false positive" },
        { type: "p", html: "Every alert is one of four things, and you should know the matrix cold: <strong>True Positive</strong> (real, alert fired — investigate/respond), <strong>False Positive</strong> (benign, alert fired — close and tune), <strong>True Negative</strong> (benign, no alert — good), <strong>False Negative</strong> (real, no alert — the dangerous one; a gap to close). A good analyst doesn't just close false positives — they note <em>why</em> it was a FP so the rule can be tuned and the next one auto-resolves." },
        { type: "h", text: "When and how to escalate (Tier 1 vs Tier 2)" },
        { type: "kv", items: [
          { k: "Tier 1", v: "Monitors the queue, does initial triage, closes clear false positives, and escalates anything confirmed or ambiguous. Speed and accurate hand-offs matter." },
          { k: "Tier 2", v: "Deeper investigation, threat hunting, scoping the full incident, coordinating response. Tier 1 escalates to them with a clean summary." },
          { k: "How to escalate", v: "A tight write-up: what fired, what you checked, what you found, why it exceeds your scope, and your recommended next step. Never escalate a raw alert with no analysis." }
        ]},
        { type: "h", text: "What makes an incident P1 / Sev1" },
        { type: "p", html: "Severity is about <strong>business impact and scope</strong>, not how scary the alert looks. A P1/Sev1 typically means: active hands-on-keyboard adversary, confirmed ransomware or data exfiltration, a domain-wide or crown-jewel compromise, or a critical service down. One workstation with a quarantined commodity trojan is not a P1. Being able to <em>right-size</em> severity is a senior signal even in a junior." },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “What makes something a Sev1?”</strong> “Impact and blast radius. Sev1 is active, spreading, or hitting the crown jewels — confirmed ransomware encryption, data exfil, domain admin compromise, or a critical business service down. A single contained malware detection isn't Sev1. I'd rather under-call and upgrade with evidence than cry wolf, but anything touching identity or backups I treat as high until proven otherwise.”</p>" },
        { type: "h", text: "SLAs" },
        { type: "p", html: "SOCs run on <strong>SLAs</strong> — time-to-acknowledge and time-to-respond targets that get tighter as severity rises (a Sev1 might be minutes; a Sev4 might be a day). Know the two big metrics: <strong>MTTD</strong> (mean time to detect) and <strong>MTTR</strong> (mean time to respond/remediate). If asked, say you'd triage by severity against the SLA clock, not strictly first-in-first-out." },
        { type: "h", text: "Investigating a reported phishing email" },
        { type: "olist", items: [
          "<strong>Don't click anything live.</strong> Work from headers and a safe analysis environment; preserve the original.",
          "<strong>Examine headers</strong> — real sender, return-path, and SPF/DKIM/DMARC results. Spoofed or failing auth?",
          "<strong>Inspect links and attachments</strong> — hover/decode URLs, detonate attachments in a sandbox, pull file hashes.",
          "<strong>Scope the blast radius</strong> — who else received it? In Defender XDR / Microsoft Defender for Office 365, search the message and see who clicked.",
          "<strong>Contain</strong> — soft/hard delete the message tenant-wide, block sender/URL, reset credentials if anyone entered them.",
          "<strong>Report & educate</strong> — extract IOCs, brief the user, and tune the filter so the next one is blocked."
        ]},
        { type: "h", text: "Investigating a suspicious / impossible-travel sign-in" },
        { type: "p", html: "“Impossible travel” = the same account signs in from two locations too far apart to physically travel between in the elapsed time. Your job is to decide if it's a compromise or a benign explanation (a VPN, a cloud proxy, a phone roaming). Pull the sign-in logs in <strong>Entra ID</strong>: look at IPs, ASNs, device, whether MFA was satisfied, and whether the risky sign-in was followed by anything bad — a new inbox rule, MFA registration, mass downloads. If real, disable the account, revoke sessions, and reset credentials." },
        { type: "h", text: "Brute force vs. password spray vs. credential stuffing" },
        { type: "table", headers: ["Attack", "Pattern", "Tell in the logs"], rows: [
          ["<strong>Brute force</strong>", "Many passwords against ONE account", "A single user with a burst of 50126 failures"],
          ["<strong>Password spray</strong>", "ONE common password against MANY accounts", "Many users, few failures each, often timed to dodge lockout (50053)"],
          ["<strong>Credential stuffing</strong>", "Known breached user:password pairs replayed", "Many users, often successful on first try, from bot infrastructure"]
        ]},
        { type: "h", text: "IOC vs. IOA" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “IOC vs. IOA?”</strong> “An <strong>Indicator of Compromise</strong> is forensic evidence the attack happened — a bad hash, IP, domain. Reactive: you match against it. An <strong>Indicator of Attack</strong> is behaviour showing an attack in progress — e.g. a process spawning a script that touches LSASS. Proactive: it catches novel attacks that don't match any known IOC. Modern detection leans on IOAs because attackers rotate IOCs cheaply.”</p>" },
        { type: "callout", variant: "lab", title: "Live KQL rep 1 — failed sign-ins (do this out loud)", html: "<p>An interviewer may hand you a whiteboard and say “find failed sign-ins.” The naive answer — <code>ResultType != 0</code> — is a trap: it also matches MFA prompts, interrupts, and Conditional Access blocks, so it's noisy and wrong. Filter on the <strong>actual bad-credential code 50126</strong> (and 50053 for lockout). Talk through why as you write it.</p>" },
        { type: "code", lang: "kql", caption: "Failed sign-ins by bad-credential ResultType (Microsoft Sentinel / Entra SigninLogs)", code: [
          "SigninLogs",
          "| where TimeGenerated > ago(1h)",
          "// 50126 = invalid username or password (bad credential)",
          "// 50053 = account locked out from repeated failures",
          "| where ResultType in (\"50126\", \"50053\")",
          "| summarize FailedAttempts = count(),",
          "            DistinctIPs = dcount(IPAddress)",
          "    by UserPrincipalName, ResultType",
          "| where FailedAttempts > 10",
          "| sort by FailedAttempts desc"
        ]},
        { type: "p", html: "Then narrate the pivot: many users with a handful of failures each points to <strong>spray</strong>; one user with hundreds points to <strong>brute force</strong>; and you'd join to successful sign-ins (ResultType 0) right after to see if any attempt landed." },
        { type: "callout", variant: "lab", title: "Live KQL rep 2 — suspicious inbox rule / process", html: "<p>After a phished sign-in, attackers often create a <strong>mailbox rule</strong> to auto-delete or forward security warnings. Knowing this hunt signals real SOC instinct. (On the endpoint side, the equivalent is hunting a suspicious process tree.)</p>" },
        { type: "code", lang: "kql", caption: "New inbox rules created (Defender XDR / OfficeActivity)", code: [
          "OfficeActivity",
          "| where TimeGenerated > ago(24h)",
          "| where Operation in (\"New-InboxRule\", \"Set-InboxRule\")",
          "| project TimeGenerated, UserId, Operation,",
          "          ClientIP, Parameters",
          "// Triage: rules that forward externally or delete/move",
          "// messages containing words like 'phish', 'hacked', 'invoice'",
          "| sort by TimeGenerated desc"
        ]},
        { type: "callout", variant: "warn", title: "SOC red flags", html: "<p>What fails a SOC interview: <strong>acting before scoping</strong> (“disable everything” reflexively), <strong>not knowing why you'd close a false positive</strong> (so you'd never tune), <strong>using ResultType != 0</strong> for a failed-logon hunt, and <strong>treating every alert as a Sev1</strong>. The senior move is calm, evidence-first reasoning and right-sized severity.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "10-5",
      title: "IAM / identity-admin track",
      subtitle: "Lifecycle, protocols, and least-privilege at scale",
      blocks: [
        { type: "p", html: "Identity is the new perimeter, and an IAM interview tests whether you can <strong>run an identity lifecycle cleanly and reason about access at scale</strong>. The recurring theme: every account is a door, and your job is making sure doors open on day one, change when people change roles, and lock the moment someone leaves." },
        { type: "h", text: "Joiner-Mover-Leaver (JML)" },
        { type: "kv", items: [
          { k: "Joiner", v: "New identity provisioned with exactly the access their role needs — ideally automatically from HR as the source of truth." },
          { k: "Mover", v: "Role change. The trap is access ACCRETION — people gain rights and never lose the old ones. A mover should LOSE old access, not just gain new." },
          { k: "Leaver", v: "Deprovision fast. Disable the account, revoke sessions/tokens, reclaim licenses and group memberships. Orphaned accounts are a top breach vector." }
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “How would you automate provisioning and deprovisioning?”</strong> “Drive it from the HR system as the authoritative source. On a joiner, automated provisioning creates the account and assigns access via <strong>dynamic groups</strong> based on attributes like department. On a leaver, the HR termination triggers automatic disable, session revocation, and group removal. In the Microsoft world that's Entra ID provisioning, often pushing to apps over <strong>SCIM</strong>. The goal is no human manually remembering to revoke access — because they'll forget, and that's how you get orphaned admin accounts.”</p>" },
        { type: "h", text: "SCIM vs. SAML vs. OAuth/OIDC — when each" },
        { type: "table", headers: ["Protocol", "Solves", "Use it when"], rows: [
          ["<strong>SCIM</strong>", "Provisioning — creating/updating/deleting user accounts in apps", "You need users auto-created and deprovisioned in a SaaS app"],
          ["<strong>SAML</strong>", "Authentication / SSO (older, XML-based)", "Enterprise web-app SSO, especially legacy or B2B federation"],
          ["<strong>OAuth 2.0</strong>", "Authorization — delegated access to an API (a token, not a login)", "An app needs to call an API on a user's behalf"],
          ["<strong>OIDC</strong>", "Authentication built ON TOP of OAuth (adds an ID token)", "Modern app sign-in, mobile/SPA — the current default for authn"]
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Difference between SAML, OAuth, and OIDC?”</strong> “<strong>SAML</strong> and <strong>OIDC</strong> both do authentication / SSO — SAML is the older XML standard, OIDC is the modern JSON one built on OAuth. <strong>OAuth 2.0</strong> alone is about <em>authorization</em> — granting an app delegated access to an API — not proving who you are. The common mistake is using raw OAuth for login; OIDC exists precisely because OAuth wasn't designed to be an authentication protocol.” That last sentence is the depth signal.</p>" },
        { type: "h", text: "Access reviews" },
        { type: "p", html: "Access drifts. <strong>Access reviews</strong> are periodic recertifications where managers or resource owners confirm each person still needs their access — especially for privileged roles, guests, and sensitive groups. In Entra ID these can be automated and recurring, with auto-removal if a reviewer doesn't respond. The interview point: access reviews are how you fight the slow accumulation of privilege that JML 'mover' handling misses." },
        { type: "h", text: "RBAC vs. ABAC and role explosion" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “RBAC vs. ABAC?”</strong> “<strong>RBAC</strong> grants access by role — simple, auditable, but you can hit <strong>role explosion</strong> when every edge case spawns a new role and you end up with thousands. <strong>ABAC</strong> grants access by attributes evaluated at access time — user department, resource sensitivity, device state — which scales to fine-grained policy without a role per combination, at the cost of complexity. In practice you use RBAC for the coarse structure and ABAC-style conditions for the nuance.”</p>" },
        { type: "h", text: "Dynamic vs. assigned groups" },
        { type: "list", items: [
          "<strong>Assigned (static) groups</strong> — membership is set manually. Precise, but someone has to maintain it, and they forget.",
          "<strong>Dynamic groups</strong> — membership is a rule over attributes (e.g. department equals Finance). Self-maintaining; ideal for JML automation. The risk: a sloppy rule or a mistyped attribute can grant or strip access en masse, so test the rule and watch for attribute integrity."
        ]},
        { type: "h", text: "SSO — benefits and risks" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Benefits and risks of SSO?”</strong> “<strong>Benefits:</strong> one strong credential instead of many weak ones, far better UX, central enforcement of MFA and Conditional Access, and instant deprovisioning across every connected app. <strong>Risk:</strong> it's a single point of failure — compromise the identity provider and you've potentially got everything. That's exactly why SSO must be paired with strong, phishing-resistant MFA and Conditional Access; the convenience and the risk are two sides of the same coin.”</p>" },
        { type: "h", text: "An offboarding runbook" },
        { type: "olist", items: [
          "<strong>Disable the account</strong> immediately (don't delete yet — you may need the data and audit trail).",
          "<strong>Revoke sessions and refresh tokens</strong> so existing logins die, not just future ones. A disabled account with a live token is still active.",
          "<strong>Reset the password</strong> and remove MFA methods to kill any cached access.",
          "<strong>Remove group memberships, roles, and licenses</strong>; reassign or transfer owned resources and mailbox.",
          "<strong>Handle data</strong> — convert the mailbox to shared, place on legal hold if required, reassign files.",
          "<strong>After a retention window, delete</strong> and confirm no orphaned access remains."
        ]},
        { type: "h", text: "B2B / guest governance" },
        { type: "p", html: "Guests (B2B) are external identities you invite into your tenant — partners, contractors. They're convenient and easy to forget about, which makes them a quiet risk. Governance means: limit what guests can see by default, require sponsors, run <strong>access reviews specifically for guests</strong>, set expiration, and remove guests who haven't signed in. The interview takeaway: every guest is an external account with a foothold inside your tenant — treat them as a managed risk, not a one-time invite." },
        { type: "callout", variant: "warn", title: "IAM red flags", html: "<p>What fails an identity interview: <strong>confusing authentication and authorization</strong> (or SAML vs. OAuth), treating a <strong>mover as a joiner</strong> (granting new access without removing old), forgetting to <strong>revoke tokens/sessions</strong> on offboarding (disabling alone isn't enough), and not understanding that <strong>SSO concentrates risk</strong>. Identity roles are unforgiving about these basics.</p>" },
        { type: "callout", variant: "lab", html: "<p><strong>Rep:</strong> Out loud, give a complete leaver runbook in 60 seconds without notes. Then explain why “I disabled the account” is an incomplete answer (live tokens, group ownership, mailbox, licenses). If you can do both cleanly, you're ahead of most junior IAM candidates.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "10-6",
      title: "Cloud security track",
      subtitle: "Landing zones, posture, and protecting what's exposed",
      blocks: [
        { type: "p", html: "Cloud-security interviews test whether you understand the <strong>shared-responsibility model in practice</strong> and can reason about securing real workloads. The recurring junior mistake is talking about cloud like it's just someone else's datacenter — the controls, the failure modes, and the tooling are genuinely different." },
        { type: "h", text: "Secure landing zone basics" },
        { type: "p", html: "A <strong>landing zone</strong> is the pre-built, governed foundation you deploy workloads into — so security isn't bolted on per-project. The basics: a sensible management-group/subscription hierarchy, network segmentation, centralized identity (Entra ID), centralized logging, baseline guardrails via policy, and separation of environments (prod vs. dev). The point: you bake security into the platform so every team inherits it instead of reinventing it (badly)." },
        { type: "h", text: "CSPM vs. CWPP" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “CSPM vs. CWPP — and what does Defender for Cloud do?”</strong> “<strong>CSPM (Cloud Security Posture Management)</strong> is about <em>configuration</em> — continuously checking for misconfigurations and compliance drift, like a public storage account or missing encryption. <strong>CWPP (Cloud Workload Protection Platform)</strong> is about <em>runtime</em> — protecting the actual VMs, containers, and databases from threats while they run. <strong>Microsoft Defender for Cloud</strong> does both: it scores your posture with Secure Score and recommendations (CSPM) and adds workload protection plans for servers, containers, storage, and SQL (CWPP).”</p>" },
        { type: "h", text: "Securing storage and secrets" },
        { type: "list", items: [
          "<strong>No public blobs.</strong> The classic cloud breach is a storage account or bucket left world-readable. Disable public access at the account level; require auth.",
          "<strong>Key Vault for secrets.</strong> Never hardcode keys, connection strings, or certs in code or config. Centralize them in Azure Key Vault with access policies / RBAC and audit logging.",
          "<strong>Private endpoints.</strong> Keep storage, Key Vault, and databases off the public internet entirely — reach them over a private endpoint inside your VNet so there's no public surface to attack.",
          "<strong>Managed identities over secrets.</strong> Let a service authenticate as itself with no stored credential to leak — the cleanest fix for the secret-sprawl problem."
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Where do application secrets go?”</strong> “Never in source code or config files — that's how keys end up in a public Git repo. They go in a secrets manager like <strong>Azure Key Vault</strong>, accessed at runtime with RBAC and audit logging. Better still, use a <strong>managed identity</strong> so the service authenticates with no stored secret at all. And rotate anything that was ever exposed — assume a leaked secret is burned.”</p>" },
        { type: "h", text: "IaC and policy-as-code" },
        { type: "p", html: "<strong>Infrastructure as Code</strong> (Bicep, ARM, Terraform) means your environment is defined in version-controlled files, so it's reviewable, repeatable, and scannable for misconfigurations <em>before</em> deployment. <strong>Policy-as-code</strong> — in Azure, that's <strong>Azure Policy</strong> — enforces guardrails automatically: deny public IPs, require encryption, enforce tagging, audit non-compliant resources. The interview point: you shift security <em>left</em>, catching the public-storage mistake in a pull request instead of in a breach report." },
        { type: "h", text: "Securing a public-facing web app" },
        { type: "olist", items: [
          "<strong>Identity & access</strong> — authenticate users (Entra ID / OIDC), least-privilege the app's own identity (managed identity, no stored secrets).",
          "<strong>Edge protection</strong> — a WAF in front for the OWASP Top 10, plus DDoS protection and TLS everywhere.",
          "<strong>Network</strong> — backend (DB, storage, Key Vault) on private endpoints, not public; segment tiers.",
          "<strong>Data</strong> — encryption at rest and in transit; secrets in Key Vault.",
          "<strong>Posture & patching</strong> — Defender for Cloud recommendations, vulnerability scanning, keep the stack patched.",
          "<strong>Logging & monitoring</strong> — centralize logs, alert on anomalies, have an IR plan."
        ]},
        { type: "h", text: "Cloud logging and monitoring strategy" },
        { type: "p", html: "“If it isn't logged, it didn't happen — and you can't investigate it.” A junior should be able to say: centralize logs (in Azure, Activity logs, resource/diagnostic logs, and sign-in logs flow to a Log Analytics workspace), feed them to a SIEM like <strong>Microsoft Sentinel</strong> for correlation and alerting, retain them long enough for investigations and compliance, and protect the logs themselves from tampering. The strategy is: collect broadly, alert narrowly, retain deliberately." },
        { type: "callout", variant: "warn", title: "Cloud red flags", html: "<p>What fails a cloud interview: <strong>not knowing the shared-responsibility line</strong> (the cloud secures the infrastructure; you secure your data, identities, and config), <strong>hardcoding secrets</strong>, thinking a <strong>public blob is fine</strong> “because the URL is hard to guess,” and treating <strong>posture (CSPM)</strong> and <strong>runtime protection (CWPP)</strong> as the same thing. Show you'd shift security left with policy-as-code.</p>" },
        { type: "callout", variant: "lab", html: "<p><strong>Rep:</strong> In 90 seconds, secure a hypothetical public web app that has a database and stores user uploads. Lead with identity and edge (WAF), then network (private endpoints), then data and logging. Practising the <em>ordering</em> — most-impactful first — is what makes you sound senior.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "10-7",
      title: "Walk-me-through scenario drills",
      subtitle: "Structured walk-throughs against the IR lifecycle",
      blocks: [
        { type: "p", html: "“Walk me through how you'd handle X” is the highest-signal question in the whole loop, and it's where you either sound like an operator or a textbook. The secret: <strong>have a backbone to hang every answer on</strong>, and <strong>lead with your top 3 moves, then say “and I'd also…”</strong> so you sound prioritised instead of dumping a list." },
        { type: "h", text: "The backbone: NIST IR lifecycle" },
        { type: "p", html: "Every scenario answer should map to the four NIST phases so you never lose your place:" },
        { type: "olist", items: [
          "<strong>Preparation</strong> — the controls, logging, runbooks, and access you set up <em>before</em> anything happens.",
          "<strong>Detection & Analysis</strong> — identify and scope: what happened, where, how bad, what's the blast radius.",
          "<strong>Containment, Eradication & Recovery</strong> — stop the spread, remove the foothold, restore clean operations.",
          "<strong>Post-Incident Activity</strong> — the lessons-learned: tune detections, fix the root cause, update the runbook."
        ]},
        { type: "callout", variant: "tip", html: "<p>Whenever you freeze mid-scenario, silently ask “which NIST phase am I in?” and narrate the next phase. Interviewers love hearing the phase names — it tells them you have a repeatable process, not just instincts.</p>" },
        { type: "h", text: "Drill 1 — Phishing incident" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “A user reports a phishing email and says they clicked the link and maybe entered their password. Walk me through it.”</strong> “Top 3 first: <strong>(1)</strong> assume the credential is compromised — disable the account or force password reset and <em>revoke active sessions/tokens</em>; <strong>(2)</strong> scope the blast radius — search the tenant in Defender for who else got the message and who clicked, and check the account for attacker actions like a new inbox rule or MFA registration; <strong>(3)</strong> contain the message — soft/hard delete it tenant-wide and block the sender/URL. <em>And I'd also</em> pull IOCs, check sign-in logs for a successful malicious login, reset and re-enroll MFA, and feed the indicators back into detections. Mapping to NIST: detection &amp; analysis to scope, containment/eradication on the account and message, then post-incident tuning of the mail filter.” Notice the <em>revoke sessions</em> detail — that's the line that separates juniors who've thought it through.</p>" },
        { type: "h", text: "Drill 2 — Ransomware first moves" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “You get an alert that files are being encrypted on a server. First moves?”</strong> “Top 3: <strong>(1) Isolate</strong> the affected host(s) from the network immediately to stop spread — contain before you investigate; <strong>(2) Identify scope</strong> — how many hosts, which share/account is the spread vector, is it still active; <strong>(3) Protect the crown jewels</strong> — verify backups are intact and <em>offline/immutable</em>, and protect domain controllers and identity. <em>And I'd also</em> preserve forensic evidence before reimaging, hunt for the initial access and persistence so I don't restore into a re-infection, and engage IR/leadership because this is likely a Sev1. The critical instinct: <strong>contain first, do NOT just start reimaging</strong> — and never pay or wipe before scoping. Recovery is from known-clean backups after eradication.”</p>" },
        { type: "callout", variant: "warn", html: "<p>The two ransomware answers that fail: <strong>“I'd reimage everything”</strong> (destroys evidence, may reinfect, ignores scope) and <strong>“I'd pull the network cable on the whole datacenter”</strong> (over-broad — isolate affected hosts, don't cause your own outage). Proportionate containment with evidence preservation is the senior answer.</p>" },
        { type: "h", text: "Drill 3 — Business Email Compromise (BEC)" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Finance reports a fraudulent wire request that looked like it came from the CFO. Walk me through.”</strong> “BEC is identity-and-money, not malware. Top 3: <strong>(1)</strong> determine if the CFO's mailbox is actually compromised — check sign-in logs for anomalous logins, and crucially look for a <strong>hidden inbox rule</strong> auto-deleting replies (the BEC signature); <strong>(2)</strong> if compromised, lock it down — reset, revoke sessions, remove the malicious rule, re-enroll MFA; <strong>(3)</strong> stop the money — immediately loop in finance and the bank to halt/recall the wire, because the financial clock matters more than the forensics. <em>And I'd also</em> scope who else was targeted, check for OAuth app-consent grants (a stealth persistence trick), and brief finance on out-of-band verification for payment changes. NIST-wise: detection on the mailbox, containment on identity and the wire, post-incident on the payment-approval process.”</p>" },
        { type: "h", text: "Drill 4 — Hardening a brand-new M365 tenant" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “You're handed a fresh Microsoft 365 tenant. What are the first things you'd lock down?”</strong> “Top 3, all identity-first: <strong>(1)</strong> enforce <strong>phishing-resistant MFA for everyone</strong>, especially admins, via Conditional Access, and turn off legacy authentication (it bypasses MFA); <strong>(2)</strong> apply <strong>least privilege to admin roles</strong> — break-glass accounts, separate admin identities, and PIM for just-in-time elevation; <strong>(3)</strong> baseline the <strong>email and endpoint security</strong> — Defender for Office 365 anti-phishing, safe links/attachments, and Intune compliance + Defender on devices. <em>And I'd also</em> turn on unified audit logging from day one (you can't investigate what you didn't log), restrict app consent so users can't grant rogue OAuth apps, and review external sharing/guest defaults. The ordering matters: <strong>identity, then logging, then everything else</strong> — because in M365 identity is the perimeter.”</p>" },
        { type: "callout", variant: "lab", html: "<p><strong>Rep:</strong> Pick one drill, set a 2-minute timer, and answer out loud with the structure: name the NIST backbone, give your <em>top 3</em>, then “and I'd also…”, then close with the post-incident lesson. Record it. The goal isn't a perfect answer — it's that the structure holds even when you're improvising the details.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "10-8",
      title: "Closing the interview",
      subtitle: "Questions, negotiation, and the follow-up",
      blocks: [
        { type: "p", html: "The interview isn't over when the technical questions stop. How you <strong>close</strong> — the questions you ask, how you handle “I don't know,” and your follow-up — moves you several points in either direction, and most juniors waste it. Treat the last ten minutes as part of the evaluation, because it is." },
        { type: "h", text: "Strong questions to ask the interviewer" },
        { type: "p", html: "“Do you have any questions for me?” is a graded question. “No, I think you covered everything” reads as disinterest. Have five ready; ask three. Good questions show you're already picturing yourself doing the job:" },
        { type: "list", items: [
          "<strong>Team structure:</strong> “How is the team organised — tiers, specialties — and where would I fit?”",
          "<strong>Day-to-day:</strong> “What does a typical day or shift actually look like for someone in this role?”",
          "<strong>Success in 6 months:</strong> “What would a successful first six months look like for whoever you hire?” (This one always lands — it shows outcome-orientation.)",
          "<strong>Tooling:</strong> “What's the core stack — SIEM, EDR, ticketing — and how mature is the automation/playbook side?”",
          "<strong>On-call:</strong> “Is there an on-call or shift rotation, and how is it run?” (Asking shows you take the operational reality seriously.)",
          "<strong>Growth:</strong> “How do juniors here grow — mentorship, training budget, certs, paths to Tier 2 or specialties?”",
          "<strong>Biggest challenge:</strong> “What's the biggest challenge the team is facing right now?”",
          "<strong>For the manager:</strong> “What do your strongest people on the team have in common?”"
        ]},
        { type: "callout", variant: "tip", html: "<p>Tailor at least one question to something said earlier in the conversation — “you mentioned you're moving to Sentinel; how's that migration going?” That proves you were listening and thinking, which is exactly the trait we're hiring for.</p>" },
        { type: "h", text: "How to handle “I don't know”" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: (Something you genuinely don't know.)</strong> Never bluff and never just say “I don't know” and stop. The model move: “<strong>I haven't worked with that directly, but here's how I'd reason about it / here's where I'd go to find out…</strong>” then think out loud or name your approach. Honesty plus a method beats a confident wrong answer every time — I'm hiring for how you handle the unknown, because the job is full of unknowns. If you later realise the answer, it's fine to circle back: “Actually, on that earlier question…”</p>" },
        { type: "callout", variant: "warn", html: "<p>The single fastest way to lose my trust is to <strong>confidently state something wrong</strong>. Once I catch one bluff, I have to second-guess everything else you told me. Say what you know, flag what you don't, and reason about the gap.</p>" },
        { type: "h", text: "Salary & negotiation basics for juniors" },
        { type: "list", items: [
          "<strong>Do your homework</strong> on the range for the role, level, and location before you walk in. Know your number.",
          "<strong>Try to let them name a figure first.</strong> If pushed early, give a researched <em>range</em>, anchored at or slightly above your real target, and say it's flexible based on the whole package.",
          "<strong>Negotiate the offer, not the interview.</strong> When you get a written offer, it's normal and expected to ask once, politely, for more — “I'm excited about this; is there flexibility on the base?” The worst case is they say no.",
          "<strong>Look at the whole package</strong> — base, bonus, signing, growth, training/cert budget, on-call comp, remote flexibility. For a first security role, the <em>learning and trajectory</em> can be worth more than a few thousand dollars.",
          "<strong>Stay gracious.</strong> Negotiate firmly but warmly; you're about to work with these people."
        ]},
        { type: "h", text: "Post-interview follow-up" },
        { type: "olist", items: [
          "Send a <strong>short thank-you</strong> within 24 hours — to your interviewers or the recruiter to pass along.",
          "Make it <strong>specific</strong>: reference one thing you discussed and reaffirm your interest. Three or four sentences, not a wall of text.",
          "If you flubbed a question, a <strong>one-line correction</strong> is fair game: “On the KQL question, the cleaner filter is ResultType 50126 for bad credentials — it came to me afterward.” That can actually rescue a borderline result.",
          "If you don't hear back by their stated timeline, a <strong>single polite nudge</strong> is appropriate; don't pester."
        ]},
        { type: "callout", variant: "lab", html: "<p><strong>Rep:</strong> Write your three go-to closing questions and a reusable thank-you template now, before you need them. Walking in with these prepared removes the most common end-of-interview fumble — going blank when asked “any questions for us?”</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "10-9",
      title: "Full mock interview",
      subtitle: "Run the loop, then score yourself",
      blocks: [
        { type: "p", html: "Time to put it together. Below is a complete <strong>phone screen</strong> and a <strong>technical loop</strong>, presented as questions with model answers you can reveal. Don't read the answer first — say yours out loud, <em>then</em> open the model and compare. Finish with the self-scoring rubric and grade yourself honestly. Do this set three times before a real interview and you'll walk in calm." },
        { type: "callout", variant: "tip", html: "<p>Best results: have someone read these to you and only reveal the model answer after you've fully answered. Solo? Cover the answer, answer aloud, then check. The reps are in the <em>speaking</em>, not the reading.</p>" },
        { type: "h", text: "Part 1 — Phone screen (8 questions)" },
        { type: "callout", variant: "interview", html: "<p><strong>Q1: “Tell me about yourself.”</strong> Model: the 3-sentence script from 10-3 — path in, what you've gone deep on (Microsoft stack + home lab), your strength (log analysis / triage), and what you want (a SOC role on real volume). Present-tense, ends on what you're looking for.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q2: “Explain the CIA triad.”</strong> Model: Confidentiality (only authorised see data), Integrity (no tampering), Availability (there when needed). One example — ransomware hits availability and confidentiality. 20 seconds, then stop.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q3: “Encryption vs. hashing?”</strong> Model: encryption is reversible with a key (confidentiality); hashing is one-way (integrity, password storage). Don't confuse either with encoding, which has no security.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q4: “Authentication vs. authorization?”</strong> Model: authentication = proving who you are; authorization = what you're allowed to do once proven. One MFA-then-RBAC example. Getting this crisp is non-negotiable on the screen.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q5: “What is MFA and is it foolproof?”</strong> Model: two-plus independent factors; massively reduces credential-theft risk; <em>not</em> foolproof — AiTM proxies and token theft beat weaker MFA, which is why we push phishing-resistant methods. The nuance is the point.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q6: “Why do you want to work in a SOC / on this team?”</strong> Model: investigative work with real stakes, you've already been hands-on with the tooling, and you want reps on real alert volume. Tie to the actual stack you'd use.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q7: “How do you stay current?”</strong> Model: name specific sources — Microsoft Security blog, MSRC, CISA advisories, a newsletter — and that you reproduce things in your lab. Specificity beats “I read a lot.”</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q8: “Do you have a home lab? Tell me about it.”</strong> Model: describe what you built (VMs, Sentinel trial), what you generated and detected, and one thing you broke and fixed. This is the single strongest signal you can give on a screen.</p>" },
        { type: "h", text: "Part 2 — Technical loop (8 questions)" },
        { type: "callout", variant: "interview", html: "<p><strong>Q1: “Walk me through triaging an alert from queue to closure.”</strong> Model: the six steps from 10-4 — acknowledge/scope, gather context (baseline), TP vs FP decision, contain if needed, escalate-or-close with rationale, document. The graded skill is <em>context before action</em>.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q2: “Write a KQL query to find suspicious failed sign-ins.”</strong> Model: filter SigninLogs on ResultType 50126 (bad credential) and 50053 (lockout) — <em>not</em> ResultType != 0, which also catches MFA prompts and CA blocks. Summarize by user, threshold the count, then pivot to spray vs. brute force.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q3: “A user reports a phishing email — what do you do?”</strong> Model: don't click live; examine headers and SPF/DKIM/DMARC; analyze links/attachments safely; scope who else received/clicked; contain (delete tenant-wide, block sender/URL, reset creds if entered); report and tune. Map to NIST.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q4: “Brute force vs. password spray vs. credential stuffing?”</strong> Model: brute force = many passwords, one account; spray = one common password, many accounts (often timed to dodge lockout); stuffing = breached user:password pairs replayed. Each has a distinct log signature.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q5: “Server files are being encrypted — first moves?”</strong> Model: isolate affected hosts (contain first, don't reimage), identify scope and spread vector, protect backups/identity, preserve evidence, hunt initial access, escalate as likely Sev1. Never “just reimage.”</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q6: “SAML vs. OAuth vs. OIDC — when do you use each?”</strong> Model: SAML and OIDC do authentication/SSO (SAML older XML, OIDC modern JSON on OAuth); OAuth alone is authorization (delegated API access), not login. SCIM is the separate one — provisioning. Don't use raw OAuth for authn.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q7: “How would you secure a public-facing web app in Azure?”</strong> Model: identity (Entra/OIDC + managed identity, no stored secrets), edge (WAF, DDoS, TLS), network (backend on private endpoints), data (encryption, Key Vault), posture (Defender for Cloud, patching), logging (centralize + Sentinel). Lead most-impactful first.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q8: “You're handed a fresh M365 tenant — what do you lock down first?”</strong> Model: identity-first — phishing-resistant MFA for all (kill legacy auth), least-privilege admin + PIM, then email/endpoint baseline; and also enable audit logging day one, restrict app consent, review guest/sharing defaults. Order: identity, logging, everything else.</p>" },
        { type: "h", text: "Self-scoring rubric" },
        { type: "p", html: "Score each answer 0-2 and total it. Be honest — the point is to find your gaps before the interviewer does." },
        { type: "table", headers: ["Dimension", "0 — Cut", "1 — Borderline", "2 — Strong"], rows: [
          ["<strong>Structure</strong>", "Rambled, no shape", "Some structure, drifted", "Clean 3-beat or STAR / NIST backbone"],
          ["<strong>Accuracy</strong>", "Stated something wrong confidently", "Mostly right, minor slip", "Correct, with the right nuance"],
          ["<strong>Operational reasoning</strong>", "Named tools only", "Some steps, gaps", "Walked evidence → decision → action"],
          ["<strong>Brevity</strong>", "Over 2 min or froze", "A bit long/short", "60-90s, landed and stopped"],
          ["<strong>Coachability / honesty</strong>", "Bluffed or got defensive", "Hesitant on unknowns", "“Here's how I'd reason about it” on gaps"]
        ]},
        { type: "callout", variant: "lab", title: "Scoring guide", html: "<p>Total across the 16 questions, 2 points each (max 32). <strong>24+</strong> — you're interview-ready; polish delivery. <strong>16-23</strong> — solid base; drill the dimensions you scored 0-1 on. <strong>Under 16</strong> — go back through the module and rerun the reps out loud before booking interviews. Re-take this set until you're consistently in the top band — then book the real thing.</p>" },
        { type: "divider" },
        { type: "callout", variant: "tip", title: "Module 10 — Key takeaways", html: "<ul><li>You're scored on <strong>operational reasoning, curiosity, coachability, and a home lab you can narrate</strong> — not trivia recall. Use the <strong>3-beat answer</strong> (define → how → tie-in) and stop at 60-90 seconds.</li><li>Behavioral questions want <strong>STAR stories with a Result</strong>; a home lab or coursework is legitimate experience — frame it as S/T/A/R.</li><li>SOC judgment = <strong>context before action</strong>, TP-vs-FP with a documented reason, right-sized severity, and clean Tier-1→Tier-2 escalation. Hunt failed sign-ins on <strong>ResultType 50126/50053</strong>, never ResultType != 0.</li><li>Know the identity protocols cold (<strong>SCIM provisions, SAML/OIDC authenticate, OAuth authorizes</strong>) and the <strong>JML</strong> lifecycle — revoke sessions on offboarding, not just disable.</li><li>Hang every scenario on the <strong>NIST IR lifecycle</strong>, lead with your <strong>top 3 then “and I'd also…”</strong>, and for ransomware <strong>contain first — don't reimage blindly</strong>.</li><li>Close strong: ask sharp <strong>questions</strong>, handle “I don't know” with “here's how I'd reason about it,” negotiate the offer gracefully, and send a specific thank-you.</li></ul>" }
      ]
    }
  ],
  quiz: [
    { q: "You're asked to handle an alert that a user's account just signed in from an unusual country. What's the BEST first move in the interview answer?", options: ["Immediately delete the account", "Gather context first — check the sign-in logs, IP/ASN, whether MFA was satisfied, and the user's baseline — before deciding TP vs FP", "Say you'd reimage the user's laptop", "Escalate to Tier 2 without looking at anything"], answer: 1, explain: "The graded skill in SOC interviews is context-before-action. Scope and baseline first, decide true vs false positive, then take a proportionate, documented action. Reflexively deleting or escalating raw alerts loses points." },
    { q: "An interviewer asks you to write KQL to find suspicious failed sign-ins. Which approach is correct?", options: ["Filter SigninLogs on ResultType != 0", "Filter SigninLogs on ResultType 50126 (bad credential) and 50053 (lockout)", "Filter on every ResultType to be safe", "Count all sign-ins regardless of result"], answer: 1, explain: "ResultType != 0 also matches MFA prompts, interrupts, and Conditional Access blocks — it's noisy and wrong. The actual bad-credential code is 50126, with 50053 for lockout. Showing you know this distinction is a strong SOC signal." },
    { q: "Which behavioral answer to 'tell me about a time you failed' is strongest?", options: ["'I work too hard, that's my flaw'", "'I've never really failed at anything'", "A real low-stakes failure told in STAR with a concrete lesson and a change you made", "Blaming a teammate for the failure"], answer: 2, explain: "Interviewers want self-awareness: a genuine, low-stakes failure, what you did, and what you changed. Fake weaknesses, denial, and blame all fail. The Result/lesson is the part most juniors forget." },
    { q: "An alert turns out to be benign. What does a strong SOC analyst do?", options: ["Close it silently and move on", "Close it AND note why it was a false positive so the rule can be tuned", "Escalate it to Tier 2 anyway", "Leave it open in case it comes back"], answer: 1, explain: "A false positive isn't just a close — it's a tuning opportunity. Documenting WHY it was benign lets the rule be improved so the next one auto-resolves, reducing fatigue. That judgment separates good analysts." },
    { q: "On the ransomware-first-moves question, which answer would FAIL?", options: ["Isolate affected hosts to stop spread, then scope", "'I'd just reimage everything right away'", "Verify backups are intact and offline/immutable", "Preserve evidence before remediating"], answer: 1, explain: "Reimaging first destroys forensic evidence, ignores scope, and risks restoring into a reinfection because the initial access and persistence were never found. Contain first, preserve evidence, eradicate, THEN recover from clean backups." },
    { q: "An interviewer asks something you genuinely don't know. Best response?", options: ["Confidently guess and state it as fact", "Just say 'I don't know' and go silent", "Say 'I haven't worked with that directly, but here's how I'd reason about it / find out' and think out loud", "Change the subject to something you do know"], answer: 2, explain: "Bluffing destroys trust; silence wastes the chance to show reasoning. Honesty plus a method is exactly what's being graded — the job is full of unknowns and they're hiring for how you handle them." },
    { q: "During offboarding (the Leaver in JML), why is disabling the account NOT enough?", options: ["It is enough; nothing else is needed", "Existing sessions and refresh tokens can stay valid — you must revoke sessions/tokens, remove roles/licenses, and handle owned data", "You should delete it instantly with no retention", "Disabling also deletes the mailbox automatically"], answer: 1, explain: "A disabled account with a live token is still active. A complete runbook revokes sessions and tokens, resets credentials/MFA, removes roles, groups, and licenses, and handles owned resources and mailbox before eventual deletion." },
    { q: "When you're handed a brand-new M365 tenant to harden, what should you do FIRST?", options: ["Buy more endpoint licenses", "Identity first — enforce phishing-resistant MFA for everyone (kill legacy auth) and least-privilege admin roles", "Configure the company logo and branding", "Set up a SharePoint site structure"], answer: 1, explain: "In M365 identity is the perimeter, so the ordering is identity, then logging (audit on day one), then email/endpoint baseline. Leading with MFA and least-privilege admin — and disabling legacy auth that bypasses MFA — is the senior answer." }
  ],
  flashcards: [
    { front: "The 3-beat answer", back: "Structure any conceptual answer in three beats: <strong>Define</strong> it cleanly, explain <strong>how it works</strong>, then give the <strong>security/scenario tie-in</strong>. Keep it to 60-90 seconds, then stop." },
    { front: "STAR method", back: "<strong>Situation</strong> (one-sentence scene) → <strong>Task</strong> (your specific goal) → <strong>Action</strong> (the steps YOU took — ~60% of the answer) → <strong>Result</strong> (measurable outcome + what you learned). No Result = anecdote, not STAR." },
    { front: "Home lab as experience", back: "No job history is a framing problem, not a blocker. A lab, CTF, or coursework is legitimate STAR material — describe what you built, what you broke, and what you fixed. Narrating a lab is the single strongest junior signal." },
    { front: "TP vs FP (and the matrix)", back: "<strong>True Positive</strong> = real + alerted (respond). <strong>False Positive</strong> = benign + alerted (close AND tune). True Negative = benign, no alert (good). <strong>False Negative</strong> = real, no alert (the dangerous gap)." },
    { front: "Failed-sign-in hunt: the right filter", back: "Filter SigninLogs on <strong>ResultType 50126</strong> (invalid username/password) and <strong>50053</strong> (lockout) — NOT ResultType != 0, which also catches MFA prompts, interrupts, and Conditional Access blocks." },
    { front: "Brute force vs spray vs stuffing", back: "<strong>Brute force</strong> = many passwords, ONE account. <strong>Spray</strong> = one common password, MANY accounts (often timed to dodge lockout). <strong>Stuffing</strong> = breached user:password pairs replayed across many accounts." },
    { front: "IOC vs IOA", back: "<strong>IOC</strong> = forensic evidence the attack happened (hash, IP, domain) — reactive, you match it. <strong>IOA</strong> = behaviour showing an attack in progress (e.g. a process touching LSASS) — proactive, catches novel attacks." },
    { front: "JML lifecycle", back: "<strong>Joiner</strong> (provision least-privilege access), <strong>Mover</strong> (role change — LOSE old access, not just gain new), <strong>Leaver</strong> (deprovision fast: disable, revoke sessions/tokens, remove roles/licenses)." },
    { front: "SCIM vs SAML vs OAuth vs OIDC", back: "<strong>SCIM</strong> = provisioning (create/delete accounts). <strong>SAML</strong> = authentication/SSO (older XML). <strong>OAuth 2.0</strong> = authorization (delegated API access, not login). <strong>OIDC</strong> = modern authentication built on OAuth." },
    { front: "NIST IR lifecycle", back: "<strong>Preparation</strong> → <strong>Detection &amp; Analysis</strong> → <strong>Containment, Eradication &amp; Recovery</strong> → <strong>Post-Incident Activity</strong>. Hang every scenario answer on this backbone." },
    { front: "Scenario answer structure", back: "Lead with your <strong>top 3 moves</strong>, then say <strong>'and I'd also…'</strong> so you sound prioritised, not list-dumping. For ransomware: <strong>contain first — do NOT just reimage</strong> (it destroys evidence and risks reinfection)." },
    { front: "Questions to ask the interviewer", back: "Have 5 ready, ask 3: team structure, day-to-day, <strong>'what does success in 6 months look like?'</strong>, tooling/automation maturity, on-call, and growth/mentorship. Tailor one to something said earlier." }
  ]
});
