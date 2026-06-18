/* Module 5 — Microsoft 365 & Collaboration Security
   Same conventions as mod-01.js (the gold-standard template):
   - JS strings use DOUBLE quotes "..."; HTML attributes inside use SINGLE quotes '...'.
   - Code blocks are arrays of lines; backslashes are DOUBLED.
   - No backticks, no template literals. */
window.COURSE.modules.push({
  id: "mod-05",
  number: 5,
  icon: "📧",
  title: "Microsoft 365 & Collaboration Security",
  tagline: "Exchange, SharePoint, Teams — plus the email defenses (SPF/DKIM/DMARC, Defender for Office 365), Purview DLP, and the audit log that breaks BEC cases.",
  estMinutes: 90,
  objectives: [
    "Explain <strong>SPF, DKIM, and DMARC</strong> and how alignment actually stops spoofing.",
    "Describe how <strong>Defender for Office 365</strong> (Safe Links, Safe Attachments, anti-phish) protects users.",
    "Use Microsoft <strong>Purview</strong> sensitivity labels and DLP to protect data, and tell labels apart from retention.",
    "Investigate a <strong>Business Email Compromise</strong> using the Unified Audit Log, and respond correctly.",
    "Harden M365 identity (MFA, block legacy auth, Conditional Access) and track Secure Score."
  ],
  lessons: [
    /* ---------------------------------------------------------------- */
    {
      id: "5-1",
      title: "What Microsoft 365 actually is",
      subtitle: "The bundle, the licensing, and where identity comes from",
      blocks: [
        { type: "p", html: "Let me clear up a confusion I see in almost every junior interview. People say &quot;Microsoft 365&quot; and &quot;Office 365&quot; and &quot;Azure&quot; as if they're interchangeable. They are not. <strong>Microsoft 365 (M365)</strong> is a <em>bundle</em> of cloud services your organisation rents per-user, per-month. The productivity apps are only part of it — the security and compliance tooling that wraps them is what you, as a security engineer, will live in." },
        { type: "callout", variant: "analogy", html: "<p>Think of M365 as a <strong>serviced office building you lease floor-by-floor</strong>. Exchange is the mailroom, SharePoint is the shared filing cabinets, OneDrive is each employee's personal locker, and Teams is the open-plan meeting space. <strong>Entra ID</strong> is the front-desk security that issues everyone's keycard, and <strong>Purview</strong> is the records-and-compliance department in the basement. You're not buying the building — you're renting managed space and you must configure the locks yourself.</p>" },
        { type: "h", text: "The core workloads" },
        { type: "kv", items: [
          { k: "Exchange Online", v: "Cloud email &amp; calendaring. The #1 attack surface in M365 — phishing lands here, and Business Email Compromise (BEC) lives here." },
          { k: "SharePoint Online", v: "Document libraries, intranet sites, and team file storage. The data lake of the org." },
          { k: "OneDrive for Business", v: "Each user's personal cloud storage (backed by SharePoint under the hood). Where leavers' files and sync conflicts hide." },
          { k: "Microsoft Teams", v: "Chat, meetings, calls. Built ON TOP of Exchange (calendar), SharePoint (files), and Entra (identity) — not a standalone product." },
          { k: "Security &amp; compliance", v: "Defender for Office 365, Microsoft Purview, and Entra ID — the parts that keep all of the above from leaking or getting owned." }
        ]},
        { type: "callout", variant: "warn", title: "M365 sits ON TOP of Entra ID", html: "<p>This is the single most important architectural fact in this module. <strong>Every M365 sign-in is an Entra ID authentication</strong> (Module 4). When a user logs into Outlook on the web, they're authenticating to Entra ID, which then issues a token for Exchange Online. So Conditional Access, MFA, risky sign-in detection — all the identity controls you learned in Module 4 — are how you actually protect M365. Email security and identity security are the same fight.</p>" },
        { type: "h", text: "Licensing tiers — and what E5 unlocks" },
        { type: "p", html: "You will be asked &quot;what's the difference between E3 and E5?&quot; in interviews because it's really a question about whether you know which security features cost extra. Memorise the shape of this table." },
        { type: "table", headers: ["Tier", "Who it's for", "Security &amp; compliance you get"], rows: [
          ["<strong>Business Premium</strong>", "Small/medium orgs (&le;300 seats)", "Defender for Office 365 <strong>Plan 1</strong>, Entra ID P1 (Conditional Access), Intune, basic DLP — a lot of value for the price"],
          ["<strong>E3</strong>", "Enterprise baseline", "EOP, sensitivity labels, manual DLP, Entra ID <strong>P1</strong> — but <em>no</em> Defender for Office 365, <em>no</em> advanced Purview"],
          ["<strong>E5</strong>", "Enterprise, security-serious", "Adds Defender for Office 365 <strong>Plan 2</strong>, full <strong>Microsoft Purview</strong> (auto-labelling, Insider Risk, Communication Compliance, advanced eDiscovery), and <strong>Entra ID P2</strong> (Identity Protection, PIM)"]
        ]},
        { type: "p", html: "The one-line mental model: <strong>E3 gives you the data; E5 gives you the protection and the investigation tooling</strong>. Auto-labelling, Threat Explorer, Insider Risk Management, PIM, and Identity Protection are all E5 (or add-on) features. When a client says &quot;we have E3 and we want Threat Explorer,&quot; you already know the answer is a licence upgrade or an add-on." },
        { type: "code", lang: "powershell", caption: "Connect to M365 with Microsoft Graph PowerShell and check licences", code: [
          "# Install once (the modern, supported module set)",
          "Install-Module Microsoft.Graph -Scope CurrentUser",
          "Install-Module ExchangeOnlineManagement -Scope CurrentUser",
          "",
          "# Connect to Microsoft Graph with the scopes you need",
          "Connect-MgGraph -Scopes 'User.Read.All','Organization.Read.All'",
          "",
          "# What SKUs (licences) does the tenant own?",
          "Get-MgSubscribedSku | Select-Object SkuPartNumber, ConsumedUnits,",
          "  @{n='Total';e={$_.PrepaidUnits.Enabled}}",
          "",
          "# Which users are NOT licensed (often service/stale accounts)?",
          "Get-MgUser -All -Property DisplayName,AssignedLicenses |",
          "  Where-Object { $_.AssignedLicenses.Count -eq 0 } |",
          "  Select-Object DisplayName"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;What's the difference between Microsoft 365 E3 and E5 from a security standpoint?&quot;</strong> The clean answer: &quot;E3 is the productivity and data baseline with Entra ID P1 and Exchange Online Protection. E5 layers on the <em>active defence and investigation stack</em> — Defender for Office 365 Plan 2 (Safe Links/Attachments, Threat Explorer, AIR, attack simulation), the full Purview compliance suite, and Entra ID P2 (Identity Protection and Privileged Identity Management). If a feature is about detecting, investigating, or auto-classifying, it's almost certainly E5.&quot;</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "5-2",
      title: "Email security fundamentals: SPF, DKIM, DMARC",
      subtitle: "The three DNS records that stop spoofing",
      blocks: [
        { type: "p", html: "If you remember one lesson from this module for your interview, make it this one. <strong>SPF, DKIM, and DMARC</strong> are the holy trinity of email authentication, and every interviewer asks about them because they reveal instantly whether you understand how email is actually trusted. Email was designed in the 1980s with <em>zero</em> authentication — anyone can claim to be anyone. These three records bolt trust on after the fact." },
        { type: "h", text: "SPF — Sender Policy Framework" },
        { type: "p", html: "SPF is a <strong>DNS TXT record</strong> that lists which mail servers (IP addresses) are <em>authorised to send email for your domain</em>. When a receiving server gets mail claiming to be from <code>contoso.com</code>, it looks up <code>contoso.com</code>'s SPF record and checks: did this actually come from one of the listed IPs? SPF authenticates the <strong>envelope sender</strong> (the &quot;MAIL FROM&quot;, also called Return-Path) — <em>not</em> the From you see in Outlook." },
        { type: "code", lang: "dns", caption: "An SPF record (a DNS TXT record on the domain root)", code: [
          "; contoso.com  TXT",
          "\"v=spf1 include:spf.protection.outlook.com ip4:203.0.113.10 -all\"",
          "",
          "; v=spf1                         -> this is an SPF v1 record",
          "; include:spf.protection...      -> Microsoft 365 is allowed to send",
          "; ip4:203.0.113.10               -> this specific server is allowed",
          "; -all  (hard fail)              -> everything else FAILS / reject",
          "; ~all  (soft fail)              -> everything else is suspicious but accept"
        ]},
        { type: "h", text: "DKIM — DomainKeys Identified Mail" },
        { type: "p", html: "DKIM adds a <strong>cryptographic signature</strong> to the message headers. The sending server signs selected headers (and a hash of the body) with a <em>private key</em>; the matching <em>public key</em> is published in DNS. The receiver fetches the public key, verifies the signature, and now knows two things: the mail genuinely came from that domain, and it <strong>wasn't altered in transit</strong>. SPF says &quot;the right server sent it&quot;; DKIM says &quot;the content is authentic and untampered.&quot;" },
        { type: "h", text: "DMARC — the policy that ties it together" },
        { type: "p", html: "Here's the gap SPF and DKIM leave: both authenticate a domain the <em>user never sees</em> (the envelope sender for SPF, the signing <code>d=</code> domain for DKIM). A phisher can pass SPF/DKIM for <code>attacker.com</code> while the <strong>visible From</strong> still reads <code>ceo@contoso.com</code>. <strong>DMARC</strong> closes this. It requires <strong>alignment</strong>: the SPF or DKIM domain must match the visible <code>From:</code> domain. If neither aligns, DMARC fails and applies your published <strong>policy</strong>." },
        { type: "table", headers: ["DMARC policy (p=)", "What the receiver does", "Maturity"], rows: [
          ["<code>p=none</code>", "Take no action — just <strong>report</strong>. Used to gather data before enforcing", "Monitoring only (do not stop here forever)"],
          ["<code>p=quarantine</code>", "Send failing mail to <strong>Junk/quarantine</strong>", "Partial enforcement"],
          ["<code>p=reject</code>", "<strong>Reject</strong> the message outright — it never reaches the user", "Full enforcement — the goal"]
        ]},
        { type: "callout", variant: "tip", html: "<p>DMARC also produces <strong>aggregate (RUA) and forensic (RUF) reports</strong> — XML feeds telling you who is sending mail as your domain. The correct rollout is <strong>p=none with reporting</strong> first, analyse for a few weeks to find your legitimate senders, fix their SPF/DKIM, then ratchet up to <code>quarantine</code> and finally <code>reject</code>. Jumping straight to reject without monitoring is how you accidentally block your own payroll system.</p>" },
        { type: "code", lang: "dns", caption: "DMARC record (a TXT record on the _dmarc subdomain)", code: [
          "; _dmarc.contoso.com  TXT",
          "\"v=DMARC1; p=reject; rua=mailto:dmarc@contoso.com; adkim=s; aspf=s; pct=100\"",
          "",
          "; p=reject       -> enforce: drop unaligned/failing mail",
          "; rua=mailto:... -> send aggregate reports here",
          "; adkim=s/aspf=s -> strict alignment (domain must match exactly)",
          "; pct=100        -> apply policy to 100% of mail"
        ]},
        { type: "h", text: "EOP — Exchange Online Protection, the baseline" },
        { type: "p", html: "Underneath all of this, every M365 mailbox is fronted by <strong>Exchange Online Protection (EOP)</strong> — the always-on anti-spam, anti-malware, and connection-filtering layer included with <em>any</em> Exchange Online plan (you don't need E5 for EOP). EOP evaluates SPF/DKIM/DMARC, runs anti-spam/anti-malware, and enforces <strong>connectors</strong> (rules for how mail flows to/from partner servers) and <strong>mail flow rules</strong> (also called transport rules — &quot;if subject contains X, do Y&quot;)." },
        { type: "code", lang: "powershell", caption: "Inspect mail authentication and transport rules in Exchange Online", code: [
          "Connect-ExchangeOnline",
          "",
          "# Is DKIM signing enabled and configured for each domain?",
          "Get-DkimSigningConfig | Select-Object Domain, Enabled, Status",
          "",
          "# Review mail flow (transport) rules - attackers/insiders abuse these",
          "Get-TransportRule | Select-Object Name, State, Priority, Description",
          "",
          "# Review inbound/outbound connectors (rogue connectors = mail hijack)",
          "Get-InboundConnector  | Select-Object Name, Enabled, SenderDomains",
          "Get-OutboundConnector | Select-Object Name, Enabled, RecipientDomains"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;Explain SPF vs DKIM vs DMARC — and which one ties them together?&quot;</strong> The answer that gets the nod: &quot;<strong>SPF</strong> publishes which IPs may send for the domain and authenticates the envelope sender. <strong>DKIM</strong> cryptographically signs the message so you know the content is authentic and untampered. But both check a domain the user can't see, so a spoofer can still forge the visible From. <strong>DMARC</strong> ties them together by requiring <em>alignment</em> between the SPF/DKIM domain and the visible From, and it adds a <em>policy</em> (none/quarantine/reject) plus reporting. You need all three: SPF and DKIM do the authentication, DMARC enforces it against the address the human actually reads.&quot;</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "5-3",
      title: "Microsoft Defender for Office 365 (MDO)",
      subtitle: "Safe Links, Safe Attachments, anti-phishing & AIR",
      blocks: [
        { type: "p", html: "EOP and the SPF/DKIM/DMARC trinity stop the bulk spam and obvious spoofing. <strong>Microsoft Defender for Office 365 (MDO)</strong> is the layer that handles the <em>targeted</em>, weaponised stuff: malicious links, sandbox-detonated attachments, and sophisticated impersonation. Note the rename — what people used to call &quot;Microsoft 365 Defender&quot; is now <strong>Microsoft Defender XDR</strong> (covered in depth in Module 8). MDO is the email-and-collaboration component that feeds into it." },
        { type: "h", text: "The four pillars of MDO" },
        { type: "kv", items: [
          { k: "Safe Links", v: "<strong>Time-of-click</strong> URL protection. Links in mail (and Teams/Office docs) are rewritten to a Microsoft proxy. When the user <em>clicks</em>, the URL is re-checked and detonated in real time — so a link that was clean at delivery but weaponised an hour later is still blocked." },
          { k: "Safe Attachments", v: "Attachments are <strong>detonated in a sandbox</strong> (a real VM) before delivery. If the file behaves maliciously when opened, it's blocked. This catches zero-day malware that signature AV misses." },
          { k: "Anti-phishing", v: "<strong>User &amp; domain impersonation</strong> protection (catches &quot;ceo@contos0.com&quot; lookalikes), <strong>spoof intelligence</strong>, and <strong>mailbox intelligence</strong> that learns each user's normal contacts to flag unusual senders." },
          { k: "Investigation &amp; response", v: "<strong>Threat Explorer</strong> (hunt across all mail), <strong>Automated Investigation &amp; Response (AIR)</strong> (auto-triages alerts and suggests/takes remediation), and <strong>Attack Simulation Training</strong> (run safe phishing campaigns against your own staff)." }
        ]},
        { type: "callout", variant: "analogy", html: "<p><strong>Safe Links is a bouncer who re-checks your ID every single time you re-enter the club</strong>, not just once at the door. The link could have been fine when the email arrived, but if the attacker flips the destination to malware later, the re-check at click-time catches it. That &quot;time-of-click&quot; re-evaluation is the whole point — and the exact phrase interviewers want to hear.</p>" },
        { type: "h", text: "Plan 1 vs Plan 2 — know the line" },
        { type: "table", headers: ["Capability", "MDO Plan 1", "MDO Plan 2"], rows: [
          ["Safe Links &amp; Safe Attachments", "Yes", "Yes"],
          ["Anti-phishing (impersonation)", "Yes", "Yes"],
          ["<strong>Threat Explorer</strong> &amp; advanced hunting", "Real-time detections (lite)", "<strong>Full Threat Explorer</strong>"],
          ["<strong>Automated Investigation &amp; Response (AIR)</strong>", "No", "<strong>Yes</strong>"],
          ["<strong>Attack Simulation Training</strong>", "No", "<strong>Yes</strong>"],
          ["Comes with", "Business Premium", "<strong>E5</strong> (or add-on)"]
        ]},
        { type: "p", html: "The shortcut to remember: <strong>Plan 1 is prevention; Plan 2 adds investigation, automation, and simulation</strong>. If the feature is about <em>hunting, auto-remediation, or training your users</em>, it's Plan 2 / E5." },
        { type: "code", lang: "powershell", caption: "Review Safe Links and Safe Attachments policies", code: [
          "Connect-ExchangeOnline",
          "",
          "# Safe Attachments policies (the sandbox-detonation rules)",
          "Get-SafeAttachmentPolicy |",
          "  Select-Object Name, Enable, Action, Redirect",
          "",
          "# Safe Links policies - confirm click-time scanning is ON",
          "Get-SafeLinksPolicy |",
          "  Select-Object Name, EnableSafeLinksForEmail, ScanUrls,",
          "    EnableForInternalSenders, DeliverMessageAfterScan",
          "",
          "# Anti-phishing: is impersonation protection configured?",
          "Get-AntiPhishPolicy |",
          "  Select-Object Name, EnableMailboxIntelligence,",
          "    EnableTargetedUserProtection, PhishThresholdLevel"
        ]},
        { type: "callout", variant: "tip", title: "Preset security policies", html: "<p>Don't hand-build every policy. Microsoft ships <strong>Standard</strong> and <strong>Strict</strong> preset security policies that turn on EOP + MDO best practices in one click, and they auto-update as Microsoft tightens defaults. For most orgs, &quot;apply the Strict preset to your high-risk users (execs, finance) and Standard to everyone else&quot; is a great, defensible answer.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;How does Safe Links actually protect a user?&quot;</strong> &quot;Safe Links rewrites URLs in email, Teams, and Office documents to point at a Microsoft scanning proxy. The protection is <strong>time-of-click</strong>: when the user clicks, the original URL is re-evaluated and detonated in real time, so even a link that was clean at delivery but weaponised afterwards gets blocked. It defeats the classic trick of sending a benign URL through filters and then switching the destination to malware.&quot; Bonus: mention that Safe Links also covers internal mail and Teams, not just inbound.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "5-4",
      title: "SharePoint, OneDrive & Teams security",
      subtitle: "External sharing, guest access, and the oversharing trap",
      blocks: [
        { type: "p", html: "Email gets the headlines, but the quiet, slow-motion breach in M365 is <strong>data oversharing</strong> in SharePoint, OneDrive, and Teams. Nobody fires off an alert when a finance folder is shared with &quot;Anyone with the link.&quot; And with <strong>Copilot</strong> now surfacing content across the tenant, every over-permissioned file becomes something an employee can simply <em>ask</em> to see. This lesson is about controlling who can reach what." },
        { type: "h", text: "Sharing operates at two levels" },
        { type: "p", html: "External sharing is governed by a <strong>hierarchy</strong>: the <em>organisation-level</em> setting sets the ceiling, and each <em>site-level</em> setting can be equal or more restrictive — never more permissive. You cannot make one site more open than the tenant allows." },
        { type: "table", headers: ["Org-level sharing setting", "Meaning", "Risk"], rows: [
          ["<strong>Anyone</strong>", "Anonymous &quot;anyone with the link&quot; links — no sign-in", "<strong>Highest</strong> — links leak, forward, and never expire by default"],
          ["<strong>New and existing guests</strong>", "External people must authenticate (guest account in Entra)", "Moderate — auditable, revocable"],
          ["<strong>Existing guests only</strong>", "Only already-invited externals", "Low"],
          ["<strong>Only people in your organisation</strong>", "No external sharing at all", "Lowest — internal-only"]
        ]},
        { type: "h", text: "Sharing link types" },
        { type: "kv", items: [
          { k: "Anyone (anonymous)", v: "No sign-in required. Anyone holding the URL gets in. The most dangerous — disable org-wide unless you have a strong reason and set expiry." },
          { k: "People in your organisation", v: "Any authenticated internal user. Convenient, but means &quot;the whole company&quot; — still a form of oversharing for sensitive data." },
          { k: "Specific people", v: "Named individuals only; the link is useless to anyone else. <strong>The safe default</strong> — least privilege for sharing." }
        ]},
        { type: "callout", variant: "danger", title: "Copilot turns oversharing into instant exposure", html: "<p>Before Copilot, an over-permissioned file was a latent risk — someone had to <em>know it existed</em> to find it. Now an employee can ask Copilot &quot;what's our acquisition budget?&quot; and Copilot will happily summarise any document that user technically has permission to open — including that &quot;shared with everyone&quot; finance folder nobody remembered. <strong>Copilot respects existing permissions; it does not fix them.</strong> So bad permissions = bad answers leaking to the wrong people, at scale, conversationally. Remediating oversharing is now a prerequisite for safely deploying Copilot.</p>" },
        { type: "h", text: "Guest access in Teams & sensitivity labels on sites" },
        { type: "list", items: [
          "<strong>Guest access in Teams</strong> — external users can be added to a Team as guests. They're real Entra ID guest accounts (B2B), so they show in your directory and are governed by Conditional Access — but review them regularly, because guests linger long after a project ends.",
          "<strong>Sensitivity labels on containers</strong> — a label applied to a SharePoint site or Team can <em>enforce</em> settings: block external sharing, require a managed/compliant device, or set the privacy to private. The label becomes a guardrail the site owner can't override.",
          "<strong>Sensitivity labels on files</strong> — covered in the next lesson; these travel <em>with the file</em> even when it leaves M365."
        ]},
        { type: "code", lang: "powershell", caption: "Audit external sharing posture (SharePoint Online & Graph)", code: [
          "# SharePoint Online Management module",
          "Connect-SPOService -Url 'https://contoso-admin.sharepoint.com'",
          "",
          "# Tenant-wide sharing ceiling (ExternalUserAndGuestSharing is 'Anyone')",
          "Get-SPOTenant | Select-Object SharingCapability,",
          "  RequireAnonymousLinksExpireInDays, DefaultSharingLinkType",
          "",
          "# Per-site sharing - find sites that allow anonymous 'Anyone' links",
          "Get-SPOSite -Limit All |",
          "  Select-Object Url, SharingCapability |",
          "  Where-Object { $_.SharingCapability -eq 'ExternalUserAndGuestSharing' }",
          "",
          "# List external/guest users in the tenant (via Graph)",
          "Connect-MgGraph -Scopes 'User.Read.All'",
          "Get-MgUser -Filter \"userType eq 'Guest'\" -All |",
          "  Select-Object DisplayName, Mail, CreatedDateTime"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;What's the biggest data-security risk in SharePoint/OneDrive, and how does Copilot change it?&quot;</strong> &quot;Oversharing — content shared with &lsquo;Anyone with the link&rsquo; or &lsquo;everyone in the org&rsquo; that should be restricted. Historically it was latent because people had to know a file existed to find it. Copilot removes that friction: it respects but doesn't fix permissions, so it will surface any over-permissioned content a user can technically access, conversationally and at scale. The fix is least-privilege sharing (&lsquo;specific people&rsquo; as default), sensitivity labels that enforce container settings, link expiry, and access reviews — done <em>before</em> rolling out Copilot.&quot;</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "5-5",
      title: "Microsoft Purview: compliance & data protection",
      subtitle: "Sensitivity labels, DLP, retention, eDiscovery, Insider Risk",
      blocks: [
        { type: "p", html: "<strong>Microsoft Purview</strong> is the compliance and data-protection suite (formerly the &quot;Microsoft 365 compliance&quot; portal). Where Defender stops attackers getting <em>in</em>, Purview governs the data itself — classifying it, stopping it leaking <em>out</em>, keeping it for legal reasons, and watching for risky behaviour by insiders. The advanced pieces are E5 (or add-ons)." },
        { type: "h", text: "Sensitivity labels (Microsoft Information Protection / Purview Information Protection)" },
        { type: "p", html: "A <strong>sensitivity label</strong> classifies a document or email (e.g. <em>Public, General, Confidential, Highly Confidential</em>) and can <strong>enforce protection</strong>: encryption, access restrictions, watermarks, and headers/footers. The crucial property — <strong>the protection is embedded in the file and travels with it</strong>. Email a labelled-and-encrypted file to a personal Gmail and it's still encrypted; the recipient can't open it unless they're authorised. Labels persist outside M365." },
        { type: "h", text: "Data Loss Prevention (DLP)" },
        { type: "p", html: "<strong>DLP policies</strong> detect sensitive content (credit-card numbers, national IDs, health records — via built-in <em>sensitive info types</em> or by sensitivity label) and take action when someone tries to share it inappropriately. The power of M365 DLP is that <em>one policy spans many workloads</em>: <strong>Exchange (email), SharePoint, OneDrive, Teams chat/channels, and the endpoint</strong> (files copied to USB, printed, or uploaded to a browser)." },
        { type: "callout", variant: "lab", title: "A concrete DLP example", html: "<p>Policy: &quot;If a message or file contains <strong>2 or more credit-card numbers</strong> and is being shared with <strong>people outside the organisation</strong>, then <strong>block</strong> the share, show the user a policy tip explaining why, and send the compliance team an alert — with an option for the user to override with a business justification.&quot; That single rule, applied across Exchange + SharePoint + OneDrive + Teams + endpoint, is the canonical interview example. Notice the pattern: <em>condition (sensitive info) &rarr; scope (external) &rarr; action (block/notify/audit) &rarr; user education (policy tip).</em></p>" },
        { type: "h", text: "Retention vs. sensitivity — don't confuse them" },
        { type: "callout", variant: "warn", html: "<p>This is a favourite trap. A <strong>sensitivity label</strong> answers &quot;<em>how protected is this?</em>&quot; (classification + encryption, controls access). A <strong>retention label</strong> answers &quot;<em>how long do we keep this, and what happens at the end?</em>&quot; (lifecycle — retain for 7 years then delete, for legal/regulatory reasons). One is about <strong>confidentiality</strong>; the other is about <strong>lifecycle/records management</strong>. A file can carry both.</p>" },
        { type: "h", text: "The rest of the Purview stack" },
        { type: "kv", items: [
          { k: "Retention labels &amp; policies", v: "Keep content for a defined period and/or delete it after — for compliance, legal hold, and storage hygiene." },
          { k: "eDiscovery", v: "Search, hold, and export content across M365 for legal cases or investigations (Standard vs Premium; Premium adds advanced review &amp; analytics)." },
          { k: "Insider Risk Management", v: "Detects risky <em>internal</em> behaviour — e.g. a departing employee mass-downloading files or emailing data to a personal account." },
          { k: "Communication Compliance", v: "Scans Teams/Exchange messages for policy violations — harassment, regulatory breaches (e.g. finance trading rules), or data leakage in chat." }
        ]},
        { type: "code", lang: "powershell", caption: "Inspect labels and DLP via the Security & Compliance PowerShell", code: [
          "# Connect to Security & Compliance PowerShell (part of ExchangeOnlineManagement)",
          "Connect-IPPSSession",
          "",
          "# Sensitivity labels defined in the tenant",
          "Get-Label | Select-Object DisplayName, Priority, ContentType",
          "",
          "# Data Loss Prevention policies and which workloads they cover",
          "Get-DlpCompliancePolicy |",
          "  Select-Object Name, Mode, ExchangeLocation, SharePointLocation,",
          "    OneDriveLocation, TeamsLocation, EndpointDlpLocation",
          "",
          "# The rules inside a DLP policy (the actual conditions and actions)",
          "Get-DlpComplianceRule | Select-Object Name, Disabled, BlockAccess",
          "",
          "# Retention policies (lifecycle, not confidentiality)",
          "Get-RetentionCompliancePolicy | Select-Object Name, Enabled"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;What's the difference between a sensitivity label and a retention label?&quot;</strong> &quot;A <strong>sensitivity label</strong> is about <em>confidentiality</em> — it classifies the data and can enforce encryption, access control, and watermarks, and that protection travels with the file even outside M365. A <strong>retention label</strong> is about <em>lifecycle</em> — how long the content must be kept and what happens when that period ends (retain, then delete, or hold for legal). One protects who can read it; the other controls how long it lives. A single document can carry both.&quot;</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "5-6",
      title: "Auditing & incident response in M365",
      subtitle: "The Unified Audit Log and a worked BEC investigation",
      blocks: [
        { type: "p", html: "When an M365 incident hits your desk, there is one thing you reach for first: the <strong>Unified Audit Log (UAL)</strong>. It is the single, tenant-wide record of <em>who did what, where, and when</em> across Exchange, SharePoint, OneDrive, Teams, Entra ID, and the admin portals. If you take nothing else from this lesson: <strong>the audit log is the evidence that breaks BEC cases.</strong>" },
        { type: "h", text: "What the Unified Audit Log captures" },
        { type: "list", items: [
          "<strong>Mailbox activity</strong> — message reads, sends, moves, deletes, and crucially <strong>inbox rule creation/modification</strong> (the BEC signature).",
          "<strong>Sign-in &amp; identity events</strong> — interactive logons, MFA challenges, and (via Entra) risky sign-ins and impossible-travel.",
          "<strong>File &amp; sharing activity</strong> — SharePoint/OneDrive views, downloads, and external shares.",
          "<strong>Admin actions</strong> — role assignments, policy changes, mailbox permission grants (e.g. someone giving themselves Full Access to the CEO's mailbox).",
          "<strong>Teams</strong> — messages, membership changes, and meeting events."
        ]},
        { type: "callout", variant: "warn", title: "Turn it on and know the retention", html: "<p>Auditing is on by default for new tenants now, but <em>verify</em> it (<code>Get-AdminAuditLogConfig</code>). Default retention for <strong>Audit (Standard)</strong> is <strong>180 days</strong>; with <strong>Audit (Premium)</strong>, included in <strong>E5</strong>, core workloads (Exchange, SharePoint, Entra sign-ins) are retained for <strong>1 year</strong> (extendable to 10) — and incidents are often discovered weeks later, so retention matters. The most common &quot;we couldn't investigate&quot; failure is an org that turned auditing off or whose retention had already expired.</p>" },
        { type: "h", text: "The BEC kill chain — the scenario you WILL be asked" },
        { type: "callout", variant: "danger", title: "Business Email Compromise (BEC) — the attack chain", html: "<ol><li><strong>Phish the credentials</strong> — user enters their password (and sometimes an MFA code) on a fake Microsoft login page. Attacker now has a valid session.</li><li><strong>Establish stealthy persistence</strong> — the attacker creates <strong>hidden inbox rules</strong>: auto-forward to an external address, and/or move replies from &quot;invoice&quot;/&quot;payment&quot; senders straight to <em>RSS Feeds</em> or <em>Deleted Items</em> so the real user never sees the conversation.</li><li><strong>Reconnaissance</strong> — read mail to learn how the company pays invoices, who approves payments, and the tone of finance emails.</li><li><strong>The fraud</strong> — send a convincing &quot;updated bank details&quot; email to a customer or to finance, intercepting replies via the rules so nobody notices until the money is gone.</li></ol><p>No malware. No malicious attachment. Just a stolen identity and an inbox rule. That's why identity hardening (Module 4) and the audit log are your only real defences here.</p>" },
        { type: "h", text: "DETECT — the signals" },
        { type: "table", headers: ["Signal", "Where you see it", "Why it matters"], rows: [
          ["<strong>Risky sign-in / impossible travel</strong>", "Entra ID Protection / sign-in logs", "Logon from a new country minutes after a normal one = stolen session"],
          ["<strong>New-Inbox-Rule audit event</strong>", "Unified Audit Log (<code>New-InboxRule</code>)", "Especially rules that forward externally or delete/move &quot;payment&quot; mail = classic BEC"],
          ["<strong>Mailbox forwarding enabled</strong>", "<code>Get-Mailbox</code> / audit log", "ForwardingSmtpAddress set to an external domain"],
          ["<strong>Mass external sharing / downloads</strong>", "Unified Audit Log", "Data exfil following the account takeover"],
          ["<strong>New mailbox permissions</strong>", "Audit log (<code>Add-MailboxPermission</code>)", "Attacker granting themselves access to other mailboxes"]
        ]},
        { type: "code", lang: "powershell", caption: "BEC investigation: hunt inbox rules and search the audit log", code: [
          "Connect-ExchangeOnline",
          "",
          "# 1) Inspect the victim's inbox rules (hidden forward/delete = BEC)",
          "Get-InboxRule -Mailbox 'jdoe@contoso.com' |",
          "  Select-Object Name, Enabled, ForwardTo, ForwardAsAttachmentTo,",
          "    RedirectTo, DeleteMessage, MoveToFolder",
          "",
          "# 2) Is mailbox-level external forwarding turned on?",
          "Get-Mailbox 'jdoe@contoso.com' |",
          "  Select-Object ForwardingSmtpAddress, DeliverToMailboxAndForward",
          "",
          "# 3) Search the Unified Audit Log for rule-creation across the tenant",
          "$start = (Get-Date).AddDays(-30); $end = Get-Date",
          "Search-UnifiedAuditLog -StartDate $start -EndDate $end -Operations New-InboxRule,Set-InboxRule |",
          "  Select-Object CreationDate, UserIds, Operations, AuditData",
          "",
          "# 4) Pull the victim's sign-in / mailbox activity",
          "Search-UnifiedAuditLog -StartDate $start -EndDate $end -UserIds 'jdoe@contoso.com' |",
          "  Select-Object CreationDate, Operations, ClientIP"
        ]},
        { type: "h", text: "RESPOND — the containment playbook" },
        { type: "olist", items: [
          "<strong>Revoke all sessions</strong> first (<code>Revoke-MgUserSignInSession</code>) — the password alone won't help if the attacker holds a live token.",
          "<strong>Reset the password</strong> and require change at next logon.",
          "<strong>Enforce / re-register MFA</strong> — if MFA was bypassed (token theft or it was never on), this is the gap to close.",
          "<strong>Remove the malicious inbox rules</strong> and clear any mailbox forwarding (<code>Remove-InboxRule</code>, <code>Set-Mailbox -ForwardingSmtpAddress $null</code>).",
          "<strong>Hunt for spread</strong> — check whether the attacker added mailbox permissions, registered an MFA method of their own, consented to an OAuth app, or created mail flow rules.",
          "<strong>Notify</strong> finance/customers of any fraudulent payment instructions, and preserve the audit evidence."
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;Walk me through detecting and responding to a BEC.&quot;</strong> &quot;Detect: a risky/impossible-travel sign-in correlated with a <code>New-InboxRule</code> audit event — typically a rule that forwards externally or moves payment-related mail to Deleted Items/RSS Feeds. Confirm with <code>Get-InboxRule</code> and check for external forwarding. Respond in this order: <em>revoke sessions first</em> (the token, not just the password, is the access), reset the password, fix MFA, remove the rules and forwarding, then hunt for added mailbox permissions or OAuth consent grants, and warn finance about fraudulent payment requests. The audit log is the backbone of the whole investigation.&quot;</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "5-7",
      title: "Hardening M365 identity & access",
      subtitle: "Conditional Access, MFA, least privilege & Secure Score",
      blocks: [
        { type: "p", html: "Everything in this module ladders up to one truth: <strong>in M365, identity is the perimeter</strong>. There's no firewall between an attacker and your mail — there's a sign-in. So the highest-ROI hardening is all about <em>who can authenticate, from where, on what device, with what privileges</em>. This is the bridge back to Module 4 (Entra ID), applied to M365." },
        { type: "h", text: "Security Defaults vs. Conditional Access" },
        { type: "table", headers: ["", "Security Defaults", "Conditional Access"], rows: [
          ["What it is", "A free, on/off baseline of sensible identity protections", "Granular, policy-based access control"],
          ["MFA", "Requires MFA for all users (no exceptions you can carve)", "MFA on <em>your</em> conditions (user, app, location, device, risk)"],
          ["Legacy auth", "Blocked", "Blocked — and far more, conditionally"],
          ["Licence", "Free (all tenants)", "Entra ID <strong>P1/P2</strong> (E3/E5)"],
          ["Use when", "Small org, no P1 — turn it ON, don't leave it off", "You have P1+ and need real control (this supersedes Security Defaults)"]
        ]},
        { type: "p", html: "The rule: <strong>if you have no licence for Conditional Access, turn Security Defaults ON.</strong> The moment you build Conditional Access policies, you disable Security Defaults (you can't run both) and recreate the protections as explicit, more flexible policies." },
        { type: "h", text: "The non-negotiable hardening baseline" },
        { type: "olist", items: [
          "<strong>Enforce MFA everywhere</strong> — phishing-resistant (FIDO2/passkeys/Windows Hello) for admins. Passwords alone are a finding in 2026.",
          "<strong>Block legacy authentication</strong> — protocols like IMAP/POP/basic-auth SMTP <em>cannot do MFA</em>, so attackers target them for password spraying. Block them in Conditional Access. This single control kills most spray attacks.",
          "<strong>Least-privilege admin roles</strong> — don't make people Global Admin. Use scoped roles (Exchange Admin, SharePoint Admin) and <strong>Privileged Identity Management (PIM, E5)</strong> for just-in-time, time-boxed, approved elevation.",
          "<strong>Separate admin accounts</strong> — admins use a dedicated, cloud-only, MFA'd admin identity, never their day-to-day mailbox account.",
          "<strong>Device compliance</strong> — require managed/compliant devices for sensitive apps via Conditional Access + Intune.",
          "<strong>Watch OAuth app consent</strong> — see below."
        ]},
        { type: "callout", variant: "danger", title: "OAuth app consent abuse (bridge to Module 4)", html: "<p>A modern phish often skips the password entirely: the lure asks you to <strong>consent to a malicious OAuth app</strong> (&quot;Grant this app access to read your mail and files&quot;). If you click Accept, the attacker gets a <strong>refresh token</strong> — persistent access that <em>survives a password reset and isn't stopped by MFA</em>, because you legitimately authorised it. Defence: turn off end-user consent (require admin approval), use the <strong>admin consent workflow</strong>, and review consented apps regularly. During a BEC response, always check whether the attacker left an OAuth grant behind.</p>" },
        { type: "h", text: "Microsoft Secure Score — measure and improve" },
        { type: "p", html: "<strong>Microsoft Secure Score</strong> gives your tenant a security posture percentage with prioritised, actionable recommendations across identity, devices, apps, and data — each weighted by impact. It's how you turn &quot;are we secure?&quot; into a number you can track over time and report to leadership. Treat it as a backlog: knock out the high-impact, low-effort items (MFA, block legacy auth, admin consent) first." },
        { type: "code", lang: "powershell", caption: "Check identity hardening via Microsoft Graph", code: [
          "Connect-MgGraph -Scopes 'Policy.Read.All','SecurityEvents.Read.All',",
          "  'RoleManagement.Read.Directory'",
          "",
          "# Are Security Defaults enabled?",
          "Get-MgPolicyIdentitySecurityDefaultEnforcementPolicy |",
          "  Select-Object IsEnabled",
          "",
          "# List Conditional Access policies and their state",
          "Get-MgIdentityConditionalAccessPolicy |",
          "  Select-Object DisplayName, State",
          "",
          "# Who holds Global Administrator? (least-privilege review)",
          "$role = Get-MgDirectoryRole -Filter \"displayName eq 'Global Administrator'\"",
          "Get-MgDirectoryRoleMember -DirectoryRoleId $role.Id",
          "",
          "# Pull the current Secure Score",
          "Get-MgSecuritySecureScore -Top 1 |",
          "  Select-Object CurrentScore, MaxScore, CreatedDateTime"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;A client has M365 with default settings. What are the first three things you harden?&quot;</strong> &quot;1) <strong>Enforce MFA on everyone</strong> (Security Defaults if no P1, or Conditional Access if licensed) — phishing-resistant for admins. 2) <strong>Block legacy authentication</strong>, because those protocols can't do MFA and are the spray target. 3) <strong>Least-privilege admin</strong> — minimise Global Admins and move to PIM for just-in-time elevation. I'd then check OAuth app-consent settings and use Secure Score to prioritise the rest.&quot;</p>" },
        { type: "divider" },
        { type: "callout", variant: "tip", title: "Module 5 — Key takeaways", html: "<ul><li><strong>M365 sits on top of Entra ID</strong> — every mailbox sign-in is an identity event, so identity hardening (MFA, Conditional Access, block legacy auth) <em>is</em> email security. E3 gives you the data; <strong>E5</strong> adds the active defence and investigation stack.</li><li><strong>SPF, DKIM, DMARC</strong> are the email-auth trinity: SPF authorises sending IPs, DKIM signs the content, and <strong>DMARC</strong> ties them to the visible From via <em>alignment</em> and enforces a policy (none&rarr;quarantine&rarr;reject). EOP is the always-on baseline.</li><li><strong>Defender for Office 365</strong> adds Safe Links (<em>time-of-click</em> URL re-check), Safe Attachments (sandbox detonation), impersonation protection, and — in <strong>Plan 2/E5</strong> — Threat Explorer, AIR, and Attack Simulation Training.</li><li><strong>Oversharing</strong> in SharePoint/OneDrive/Teams is the silent breach, and <strong>Copilot</strong> makes it instant — it respects permissions but doesn't fix them. Default to &quot;specific people&quot; sharing and enforce sensitivity labels.</li><li><strong>Purview</strong>: sensitivity labels = confidentiality (encryption travels with the file); retention labels = lifecycle (how long to keep). DLP spans Exchange/SharePoint/OneDrive/Teams/endpoint.</li><li><strong>The Unified Audit Log breaks BEC cases.</strong> The kill chain: phished creds &rarr; hidden inbox rules &rarr; invoice fraud. Detect via risky sign-in + <code>New-InboxRule</code>; respond by <em>revoking sessions first</em>, then reset, MFA, remove rules, hunt for OAuth grants.</li></ul>" }
      ]
    }
  ],
  quiz: [
    { q: "Which email-authentication mechanism ties SPF and DKIM to the visible From address and enforces a policy on failure?", options: ["SPF", "DKIM", "DMARC", "EOP"], answer: 2, explain: "SPF authenticates the envelope sender and DKIM signs the message, but both check domains the user never sees. DMARC requires alignment between the SPF/DKIM domain and the visible From, then applies p=none/quarantine/reject plus reporting." },
    { q: "What makes Safe Links in Defender for Office 365 effective against weaponised URLs?", options: ["It deletes all emails containing links", "It performs time-of-click re-evaluation — the URL is re-checked and detonated when the user actually clicks", "It only scans attachments", "It blocks all external domains"], answer: 1, explain: "Safe Links rewrites URLs to a Microsoft proxy and re-evaluates them at click time, so a link that was clean at delivery but weaponised later is still blocked. This defeats the delivery-time bait-and-switch trick." },
    { q: "A document has a sensitivity label that applies encryption. It is emailed to a personal Gmail account. What happens?", options: ["The encryption is stripped at the gateway", "The protection persists — the file stays encrypted and only authorised users can open it", "The label is removed automatically", "The email is always blocked by DLP"], answer: 1, explain: "Sensitivity-label protection is embedded in the file and travels with it, even outside M365. The recipient cannot open it unless they are authorised. That persistence is the key property of MIP/Purview sensitivity labels." },
    { q: "During a BEC investigation, what is the FIRST containment action you should take?", options: ["Reset the password", "Revoke the user's active sessions/tokens", "Delete the mailbox", "Disable the firewall"], answer: 1, explain: "The attacker holds a live session token. Resetting the password alone does not kill an existing token. Revoke sessions first (Revoke-MgUserSignInSession), then reset the password, fix MFA, and remove malicious inbox rules." },
    { q: "Which feature set is included with Microsoft 365 E5 but NOT E3?", options: ["Exchange Online Protection (EOP)", "Sensitivity labels (manual)", "Defender for Office 365 Plan 2, full Purview, and Entra ID P2", "Basic mail flow rules"], answer: 2, explain: "E3 is the data/productivity baseline with EOP and Entra ID P1. E5 adds the active defence and investigation stack: Defender for Office 365 Plan 2 (Threat Explorer, AIR, attack simulation), full Purview, and Entra ID P2 (Identity Protection, PIM)." },
    { q: "What is the classic technical signature of a Business Email Compromise once the account is taken over?", options: ["A malicious .exe attachment", "Hidden inbox rules that auto-forward externally or move payment-related mail to Deleted Items/RSS Feeds", "A new firewall rule", "A registry Run key"], answer: 1, explain: "BEC typically uses no malware. After phishing credentials, the attacker creates hidden inbox rules to divert or delete replies (often to RSS Feeds or Deleted Items) so the victim never sees the fraudulent invoice conversation. The Unified Audit Log records these as New-InboxRule events." },
    { q: "A DLP policy is configured to block sharing of credit-card numbers to external recipients. Which workloads can a single M365 DLP policy cover?", options: ["Only Exchange email", "Only SharePoint", "Exchange, SharePoint, OneDrive, Teams, and the endpoint", "Only the endpoint via Intune"], answer: 2, explain: "A single Purview DLP policy spans Exchange (email), SharePoint, OneDrive, Teams chat/channels, and the endpoint (USB/print/browser upload). The unified scope across workloads is a core strength of M365 DLP." },
    { q: "Why is OAuth app-consent phishing especially dangerous, and what defence stops it?", options: ["It steals the password, so a reset fixes it; defence is a longer password", "It grants a refresh token that survives password resets and MFA; defence is requiring admin approval for app consent", "It only affects on-prem servers; defence is patching", "It is blocked automatically by EOP; no action needed"], answer: 1, explain: "If a user consents to a malicious OAuth app, the attacker gets a refresh token — persistent access that survives password resets and is not stopped by MFA because the access was legitimately authorised. Defence: disable end-user consent, require admin approval, and review consented apps." }
  ],
  flashcards: [
    { front: "Microsoft 365 vs Entra ID — the relationship", back: "M365 (Exchange, SharePoint, OneDrive, Teams + security/compliance) sits ON TOP of <strong>Entra ID</strong>. Every M365 sign-in is an Entra ID authentication, so Conditional Access / MFA / risky-sign-in are how you protect M365." },
    { front: "E3 vs E5 (security)", back: "E3 = data/productivity baseline with EOP + Entra ID P1. <strong>E5</strong> adds the active defence/investigation stack: Defender for Office 365 Plan 2, full Microsoft Purview, and Entra ID P2 (Identity Protection, PIM)." },
    { front: "SPF", back: "DNS TXT record listing the IPs authorised to send mail for a domain. Authenticates the <strong>envelope sender</strong> (MAIL FROM / Return-Path), NOT the visible From. <code>-all</code> = hard fail." },
    { front: "DKIM", back: "Cryptographic signature in the headers: sender signs with a private key, receiver verifies with the public key in DNS. Proves the mail is authentic and <strong>untampered in transit</strong>." },
    { front: "DMARC", back: "Ties SPF/DKIM to the <strong>visible From</strong> via <em>alignment</em>, and sets a policy: <code>p=none</code> (report only) &rarr; <code>p=quarantine</code> &rarr; <code>p=reject</code>. Plus RUA/RUF reporting. The enforcement layer." },
    { front: "EOP — Exchange Online Protection", back: "The always-on anti-spam / anti-malware / connection-filtering baseline included with any Exchange Online plan (no E5 needed). Evaluates SPF/DKIM/DMARC; hosts connectors &amp; transport (mail flow) rules." },
    { front: "Safe Links", back: "Defender for Office 365 feature that rewrites URLs to a Microsoft proxy and re-checks them at <strong>time-of-click</strong> (real-time detonation). Defeats links that are clean at delivery but weaponised later. Covers mail, Teams, and Office docs." },
    { front: "Safe Attachments", back: "Detonates attachments in a real-VM <strong>sandbox</strong> before delivery; blocks files that behave maliciously. Catches zero-day malware that signature AV misses." },
    { front: "MDO Plan 1 vs Plan 2", back: "Plan 1 = prevention (Safe Links/Attachments, anti-phishing). <strong>Plan 2</strong> = adds investigation/automation: full Threat Explorer, Automated Investigation &amp; Response (AIR), and Attack Simulation Training. Plan 2 comes with E5." },
    { front: "Oversharing + Copilot risk", back: "Content shared with &quot;Anyone&quot; or &quot;everyone in org&quot; that should be restricted. Copilot <strong>respects but does not fix</strong> permissions — it surfaces any over-permissioned content a user can access, conversationally. Fix sharing before deploying Copilot." },
    { front: "Sensitivity label vs Retention label", back: "<strong>Sensitivity</strong> = confidentiality (classify + encrypt + watermark; travels with the file even outside M365). <strong>Retention</strong> = lifecycle (how long to keep, then delete/hold). One protects access; the other controls duration." },
    { front: "Unified Audit Log & BEC", back: "Tenant-wide record of who-did-what across Exchange/SharePoint/OneDrive/Teams/Entra. THE first thing you pull in an investigation. BEC chain: phished creds &rarr; hidden <code>New-InboxRule</code> (forward/delete) &rarr; invoice fraud. Respond: <strong>revoke sessions first</strong>, reset, MFA, remove rules, hunt OAuth grants." }
  ]
});
