/* Module 9 — Zero Trust, Threats & Defense (CAPSTONE)
   This module ties Modules 1–8 together.
   - JS strings use DOUBLE quotes "..."; HTML attributes inside use SINGLE quotes '...'.
   - Code blocks are arrays of lines; backslashes are DOUBLED.
   - No backticks, no template literals.
   Block types: p, h, h3, list, olist, steps, quote, divider,
     callout {variant: info|tip|warn|danger|interview|lab|analogy},
     code {lang, caption, code:[...]}, table {headers, rows}, kv {items:[{k,v}]}. */
window.COURSE.modules.push({
  id: "mod-09",
  number: 9,
  icon: "🔐",
  title: "Zero Trust, Threats & Defense",
  tagline: "The capstone: Zero Trust principles, the attack kill chain across a Microsoft estate, the control that stops each step, and how to design + defend a secure environment.",
  estMinutes: 95,
  objectives: [
    "State the <strong>Zero Trust</strong> principles (verify explicitly, least privilege, assume breach) and the six pillars.",
    "Explain why <strong>identity is the new perimeter</strong> and how Entra + Intune + Defender implement Zero Trust together.",
    "Walk an <strong>attack kill chain</strong> and name the Microsoft control that stops each step.",
    "Map common attack techniques to their concrete Microsoft defenses.",
    "Outline a secure design and the <strong>NIST IR lifecycle</strong>, and relate them to frameworks (NIST CSF, CIS, ISO 27001)."
  ],
  lessons: [
    /* ---------------------------------------------------------------- */
    {
      id: "9-1",
      title: "Zero Trust: never trust, always verify",
      subtitle: "The capstone mindset",
      blocks: [
        { type: "p", html: "Welcome to the module that pulls the whole course together. Everything you've learned — Windows internals (Module 1), Active Directory (Module 2), Azure networking (Module 3), Entra ID and identity (Modules 4 &amp; 6), endpoint management (Module 5), and the Defender/Sentinel SecOps stack (Module 8) — exists to serve <em>one organising philosophy</em>: <strong>Zero Trust</strong>. If you can articulate Zero Trust clearly and then map real Microsoft controls onto it, you will sound like an architect, not a button-clicker." },
        { type: "p", html: "<strong>Zero Trust</strong> is a security model that assumes the network is already hostile. There is no trusted &quot;inside.&quot; Every access request — from any user, any device, anywhere — is treated as if it originated from an untrusted network and must be explicitly authenticated, authorized, and inspected before access is granted. The slogan is <strong>&quot;never trust, always verify.&quot;</strong>" },
        { type: "callout", variant: "analogy", html: "<p>The old model was a <strong>medieval castle with a moat</strong>: one hard perimeter (the firewall), and once you were inside the walls you could wander anywhere. Zero Trust is an <strong>airport</strong>: you show ID at check-in, again at security, again at the gate, again on the jet bridge — and being airside doesn't get you into the cockpit. Every door checks you afresh, because anyone in the terminal might be an impostor.</p>" },
        { type: "h", text: "The three guiding principles" },
        { type: "p", html: "Memorise these three. Interviewers ask for them by name, and they are the backbone of every Microsoft Zero Trust answer:" },
        { type: "kv", items: [
          { k: "1. Verify explicitly", v: "Always authenticate and authorize based on <em>all</em> available signals — user identity, device health, location, real-time risk, the sensitivity of the resource. Never grant access on network location alone." },
          { k: "2. Use least-privilege access", v: "Limit access with just-in-time and just-enough-access (<strong>JIT/JEA</strong>), risk-based adaptive policies, and data protection. Nobody is standing-privileged &quot;just in case.&quot;" },
          { k: "3. Assume breach", v: "Operate as if an attacker is already inside. Minimise blast radius with segmentation, verify end-to-end encryption, and use analytics to detect threats and improve defences." }
        ]},
        { type: "callout", variant: "tip", html: "<p>&quot;Assume breach&quot; is the principle juniors forget. It flips your job from <em>only</em> prevention to <strong>containment and detection</strong>. It's the reason we segment networks, use tiered admin, enable EDR, and run tabletop exercises. If you only say &quot;verify explicitly&quot; in an interview, you've revealed you think Zero Trust is just &quot;turn on MFA.&quot;</p>" },
        { type: "h", text: "Microsoft's six pillars of Zero Trust" },
        { type: "p", html: "Microsoft frames Zero Trust as protection applied across <strong>six pillars</strong>, each instrumented by specific products. This table is the single most useful synthesis in the course — it shows where each earlier module lives inside the bigger picture." },
        { type: "table", headers: ["Pillar", "What you protect", "Microsoft control(s)", "Course module"], rows: [
          ["<strong>Identities</strong>", "Users, service principals, workload identities", "Entra ID, Conditional Access, MFA, Identity Protection, PIM", "4 &amp; 6"],
          ["<strong>Endpoints</strong>", "Laptops, phones, servers — managed &amp; BYOD", "Intune (MDM/MAM), device compliance, Defender for Endpoint", "5"],
          ["<strong>Applications</strong>", "SaaS, on-prem, and custom apps", "Entra app registrations, Defender for Cloud Apps (CASB), app proxy", "6 &amp; 8"],
          ["<strong>Data</strong>", "Files, emails, structured data", "Microsoft Purview — sensitivity labels, DLP, encryption", "9 (this module)"],
          ["<strong>Infrastructure</strong>", "VMs, containers, PaaS, on-prem servers", "Defender for Cloud, Azure Policy, JIT VM access", "3 &amp; 8"],
          ["<strong>Networks</strong>", "Segmentation, traffic flow, access path", "NSGs, Azure Firewall, Private Link, Entra Global Secure Access", "3 &amp; 9"]
        ]},
        { type: "h", text: "The shift: from perimeter to identity" },
        { type: "p", html: "The castle-and-moat model died for a concrete reason: <strong>there is no longer a single perimeter to defend</strong>. Users work from home and coffee shops. Apps live in SaaS you don't own. Data sits in OneDrive, Salesforce, and a dozen other clouds. The firewall still matters, but it no longer marks the edge of trust. The new control plane — the thing that travels with the user to every app and device — is <strong>identity</strong>. That's the topic of the very next lesson, and it's why Microsoft invests so heavily in Entra ID." },
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;Define Zero Trust and give me its three principles.&quot;</strong> &quot;Zero Trust is a security model that assumes no implicit trust based on network location — every request is verified as if it came from an open network. Its three principles are: <strong>verify explicitly</strong> (authenticate and authorize on all signals — identity, device, location, risk), <strong>use least-privilege access</strong> (JIT/JEA, risk-based adaptive policy), and <strong>assume breach</strong> (segment to limit blast radius, encrypt end-to-end, and use analytics to detect). Microsoft applies it across six pillars: identities, endpoints, apps, data, infrastructure, and networks.&quot; That answer alone separates you from 80% of candidates.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "9-2",
      title: "Identity is the new perimeter",
      blocks: [
        { type: "p", html: "If you take one sentence from this entire course into your interview, make it this: <strong>identity is the new perimeter and the primary control plane.</strong> When the network edge dissolved, identity became the consistent boundary that every access decision flows through. An attacker no longer &quot;breaks in&quot; through the firewall — they <strong>log in</strong> with stolen or sprayed credentials. Which means the controls around <em>logging in</em> are now your most important defences." },
        { type: "callout", variant: "analogy", html: "<p>Defending the network used to be like guarding the <strong>walls of a city</strong>. Now the citizens carry their valuables everywhere, so you guard the <strong>passport</strong> instead of the gate. A passport that's hard to forge (phishing-resistant MFA), checked against a watchlist at every counter (Conditional Access + risk), and revocable in seconds (token revocation) — that's identity as a perimeter.</p>" },
        { type: "h", text: "How the Microsoft identity controls implement Zero Trust together" },
        { type: "p", html: "No single control is Zero Trust. The power is in the <strong>combination</strong> — signals from one feed the decision of another. Here's how the pieces from Modules 4 and 6 lock together into one access decision:" },
        { type: "table", headers: ["Control", "Zero Trust job", "Signal it provides / consumes"], rows: [
          ["<strong>Conditional Access (CA)</strong>", "The policy engine — the &quot;verify explicitly&quot; brain", "Consumes user, device, location, app &amp; risk signals; grants, blocks, or steps-up"],
          ["<strong>MFA</strong>", "Proves the human, not just the password", "A grant control CA can require — ideally phishing-resistant"],
          ["<strong>Identity Protection</strong>", "Calculates user-risk &amp; sign-in-risk", "Feeds risk level into CA (e.g. require MFA / password change on risky sign-in)"],
          ["<strong>PIM</strong>", "Just-in-time privileged access (least privilege)", "Time-bounds &amp; approves role activation; eliminates standing admin"],
          ["<strong>Intune compliance</strong>", "Proves the device is healthy &amp; managed", "Device-compliance signal CA can require before granting access"]
        ]},
        { type: "p", html: "Read that as a sentence: <em>Conditional Access requires a compliant device (Intune) and phishing-resistant MFA, escalates to a password reset when Identity Protection flags risk, and the admin who needs Global Administrator activates it for two hours through PIM with approval.</em> That single flow touches four pillars and all three Zero Trust principles." },
        { type: "h", text: "Phishing-resistant MFA — not all MFA is equal" },
        { type: "p", html: "Here is a nuance that earns serious credibility: <strong>plain MFA is no longer good enough for privileged accounts.</strong> SMS codes and even standard push notifications can be defeated by phishing and &quot;MFA fatigue&quot; (spamming push until the user taps Approve). The gold standard is <strong>phishing-resistant MFA</strong>, which cryptographically binds the credential to the legitimate site so a fake login page can't relay it:" },
        { type: "list", items: [
          "<strong>FIDO2 / passkeys</strong> — public-key credentials (hardware security keys or device-bound passkeys). The private key never leaves the device and is bound to the real domain, so an AiTM proxy can't reuse it.",
          "<strong>Windows Hello for Business (WHfB)</strong> — biometric/PIN unlock of a TPM-protected key pair. Phishing-resistant by design.",
          "<strong>Certificate-based authentication (CBA)</strong> — smart-card or PKI certificates, common in government and high-assurance environments."
        ]},
        { type: "callout", variant: "danger", title: "Token theft & Adversary-in-the-Middle (AiTM)", html: "<p>Modern phishing kits (Evilginx, EvilProxy) act as a <strong>reverse proxy</strong> between the victim and the real Microsoft login. The victim enters their password <em>and</em> completes MFA on the genuine page — but the attacker sitting in the middle captures the resulting <strong>session token (cookie)</strong>. Replaying that token, the attacker is signed in <em>without ever knowing the password or touching MFA again</em>. This is how attackers &quot;bypass MFA.&quot; They don't break MFA — they steal what comes after it.</p>" },
        { type: "h", text: "Stopping token theft (name these mitigations)" },
        { type: "kv", items: [
          { k: "Phishing-resistant MFA", v: "FIDO2/WHfB won't authenticate to the attacker's proxy domain at all — it breaks the AiTM kit at step one." },
          { k: "Token protection (token binding)", v: "Cryptographically binds the session token to the device, so a stolen cookie is useless on the attacker's machine." },
          { k: "Conditional Access + compliant device", v: "Even a replayed token fails CA if the attacker's device isn't compliant/managed or is in a blocked location." },
          { k: "Sign-in risk (Identity Protection)", v: "Impossible-travel and anomalous-token signals raise risk, triggering re-auth or block." },
          { k: "Short-lived sessions & continuous access evaluation (CAE)", v: "CAE revokes access near-real-time on risky events instead of waiting for token expiry." }
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;How does token theft bypass MFA, and how do you stop it?&quot;</strong> &quot;An adversary-in-the-middle proxy phishes the user, who completes MFA on the real page; the attacker steals the resulting session token and replays it — no password or MFA needed. You stop it with <strong>phishing-resistant MFA</strong> (FIDO2/WHfB breaks the proxy), <strong>token protection</strong> (binds the cookie to the device), <strong>Conditional Access</strong> requiring a compliant device, <strong>sign-in risk</strong> detection, and <strong>continuous access evaluation</strong> to revoke fast.&quot; Mentioning that you don't &quot;break&quot; MFA but steal the post-MFA token is the detail that signals real understanding.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "9-3",
      title: "The attack kill chain in a Microsoft estate",
      blocks: [
        { type: "p", html: "To defend, you must think like the attacker. The industry-standard map of adversary behaviour is <strong>MITRE ATT&amp;CK</strong> — a knowledge base of <em>tactics</em> (the attacker's goals, the &quot;why&quot;) and <em>techniques</em> (the &quot;how&quot;). In an interview you'll often be asked to &quot;walk a breach&quot; from first contact to ransom. Here is that walk, grounded in concrete Microsoft-world examples and tied back to earlier modules." },
        { type: "callout", variant: "danger", title: "A typical intrusion, tactic by tactic", html: "<p>An attacker rarely does one clever thing. They chain many small steps. Each link is a chance to detect or stop them — which is the entire point of defence in depth.</p>" },
        { type: "table", headers: ["#", "ATT&CK tactic", "Concrete example in a Microsoft estate", "Module"], rows: [
          ["1", "<strong>Initial Access</strong>", "Phishing email (Defender for Office 365), password spray against Entra ID, or illicit OAuth consent grant", "1, 6"],
          ["2", "<strong>Execution</strong>", "User opens a macro-laden Office doc; malicious PowerShell / LOLBins run on the endpoint", "1"],
          ["3", "<strong>Persistence</strong>", "Run keys, scheduled tasks, malicious inbox rules, or an added app secret / service principal credential", "1, 6"],
          ["4", "<strong>Privilege Escalation</strong>", "Local UAC bypass, abusing a writable service path, or escalating in AD to a privileged group", "1, 2"],
          ["5", "<strong>Defense Evasion</strong>", "Disabling Defender, clearing the Security log (event 1102), BYOVD to kill EDR", "1, 5"],
          ["6", "<strong>Credential Access</strong>", "Dumping LSASS (Mimikatz), Kerberoasting service accounts, DCSync against a domain controller", "1, 2"],
          ["7", "<strong>Lateral Movement</strong>", "Pass-the-Hash / Pass-the-Ticket, RDP, PsExec, WMI to hop machine-to-machine", "1, 2"],
          ["8", "<strong>Collection &amp; Exfiltration</strong>", "Staging files, then exfil to attacker storage or cloud (Defender for Cloud Apps spots it)", "8"],
          ["9", "<strong>Impact</strong>", "Mass file encryption (ransomware), data destruction, or extortion", "5, 8"]
        ]},
        { type: "h", text: "The story in plain English" },
        { type: "p", html: "A finance clerk gets a convincing invoice email (<strong>Initial Access</strong>). They open the attachment and enable macros (<strong>Execution</strong>), which drops a beacon and writes a Run key so it survives reboot (<strong>Persistence</strong>). The beacon finds the clerk is a local admin, so it grabs SYSTEM (<strong>Privilege Escalation</strong>), turns off real-time protection (<strong>Defense Evasion</strong>), and dumps LSASS to harvest the cached hash of a roaming IT admin (<strong>Credential Access</strong>). With that hash it Pass-the-Hashes onto a server (<strong>Lateral Movement</strong>), enumerates and copies the finance share (<strong>Collection</strong>), uploads it to a cloud bucket (<strong>Exfiltration</strong>), and finally deploys ransomware across every reachable host (<strong>Impact</strong>)." },
        { type: "callout", variant: "warn", html: "<p>Notice how many links in that chain are <strong>identity and endpoint</strong> problems you already studied. The clerk being local admin (Module 1), the cached IT-admin credential (Module 1/2), and the missing MFA on initial sign-in (Module 6) are the load-bearing failures. Fix those three and the chain breaks in multiple places. That's why &quot;assume breach&quot; pushes us to harden <em>every</em> link, not just the front door.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;Walk me through an attack kill chain and tell me where you'd detect it.&quot;</strong> Go tactic by tactic — Initial Access (phishing) → Execution (macro/PowerShell) → Persistence (Run key) → Privilege Escalation → Defense Evasion → Credential Access (LSASS) → Lateral Movement (PtH) → Exfiltration → Impact (ransomware) — and at <em>each</em> step name a detection or control. The candidate who narrates a coherent chain and pins a Microsoft control to each link wins. The next lesson gives you exactly those controls.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "9-4",
      title: "Attack techniques vs Microsoft defenses",
      blocks: [
        { type: "p", html: "This is the single most quotable lesson in the module. For every well-known technique, you should be able to fire back the concrete Microsoft control — ideally <em>more than one</em>, because real defence is layered. Memorise the right-hand columns; they are interview gold and day-job reality." },
        { type: "table", headers: ["Technique", "What the attacker does", "Microsoft defenses (layered)"], rows: [
          ["<strong>Password spray</strong>", "Tries one common password across many accounts to avoid lockout", "Entra Smart Lockout; MFA; block legacy auth; Conditional Access; password protection (banned-password list)"],
          ["<strong>Phishing / AiTM</strong>", "Tricks users into creds or steals session tokens via a proxy", "Defender for Office 365 (Safe Links/Attachments); phishing-resistant MFA (FIDO2/WHfB); token protection; user training; DMARC/DKIM/SPF"],
          ["<strong>Kerberoasting</strong>", "Requests service tickets (SPNs) and cracks them offline for service-account passwords", "<strong>gMSA</strong> (long random managed passwords); Defender for Identity detection; remove unneeded SPNs; AES encryption; monitor event 4769"],
          ["<strong>Pass-the-Hash / PtT</strong>", "Reuses stolen NT hashes / Kerberos tickets to move laterally", "Credential Guard (VBS); <strong>LAPS</strong> (unique local-admin passwords); tiered admin model; no admin logon to workstations"],
          ["<strong>Ransomware</strong>", "Encrypts files and demands payment", "ASR rules; Controlled Folder Access; Defender for Endpoint (EDR); <strong>immutable / offline backups</strong>; network segmentation"],
          ["<strong>Business Email Compromise (BEC)</strong>", "Hijacks a mailbox to redirect payments via fraudulent emails", "DMARC enforcement; mailbox audit logging; Conditional Access; alert on new inbox-forwarding rules; impersonation protection"],
          ["<strong>Data exfiltration</strong>", "Copies sensitive data out to attacker-controlled storage/cloud", "Microsoft Purview DLP; Defender for Cloud Apps (CASB); sensitivity labels + encryption; egress controls / Private Link"],
          ["<strong>LSASS credential dump</strong>", "Reads LSASS memory to steal cached secrets", "Credential Guard; LSASS as PPL (RunAsPPL); ASR rule &quot;Block credential stealing from LSASS&quot;; least privilege"]
        ]},
        { type: "callout", variant: "tip", title: "How to talk about layers", html: "<p>When asked &quot;how do you stop X?&quot; never give one answer. Structure it as <strong>prevent → detect → recover</strong>. For ransomware: <em>prevent</em> with ASR + Controlled Folder Access + least privilege; <em>detect</em> with Defender EDR + Sentinel analytics; <em>recover</em> with immutable, offline-tested backups. Three layers per threat is the architect's reflex.</p>" },
        { type: "h", text: "The defender's hunt query mindset" },
        { type: "p", html: "Many of these defences also produce <strong>detections</strong> you'd hunt in Microsoft Defender / Sentinel using Kusto Query Language (KQL) — the query language from Module 8. You don't need to memorise KQL syntax, but recognising it and reading it is expected of a SOC-ready candidate:" },
        { type: "code", lang: "kusto", caption: "KQL: spot a password-spray pattern (many accounts, one source, failure 50126)", code: [
          "SigninLogs",
          "| where ResultType == 50126   // invalid username or password",
          "| summarize FailedAccounts = dcount(UserPrincipalName)",
          "    by IPAddress, bin(TimeGenerated, 1h)",
          "| where FailedAccounts > 20",
          "| order by FailedAccounts desc"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;An attacker is Kerberoasting your domain. What stops it?&quot;</strong> &quot;Kerberoasting cracks service-account passwords from requested service tickets. The strongest fix is <strong>gMSA</strong> — group Managed Service Accounts have 240-character passwords that rotate automatically, so they're not crackable. Layer on <strong>Defender for Identity</strong> to detect the anomalous ticket requests (event 4769), remove unnecessary SPNs, and enforce AES instead of RC4.&quot; Leading with gMSA shows you know the root-cause fix, not just the detection.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "9-5",
      title: "Network security in the Microsoft world",
      blocks: [
        { type: "p", html: "Identity is the new perimeter — but the network still matters enormously for the &quot;assume breach&quot; principle. Good network design is about <strong>limiting blast radius</strong>: when (not if) one host is compromised, segmentation decides whether the attacker owns one subnet or the whole estate. This lesson recaps Module 3's building blocks and adds the modern Zero Trust network access story." },
        { type: "h", text: "Segmentation and micro-segmentation" },
        { type: "p", html: "<strong>Segmentation</strong> divides the network into zones so traffic between them is filtered, not free-flowing. <strong>Micro-segmentation</strong> takes it down to the individual workload — each VM or app only talks to exactly what it needs. The castle-and-moat sin was a flat internal network where one foothold reached everything. Zero Trust networks are deliberately compartmentalised." },
        { type: "table", headers: ["Control (Module 3 recap)", "What it does", "Zero Trust role"], rows: [
          ["<strong>NSG (Network Security Group)</strong>", "Stateful allow/deny rules on subnets &amp; NICs", "Micro-segmentation; deny-by-default east-west traffic"],
          ["<strong>Azure Firewall</strong>", "Managed, stateful, central L3–L7 firewall with threat intel", "Inspect &amp; filter north-south and inter-spoke traffic"],
          ["<strong>Private Link / Private Endpoint</strong>", "Brings a PaaS service onto your private VNet, off the public internet", "Removes public exposure; data stays on the Microsoft backbone"],
          ["<strong>Azure Bastion</strong>", "Browser-based RDP/SSH with no public IP on the VM", "Eliminates exposed management ports (3389/22)"],
          ["<strong>DDoS Protection</strong>", "Absorbs/scrubs volumetric attacks", "Availability — keeps the front door open under attack"]
        ]},
        { type: "h", text: "Connecting on-prem: VPN vs ExpressRoute" },
        { type: "kv", items: [
          { k: "Site-to-Site VPN", v: "Encrypted IPsec tunnel over the public internet. Cheaper, quick to stand up, variable performance." },
          { k: "ExpressRoute", v: "A private, dedicated circuit to Azure that bypasses the public internet — higher bandwidth, lower latency, stronger SLA. Used by enterprises for predictable, sensitive connectivity." }
        ]},
        { type: "h", text: "The modern shift: SSE / ZTNA via Entra Global Secure Access" },
        { type: "p", html: "Legacy remote access used a <strong>VPN</strong>: connect, and you're &quot;on the network&quot; with broad implicit trust — the castle-and-moat model in software form. The modern replacement is <strong>Zero Trust Network Access (ZTNA)</strong>, delivered as <strong>Secure Service Edge (SSE)</strong>. Microsoft's offering is <strong>Microsoft Entra Global Secure Access</strong>, which has two parts:" },
        { type: "list", items: [
          "<strong>Entra Internet Access</strong> — a secure web gateway / SSE for internet and SaaS traffic, with Conditional Access applied to network access itself and protection against malicious sites.",
          "<strong>Entra Private Access</strong> — ZTNA for private/internal apps: users reach <em>specific apps</em> (not the whole network) after per-app, identity- and device-verified Conditional Access — no broad VPN trust, no lateral movement."
        ]},
        { type: "table", headers: ["", "Castle-and-moat VPN", "Zero Trust Network Access (Entra GSA)"], rows: [
          ["Trust model", "Connect once = trusted on the whole network", "Verify every request; trust nothing implicitly"],
          ["Access granularity", "Broad network-level access", "Per-application access only"],
          ["Lateral movement", "Easy once inside the tunnel", "Contained — no network-wide reach"],
          ["Policy engine", "Static firewall/VPN rules", "Conditional Access: identity + device + risk per session"],
          ["User exposure", "VPN concentrator with a public IP", "Apps are never published to the internet"]
        ]},
        { type: "callout", variant: "warn", html: "<p>The classic VPN failure: a contractor's compromised laptop connects to the VPN and the attacker now has a route to <em>everything</em> the VPN reaches. With Entra Private Access, that same laptop only ever reaches the one app it was authorized for, and only if the device is compliant and the sign-in isn't risky. Same breach, vastly smaller blast radius — &quot;assume breach&quot; in action.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;Why is a VPN not Zero Trust, and what replaces it?&quot;</strong> &quot;A VPN grants <em>network-level</em> trust — once connected you can reach broadly, which violates least privilege and enables lateral movement. ZTNA via <strong>Microsoft Entra Global Secure Access</strong> (Internet Access + Private Access) replaces it with <strong>per-application</strong> access gated by Conditional Access — identity, device health, and risk are verified every session, and internal apps are never exposed to the internet.&quot;</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "9-6",
      title: "Governance, compliance & data protection",
      blocks: [
        { type: "p", html: "Architecture isn't only about stopping attacks — it's about proving you're secure, staying that way as the estate grows, and protecting the data itself. This lesson covers <strong>governance</strong> (guardrails &amp; posture), <strong>data protection</strong> (Purview), and the <strong>frameworks</strong> auditors and interviewers expect you to name." },
        { type: "h", text: "Posture & guardrails" },
        { type: "kv", items: [
          { k: "Defender for Cloud — Secure Score", v: "A single percentage measuring your security posture against Microsoft's recommended controls. It turns &quot;are we secure?&quot; into a number with a prioritised to-do list. Track it over time; set a target." },
          { k: "Azure Policy", v: "Guardrails as code — enforces or audits rules across subscriptions (e.g. &quot;deny public storage accounts,&quot; &quot;require encryption,&quot; &quot;allowed regions only&quot;). This is how least privilege and config standards scale." },
          { k: "Management groups + RBAC", v: "Structure subscriptions and assign least-privilege roles at the right scope so policy and access are consistent." }
        ]},
        { type: "h", text: "Protecting the data itself (Microsoft Purview)" },
        { type: "p", html: "The <strong>Data</strong> pillar is where many programmes are weakest. Microsoft Purview provides the controls that travel with the data:" },
        { type: "list", items: [
          "<strong>Sensitivity labels</strong> — classify and tag content (Public / Confidential / Highly Confidential); the label can enforce encryption and access rights that persist even if the file leaves your tenant.",
          "<strong>Data Loss Prevention (DLP)</strong> — policies that detect and block sensitive data (credit cards, health records, secrets) from being shared via email, Teams, or endpoints.",
          "<strong>Encryption &amp; key management</strong> — data encrypted at rest and in transit; keys in <strong>Azure Key Vault</strong>, with the option of customer-managed keys for higher assurance."
        ]},
        { type: "h", text: "Frameworks & regulations you should be able to name" },
        { type: "p", html: "You won't be asked to recite a control catalogue, but you <em>will</em> be asked to name a framework and say what it's for. Know these at a high level — and that Microsoft tooling maps to them so you can demonstrate compliance:" },
        { type: "table", headers: ["Framework / regulation", "What it is", "How Microsoft tooling maps"], rows: [
          ["<strong>NIST CSF</strong>", "A voluntary framework of five functions: <em>Identify, Protect, Detect, Respond, Recover</em>", "Defender XDR + Sentinel + Purview cover all five functions"],
          ["<strong>ISO/IEC 27001</strong>", "International standard for an Information Security Management System (ISMS) — certifiable", "Defender for Cloud has a built-in ISO 27001 compliance assessment"],
          ["<strong>CIS Benchmarks</strong>", "Prescriptive hardening configs for OS, cloud &amp; products", "Secure Score &amp; Azure Policy initiatives map to CIS baselines"],
          ["<strong>GDPR</strong>", "EU regulation on personal-data privacy &amp; breach notification", "Purview (DLP, data subject requests, eDiscovery) supports it"],
          ["<strong>HIPAA</strong>", "US healthcare data protection (PHI)", "Compliance Manager assessment + Purview controls"],
          ["<strong>PCI-DSS</strong>", "Security standard for handling payment-card data", "Defender for Cloud regulatory-compliance dashboard tracks it"]
        ]},
        { type: "callout", variant: "tip", html: "<p>A clean mental hook: <strong>NIST CSF = a framework</strong> (a flexible set of functions you adopt voluntarily), <strong>ISO 27001 = a certifiable standard</strong> (you get audited and certified), <strong>CIS = concrete benchmarks</strong> (specific settings), and <strong>GDPR/HIPAA/PCI = regulations/standards you must legally or contractually comply with</strong>. Knowing the <em>category</em> of each is half the battle.</p>" },
        { type: "h", text: "Least privilege & the identity lifecycle" },
        { type: "p", html: "Governance closes the loop on least privilege over <em>time</em>. Access granted on day one rots — people change roles, projects end, contractors leave. The <strong>joiner/mover/leaver (JML)</strong> lifecycle keeps entitlements honest:" },
        { type: "steps", items: [
          "<strong>Joiner</strong> — provision the right access for the role from day one (ideally automated via Entra Lifecycle Workflows / group-based access).",
          "<strong>Mover</strong> — when someone changes role, <em>remove</em> the old access, not just add new — this prevents privilege accumulation (&quot;access creep&quot;).",
          "<strong>Leaver</strong> — deprovision promptly; orphaned accounts are a top attack vector.",
          "<strong>Access reviews</strong> — periodic recertification (Entra Access Reviews) where managers attest that access is still needed; combine with PIM for privileged roles."
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;What is Secure Score, and what's a framework you'd reference?&quot;</strong> &quot;<strong>Secure Score</strong> is Microsoft's measurement of your security posture as a single percentage against recommended controls, with a prioritised remediation list — it makes posture measurable and trackable. For frameworks I'd reference <strong>NIST CSF</strong> — Identify, Protect, Detect, Respond, Recover — because it's a clear way to organise a programme, and Microsoft's Defender, Sentinel, and Purview stack maps onto all five functions.&quot;</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "9-7",
      title: "Designing & defending a secure Microsoft environment",
      blocks: [
        { type: "p", html: "This is the synthesis lesson — everything converges here. As an architect, you'll be handed an estate and asked &quot;how would you secure this?&quot; or &quot;we just got breached, what now?&quot;. You answer with two things: a <strong>hardening baseline</strong> (prevention) and an <strong>incident-response lifecycle</strong> (when prevention fails, because assume breach). Let's build both." },
        { type: "h", text: "The hardening checklist (your default baseline)" },
        { type: "p", html: "If I walked into a new Microsoft tenant tomorrow, this is the order I'd work in. It's deliberately identity-first, because that's where the leverage is, then endpoint, then monitoring and recovery:" },
        { type: "steps", items: [
          "<strong>MFA everywhere</strong> — enforce via Conditional Access for all users; <strong>phishing-resistant MFA</strong> (FIDO2/WHfB) mandatory for all admins.",
          "<strong>Block legacy authentication</strong> — it can't do MFA and is the #1 enabler of password spray. Block it in CA on day one.",
          "<strong>PIM for every privileged role</strong> — no standing Global Admins; just-in-time activation with approval and time limits.",
          "<strong>Least privilege + tiered admin</strong> — admins never log privileged accounts onto regular workstations; separate admin accounts and a clean management plane.",
          "<strong>Device compliance + Conditional Access</strong> — require a managed, compliant (Intune) device to access corporate resources.",
          "<strong>Endpoint hardening</strong> — Defender AV + EDR, ASR rules, Credential Guard, LAPS, Tamper Protection, BitLocker.",
          "<strong>Monitoring</strong> — Defender XDR + Microsoft Sentinel ingesting sign-in, endpoint, and audit logs with detections &amp; automation (Module 8).",
          "<strong>Network segmentation</strong> — NSGs/Azure Firewall, Private Link, Bastion; replace VPN trust with Entra Private Access (ZTNA).",
          "<strong>Data protection</strong> — Purview sensitivity labels + DLP; encryption with Key Vault.",
          "<strong>Immutable, tested backups</strong> — offline/immutable copies, and <em>regularly test the restore</em> — an untested backup is a hope, not a control.",
          "<strong>Secure Score target</strong> — set a posture goal, remediate the top recommendations, and track the trend.",
          "<strong>Access reviews + JML</strong> — keep entitlements honest over time."
        ]},
        { type: "callout", variant: "lab", html: "<p><strong>Try it:</strong> open the Microsoft Entra admin centre and audit just three things on a tenant you control — (1) is legacy auth blocked? (2) do any accounts hold <em>standing</em> Global Administrator instead of PIM-eligible? (3) is MFA enforced for all users via Conditional Access? Those three findings alone are what most real-world tenant reviews start with.</p>" },
        { type: "h", text: "When prevention fails: the NIST incident-response lifecycle" },
        { type: "p", html: "&quot;Assume breach&quot; means having a plan for the bad day. The <strong>NIST SP 800-61</strong> incident-response lifecycle is the standard four-phase model — know its phases and that it's a <em>loop</em>, not a line:" },
        { type: "table", headers: ["Phase", "What happens", "Microsoft tools in play"], rows: [
          ["<strong>1. Preparation</strong>", "Build the plan, tooling, logging, runbooks &amp; training <em>before</em> an incident", "Sentinel onboarded, logs retained, playbooks written, contacts known"],
          ["<strong>2. Detection &amp; Analysis</strong>", "Identify and triage the incident; scope what's affected", "Defender XDR incidents, Sentinel analytics &amp; hunting (KQL), alert correlation"],
          ["<strong>3. Containment, Eradication &amp; Recovery</strong>", "Isolate hosts, remove the foothold, restore clean systems", "Defender device isolation, disable/reset identities, restore from immutable backup"],
          ["<strong>4. Post-Incident Activity</strong>", "Lessons learned; feed fixes back into Preparation", "Update detections, close the gaps, run a blameless retro"]
        ]},
        { type: "callout", variant: "tip", title: "Tabletop & assume-breach thinking", html: "<p>The cheapest, highest-value exercise you can run is a <strong>tabletop</strong>: gather the team and talk through a realistic scenario (&quot;a finance laptop is ransomwared at 4pm Friday — go&quot;). You find the broken phone trees, the backup nobody tested, and the runbook nobody wrote — on a <em>quiet</em> day instead of during a real fire. Assume-breach isn't pessimism; it's rehearsal.</p>" },
        { type: "h", text: "Bringing it all home" },
        { type: "p", html: "You've now walked the full arc: Windows internals, Active Directory, Azure networking, Entra identity, endpoint management, secure operations — and in this module, the philosophy that unifies them. Zero Trust isn't a product you buy; it's a way of designing where <strong>identity is the control plane, least privilege is the default, and you always assume the adversary is already inside</strong>. Every Microsoft control you've learned is a tool in service of that mindset." },
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;If you had limited budget, what would you do first to secure a Microsoft tenant?&quot;</strong> &quot;Identity, because that's where the leverage is: <strong>enforce MFA for everyone, phishing-resistant MFA for admins, block legacy authentication, and put privileged roles behind PIM.</strong> Those four are low-cost and stop the overwhelming majority of real-world intrusions — password spray, basic phishing, and standing-admin abuse. Then I'd add device compliance via Conditional Access and stand up Sentinel for monitoring.&quot; Leading with high-ROI identity controls is exactly the prioritisation interviewers want to hear.</p>" },
        { type: "divider" },
        { type: "callout", variant: "tip", title: "Module 9 — Key takeaways", html: "<ul><li><strong>Zero Trust = never trust, always verify</strong>, built on three principles: verify explicitly, use least-privilege access (JIT/JEA), and assume breach — applied across six pillars (identities, endpoints, apps, data, infrastructure, networks).</li><li><strong>Identity is the new perimeter.</strong> Conditional Access + MFA + Identity Protection + PIM + Intune compliance implement Zero Trust together; <strong>phishing-resistant MFA</strong> (FIDO2/WHfB/CBA) and <strong>token protection</strong> defeat AiTM token theft.</li><li>You can <strong>walk the kill chain</strong> (Initial Access → … → Impact) and name a Microsoft control at each step: Smart Lockout, Defender for Office 365, gMSA, Credential Guard + LAPS, ASR + immutable backups, Purview DLP.</li><li>Network defence limits blast radius: NSGs, Azure Firewall, Private Link, Bastion — and modern <strong>ZTNA via Entra Global Secure Access</strong> replaces broad VPN trust with per-app access.</li><li>Governance proves and sustains it: <strong>Secure Score</strong>, Azure Policy, Purview, frameworks (NIST CSF / ISO 27001 / CIS / GDPR-HIPAA-PCI), and the least-privilege <strong>JML lifecycle</strong> with access reviews.</li><li>Design with a hardening baseline and defend with the <strong>NIST IR lifecycle</strong> (Prepare → Detect &amp; Analyse → Contain/Eradicate/Recover → Post-Incident). Assume breach; rehearse with tabletops. You're ready for the interview.</li></ul>" }
      ]
    }
  ],
  quiz: [
    { q: "What are the three guiding principles of Zero Trust?", options: ["Authenticate, encrypt, log", "Verify explicitly; use least-privilege access; assume breach", "Firewall, antivirus, backup", "Identify, protect, recover"], answer: 1, explain: "Zero Trust's three principles are verify explicitly (authenticate/authorize on all signals), use least-privilege access (JIT/JEA, risk-based), and assume breach (segment, encrypt, detect). 'Identify/protect/recover' are NIST CSF functions, a different model." },
    { q: "Why is the phrase 'identity is the new perimeter' accurate in a modern Microsoft estate?", options: ["Because firewalls no longer exist", "Because attackers now log in with stolen/sprayed credentials rather than breaking the network edge, making identity the consistent control plane", "Because all data is now public", "Because VPNs are mandatory"], answer: 1, explain: "With users, apps, and data outside any single network edge, identity is the boundary every request flows through. Attackers 'log in' rather than 'break in', so identity controls (CA, MFA, PIM) are the primary defences." },
    { q: "How does an Adversary-in-the-Middle (AiTM) attack 'bypass' MFA?", options: ["It guesses the MFA code", "It proxies the real login so the user completes MFA, then steals and replays the resulting session token", "It disables MFA in Entra ID", "It uses a stolen password only"], answer: 1, explain: "AiTM kits reverse-proxy the genuine Microsoft login; the victim completes MFA on the real page and the attacker captures the post-MFA session token (cookie) to replay. MFA isn't broken — the token after it is stolen. Phishing-resistant MFA + token protection stop this." },
    { q: "Which MFA method is phishing-resistant?", options: ["SMS one-time codes", "Email codes", "FIDO2 passkeys / Windows Hello for Business", "Standard push notifications"], answer: 2, explain: "FIDO2/passkeys, Windows Hello for Business, and certificate-based auth cryptographically bind the credential to the legitimate domain, so an AiTM proxy can't relay them. SMS, email, and basic push are phishable / vulnerable to MFA fatigue." },
    { q: "An attacker is Kerberoasting your Active Directory. What is the strongest root-cause defense?", options: ["Block legacy authentication", "Use group Managed Service Accounts (gMSA) with long auto-rotating passwords", "Enable BitLocker", "Turn off SMBv1"], answer: 1, explain: "Kerberoasting cracks service-account passwords offline from requested service tickets. gMSA passwords are ~240 random characters that rotate automatically, so they're effectively uncrackable. Layer Defender for Identity detection (event 4769) on top." },
    { q: "What is the key Zero Trust advantage of Entra Private Access (ZTNA) over a traditional VPN?", options: ["It is cheaper than a VPN", "It grants per-application access verified by Conditional Access instead of broad network-level trust, limiting lateral movement", "It requires no authentication", "It exposes apps directly to the internet"], answer: 1, explain: "A VPN grants network-level trust (lateral movement is easy once connected). Entra Private Access provides per-app access gated by identity, device health, and risk every session, and internal apps are never published to the internet." },
    { q: "What does Microsoft Defender for Cloud Secure Score measure?", options: ["Network bandwidth usage", "Your security posture as a single percentage against recommended controls, with a prioritised remediation list", "The number of users in the tenant", "Monthly Azure cost"], answer: 1, explain: "Secure Score turns 'are we secure?' into a measurable percentage benchmarked against Microsoft's recommended controls, giving a prioritised to-do list you track over time." },
    { q: "In the joiner/mover/leaver (JML) lifecycle, why is the 'mover' stage commonly mishandled?", options: ["New hires get no access", "Old access is often left in place when only new access is added, causing privilege accumulation ('access creep')", "Leavers keep their laptops", "It only applies to contractors"], answer: 1, explain: "When someone changes roles, removing the old entitlements (not just granting new ones) is essential to least privilege. Skipping removal causes access creep. Entra Access Reviews recertify access periodically to catch this." }
  ],
  flashcards: [
    { front: "Define Zero Trust in one line.", back: "A security model that assumes no implicit trust based on network location — every request is verified as if it came from an open, hostile network. 'Never trust, always verify.'" },
    { front: "The three Zero Trust principles", back: "<strong>Verify explicitly</strong> (auth/authz on all signals), <strong>use least-privilege access</strong> (JIT/JEA, risk-based), and <strong>assume breach</strong> (segment, encrypt end-to-end, detect with analytics)." },
    { front: "Microsoft's six Zero Trust pillars", back: "<strong>Identities, Endpoints, Applications, Data, Infrastructure, Networks</strong> — each instrumented by specific Microsoft products (Entra, Intune, Defender, Purview, Azure Policy, GSA)." },
    { front: "'Identity is the new perimeter' — what does it mean?", back: "With the network edge dissolved, identity is the consistent control plane every access decision flows through. Attackers 'log in' rather than 'break in', so identity controls are the primary defence." },
    { front: "What is phishing-resistant MFA?", back: "MFA cryptographically bound to the legitimate domain so a fake site can't relay it: <strong>FIDO2/passkeys, Windows Hello for Business, certificate-based auth</strong>. (SMS/push are phishable.)" },
    { front: "How does AiTM token theft bypass MFA?", back: "A reverse-proxy phishing kit lets the user complete MFA on the real page, then steals the resulting <strong>session token (cookie)</strong> and replays it — no password or MFA needed. Stop it: phishing-resistant MFA, token protection, compliant-device CA, CAE." },
    { front: "Name the MITRE ATT&CK kill-chain order.", back: "Initial Access → Execution → Persistence → Privilege Escalation → Defense Evasion → Credential Access → Lateral Movement → Collection/Exfiltration → Impact." },
    { front: "Defense for Pass-the-Hash / Pass-the-Ticket?", back: "<strong>Credential Guard</strong> (VBS isolation of LSASS secrets), <strong>LAPS</strong> (unique local-admin passwords), a tiered admin model, and never logging privileged accounts onto workstations." },
    { front: "Layered defense against ransomware", back: "<strong>Prevent</strong>: ASR rules + Controlled Folder Access + least privilege. <strong>Detect</strong>: Defender EDR + Sentinel. <strong>Recover</strong>: immutable/offline, regularly-tested backups + segmentation." },
    { front: "VPN vs ZTNA (Entra Global Secure Access)", back: "VPN = connect once, broad network-level trust (lateral movement easy). ZTNA = <strong>per-application</strong> access verified by Conditional Access every session; internal apps never exposed to the internet." },
    { front: "Name a framework and a regulation.", back: "<strong>Framework</strong>: NIST CSF (Identify, Protect, Detect, Respond, Recover) or ISO/IEC 27001 (certifiable ISMS) or CIS Benchmarks (hardening configs). <strong>Regulations</strong>: GDPR, HIPAA, PCI-DSS." },
    { front: "The NIST incident-response lifecycle", back: "<strong>1. Preparation → 2. Detection &amp; Analysis → 3. Containment, Eradication &amp; Recovery → 4. Post-Incident Activity</strong> — and it's a loop: lessons feed back into Preparation." }
  ]
});
