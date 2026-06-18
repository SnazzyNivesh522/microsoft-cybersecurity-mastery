/* Interview preparation bank.
   window.COURSE.interview = [ { category, icon, blurb, items:[ {q, level, a:[blocks]} ] } ]
   Answers are arrays of the same block types used in modules (rendered by the engine).
   Convention: double-quoted JS strings; single-quoted HTML attributes; no backticks. */
window.COURSE.interview = [

  /* ============================================================= */
  {
    category: "How to win the interview (strategy)",
    icon: "🧭",
    blurb: "Before the technical content — how a senior interviewer actually evaluates you, and how to frame answers.",
    items: [
      {
        q: "How should I structure a technical answer so it lands well?",
        level: "Strategy",
        a: [
          { type: "p", html: "Use a simple three-beat structure every time. It makes you sound senior even on topics you only half-know:" },
          { type: "steps", items: [
            "<strong>Define it</strong> in one plain sentence (prove you understand the concept).",
            "<strong>Explain how it works</strong> — the mechanism, briefly.",
            "<strong>Tie it to security / a real scenario</strong> — why it matters, the attack it stops or enables, or how you'd use it on the job."
          ]},
          { type: "callout", variant: "tip", html: "<p>Example for “What is Conditional Access?” → <em>(define)</em> a policy engine in Entra ID. <em>(how)</em> It evaluates signals — user, device, location, risk — and grants/blocks access with controls like MFA. <em>(security)</em> It's the enforcement point for Zero Trust; e.g., I'd require a compliant device and MFA for any admin sign-in.</p>" }
        ]
      },
      {
        q: "What do I do when I genuinely don't know the answer?",
        level: "Strategy",
        a: [
          { type: "p", html: "Never bluff — seniors smell it instantly. Do this instead:" },
          { type: "list", items: [
            "Say what you <em>do</em> know that's adjacent (“I haven't configured X, but it's conceptually similar to Y, which I have…”).",
            "Reason out loud from first principles — interviewers often score the <em>thinking</em>, not the trivia.",
            "Say how you'd find the answer (Microsoft Learn docs, test in a lab tenant). Resourcefulness is a real skill."
          ]},
          { type: "callout", variant: "interview", html: "<p>“I don't know, but here's how I'd figure it out” beats a confident wrong answer every single time.</p>" }
        ]
      },
      {
        q: "“Tell me about yourself” for an entry-level cybersecurity role — what should I say?",
        level: "Behavioral",
        a: [
          { type: "p", html: "Keep it to ~60–90 seconds and follow Present → Path → Why-this-role. Anchor it in <strong>concrete Microsoft skills</strong>: “I've been building hands-on skills in Windows and Microsoft cloud security — Active Directory, Entra ID Conditional Access, Intune, and using KQL in Sentinel/Defender for hunting. I built a lab tenant to practice MFA, PIM, and incident response…”. Show initiative (home lab), name the stack, and connect to the company's needs." },
          { type: "callout", variant: "tip", html: "<p>A <strong>home lab</strong> (free Microsoft 365 Developer tenant + an Azure free account) is the single best differentiator for a junior. “I set up Conditional Access and tested it” is worth more than any certificate alone.</p>" }
        ]
      },
      {
        q: "What certifications and proof-of-skill matter for Microsoft security roles?",
        level: "Strategy",
        a: [
          { type: "list", items: [
            "<strong>SC-900</strong> (Security, Compliance &amp; Identity Fundamentals) — perfect first cert; maps almost 1:1 to this course.",
            "<strong>AZ-900</strong> (Azure Fundamentals) — cloud groundwork.",
            "<strong>SC-300</strong> (Identity &amp; Access Administrator) and <strong>SC-200</strong> (Security Operations Analyst) — the role-based certs that get you shortlisted.",
            "<strong>AZ-500</strong> (Azure Security Engineer) for deeper cloud security.",
            "A <strong>home lab</strong> and a couple of write-ups (blog/GitHub) of things you built or detected."
          ]},
          { type: "callout", variant: "warn", html: "<p>Certs open the door; the lab and the ability to <em>explain</em> get the offer. Do both.</p>" }
        ]
      }
    ]
  },

  /* ============================================================= */
  {
    category: "Windows & Endpoint Security",
    icon: "🪟",
    blurb: "Foundations interviewers use to separate the hands-on from the theoretical.",
    items: [
      {
        q: "What's the difference between authentication and authorization in Windows?",
        level: "Fundamentals",
        a: [
          { type: "p", html: "<strong>Authentication</strong> proves <em>who you are</em> (logon, validated by LSASS). <strong>Authorization</strong> decides <em>what you can do</em> — Windows compares your <strong>access token</strong> (your SID + group SIDs + privileges) against the object's <strong>DACL</strong>. Authentication happens once at logon; authorization happens on every object access." }
        ]
      },
      {
        q: "Why is the LSASS process such a prized target, and how do you defend it?",
        level: "Core",
        a: [
          { type: "p", html: "LSASS caches credential material (NT hashes, Kerberos tickets) in memory so you don't re-type your password constantly. An attacker with local admin can read that memory and reuse the credentials elsewhere — <strong>Pass-the-Hash</strong> / <strong>Pass-the-Ticket</strong> — turning one box into domain-wide compromise." },
          { type: "list", items: [
            "<strong>Credential Guard</strong> (VBS) isolates the secrets so even SYSTEM can't read them.",
            "Run LSASS as a <strong>Protected Process Light</strong> (RunAsPPL).",
            "Defender <strong>ASR rule</strong> “Block credential stealing from LSASS.”",
            "Remove local admin, and never log privileged accounts onto untrusted endpoints (tiering)."
          ]}
        ]
      },
      {
        q: "Is UAC a security boundary?",
        level: "Core",
        a: [
          { type: "p", html: "No — Microsoft explicitly says UAC is <strong>not</strong> a security boundary. It's a convenience/friction mechanism (Admin Approval Mode gives admins a split token) that catches accidental changes and noisy malware. Many bypasses exist (auto-elevating binaries, etc.). Treat it as a speed bump, not a wall. Saying this signals maturity." }
        ]
      },
      {
        q: "A folder is shared. Share perms = Read; NTFS perms = Full Control. What does a network user get, and why?",
        level: "Core",
        a: [
          { type: "p", html: "<strong>Read.</strong> Over the network both layers apply and the <em>most restrictive</em> wins. Locally (no share), only NTFS applies → Full Control. Bonus: I'd confirm real rights with the <strong>Effective Access</strong> tab rather than reasoning in my head, and remember explicit <strong>Deny</strong> beats Allow." }
        ]
      },
      {
        q: "You suspect an endpoint is compromised. What do you check first?",
        level: "Scenario",
        a: [
          { type: "list", items: [
            "Running <strong>processes + command lines</strong> and active <strong>network connections</strong>.",
            "Recent <strong>logons</strong> (4624/4672) and <strong>process creation</strong> (4688) in the Security log.",
            "<strong>Persistence</strong>: Run keys, Scheduled Tasks, Services — all at once with Sysinternals <strong>Autoruns</strong>.",
            "New/odd <strong>accounts</strong> (4720) or group changes (4732).",
            "Signs of <strong>evasion</strong>: Security log cleared (1102) or Defender tampered with."
          ]},
          { type: "callout", variant: "tip", html: "<p>If it may go to forensics, <strong>preserve volatile data first</strong> (memory, network state) before you start poking — order of volatility matters.</p>" }
        ]
      }
    ]
  },

  /* ============================================================= */
  {
    category: "Active Directory & On-Prem Identity",
    icon: "🏛️",
    blurb: "The AD-attack questions show up in nearly every blue-team interview.",
    items: [
      {
        q: "What's the difference between Active Directory and Microsoft Entra ID?",
        level: "Core",
        a: [
          { type: "table", headers: ["", "Active Directory (AD DS)", "Microsoft Entra ID"], rows: [
            ["Location", "On-premises, your DCs", "Microsoft-hosted cloud"],
            ["Protocols", "Kerberos, NTLM, LDAP", "OAuth 2.0, OIDC, SAML, SCIM, Graph"],
            ["Structure", "Forests, domains, OUs, GPOs", "Flat tenant, groups, CA policies"],
            ["Manages", "Domain-joined Windows, on-prem apps", "SaaS/cloud apps, any device/OS"]
          ]},
          { type: "p", html: "They're complementary, bridged by <strong>Entra Connect</strong>. Entra ID is not “AD in the cloud” — there are no OUs, GPOs, Kerberos, or LDAP." }
        ]
      },
      {
        q: "Explain Kerberoasting and how you'd defend against it.",
        level: "Advanced",
        a: [
          { type: "p", html: "Any authenticated user can request a Kerberos <strong>service ticket (TGS)</strong> for an account that has a <strong>Service Principal Name (SPN)</strong>. Part of that ticket is encrypted with the service account's password hash. The attacker requests tickets for SPN accounts, pulls them offline, and brute-forces the password — no further access needed during cracking." },
          { type: "list", items: [
            "Use <strong>group Managed Service Accounts (gMSA)</strong> — 240-character, auto-rotated passwords that can't realistically be cracked.",
            "Give human service accounts <strong>long, random passwords</strong> and minimal privileges.",
            "Reduce unnecessary SPNs; monitor <strong>4769</strong> for abnormal ticket requests (Defender for Identity does this)."
          ]}
        ]
      },
      {
        q: "Golden Ticket vs. Silver Ticket vs. DCSync — what are they?",
        level: "Advanced",
        a: [
          { type: "list", items: [
            "<strong>Golden Ticket</strong>: forge a TGT using the <strong>krbtgt</strong> account's hash → impersonate <em>anyone</em>, including Domain Admin, for any service. Catastrophic; remediation requires rotating krbtgt <em>twice</em>.",
            "<strong>Silver Ticket</strong>: forge a single <em>service</em> ticket (TGS) using that service account's hash → access just that one service, stealthier (no DC contact).",
            "<strong>DCSync</strong>: abuse the “Replicating Directory Changes” right to ask a DC to replicate password hashes — effectively impersonating a DC to steal krbtgt and any hash."
          ]},
          { type: "callout", variant: "interview", html: "<p>Why is the <strong>forest</strong> (not the domain) the security boundary? Because shared trust and replication mean a Domain Admin in one domain can generally be leveraged across the forest — so you size your blast radius and Tier-0 controls at the forest level.</p>" }
        ]
      },
      {
        q: "Kerberos vs. NTLM — when is each used and why is NTLM weaker?",
        level: "Core",
        a: [
          { type: "p", html: "<strong>Kerberos</strong> is the default in AD: ticket-based, supports <em>mutual</em> authentication, uses timestamps to resist replay, and doesn't send the password over the wire. <strong>NTLM</strong> is the legacy challenge-response fallback (used for IP-based connections, local accounts, workgroups). NTLM has no mutual auth, is relayable, and is the basis of Pass-the-Hash — so you disable/restrict it where possible and monitor its use." }
        ]
      }
    ]
  },

  /* ============================================================= */
  {
    category: "Microsoft Entra ID & Identity",
    icon: "🆔",
    blurb: "Identity is the #1 topic in modern Microsoft security interviews. Nail this category.",
    items: [
      {
        q: "What is Conditional Access, and give three policies every tenant should have.",
        level: "Core",
        a: [
          { type: "p", html: "Conditional Access is Entra ID's policy engine and the enforcement point for Zero Trust. It's <em>if-this-then-that</em>: evaluate <strong>signals</strong> (user/group, app, device state/compliance, location, sign-in risk, client app) and reach a <strong>decision</strong> — block, or grant with controls (require MFA, compliant device, etc.)." },
          { type: "list", items: [
            "<strong>Block legacy authentication</strong> (it bypasses MFA entirely).",
            "<strong>Require MFA for all users</strong> (and phishing-resistant MFA for admins).",
            "<strong>Require a compliant / hybrid-joined device</strong> for access to corporate apps."
          ]},
          { type: "callout", variant: "tip", html: "<p>Always roll out new policies in <strong>report-only</strong> mode first and exclude a break-glass admin account so you can't lock yourself out.</p>" }
        ]
      },
      {
        q: "Compare Password Hash Sync, Pass-through Authentication, and Federation.",
        level: "Advanced",
        a: [
          { type: "table", headers: ["Method", "Where password is validated", "Trade-off"], rows: [
            ["<strong>PHS</strong> (Password Hash Sync)", "In Entra ID (a hash-of-a-hash is synced)", "Simplest, most resilient; enables leaked-credential detection. Recommended default."],
            ["<strong>PTA</strong> (Pass-through Auth)", "On-prem AD via lightweight agents", "Passwords stay on-prem; depends on agent availability."],
            ["<strong>Federation</strong> (AD FS)", "On-prem federation servers", "Most control/complexity; biggest attack surface (Golden SAML)."]
          ]},
          { type: "p", html: "Microsoft's guidance leans to <strong>PHS</strong> for most orgs — fewer moving parts and it keeps working if on-prem is down." }
        ]
      },
      {
        q: "How can an attacker bypass MFA, and how do you mitigate it?",
        level: "Advanced",
        a: [
          { type: "p", html: "The big one is <strong>token theft / adversary-in-the-middle (AiTM)</strong> phishing: a reverse-proxy page captures the session <strong>token</strong> after you complete MFA, then the attacker replays the token — MFA already happened. Other routes: <strong>MFA fatigue</strong> (push bombing), SIM-swap on SMS, and legacy auth that skips MFA." },
          { type: "list", items: [
            "<strong>Phishing-resistant MFA</strong> (FIDO2 passkeys, Windows Hello, certificate-based) — bound to the legit domain, defeats AiTM.",
            "<strong>Token protection</strong> / continuous access evaluation and Conditional Access requiring a compliant device.",
            "Authenticator <strong>number matching</strong> to kill push-fatigue; <strong>block legacy auth</strong>; use sign-in <strong>risk</strong> policies."
          ]}
        ]
      },
      {
        q: "PIM — what problem does it solve, and what's the difference between eligible and active assignments?",
        level: "Core",
        a: [
          { type: "p", html: "Privileged Identity Management gives <strong>just-in-time, time-bound</strong> privileged access instead of standing admin rights. An <strong>active</strong> assignment means the role is on now; an <strong>eligible</strong> assignment means the person can <em>activate</em> it when needed — often with MFA, justification, and approval — for a limited window. This shrinks the standing attack surface and creates an audit trail. (Needs Entra ID P2.)" }
        ]
      },
      {
        q: "Service principal vs. managed identity vs. app registration — untangle these.",
        level: "Advanced",
        a: [
          { type: "list", items: [
            "<strong>App registration</strong> = the global <em>definition</em> of an application (its identity blueprint) in your tenant.",
            "<strong>Service principal</strong> = the local <em>instance</em> of that app in a tenant — what actually gets permissions and signs in.",
            "<strong>Managed identity</strong> = a special service principal that Azure creates and manages for a resource (VM, Function) so you use <strong>no secrets in code</strong>. System-assigned (tied to one resource) or user-assigned (shared)."
          ]},
          { type: "callout", variant: "interview", html: "<p>One-liner: “A managed identity is a service principal that Azure manages the credentials for, so I never store secrets.” That sentence alone scores points.</p>" }
        ]
      },
      {
        q: "What is consent phishing (illicit consent grant) and how do you stop it?",
        level: "Advanced",
        a: [
          { type: "p", html: "Instead of stealing a password, the attacker tricks a user into <strong>consenting</strong> to a malicious OAuth app that requests permissions (e.g., read all mail). The user clicks “Accept,” and the app gets a token — which keeps working even after a password reset and isn't stopped by MFA. Defenses: restrict user consent to <strong>verified publishers / low-risk permissions</strong>, enable the <strong>admin consent workflow</strong>, and review enterprise apps / risky OAuth grants (Defender for Cloud Apps)." }
        ]
      }
    ]
  },

  /* ============================================================= */
  {
    category: "Azure & Cloud Security",
    icon: "☁️",
    blurb: "Cloud fundamentals every security role now expects.",
    items: [
      {
        q: "Explain the shared responsibility model.",
        level: "Fundamentals",
        a: [
          { type: "p", html: "Security is split between Microsoft (the cloud) and you (your data). The line moves by service model: in <strong>IaaS</strong> you secure the OS, apps, and data; in <strong>PaaS</strong> Microsoft handles the OS/runtime and you secure the app config and data; in <strong>SaaS</strong> Microsoft runs almost everything but <em>you always own identity, access, and data classification</em>. The constant across all models: <strong>you are always responsible for identities and data</strong>." }
        ]
      },
      {
        q: "Azure RBAC vs. Entra ID roles — what's the difference?",
        level: "Core",
        a: [
          { type: "p", html: "<strong>Azure RBAC</strong> controls access to <em>Azure resources</em> (VMs, storage, networks) at management-group/subscription/RG/resource scope — roles like Owner, Contributor, Reader. <strong>Entra ID roles</strong> control access to <em>identity/tenant features</em> (managing users, Conditional Access, etc.) — roles like Global Administrator. Two different planes: resource control vs. identity control. A classic gotcha: <strong>Contributor can manage resources but cannot grant access</strong> (that needs Owner or User Access Administrator)." }
        ]
      },
      {
        q: "How does a Network Security Group (NSG) work?",
        level: "Core",
        a: [
          { type: "p", html: "An NSG is a <strong>stateful</strong> firewall of allow/deny rules evaluated by <strong>priority</strong> (lowest number first; first match wins). Each rule is a 5-tuple: source, source port, destination, destination port, protocol. Stateful means a permitted inbound flow's return traffic is automatically allowed. There are default rules (e.g., allow VNet-in, deny all inbound) you can't delete but can override. For L7/FQDN filtering you step up to <strong>Azure Firewall</strong>." }
        ]
      },
      {
        q: "What are the risks of SAS tokens, and how do you reduce them?",
        level: "Advanced",
        a: [
          { type: "p", html: "A <strong>Shared Access Signature</strong> grants scoped, time-limited access to storage without sharing the account key — but if a SAS URL leaks, anyone with it has access until it expires, and you can't easily revoke a single one. Mitigate with <strong>short expiry</strong>, least-privilege scope, IP restrictions, <strong>user-delegation SAS</strong> (tied to Entra identity), and preferring <strong>Entra-based auth + RBAC</strong> over account keys. Also disable anonymous/public blob access." }
        ]
      }
    ]
  },

  /* ============================================================= */
  {
    category: "Microsoft 365 & Email Security",
    icon: "📧",
    blurb: "Email is still the #1 initial-access vector — expect these.",
    items: [
      {
        q: "Explain SPF, DKIM, and DMARC and how they work together.",
        level: "Core",
        a: [
          { type: "list", items: [
            "<strong>SPF</strong> — a DNS record listing which IPs may send mail for your domain (checks the envelope sender).",
            "<strong>DKIM</strong> — a cryptographic signature added to the message headers, verified against a public key in DNS (proves integrity + that the domain authorized it).",
            "<strong>DMARC</strong> — ties SPF/DKIM to the visible <strong>From</strong> address (alignment), tells receivers what to do on failure (<code>p=none/quarantine/reject</code>), and provides reporting."
          ]},
          { type: "p", html: "You need all three: SPF and DKIM authenticate, and <strong>DMARC enforces alignment</strong> so an attacker can't pass SPF on their own domain while spoofing yours in the From line. Target <code>p=reject</code>." }
        ]
      },
      {
        q: "Walk me through a Business Email Compromise (BEC) and how you'd detect and respond.",
        level: "Scenario",
        a: [
          { type: "p", html: "<strong>Chain:</strong> attacker phishes credentials (often via AiTM, bypassing MFA) → signs in to the mailbox → creates a <strong>hidden inbox rule</strong> to auto-forward/delete replies → impersonates the user to redirect an invoice payment. No malware required." },
          { type: "list", items: [
            "<strong>Detect</strong>: risky sign-in / impossible travel (Identity Protection), <strong>new-inbox-rule</strong> events and mail-forwarding in the <strong>Unified Audit Log</strong>, unusual sent items.",
            "<strong>Respond</strong>: revoke sessions + reset password, require MFA, <strong>remove the malicious inbox rules</strong>, check for added app consents, notify finance, and hunt for other affected mailboxes."
          ]}
        ]
      },
      {
        q: "What is the Unified Audit Log and why does it matter for IR?",
        level: "Core",
        a: [
          { type: "p", html: "It's the centralized record of activity across M365 (Exchange, SharePoint, Teams, Entra, admin actions). In almost any M365 investigation it's the <strong>first thing you pull</strong> — who signed in from where, who created inbox rules, who shared a file, who changed a role. Make sure auditing is on <em>before</em> an incident; you can't retroactively log what wasn't captured." }
        ]
      },
      {
        q: "How does Safe Links protect users?",
        level: "Fundamentals",
        a: [
          { type: "p", html: "Safe Links (Defender for Office 365) rewrites URLs in mail/Teams/Office and checks reputation <strong>at time of click</strong>, not just at delivery. That defeats <em>delayed weaponization</em>, where a link is clean when the email arrives and turns malicious later. Pair it with <strong>Safe Attachments</strong>, which detonates attachments in a sandbox before delivery." }
        ]
      }
    ]
  },

  /* ============================================================= */
  {
    category: "Intune & Endpoint Management",
    icon: "📱",
    blurb: "The compliance-to-Conditional-Access loop is the money question here.",
    items: [
      {
        q: "MDM vs. MAM — and how do you protect company data on an employee's personal phone without managing the whole device?",
        level: "Core",
        a: [
          { type: "p", html: "<strong>MDM</strong> manages the whole <em>device</em> (enrollment, config, wipe). <strong>MAM</strong> manages the <em>app and its data</em>. For BYOD you use <strong>App Protection Policies</strong> (MAM without enrollment): corporate data inside managed apps is encrypted and containerized, copy/paste to personal apps is blocked, a PIN is required, and you can <strong>selectively wipe just the corporate data</strong> — never touching the user's personal photos. That's the privacy-friendly BYOD answer interviewers want." }
        ]
      },
      {
        q: "Explain how Intune compliance and Conditional Access work together.",
        level: "Advanced",
        a: [
          { type: "p", html: "It's the core Zero Trust device control. Intune <strong>compliance policies</strong> define a healthy device (encrypted, AV on, min OS, low Defender risk). Intune marks each device compliant or not, and writes that state to the device's Entra ID record. Entra <strong>Conditional Access</strong> then requires “compliant device” to access corporate apps — so a non-compliant or unmanaged device is blocked automatically. Compliance is the signal; Conditional Access is the gate." }
        ]
      },
      {
        q: "What is Windows Autopilot?",
        level: "Fundamentals",
        a: [
          { type: "p", html: "Zero-touch provisioning. A device ships from the OEM, the user signs in with their work account, and Autopilot joins it to Entra ID, enrolls it in Intune, and applies policies/apps automatically — no manual imaging. It turns “IT images every laptop” into “the user unboxes and signs in,” which is huge for remote workforces." }
        ]
      },
      {
        q: "Selective wipe vs. full wipe?",
        level: "Fundamentals",
        a: [
          { type: "p", html: "<strong>Retire / selective wipe</strong> removes only corporate data, apps, and policies, leaving personal data intact — used for BYOD or offboarding. <strong>Wipe</strong> is a full factory reset of the whole device — used for corporate-owned or lost/stolen devices. Choosing correctly is both a security and a privacy/legal decision." }
        ]
      }
    ]
  },

  /* ============================================================= */
  {
    category: "PowerShell",
    icon: "⚡",
    blurb: "Automation skill plus the security angle (logging, AMSI) that SOCs probe.",
    items: [
      {
        q: "What makes the PowerShell pipeline different from a Unix/bash pipeline?",
        level: "Core",
        a: [
          { type: "p", html: "PowerShell passes <strong>.NET objects</strong> down the pipeline, not text. So <code>Get-Process | Where-Object CPU -gt 100 | Sort-Object CPU</code> works on real properties — no fragile text parsing with awk/sed. <code>Get-Member</code> shows an object's properties and methods. This object model is why PowerShell is so powerful for administration and why <code>Select-Object</code>/<code>Where-Object</code> are reliable." }
        ]
      },
      {
        q: "Is PowerShell Execution Policy a security control?",
        level: "Core",
        a: [
          { type: "p", html: "No — and saying so is a green flag. Execution Policy is a <strong>safety feature to prevent accidental script execution</strong>, not a security boundary. It's trivially bypassed (<code>-ExecutionPolicy Bypass</code>, piping to <code>powershell -</code>, reading and IEX-ing a file). Real controls are <strong>Constrained Language Mode</strong>, <strong>WDAC/App Control</strong>, code signing, AMSI, and logging." }
        ]
      },
      {
        q: "What is AMSI, and what logging catches malicious PowerShell?",
        level: "Advanced",
        a: [
          { type: "p", html: "<strong>AMSI</strong> (Antimalware Scan Interface) lets PowerShell, Office macros, etc. submit content — <em>including de-obfuscated, in-memory scripts</em> — to the AV engine for inspection, defeating simple obfuscation. For detection, enable <strong>Script Block Logging (Event ID 4104)</strong>, which records the actual (deobfuscated) script blocks executed, plus <strong>Module Logging</strong> and <strong>Transcription</strong>. A <code>-EncodedCommand</code> with a long Base64 blob, or an <code>IEX (New-Object Net.WebClient).DownloadString(...)</code> cradle, are classic things 4104 surfaces." }
        ]
      }
    ]
  },

  /* ============================================================= */
  {
    category: "Security Operations (Defender XDR & Sentinel)",
    icon: "🛰️",
    blurb: "SOC-analyst staples: terminology, the Microsoft stack, and KQL.",
    items: [
      {
        q: "SIEM vs. SOAR vs. EDR vs. XDR — define each.",
        level: "Core",
        a: [
          { type: "list", items: [
            "<strong>SIEM</strong> — collects and correlates logs from everywhere for detection &amp; investigation (e.g., <strong>Microsoft Sentinel</strong>).",
            "<strong>SOAR</strong> — automates response with playbooks (Sentinel's Logic-App playbooks).",
            "<strong>EDR</strong> — deep detection/response on <em>endpoints</em> (Defender for Endpoint).",
            "<strong>XDR</strong> — <em>extends</em> detection across endpoint, identity, email, and cloud and correlates them into one incident (<strong>Microsoft Defender XDR</strong>)."
          ]}
        ]
      },
      {
        q: "What is MITRE ATT&CK and how do you use it?",
        level: "Core",
        a: [
          { type: "p", html: "A public knowledge base of adversary <strong>tactics</strong> (the “why” — e.g., Persistence, Lateral Movement) and <strong>techniques</strong> (the “how” — e.g., T1003 Credential Dumping). SOCs use it as a common language to map detections, find coverage gaps, and describe incidents. In an interview, mapping an attack step to a tactic (“that's defense evasion via disabling AV”) shows real fluency." }
        ]
      },
      {
        q: "What are the four Microsoft Defender workloads, and what does each cover?",
        level: "Core",
        a: [
          { type: "table", headers: ["Workload", "Protects"], rows: [
            ["<strong>Defender for Endpoint</strong>", "Devices — EDR, next-gen AV, vuln management"],
            ["<strong>Defender for Office 365</strong>", "Email &amp; collaboration — Safe Links/Attachments, anti-phish"],
            ["<strong>Defender for Identity</strong>", "On-prem AD — Kerberoasting, DCSync, lateral movement"],
            ["<strong>Defender for Cloud Apps</strong>", "SaaS apps — CASB, shadow IT, OAuth abuse"]
          ]},
          { type: "p", html: "<strong>Defender XDR</strong> correlates alerts from all four into a single incident." }
        ]
      },
      {
        q: "Write a quick KQL query to find failed sign-ins by user in the last 24 hours.",
        level: "Advanced",
        a: [
          { type: "code", lang: "kql", caption: "Top failed sign-ins (password spray hunting)", code: [
            "SigninLogs",
            "| where TimeGenerated > ago(24h)",
            "| where ResultType == 50126",
            "| summarize FailedCount = count() by UserPrincipalName, IPAddress",
            "| sort by FailedCount desc"
          ]},
          { type: "p", html: "The shape to remember: <strong>table → where (filter) → summarize (aggregate) by → sort</strong>. Mention you'd then pivot for failures-followed-by-a-success from the same IP (spray success)." }
        ]
      },
      {
        q: "Alert vs. incident — and what's the analyst workflow?",
        level: "Fundamentals",
        a: [
          { type: "p", html: "An <strong>alert</strong> is a single detection; an <strong>incident</strong> is a group of related alerts stitched into one story (Defender XDR/Sentinel do this correlation). Workflow: <strong>triage</strong> (is it real / how bad), <strong>investigate</strong> (scope, timeline, KQL hunting), <strong>contain &amp; respond</strong> (isolate device, disable user — often automated by a playbook), <strong>recover</strong>, then <strong>lessons learned</strong>. Maps to the NIST IR lifecycle." }
        ]
      }
    ]
  },

  /* ============================================================= */
  {
    category: "Zero Trust, Frameworks & Scenarios",
    icon: "🔐",
    blurb: "The synthesis questions — show you can think like an architect and a responder.",
    items: [
      {
        q: "Define Zero Trust and its guiding principles.",
        level: "Core",
        a: [
          { type: "p", html: "Zero Trust means <strong>never trust, always verify</strong> — no implicit trust from network location. Three principles:" },
          { type: "list", items: [
            "<strong>Verify explicitly</strong> — authenticate &amp; authorize on all signals (identity, device, location, risk).",
            "<strong>Use least-privilege access</strong> — just-in-time / just-enough (PIM, JEA), risk-based.",
            "<strong>Assume breach</strong> — segment, encrypt, monitor, and minimize blast radius."
          ]},
          { type: "p", html: "Microsoft's pillars: identities, endpoints, apps, data, infrastructure, networks — with identity as the primary control plane." }
        ]
      },
      {
        q: "“Identity is the new perimeter.” What does that mean and how do you defend it?",
        level: "Advanced",
        a: [
          { type: "p", html: "With cloud and remote work, the network edge no longer contains your assets — every access decision turns on <em>identity</em>. So you harden identity as the perimeter: <strong>MFA everywhere</strong> (phishing-resistant for admins), <strong>Conditional Access</strong> requiring compliant devices, <strong>PIM</strong> for just-in-time privilege, <strong>Identity Protection</strong> for risk-based blocking, and continuous monitoring of sign-ins. The Entra + Intune + Defender stack <em>is</em> the perimeter." }
        ]
      },
      {
        q: "Scenario: you're handed a brand-new Microsoft 365 tenant. What are your top hardening steps?",
        level: "Scenario",
        a: [
          { type: "steps", items: [
            "Enforce <strong>MFA for everyone</strong>; phishing-resistant MFA + <strong>PIM</strong> for admins; create break-glass accounts.",
            "<strong>Block legacy authentication</strong> via Conditional Access.",
            "Require <strong>compliant/managed devices</strong> (Intune) for corporate access.",
            "Restrict <strong>user app consent</strong>; enable the admin consent workflow.",
            "Set up email auth: <strong>SPF, DKIM, DMARC</strong> (aim p=reject) + Defender for Office 365 (Safe Links/Attachments).",
            "Turn on the <strong>Unified Audit Log</strong> and connect signals to <strong>Defender XDR / Sentinel</strong>.",
            "Apply least privilege on roles; review with <strong>access reviews</strong>; track <strong>Secure Score</strong>."
          ]}
        ]
      },
      {
        q: "Scenario: ransomware is detected encrypting files on several endpoints. First moves?",
        level: "Scenario",
        a: [
          { type: "list", items: [
            "<strong>Contain</strong> immediately — isolate affected devices (Defender for Endpoint network isolation), disable compromised accounts, revoke sessions.",
            "<strong>Preserve evidence</strong> for forensics before wiping.",
            "Identify <strong>patient zero</strong> and the spread path (lateral movement, which creds were used) via Defender/Sentinel hunting.",
            "<strong>Eradicate</strong>: remove persistence, reset affected credentials (incl. krbtgt if AD is involved), patch the entry point.",
            "<strong>Recover</strong> from known-good, <strong>immutable/offline backups</strong>; validate clean before reconnecting.",
            "<strong>Post-incident</strong>: lessons learned, close the gap (ASR rules, MFA, backups, segmentation)."
          ]},
          { type: "callout", variant: "interview", html: "<p>This is the <strong>NIST IR lifecycle</strong>: Preparation → Detection &amp; Analysis → Containment, Eradication &amp; Recovery → Post-Incident. Naming it frames you as someone who works to a process under pressure.</p>" }
        ]
      },
      {
        q: "Name a security framework and how Microsoft tooling maps to it.",
        level: "Core",
        a: [
          { type: "p", html: "Pick one you can speak to. <strong>NIST CSF</strong> organizes security into Identify, Protect, Detect, Respond, Recover — Microsoft maps neatly: Identify (Defender for Cloud inventory, Purview data classification), Protect (Entra CA/MFA, Intune, BitLocker), Detect (Defender XDR, Sentinel), Respond (Sentinel playbooks, automated investigation), Recover (backups, Autopilot reset). Others worth naming: <strong>CIS Benchmarks</strong> (hardening baselines), <strong>ISO/IEC 27001</strong> (ISMS), and regulations like GDPR/HIPAA/PCI-DSS." }
        ]
      }
    ]
  }
];
