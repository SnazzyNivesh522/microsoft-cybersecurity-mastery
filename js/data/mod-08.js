/* Module 8 — Microsoft Defender XDR & Sentinel (SecOps)
   Follows the gold-standard template (see mod-01.js):
   - JS strings use DOUBLE quotes "..."; HTML attributes inside use SINGLE quotes '...'.
   - Code blocks are arrays of lines; backslashes are DOUBLED.
   - No backticks, no template literals.
   Block types: p, h, h3, list, olist, steps, quote, divider,
     callout {variant: info|tip|warn|danger|interview|lab|analogy},
     code {lang, caption, code:[...]}, table {headers, rows}, kv {items:[{k,v}]}. */
window.COURSE.modules.push({
  id: "mod-08",
  number: 8,
  icon: "🛰️",
  title: "Microsoft Defender XDR & Sentinel (SecOps)",
  tagline: "SIEM vs SOAR vs XDR vs EDR, the Defender workloads, KQL hunting, Sentinel analytics & playbooks — and an end-to-end incident.",
  estMinutes: 100,
  objectives: [
    "Distinguish <strong>SIEM, SOAR, EDR, and XDR</strong>, and name the four Defender workloads (MDE/MDO/MDI/MDA).",
    "Explain how <strong>Defender XDR</strong> correlates alerts into a single incident and how <strong>Sentinel</strong> adds SIEM + SOAR.",
    "Read and write basic <strong>KQL</strong> hunting queries (table → where → summarize → sort).",
    "Use MITRE ATT&CK as a common language for tactics and techniques.",
    "Walk an incident end-to-end against the <strong>NIST IR lifecycle</strong>."
  ],
  lessons: [
    /* ---------------------------------------------------------------- */
    {
      id: "8-1",
      title: "SOC & SecOps concepts — the vocabulary you'll be tested on",
      subtitle: "SIEM, SOAR, EDR, XDR and how a SOC actually works",
      blocks: [
        { type: "p", html: "Let me set the scene the way I would for an analyst on their first day in the <strong>Security Operations Centre (SOC)</strong>. A SOC is the team (people), process, and technology that detects, investigates, and responds to threats around the clock. <strong>Security Operations (SecOps)</strong> is the discipline that runs it. Before you touch a single Microsoft tool, you must be able to distinguish four acronyms that interviewers throw at every candidate — and that juniors confuse constantly: <strong>SIEM, SOAR, EDR, and XDR</strong>." },
        { type: "callout", variant: "analogy", html: "<p>Think of a SOC as an <strong>air-traffic control tower</strong>. <strong>EDR</strong> is the radar bolted to each individual aircraft (the endpoint). <strong>SIEM</strong> is the central room collecting every radar feed, radio call, and weather report into one screen. <strong>SOAR</strong> is the automated rulebook that re-routes a plane the instant a collision course appears. <strong>XDR</strong> is a next-generation tower where the radars, radios, and rulebook already speak one language out of the box — no integration glue required.</p>" },
        { type: "h", text: "The four acronyms, side by side" },
        { type: "table", headers: ["Term", "Full name", "What it is", "Scope"], rows: [
          ["<strong>EDR</strong>", "Endpoint Detection &amp; Response", "Behavioural detection + response on a single endpoint (process, file, registry, network telemetry)", "One domain: endpoints"],
          ["<strong>SIEM</strong>", "Security Information &amp; Event Management", "Central log aggregation, correlation, alerting and long-term retention across <em>any</em> source", "Everything you feed it"],
          ["<strong>SOAR</strong>", "Security Orchestration, Automation &amp; Response", "Playbooks/automation that take action (isolate device, disable user, open ticket) with little or no human", "Response/automation layer"],
          ["<strong>XDR</strong>", "Extended Detection &amp; Response", "A vendor-integrated suite that natively correlates signals across endpoint, identity, email, cloud into one incident", "Cross-domain, pre-integrated"]
        ]},
        { type: "p", html: "The cleanest one-liner to memorise: <strong>EDR is one domain, SIEM ingests everything you give it, SOAR acts, and XDR is the pre-correlated cross-domain suite.</strong> In the Microsoft world, <strong>Defender for Endpoint</strong> is the EDR, <strong>Defender XDR</strong> is the XDR, and <strong>Microsoft Sentinel</strong> is the SIEM <em>and</em> SOAR." },
        { type: "h", text: "Alerts vs. incidents — the single most common confusion" },
        { type: "p", html: "An <strong>alert</strong> is a single detection — one rule fired on one signal (&quot;suspicious PowerShell ran on PC-12&quot;). An <strong>incident</strong> is a <em>correlated grouping of related alerts</em> that together tell a story (the phishing email, the credential risk, and the endpoint detonation are one attack, not three). XDR and SIEM both do this correlation so analysts triage one incident instead of drowning in a thousand alerts. <strong>Incident = correlated alerts.</strong> Say it in your sleep." },
        { type: "h", text: "The analyst tiers and the response workflow" },
        { type: "kv", items: [
          { k: "Tier 1 (Triage)", v: "Monitors the queue, validates and prioritises incoming alerts, closes obvious false positives, escalates the real ones." },
          { k: "Tier 2 (Investigate)", v: "Deep investigation — scopes the blast radius, gathers evidence, decides containment. The heart of the SOC." },
          { k: "Tier 3 (Threat Hunting / IR)", v: "Proactive hunting for threats no rule caught, advanced incident response, and threat intelligence." },
          { k: "SOC Manager / Lead", v: "Owns metrics (MTTD, MTTR), process, and the post-incident lessons-learned loop." }
        ]},
        { type: "p", html: "The workflow they run is a loop: <strong>Triage → Investigate → Contain/Respond → Hunt → Lessons learned</strong>. Two metrics measure it: <strong>MTTD</strong> (mean time to detect) and <strong>MTTR</strong> (mean time to respond). Everything in Defender XDR and Sentinel exists to shrink those two numbers." },
        { type: "h", text: "MITRE ATT&CK — the common language" },
        { type: "p", html: "When an analyst in Tokyo and an analyst in London describe the same attacker behaviour, they use <strong>MITRE ATT&CK</strong> — a free, globally-adopted knowledge base of real adversary behaviour. Two terms you must never swap:" },
        { type: "list", items: [
          "<strong>Tactic</strong> = the attacker's <em>goal</em> — the &quot;why&quot;. Examples: Initial Access, Execution, Persistence, Credential Access, Lateral Movement, Exfiltration. There are 14 enterprise tactics, displayed as the columns of the ATT&CK matrix.",
          "<strong>Technique</strong> = <em>how</em> they achieve the tactic. Example: under Credential Access, the technique <strong>T1003 OS Credential Dumping</strong> (with sub-techniques like LSASS Memory, T1003.001).",
          "<strong>Procedure</strong> = the specific implementation a given group/tool uses (e.g., Mimikatz reading LSASS)."
        ]},
        { type: "callout", variant: "tip", html: "<p>Every alert in Defender XDR and Sentinel is tagged with its ATT&CK tactic and technique. Speaking in &quot;T-numbers&quot; in an interview — &quot;that looks like T1110 password spraying feeding into T1078 valid accounts&quot; — instantly marks you as someone who has actually worked in a SOC.</p>" },
        { type: "h", text: "True/false, positive/negative — the detection-quality square" },
        { type: "table", headers: ["", "Alert fired", "No alert"], rows: [
          ["<strong>Was malicious</strong>", "True Positive (TP) — correct catch", "False Negative (FN) — the miss that gets you breached"],
          ["<strong>Was benign</strong>", "False Positive (FP) — noise that burns analyst time", "True Negative (TN) — correctly quiet"]
        ]},
        { type: "p", html: "Tuning detections is the constant trade-off: turn the dials too sensitive and you flood the SOC with <strong>false positives</strong> (alert fatigue); too loose and you create <strong>false negatives</strong> (the breach you never saw). A mature SOC measures and tunes this ratio relentlessly." },
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;What's the difference between SIEM, SOAR, EDR and XDR?&quot;</strong> &quot;<strong>EDR</strong> detects and responds on a single endpoint. <strong>SIEM</strong> centrally ingests and correlates logs from <em>any</em> source for detection and retention. <strong>SOAR</strong> automates the response actions via playbooks. <strong>XDR</strong> is a vendor-integrated suite that natively correlates endpoint, identity, email and cloud signals into one incident without you building the integrations. In Microsoft terms: Defender for Endpoint = EDR, Defender XDR = XDR, Sentinel = SIEM + SOAR.&quot; Then add: &quot;an alert is one detection; an incident is correlated alerts.&quot;</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "8-2",
      title: "Microsoft Defender XDR — the unified suite",
      blocks: [
        { type: "p", html: "Microsoft's XDR has changed names, so get the current facts straight because interviewers test whether you're up to date. What used to be called <strong>Microsoft 365 Defender</strong> is now <strong>Microsoft Defender XDR</strong>. Everything lives in one place: the <strong>Microsoft Defender portal</strong> at <code>security.microsoft.com</code>. That is your single pane of glass." },
        { type: "callout", variant: "warn", title: "Name check (mid-2026)", html: "<p>&quot;Microsoft 365 Defender&quot; was <strong>renamed Microsoft Defender XDR</strong>. The unified portal is the <strong>Microsoft Defender portal</strong> (<code>security.microsoft.com</code>). And — big one — <strong>Microsoft Sentinel is now generally available inside that same Defender portal</strong>, available even without an E5 license. If you say &quot;M365 Defender&quot; in an interview, you sound a year out of date.</p>" },
        { type: "h", text: "The core idea: correlation across workloads" },
        { type: "p", html: "Defender XDR's superpower is <strong>correlation</strong>. Each underlying workload watches a different slice of your estate and raises its own alerts; XDR stitches related alerts from <em>all</em> of them into a <strong>single incident</strong> with a unified timeline, an attack story graph, and one set of evidence. The four workloads it correlates:" },
        { type: "table", headers: ["Workload", "Short name", "What it protects", "Example signal"], rows: [
          ["<strong>Defender for Endpoint</strong>", "MDE", "Devices/endpoints — Windows, macOS, Linux, mobile, servers", "Malicious PowerShell, LSASS access, ransomware behaviour"],
          ["<strong>Defender for Office 365</strong>", "MDO", "Email &amp; collaboration — Exchange Online, Teams, SharePoint, OneDrive", "Phishing, malicious attachment (Safe Attachments), bad URL (Safe Links)"],
          ["<strong>Defender for Identity</strong>", "MDI", "On-premises Active Directory (sensors on Domain Controllers)", "Kerberoasting, DCSync, Golden Ticket, lateral movement"],
          ["<strong>Defender for Cloud Apps</strong>", "MDA (formerly MCAS)", "SaaS apps — the CASB (Cloud Access Security Broker)", "Impossible travel, mass download, OAuth app abuse, shadow IT"]
        ]},
        { type: "callout", variant: "analogy", html: "<p>Each workload is a <strong>detective specialising in one beat</strong> — the email detective, the endpoint detective, the AD detective, the SaaS detective. On their own they file separate reports. Defender XDR is the <strong>chief inspector</strong> who reads all four reports, realises they describe one criminal, and opens a single case file with the full timeline.</p>" },
        { type: "h", text: "Automated Investigation & Response (AIR)" },
        { type: "p", html: "When an incident fires, Defender XDR can launch <strong>Automated Investigation &amp; Response (AIR)</strong> — virtual analysts that automatically investigate the alert, examine related entities (files, processes, users, mailboxes), determine a verdict, and take or recommend <strong>remediation actions</strong> (quarantine a file, remove a malicious inbox rule, isolate a device). This is the built-in automation that does Tier-1 grunt work at machine speed and is graded by an <strong>automation level</strong> (from &quot;no automation&quot; up to &quot;fully automated&quot;)." },
        { type: "h", text: "Unified RBAC" },
        { type: "p", html: "Historically each workload had its own permissions model. Defender XDR now offers <strong>Microsoft Defender XDR Unified role-based access control (RBAC)</strong> — one place to grant least-privilege roles (e.g., read-only Tier-1 analyst vs. responder who can isolate devices) across all workloads. This ties straight back to the least-privilege and PIM concepts from the identity modules." },
        { type: "code", lang: "text", caption: "What a single correlated Defender XDR incident looks like", code: [
          "Incident #4471  \"Multi-stage incident involving Initial Access & Lateral Movement on one user\"",
          "  Severity: High   Status: Active   Assigned: tier2-analyst",
          "  Impacted: user j.smith@contoso.com, device PC-FIN-12, mailbox j.smith",
          "  Correlated alerts (4):",
          "    [MDO] Email with malicious attachment delivered (Safe Attachments)   T1566 Phishing",
          "    [Entra] Atypical travel / risky sign-in for j.smith                  T1078 Valid Accounts",
          "    [MDE] Suspicious 'powershell -enc' spawned by WINWORD.EXE            T1059 Command & Scripting",
          "    [MDI] Suspected DCSync from PC-FIN-12 against the domain controller   T1003.006 DCSync",
          "  --> One story. One timeline. One case."
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;Name the workloads Defender XDR correlates and what each covers.&quot;</strong> &quot;<strong>MDE</strong> for endpoints, <strong>MDO</strong> for email and collaboration, <strong>MDI</strong> for on-premises Active Directory via DC sensors, and <strong>Defender for Cloud Apps</strong> as the CASB for SaaS. Defender XDR correlates alerts from all four into a single incident, can auto-remediate with AIR, and is managed in the unified Defender portal at security.microsoft.com with unified RBAC.&quot;</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "8-3",
      title: "Microsoft Defender for Endpoint (MDE)",
      blocks: [
        { type: "p", html: "MDE is the <strong>EDR</strong> at the centre of the suite and the workload you'll spend the most time in as an analyst. It does far more than antivirus: it continuously records endpoint behaviour, detects attacks from that behaviour, and lets you respond remotely. Let me walk the pieces." },
        { type: "h", text: "Onboarding — getting telemetry flowing" },
        { type: "p", html: "A device is <strong>onboarded</strong> (Windows, macOS, Linux, servers, mobile) via Intune, Group Policy, a local script, or Configuration Manager. Once onboarded, a lightweight sensor streams behavioural telemetry to the cloud, and the device appears in the Defender portal's device inventory. No agent telemetry, no detection — onboarding is step zero." },
        { type: "h", text: "The capabilities you must be able to name" },
        { type: "kv", items: [
          { k: "Next-gen AV", v: "Microsoft Defender Antivirus — signatures + cloud-delivered protection + behaviour monitoring. The prevention layer." },
          { k: "EDR", v: "Behavioural detection in the cloud. Records process/file/registry/network events and raises alerts on attack patterns even with no known signature." },
          { k: "Attack Surface Reduction (ASR)", v: "Rules that block risky behaviours pre-emptively, e.g. &quot;block Office apps from creating child processes&quot; or &quot;block credential stealing from LSASS&quot;." },
          { k: "Advanced Hunting", v: "Query the raw endpoint telemetry with KQL over schema tables (DeviceProcessEvents, DeviceNetworkEvents, DeviceFileEvents, etc.)." },
          { k: "Device timeline", v: "A chronological record of everything that happened on a device — your forensic flight recorder during investigation." },
          { k: "Live Response", v: "A remote shell into the endpoint to collect files, run scripts, kill processes, and remediate — without physically touching the box." },
          { k: "Defender Vulnerability Management (TVM)", v: "Continuous discovery of vulnerabilities, missing patches, and misconfigurations, prioritised by real-world exploitability." }
        ]},
        { type: "callout", variant: "analogy", html: "<p>If antivirus is a <strong>bouncer checking IDs at the door</strong> (known-bad signatures), <strong>EDR is the CCTV recording everyone's behaviour inside</strong>. The bouncer stops known troublemakers; the cameras let you catch the well-dressed thief whose ID looked fine but who is now jimmying a lock. You need both, which is why MDE bundles next-gen AV <em>and</em> EDR.</p>" },
        { type: "h", text: "Advanced Hunting — KQL over the device tables" },
        { type: "p", html: "MDE's Advanced Hunting lets you write <strong>KQL</strong> (Kusto Query Language — Lesson 6) directly against the endpoint telemetry. This is how a hunter goes looking for things no canned rule caught. A classic example: encoded PowerShell, which malware loves because it hides the real command." },
        { type: "code", lang: "kql", caption: "Advanced Hunting — encoded PowerShell launched by Office apps (last 7 days)", code: [
          "DeviceProcessEvents",
          "| where Timestamp > ago(7d)",
          "| where FileName in~ (\"powershell.exe\", \"pwsh.exe\")",
          "| where ProcessCommandLine has_any (\"-enc\", \"-encodedcommand\", \"-e \", \"frombase64string\")",
          "| where InitiatingProcessFileName in~ (\"winword.exe\", \"excel.exe\", \"outlook.exe\")",
          "| project Timestamp, DeviceName, AccountName, InitiatingProcessFileName, ProcessCommandLine",
          "| sort by Timestamp desc"
        ]},
        { type: "h", text: "Risk score → Intune compliance → Conditional Access (the bridge)" },
        { type: "p", html: "Here is where MDE connects to the rest of the course. Each device gets a <strong>risk score</strong> based on active alerts and behaviour. Through the MDE&ndash;Intune connector, that risk score feeds an Intune <strong>device compliance</strong> policy: a device at &quot;high&quot; risk is marked <em>non-compliant</em>. A Conditional Access policy then says &quot;require a compliant device&quot; — so the compromised endpoint is automatically <strong>blocked from accessing corporate resources</strong> until it's cleaned. Endpoint detection (Module 8) drives device compliance (Module 6) which drives access decisions (Module 4). One sentence in an interview that ties three modules together is gold." },
        { type: "callout", variant: "lab", html: "<p>In a Defender XDR trial, onboard one test VM, then in Advanced Hunting run the encoded-PowerShell query above. Trigger it safely by running <code>powershell.exe -EncodedCommand</code> with a harmless Base64 of <code>Write-Host hello</code>, and watch the event appear in <code>DeviceProcessEvents</code> and on the device timeline. Seeing your own action land in the telemetry makes the whole model click.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;What's the difference between antivirus and EDR, and what does MDE add?&quot;</strong> &quot;AV is mostly <em>prevention</em> using signatures and cloud heuristics — it blocks known-bad. <strong>EDR</strong> is <em>detection and response</em> based on <em>behaviour</em>: it records endpoint activity and catches attacker techniques even when nothing is a known signature, then lets you respond — isolate the device, run Live Response, hunt with KQL. MDE bundles next-gen AV, EDR, ASR, vulnerability management and a device risk score that can feed Intune compliance and Conditional Access.&quot;</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "8-4",
      title: "Defender for Identity (MDI) — protecting on-prem AD",
      blocks: [
        { type: "p", html: "If Module 2 taught you the Active Directory attacks (Kerberoasting, DCSync, Golden Ticket, lateral movement), <strong>MDI is the workload that catches them</strong>. Defender for Identity puts a lightweight <strong>sensor directly on your Domain Controllers</strong> (and AD FS / AD CS servers), where it watches authentication traffic, AD activity, and the Windows events the DC generates. It then detects identity-based attacks across the full kill chain and feeds those alerts into Defender XDR." },
        { type: "callout", variant: "analogy", html: "<p>Your <strong>Domain Controllers are the bank vault</strong> of the enterprise — every key and credential ultimately checks out through them. MDI is the <strong>insider-threat camera inside the vault</strong>: it doesn't just see who walked in the front door, it watches the suspicious behaviour around the safe itself (someone enumerating every account, someone impersonating the vault manager, someone copying the master key list).</p>" },
        { type: "h", text: "What MDI detects (mapped to the kill chain)" },
        { type: "table", headers: ["Phase", "Attack MDI detects", "What it is (ties to Module 2)"], rows: [
          ["Reconnaissance", "Account / SPN / group enumeration", "Attacker maps users, admins and Kerberos service accounts (e.g. via BloodHound)"],
          ["Credential Access", "<strong>Kerberoasting</strong>", "Requesting service tickets to crack service-account passwords offline"],
          ["Credential Access", "Brute force / password spray", "Many failed authentications across accounts"],
          ["Lateral Movement", "Pass-the-Hash / Pass-the-Ticket / overpass-the-hash", "Reusing stolen NTLM hashes or Kerberos tickets to hop machines"],
          ["Privilege Escalation / Persistence", "<strong>DCSync</strong>", "Impersonating a DC to replicate password hashes (e.g. of krbtgt)"],
          ["Persistence (domain)", "<strong>Golden Ticket</strong> / Silver Ticket", "Forging Kerberos TGTs with the stolen krbtgt key for near-unlimited access"]
        ]},
        { type: "h", text: "MDI vs. Entra ID Identity Protection — do NOT confuse these" },
        { type: "p", html: "This is a guaranteed interview trap because both have &quot;identity&quot; in the name and both produce risk. The clean distinction is <strong>on-premises AD vs. cloud identity</strong>:" },
        { type: "kv", items: [
          { k: "Defender for Identity (MDI)", v: "<strong>On-premises Active Directory</strong> threat detection. Sensors on Domain Controllers detect AD attacks (Kerberoasting, DCSync, Golden Ticket, lateral movement) from DC traffic and events." },
          { k: "Entra ID Identity Protection", v: "<strong>Cloud identity risk</strong>. Detects risky sign-ins and risky users in Microsoft Entra ID (leaked credentials, anonymous IP, atypical/impossible travel) and feeds risk-based Conditional Access (Module 4)." }
        ]},
        { type: "p", html: "Memory hook: <strong>MDI watches the Domain Controller; Identity Protection watches the cloud sign-in.</strong> Both surface up into Defender XDR, but they monitor completely different planes." },
        { type: "code", lang: "kql", caption: "Advanced Hunting — MDI identity events feeding XDR (IdentityLogonEvents)", code: [
          "// Failed on-prem logons by account in the last day — recon / spray indicator",
          "IdentityLogonEvents",
          "| where Timestamp > ago(1d)",
          "| where ActionType == \"LogonFailed\"",
          "| summarize FailedCount = count(), Targets = dcount(DeviceName) by AccountUpn",
          "| where FailedCount > 25",
          "| sort by FailedCount desc"
        ]},
        { type: "callout", variant: "danger", title: "Why DCSync and Golden Ticket are the nightmares", html: "<p><strong>DCSync</strong> lets an attacker with the right rights pull the <em>krbtgt</em> hash by pretending to be a Domain Controller. With that hash they forge a <strong>Golden Ticket</strong> — a Kerberos TGT for any user, any group, that the domain will honour until krbtgt is rotated twice. That's effectively a master key to the entire domain. MDI is one of the few tools that can flag the replication behaviour DCSync uses, which is exactly why it sits on the DC.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;What's the difference between Defender for Identity and Entra ID Identity Protection?&quot;</strong> &quot;<strong>MDI</strong> protects <em>on-premises Active Directory</em> — its sensors run on Domain Controllers and detect AD attacks like Kerberoasting, DCSync, Golden Ticket and lateral movement. <strong>Entra ID Identity Protection</strong> protects <em>cloud identities</em> — it scores risky sign-ins and risky users in Entra ID (leaked creds, impossible travel) and drives risk-based Conditional Access. On-prem DC vs. cloud sign-in. Both roll up into Defender XDR.&quot;</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "8-5",
      title: "Microsoft Sentinel — cloud-native SIEM + SOAR",
      blocks: [
        { type: "p", html: "Defender XDR is brilliant at the Microsoft estate, but a real SOC also ingests firewalls, on-prem Linux, third-party SaaS, network gear and more. That's the job of <strong>Microsoft Sentinel</strong> — Microsoft's cloud-native <strong>SIEM and SOAR</strong>. It scales elastically, charges by data ingested, and runs everything on <strong>KQL</strong>." },
        { type: "callout", variant: "warn", title: "Where Sentinel lives now (mid-2026)", html: "<p>Microsoft Sentinel is <strong>generally available inside the unified Microsoft Defender portal</strong> (<code>security.microsoft.com</code>) and is usable <strong>even without an E5 license</strong>. The older Sentinel experience in the <strong>Azure portal is being retired on March 31, 2027</strong>. Under the hood Sentinel still sits on a <strong>Log Analytics workspace</strong> and is still queried with KQL — only the front door is moving.</p>" },
        { type: "h", text: "The building blocks of Sentinel" },
        { type: "kv", items: [
          { k: "Workspace (Log Analytics)", v: "The data store. All logs land in a Log Analytics workspace; tables and queries live here. This is the engine room under Sentinel." },
          { k: "Data connectors", v: "Pre-built ingestion for sources — M365, Azure activity, Entra ID sign-in/audit logs, Defender XDR, firewalls (CEF), Linux/Windows syslog, threat intel, AWS/GCP, and custom logs." },
          { k: "Analytics rules", v: "The detections. Scheduled (KQL on a timer) or near-real-time (NRT). When they match, they create alerts and group them into <strong>incidents</strong>." },
          { k: "Workbooks", v: "Interactive dashboards/visualisations built on KQL — for monitoring posture and reporting to leadership." },
          { k: "Hunting queries", v: "Saved KQL queries you run proactively (often mapped to MITRE ATT&CK) to find threats no rule alerted on." },
          { k: "Playbooks (Logic Apps)", v: "The SOAR layer. Automated workflows built on Azure Logic Apps that take action — isolate a device, disable a user, post to Teams, open a ServiceNow ticket." },
          { k: "UEBA", v: "User &amp; Entity Behaviour Analytics — baselines normal behaviour per user/host and flags anomalies (a quiet account suddenly touching 200 servers)." }
        ]},
        { type: "h", text: "Analytics rule vs. hunting query — a favourite distinction" },
        { type: "p", html: "Both are KQL, but the trigger differs. An <strong>analytics rule</strong> runs <em>automatically on a schedule</em> and, when it matches, <strong>creates an incident</strong> in your queue — it is a detection. A <strong>hunting query</strong> is run <em>on demand by a human</em> who is proactively looking for evil; it doesn't generate incidents by itself. Hunting often <em>graduates</em> into an analytics rule once it proves valuable. &quot;Rule = automatic detection that makes incidents; hunt = manual proactive search.&quot;" },
        { type: "code", lang: "kql", caption: "A scheduled analytics rule — multiple failed sign-ins then a success (Entra)", code: [
          "// Returns accounts that failed many sign-ins and then succeeded — possible spray/brute-force win",
          "let lookback = 1h;",
          "let failureThreshold = 10;",
          "SigninLogs",
          "| where TimeGenerated > ago(lookback)",
          "| summarize Failures = countif(ResultType == 50126),",
          "            Successes = countif(ResultType == 0),",
          "            IPs = make_set(IPAddress, 20)",
          "          by UserPrincipalName, bin(TimeGenerated, 10m)",
          "| where Failures >= failureThreshold and Successes > 0",
          "| project TimeGenerated, UserPrincipalName, Failures, Successes, IPs"
        ]},
        { type: "h", text: "Playbooks — the SOAR automation in action" },
        { type: "p", html: "A <strong>playbook</strong> is an Azure Logic App triggered by an incident or alert. Typical flow: incident raised → playbook fires → it calls Defender XDR to <strong>isolate the device</strong>, calls Entra to <strong>disable the user</strong> or revoke sessions, posts an adaptive card to a <strong>Teams</strong> SOC channel for approval, and opens a ticket. This is how a SOC responds in seconds at 3am with no analyst awake — automation closing the gap between detection and containment." },
        { type: "table", headers: ["Capability", "Defender XDR", "Microsoft Sentinel"], rows: [
          ["Primary role", "XDR — pre-correlated Microsoft signals", "SIEM + SOAR — any source, custom detections"],
          ["Data scope", "Microsoft workloads (MDE/MDO/MDI/MDA)", "Anything you connect (firewalls, syslog, SaaS, cloud)"],
          ["Detection authoring", "Mostly built-in detections + custom rules", "Fully custom KQL analytics rules + hunting"],
          ["Automation", "AIR (built-in auto-investigation)", "Playbooks (Logic Apps) — full SOAR orchestration"],
          ["Retention", "Limited / workload-defined", "Long-term, configurable (compliance-grade)"]
        ]},
        { type: "callout", variant: "tip", html: "<p>They are not either/or. The modern Microsoft SOC runs <strong>both, unified in the Defender portal</strong>: Defender XDR brings the rich, pre-correlated Microsoft signals, and Sentinel adds everything else plus custom detection, long retention, and SOAR playbooks. Defender XDR incidents flow straight into Sentinel.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;What's the difference between an analytics rule and a hunting query in Sentinel?&quot;</strong> &quot;Both are KQL. An <strong>analytics rule</strong> runs automatically on a schedule (or near-real-time) and creates incidents when it matches — it's an active detection. A <strong>hunting query</strong> is run manually by an analyst who's proactively looking for threats; it doesn't raise incidents on its own. A good hunt that consistently finds something gets promoted into an analytics rule.&quot;</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "8-6",
      title: "KQL — the language of Microsoft security",
      blocks: [
        { type: "p", html: "<strong>Kusto Query Language (KQL)</strong> is the one language that runs the entire Microsoft security stack — Advanced Hunting in Defender XDR, analytics rules and hunts in Sentinel, and Log Analytics. If you can read and write basic KQL, you can work in this whole ecosystem. The good news: it reads like a sentence, left to right, through pipes." },
        { type: "h", text: "The mental model: a table, then a pipeline" },
        { type: "p", html: "Every query <strong>starts with a table</strong> (the data source — e.g. <code>SigninLogs</code>, <code>DeviceProcessEvents</code>, <code>SecurityEvent</code>). You then pass the data through a series of <strong>operators</strong> joined by the pipe <code>|</code>, each one transforming the rows that flow into it. Read top to bottom: &quot;take this table, then filter, then shape, then aggregate.&quot;" },
        { type: "table", headers: ["Operator", "What it does", "SQL-ish analogy"], rows: [
          ["<code>where</code>", "Filter rows by a condition", "WHERE"],
          ["<code>project</code>", "Choose / rename the columns to keep", "SELECT"],
          ["<code>extend</code>", "Add a new calculated column", "SELECT ... AS"],
          ["<code>summarize ... by</code>", "Aggregate (count, sum, avg, dcount) grouped by columns", "GROUP BY"],
          ["<code>count</code>", "Count the rows", "COUNT(*)"],
          ["<code>top N by</code>", "Take the top N rows by a column", "ORDER BY ... LIMIT N"],
          ["<code>sort by</code> / <code>order by</code>", "Sort the result", "ORDER BY"],
          ["<code>join</code>", "Combine two tables on a key", "JOIN"],
          ["<code>render</code>", "Visualise the result (timechart, barchart)", "(charting)"]
        ]},
        { type: "p", html: "Two more essentials: time filtering with <strong><code>ago()</code></strong> (e.g. <code>where TimeGenerated &gt; ago(24h)</code> means &quot;the last 24 hours&quot;), and <strong>case-insensitive string operators</strong> like <code>has</code>, <code>contains</code>, <code>in~</code>, and <code>=~</code>. Filter <em>early</em> (especially on time) so the engine scans less and your query stays fast." },
        { type: "callout", variant: "analogy", html: "<p>KQL is a <strong>factory conveyor belt</strong>. The raw material (the table) goes on at the start; each station along the belt (<code>where</code>, <code>project</code>, <code>summarize</code>) does one job to whatever passes through; the finished product drops off the end. Put the cheap filtering stations first so you're not hauling raw ore down the whole line.</p>" },
        { type: "h", text: "Three real hunting queries you can read" },
        { type: "code", lang: "kql", caption: "1) Password spray — many failed sign-ins, then a success (SigninLogs)", code: [
          "SigninLogs",
          "| where TimeGenerated > ago(24h)",
          "| summarize Failed = countif(ResultType == 50126),",
          "            Success = countif(ResultType == 0),",
          "            DistinctUsersTargeted = dcount(UserPrincipalName)",
          "          by IPAddress, bin(TimeGenerated, 1h)",
          "| where Failed > 20 and Success > 0",
          "| sort by Failed desc"
        ]},
        { type: "callout", variant: "tip", title: "Know your ResultType codes", html: "<p>In <code>SigninLogs</code>, <code>ResultType == 0</code> is success. For a brute-force/spray hunt, filter on the specific failure you mean — <code>50126</code> (invalid username or password) and <code>50053</code> (account locked) — rather than <code>ResultType != 0</code>, which also matches MFA challenges (<code>50074</code>), interrupts, and Conditional Access blocks (<code>53003</code>) and would inflate your “failure” count.</p>" },
        { type: "code", lang: "kql", caption: "2) Suspicious encoded PowerShell on endpoints (DeviceProcessEvents)", code: [
          "DeviceProcessEvents",
          "| where Timestamp > ago(7d)",
          "| where FileName in~ (\"powershell.exe\", \"pwsh.exe\")",
          "| where ProcessCommandLine has_any (\"-enc\", \"-encodedcommand\", \"frombase64string\", \"-w hidden\")",
          "| project Timestamp, DeviceName, AccountName,",
          "          InitiatingProcessFileName, ProcessCommandLine",
          "| sort by Timestamp desc",
          "| take 100"
        ]},
        { type: "code", lang: "kql", caption: "3) Spike in failed logons per host (4625) (SecurityEvent)", code: [
          "SecurityEvent",
          "| where TimeGenerated > ago(24h)",
          "| where EventID == 4625            // failed logon",
          "| summarize FailedLogons = count() by Computer, Account, bin(TimeGenerated, 1h)",
          "| where FailedLogons > 50",
          "| sort by FailedLogons desc",
          "| render timechart"
        ]},
        { type: "callout", variant: "lab", html: "<p>Open the free <strong>KQL playground</strong> Microsoft hosts (search &quot;Log Analytics demo&quot;) or your own Sentinel workspace. Run <code>SigninLogs | take 10</code> to see the shape of the data, then add one pipe at a time — <code>| where ResultType == 50126</code> (invalid credentials), then <code>| summarize count() by UserPrincipalName</code>. Building a query a pipe at a time is exactly how analysts work, and how you should answer a live KQL interview question.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;Write a quick KQL query to find brute-force attempts.&quot;</strong> Talk while you type: &quot;I start with the table — <code>SigninLogs</code> — filter time first with <code>| where TimeGenerated &gt; ago(24h)</code>, then <code>| summarize Failed = countif(ResultType == 50126) by IPAddress, UserPrincipalName</code>, then <code>| where Failed &gt; 20</code>, then <code>| sort by Failed desc</code>.&quot; Naming the table, filtering time early, and using <code>summarize ... by</code> shows you actually know KQL rather than reciting it.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "8-7",
      title: "End-to-end incident response — one attack through the whole stack",
      blocks: [
        { type: "p", html: "Now let me put it all together the way it actually happens, and the way you should narrate it in an interview. We'll follow a <strong>single correlated incident</strong> from the first malicious email to recovery, and map every step to the <strong>NIST incident-response lifecycle</strong>. This is the capstone — if you can tell this story cleanly, you understand the module." },
        { type: "h", text: "The NIST IR lifecycle — your backbone" },
        { type: "table", headers: ["NIST phase", "Goal", "In this incident"], rows: [
          ["<strong>1. Preparation</strong>", "Be ready before anything happens", "Defender workloads onboarded, Sentinel connectors live, analytics rules + playbooks built, runbooks written"],
          ["<strong>2. Detection &amp; Analysis</strong>", "See it, scope it, confirm it", "MDO/MDE/Entra alerts fire; Defender XDR correlates into one incident; analyst triages and hunts with KQL"],
          ["<strong>3. Containment, Eradication &amp; Recovery</strong>", "Stop spread, remove the threat, restore", "Playbook isolates device + disables user; remove persistence; reimage; restore access once clean"],
          ["<strong>4. Post-Incident Activity</strong>", "Learn and improve", "Lessons learned, new detection rule, tuning, report — feeds back into Preparation"]
        ]},
        { type: "h", text: "The attack, step by step" },
        { type: "olist", items: [
          "<strong>Phishing email arrives (MDO).</strong> An email with a weaponised attachment targets j.smith. <strong>Defender for Office 365 Safe Attachments</strong> detonates it in a sandbox and raises an alert — but a similar lure slips through to the user. <em>(ATT&CK: T1566 Phishing → Detection &amp; Analysis begins.)</em>",
          "<strong>User clicks, credentials at risk (Entra / Identity Protection).</strong> The user is lured to a fake login page and enters credentials. The attacker signs in from another country; <strong>Entra ID Identity Protection</strong> flags a high-risk sign-in (impossible travel). <em>(ATT&CK: T1078 Valid Accounts.)</em>",
          "<strong>Endpoint detonation &amp; EDR alert (MDE).</strong> The opened attachment spawns <code>powershell.exe -enc ...</code> from <code>WINWORD.EXE</code>. <strong>Defender for Endpoint</strong> raises a behavioural EDR alert and the device's risk score jumps. <em>(ATT&CK: T1059 Command &amp; Scripting.)</em>",
          "<strong>Defender XDR correlates into ONE incident.</strong> Instead of three disconnected alerts in three consoles, XDR links the email, the risky sign-in, and the endpoint detonation into a <strong>single incident</strong> with a unified attack timeline. The analyst sees the whole story at once. <em>(Detection &amp; Analysis, scoped.)</em>",
          "<strong>Sentinel + playbook auto-respond.</strong> The incident flows into Sentinel; an analytics rule and a <strong>SOAR playbook (Logic App)</strong> fire: <strong>MDE isolates the device</strong> from the network and <strong>Entra disables the user / revokes sessions</strong>, then posts to the SOC Teams channel. <em>(Containment — minutes, not hours.)</em>",
          "<strong>Analyst hunts with KQL (Eradication).</strong> The Tier-2 analyst hunts in Advanced Hunting / Sentinel: did that PowerShell reach other hosts? Any persistence (Run keys, scheduled tasks, new accounts)? Any lateral movement MDI saw on the DC? They remove every artefact found. <em>(Eradication.)</em>",
          "<strong>Recovery.</strong> The device is reimaged or confirmed clean, the user's password is reset and MFA re-registered, and access is restored only once the device is compliant again (risk score back to normal → Intune compliant → Conditional Access lets it back in). <em>(Recovery.)</em>",
          "<strong>Post-incident.</strong> The SOC writes the lessons learned, tightens the email policy, adds a new analytics rule for the exact technique, tunes the false-positive that delayed triage, and updates the playbook. <em>(Post-Incident Activity → back to Preparation.)</em>"
        ]},
        { type: "callout", variant: "danger", title: "Containment before eradication — always", html: "<p>A junior's instinct is to immediately delete the malware. Wrong order. <strong>Contain first</strong> (isolate the device, disable the account) so the attacker can't spread or react while you work, then <strong>eradicate</strong> (remove every artefact, not just the obvious one), then <strong>recover</strong>. Eradicating before containing is how an attacker watches you clean one box and pivots to ten others.</p>" },
        { type: "code", lang: "kql", caption: "Hunt step — did this technique spread? (DeviceProcessEvents)", code: [
          "// Find the same encoded-PowerShell pattern across ALL devices, not just the first",
          "DeviceProcessEvents",
          "| where Timestamp > ago(3d)",
          "| where ProcessCommandLine has \"-enc\"",
          "| where InitiatingProcessFileName in~ (\"winword.exe\", \"excel.exe\", \"outlook.exe\")",
          "| summarize Hits = count(), Cmds = make_set(ProcessCommandLine, 5)",
          "          by DeviceName, AccountName",
          "| sort by Hits desc"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;Walk me through how the Microsoft stack detects and responds to a phishing-led breach.&quot;</strong> Tell the story above and name the phase at each step: &quot;<strong>MDO</strong> catches the malicious attachment, <strong>Entra Identity Protection</strong> flags the risky sign-in, <strong>MDE</strong> raises the endpoint EDR alert; <strong>Defender XDR correlates all three into one incident</strong>; <strong>Sentinel</strong> and a <strong>SOAR playbook</strong> isolate the device and disable the user; the analyst <strong>hunts with KQL</strong> to eradicate, then we recover and run lessons learned — mapping the whole thing to NIST: Preparation, Detection &amp; Analysis, Containment/Eradication/Recovery, Post-Incident. And I'd contain before I eradicate.&quot;</p>" },
        { type: "divider" },
        { type: "callout", variant: "tip", title: "Module 8 — Key takeaways", html: "<ul><li><strong>EDR</strong> = one endpoint; <strong>SIEM</strong> = central log ingest/correlation; <strong>SOAR</strong> = automated response; <strong>XDR</strong> = pre-integrated cross-domain suite. An <strong>alert</strong> is one detection; an <strong>incident</strong> is correlated alerts.</li><li><strong>Microsoft Defender XDR</strong> (formerly M365 Defender) lives in the Defender portal (<code>security.microsoft.com</code>) and correlates <strong>MDE</strong> (endpoints), <strong>MDO</strong> (email), <strong>MDI</strong> (on-prem AD), and <strong>Defender for Cloud Apps</strong> (CASB) into one incident, with AIR auto-remediation and unified RBAC.</li><li><strong>MDI</strong> = on-prem AD attack detection from DC sensors (Kerberoasting, DCSync, Golden Ticket); <strong>Entra ID Identity Protection</strong> = cloud sign-in risk. Don't swap them.</li><li><strong>Microsoft Sentinel</strong> is the cloud-native SIEM + SOAR (Log Analytics + KQL). Now GA <em>inside the Defender portal</em>; the Azure-portal experience retires <strong>March 31, 2027</strong>. Analytics rules = auto detections that make incidents; hunting queries = manual proactive searches; playbooks = Logic App automation.</li><li><strong>KQL</strong> runs the whole stack: start with a table, then pipe through <code>where / project / extend / summarize by / sort / join</code>, filter time early with <code>ago()</code>.</li><li>An end-to-end incident maps to <strong>NIST IR</strong>: Preparation → Detection &amp; Analysis → Containment, Eradication &amp; Recovery → Post-Incident. Always <strong>contain before you eradicate</strong>.</li></ul>" }
      ]
    }
  ],
  quiz: [
    { q: "Which statement best distinguishes XDR from SIEM?", options: ["XDR only stores logs; SIEM responds automatically", "XDR is a vendor-integrated suite that natively correlates endpoint/identity/email/cloud signals into one incident, while SIEM centrally ingests and correlates logs from ANY source you connect", "They are identical terms", "SIEM only works on endpoints; XDR works on networks"], answer: 1, explain: "XDR (e.g., Defender XDR) is pre-integrated cross-domain correlation. SIEM (e.g., Sentinel) ingests and correlates logs from any source and adds retention. EDR is one domain; SOAR is the automated response layer." },
    { q: "In a SOC, what is the relationship between an alert and an incident?", options: ["They are the same thing", "An incident is a single raw detection; an alert groups many incidents", "An alert is a single detection; an incident is a correlated grouping of related alerts that tell one attack story", "Incidents are benign; alerts are always malicious"], answer: 2, explain: "An alert is one detection from one rule on one signal. An incident is the correlated set of related alerts — the whole attack story — which is what XDR and SIEM build so analysts triage one case, not a thousand alerts." },
    { q: "Which four workloads does Microsoft Defender XDR correlate into a single incident?", options: ["Firewall, VPN, DNS, and proxy", "Defender for Endpoint (MDE), Defender for Office 365 (MDO), Defender for Identity (MDI), and Defender for Cloud Apps", "Intune, Entra, Purview, and Sentinel", "BitLocker, Credential Guard, ASR, and SmartScreen"], answer: 1, explain: "MDE protects endpoints, MDO protects email/collaboration, MDI protects on-prem Active Directory via DC sensors, and Defender for Cloud Apps is the CASB for SaaS. XDR stitches their alerts into one incident." },
    { q: "What is the key difference between Defender for Identity (MDI) and Entra ID Identity Protection?", options: ["They are two names for the same product", "MDI detects on-premises Active Directory attacks via DC sensors; Identity Protection scores cloud sign-in/user risk in Entra ID", "MDI is cloud-only; Identity Protection is on-prem only", "MDI encrypts disks; Identity Protection manages firewalls"], answer: 1, explain: "MDI = on-prem AD threat detection (Kerberoasting, DCSync, Golden Ticket, lateral movement) from Domain Controller sensors. Entra ID Identity Protection = cloud identity risk (leaked creds, impossible travel) feeding risk-based Conditional Access." },
    { q: "Per the mid-2026 facts, where does Microsoft Sentinel now run and what is changing?", options: ["Only in the Azure portal, forever", "It is generally available inside the unified Microsoft Defender portal (even without E5); the Azure-portal Sentinel experience retires March 31, 2027", "It has been discontinued and replaced by Log Analytics", "It now requires an E5 license to use at all"], answer: 1, explain: "Sentinel is GA inside the Defender portal (security.microsoft.com) and works without E5. It still uses a Log Analytics workspace and KQL under the hood. The separate Azure-portal experience is being retired on March 31, 2027." },
    { q: "In Sentinel, what is the difference between an analytics rule and a hunting query?", options: ["Analytics rules use SQL; hunting queries use KQL", "An analytics rule runs automatically on a schedule and creates incidents; a hunting query is run manually by an analyst and does not raise incidents on its own", "Hunting queries run automatically; analytics rules are manual", "There is no difference"], answer: 1, explain: "Both are KQL. An analytics rule is an active detection on a schedule (or near-real-time) that creates incidents. A hunting query is a proactive, on-demand search by a human; a good hunt is often promoted into an analytics rule." },
    { q: "Which KQL operator aggregates rows and groups them (the GROUP BY equivalent)?", options: ["project", "where", "summarize ... by", "render"], answer: 2, explain: "summarize with 'by' performs aggregation (count, dcount, sum) grouped by columns. 'where' filters rows, 'project' selects columns, and 'render' visualises the result." },
    { q: "Per the NIST incident-response lifecycle, what is the correct order of the action-oriented phases?", options: ["Eradication, then Containment, then Recovery", "Recovery, then Detection, then Preparation", "Preparation, then Detection & Analysis, then Containment/Eradication/Recovery, then Post-Incident Activity", "Detection, then Recovery, then Containment"], answer: 2, explain: "NIST: Preparation; Detection & Analysis; Containment, Eradication & Recovery; Post-Incident Activity. Critically, you contain BEFORE you eradicate so the attacker can't spread or react while you clean up." }
  ],
  flashcards: [
    { front: "SIEM vs SOAR vs EDR vs XDR", back: "<strong>EDR</strong> = detect/respond on one endpoint. <strong>SIEM</strong> = central ingest + correlation of any log source. <strong>SOAR</strong> = automated response (playbooks). <strong>XDR</strong> = vendor-integrated suite correlating endpoint/identity/email/cloud into one incident." },
    { front: "Alert vs incident", back: "An <strong>alert</strong> is a single detection from one rule on one signal. An <strong>incident</strong> is a correlated grouping of related alerts that together tell one attack story. Incident = correlated alerts." },
    { front: "What was 'Microsoft 365 Defender' renamed to, and where does it live?", back: "Renamed <strong>Microsoft Defender XDR</strong>. The single pane of glass is the <strong>Microsoft Defender portal</strong> at <code>security.microsoft.com</code>." },
    { front: "The four Defender XDR workloads", back: "<strong>MDE</strong> (endpoints), <strong>MDO</strong> (email/collaboration, Safe Attachments/Links), <strong>MDI</strong> (on-prem Active Directory via DC sensors), <strong>Defender for Cloud Apps</strong> (CASB for SaaS)." },
    { front: "MITRE ATT&CK: tactic vs technique", back: "<strong>Tactic</strong> = the attacker's goal/why (e.g., Credential Access). <strong>Technique</strong> = how they do it (e.g., T1003 OS Credential Dumping). Procedure = the specific tool/implementation." },
    { front: "MDE: EDR vs antivirus", back: "AV = signature/cloud-based <strong>prevention</strong> of known-bad. <strong>EDR</strong> = behaviour-based <strong>detection & response</strong> that records endpoint activity and catches techniques with no signature. MDE bundles both, plus ASR, TVM, and Live Response." },
    { front: "MDI vs Entra ID Identity Protection", back: "<strong>MDI</strong> = on-prem AD attack detection from Domain Controller sensors (Kerberoasting, DCSync, Golden Ticket, lateral movement). <strong>Identity Protection</strong> = cloud sign-in/user risk in Entra ID (leaked creds, impossible travel)." },
    { front: "Where does Microsoft Sentinel run now (mid-2026)?", back: "GA <strong>inside the unified Defender portal</strong>, usable without E5. Still sits on a <strong>Log Analytics workspace</strong> and uses KQL. The separate <strong>Azure-portal experience retires March 31, 2027</strong>." },
    { front: "Sentinel building blocks", back: "Workspace (Log Analytics), data connectors, analytics rules (make incidents), workbooks (dashboards), hunting queries, playbooks (Logic Apps = SOAR), and UEBA (behaviour baselining)." },
    { front: "Analytics rule vs hunting query (Sentinel)", back: "<strong>Analytics rule</strong> = automatic scheduled/NRT detection that creates incidents. <strong>Hunting query</strong> = manual, on-demand proactive KQL search; raises no incidents itself. Good hunts get promoted to rules." },
    { front: "KQL skeleton", back: "Start with a <strong>table</strong>, then pipe through operators: <code>| where</code> (filter), <code>| project</code> (columns), <code>| extend</code> (new column), <code>| summarize ... by</code> (aggregate), <code>| sort by</code>, <code>| join</code>, <code>| render</code>. Filter time early with <code>ago()</code>." },
    { front: "NIST IR lifecycle (and the golden rule)", back: "1) Preparation, 2) Detection & Analysis, 3) Containment, Eradication & Recovery, 4) Post-Incident Activity. Golden rule: <strong>contain BEFORE you eradicate</strong> so the attacker can't spread or react while you clean up." }
  ]
});
