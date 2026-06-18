/* Cheat Sheets — last-minute-cram quick-reference cards.
   window.COURSE.cheatsheets = [ { id, icon, title, blurb, blocks:[...] } ]
   Blocks use the same schema the engine renders elsewhere (p, h, h3, list,
   olist, steps, callout, code, table, kv). These are reference cards: prefer
   compact table / kv / code over prose.
   Convention: double-quoted JS strings; single-quoted HTML attributes; no
   backticks; doubled backslashes inside code blocks. */
window.COURSE.cheatsheets = [

  /* ============================================================= 1 */
  {
    id: "acronyms",
    icon: "🔤",
    title: "Acronym Cram Card",
    blurb: "Say each one out loud in a sentence — that's how interviewers test you.",
    blocks: [
      { type: "p", html: "If you can define these in one breath, you sound fluent. Keep each to a sentence." },
      { type: "h3", text: "Detection & operations" },
      { type: "table", headers: ["Term", "Say it out loud"], rows: [
        ["<strong>XDR</strong>", "Extended Detection &amp; Response — correlates signals across endpoint, identity, email and cloud (Microsoft Defender XDR)."],
        ["<strong>EDR</strong>", "Endpoint Detection &amp; Response — behaviour-based detection on devices (Defender for Endpoint)."],
        ["<strong>SIEM</strong>", "Security Info &amp; Event Management — central log search and alerting (Microsoft Sentinel)."],
        ["<strong>SOAR</strong>", "Security Orchestration, Automation &amp; Response — automated playbooks that respond to alerts."],
        ["<strong>KQL</strong>", "Kusto Query Language — the query language for Sentinel and Defender hunting."],
        ["<strong>CSPM</strong>", "Cloud Security Posture Management — finds misconfigurations across cloud resources."],
        ["<strong>CWPP</strong>", "Cloud Workload Protection Platform — runtime protection for VMs, containers and servers."],
        ["<strong>CASB</strong>", "Cloud Access Security Broker — visibility and control over SaaS apps (Microsoft Defender for Cloud Apps, MDA)."],
        ["<strong>MDE / MDO / MDI</strong>", "Defender for Endpoint / for Office 365 / for Identity — the three core Defender workloads."]
      ]},
      { type: "h3", text: "Identity & access" },
      { type: "table", headers: ["Term", "Say it out loud"], rows: [
        ["<strong>MFA</strong>", "Multi-Factor Auth — proof from two of: something you know, have, are."],
        ["<strong>CA</strong>", "Conditional Access — Entra ID policy engine: if these signals, then this control."],
        ["<strong>PIM</strong>", "Privileged Identity Management — just-in-time, time-boxed, approved admin role activation."],
        ["<strong>SSPR</strong>", "Self-Service Password Reset — users reset their own password after verifying."],
        ["<strong>RBAC</strong>", "Role-Based Access Control — permissions via roles, not per-user grants."],
        ["<strong>PHS / PTA</strong>", "Password Hash Sync / Pass-Through Auth — two ways hybrid sign-in validates passwords."],
        ["<strong>Federation</strong>", "Sign-in is redirected to an external IdP (e.g. AD FS) that validates the password."],
        ["<strong>gMSA</strong>", "Group Managed Service Account — AD account whose password AD rotates automatically."],
        ["<strong>JML</strong>", "Joiner-Mover-Leaver — the identity lifecycle that provisioning automates."]
      ]},
      { type: "h3", text: "Protocols & tokens" },
      { type: "table", headers: ["Term", "Say it out loud"], rows: [
        ["<strong>SAML</strong>", "XML-based SSO protocol for web apps — IdP issues a signed assertion."],
        ["<strong>OIDC</strong>", "OpenID Connect — identity layer on OAuth2; issues an ID token (JWT)."],
        ["<strong>OAuth</strong>", "Delegated authorization — issues access tokens so an app can call an API as you."],
        ["<strong>SCIM</strong>", "System for Cross-domain Identity Management — REST standard to auto-provision users into apps."]
      ]},
      { type: "h3", text: "Threats & internals" },
      { type: "table", headers: ["Term", "Say it out loud"], rows: [
        ["<strong>AiTM</strong>", "Adversary-in-the-Middle — phishing proxy that steals the session token, defeating basic MFA."],
        ["<strong>BEC</strong>", "Business Email Compromise — attacker uses a trusted mailbox to commit fraud."],
        ["<strong>SID</strong>", "Security Identifier — the unique ID that actually carries permissions, not the name."],
        ["<strong>DACL</strong>", "Discretionary Access Control List — the allow/deny entries that grant access on an object."],
        ["<strong>LSASS</strong>", "Local Security Authority Subsystem — Windows process that holds credentials in memory; theft target."],
        ["<strong>TPM</strong>", "Trusted Platform Module — hardware chip that stores keys (BitLocker, device attestation)."],
        ["<strong>VBS</strong>", "Virtualization-Based Security — uses the hypervisor to isolate secrets (e.g. Credential Guard)."]
      ]}
    ]
  },

  /* ============================================================= 2 */
  {
    id: "events",
    icon: "🪟",
    title: "Windows Event IDs",
    blurb: "One-line meaning of the Security-log IDs you must know.",
    blocks: [
      { type: "p", html: "Most live in the <strong>Security</strong> log; 4104 is in <em>Microsoft-Windows-PowerShell/Operational</em>." },
      { type: "table", headers: ["Event ID", "Meaning", "Why it matters"], rows: [
        ["<strong>4624</strong>", "Account successfully logged on", "Check Logon Type: 2 interactive, 3 network, 10 RemoteInteractive (RDP)."],
        ["<strong>4625</strong>", "Failed logon", "Spikes = password spray / brute force. Sub-status gives the reason."],
        ["<strong>4634</strong>", "Account logged off", "Pair with 4624 to measure session duration."],
        ["<strong>4672</strong>", "Special privileges assigned at logon", "Admin-equivalent logon — high-value sessions to watch."],
        ["<strong>4688</strong>", "A new process was created", "Process + command line — core for malware and LOLBins (enable cmdline auditing)."],
        ["<strong>4720</strong>", "A user account was created", "New account on a server can be attacker persistence."],
        ["<strong>4732</strong>", "Member added to a security-enabled local group", "Watch additions to Administrators — privilege escalation."],
        ["<strong>4740</strong>", "An account was locked out", "Triggered by repeated bad passwords (or a stuck old credential)."],
        ["<strong>4768</strong>", "Kerberos TGT (AS-REQ) requested", "Authentication on a DC; baseline of who logged on."],
        ["<strong>4769</strong>", "Kerberos service ticket (TGS) requested", "Bursts with RC4 encryption = Kerberoasting indicator."],
        ["<strong>1102</strong>", "The Security audit log was cleared", "Almost always anti-forensics — treat as high severity."],
        ["<strong>4104</strong>", "PowerShell script-block logging", "Reveals deobfuscated PowerShell — gold for hunting."]
      ]},
      { type: "callout", variant: "tip", html: "<p>Logon-type cheat: <strong>2</strong> = at the keyboard, <strong>3</strong> = network/SMB, <strong>10</strong> = RDP. A type-3 logon with admin privileges from an odd host is a lateral-movement smell.</p>" },
      { type: "kv", items: [
        { k: "Mass 4625 then 4624", v: "Password spray that finally succeeded — investigate the success." },
        { k: "4768/4769 with RC4 (0x17)", v: "Possible Kerberoasting; cross-check the SPN account." },
        { k: "1102 out of nowhere", v: "Log clearing — assume compromise and preserve evidence." }
      ]}
    ]
  },

  /* ============================================================= 3 */
  {
    id: "kql",
    icon: "📊",
    title: "KQL Quick Reference",
    blurb: "The query shape, the operators, and four copy-paste hunts.",
    blocks: [
      { type: "p", html: "KQL flows top-down: start with a <strong>table</strong>, then pipe through filters and shaping. Each <code>|</code> passes rows to the next step." },
      { type: "code", lang: "kql", caption: "The canonical query shape", code: [
        "TableName",
        "| where TimeGenerated > ago(1d)      // filter rows",
        "| project User, IP, ResultType        // pick columns",
        "| summarize Count = count() by User   // aggregate",
        "| sort by Count desc                  // order",
        "| render barchart                     // visualize"
      ]},
      { type: "table", headers: ["Operator", "Does"], rows: [
        ["<code>where</code>", "Filter rows by a condition."],
        ["<code>project</code> / <code>project-away</code>", "Keep / drop specific columns."],
        ["<code>extend</code>", "Add a calculated column."],
        ["<code>summarize ... by</code>", "Aggregate (count, dcount, avg) grouped by fields."],
        ["<code>sort by</code> (a.k.a. <code>order by</code>)", "Order results, asc or desc."],
        ["<code>top N by</code>", "Keep the highest N rows."],
        ["<code>join kind=inner</code>", "Combine two tables on a key."],
        ["<code>union</code>", "Stack rows from multiple tables."],
        ["<code>render</code>", "Draw a chart (timechart, barchart, piechart)."]
      ]},
      { type: "h3", text: "Hunt 1 — failed sign-ins (bad password / lockout)" },
      { type: "code", lang: "kql", caption: "ResultType 50126 = invalid password, 50053 = account locked out", code: [
        "SigninLogs",
        "| where TimeGenerated > ago(1d)",
        "| where ResultType in (\"50126\", \"50053\")",
        "| summarize Attempts = count(), IPs = dcount(IPAddress) by UserPrincipalName",
        "| where Attempts > 10",
        "| sort by Attempts desc"
      ]},
      { type: "h3", text: "Hunt 2 — impossible-travel style (one user, many countries)" },
      { type: "code", lang: "kql", caption: "Same account signing in from multiple countries in a short window", code: [
        "SigninLogs",
        "| where TimeGenerated > ago(1d)",
        "| where ResultType == \"0\"",
        "| summarize Countries = make_set(Location), Logins = count() by UserPrincipalName, bin(TimeGenerated, 1h)",
        "| extend CountryCount = array_length(Countries)",
        "| where CountryCount > 1",
        "| sort by CountryCount desc"
      ]},
      { type: "h3", text: "Hunt 3 — new inbox rule (BEC indicator)" },
      { type: "code", lang: "kql", caption: "Mailbox rules that auto-forward or delete are a classic BEC tell", code: [
        "OfficeActivity",
        "| where TimeGenerated > ago(7d)",
        "| where Operation in (\"New-InboxRule\", \"Set-InboxRule\")",
        "| project TimeGenerated, UserId, Operation, ClientIP, Parameters",
        "| sort by TimeGenerated desc"
      ]},
      { type: "h3", text: "Hunt 4 — suspicious process (encoded PowerShell)" },
      { type: "code", lang: "kql", caption: "Base64-encoded command lines often hide attacker payloads", code: [
        "DeviceProcessEvents",
        "| where TimeGenerated > ago(1d)",
        "| where FileName in~ (\"powershell.exe\", \"pwsh.exe\")",
        "| where ProcessCommandLine has_any (\"-enc\", \"-encodedcommand\", \"-ec\")",
        "| project TimeGenerated, DeviceName, AccountName, ProcessCommandLine, InitiatingProcessFileName",
        "| sort by TimeGenerated desc"
      ]},
      { type: "callout", variant: "tip", html: "<p>Use <code>has</code> for whole-token matches (fast, indexed); reserve <code>contains</code> for substrings (slower). <code>=~</code> and <code>in~</code> are case-insensitive.</p>" }
    ]
  },

  /* ============================================================= 4 */
  {
    id: "ad-attacks",
    icon: "🗝️",
    title: "AD Attack ↔ Defense Matrix",
    blurb: "The Kerberos and credential attacks, plus how you detect and stop each.",
    blocks: [
      { type: "p", html: "Defender for Identity (MDI) raises most of these as alerts; Event IDs are the on-DC evidence." },
      { type: "table", headers: ["Attack", "How it works", "Defense", "Detection"], rows: [
        ["<strong>Kerberoasting</strong>", "Request a service ticket for an SPN, crack it offline for the service account's password.", "Long random passwords or gMSA on service accounts; remove needless SPNs.", "4769 with RC4 (0x17); MDI Kerberoasting alert."],
        ["<strong>AS-REP Roasting</strong>", "Accounts with pre-auth disabled give an AS-REP that's crackable offline.", "Require Kerberos pre-authentication on every account.", "4768 for pre-auth-not-required accounts; MDI alert."],
        ["<strong>Pass-the-Hash (PtH)</strong>", "Steal an NTLM hash from memory and authenticate without the plaintext.", "Credential Guard, LAPS, no admin reuse across tiers.", "4624 logon type 3 / 9; MDI lateral-movement alert."],
        ["<strong>Pass-the-Ticket (PtT)</strong>", "Steal a Kerberos TGT/TGS and reuse it.", "Protect LSASS; limit admin logons; expire tickets.", "Anomalous 4769/4624; MDI alert."],
        ["<strong>Golden Ticket</strong>", "Forge any TGT using the stolen <code>krbtgt</code> hash — total domain forgery.", "Reset <code>krbtgt</code> twice; protect DCs; tier-0 isolation.", "TGT with odd lifetime; MDI Golden Ticket alert."],
        ["<strong>Silver Ticket</strong>", "Forge a service ticket using a service/computer account hash — one service.", "Rotate service-account secrets; gMSA; monitor SPNs.", "4769 with no matching 4768; MDI alert."],
        ["<strong>DCSync</strong>", "Impersonate a DC and ask for replication of password hashes.", "Restrict Replicating-Directory-Changes rights to DCs only.", "4662 replication GUID from a non-DC; MDI DCSync alert."],
        ["<strong>LLMNR / NBT-NS poisoning</strong>", "Answer broadcast name lookups to capture NTLMv2 hashes (Responder).", "Disable LLMNR and NBT-NS; enable SMB signing.", "Network anomalies; rogue responder; MDI/network detection."]
      ]},
      { type: "callout", variant: "interview", html: "<p><strong>Golden vs Silver in one line:</strong> Golden uses the <code>krbtgt</code> hash to forge a TGT (whole domain); Silver uses a service account's hash to forge a TGS (one service, no DC contact, harder to spot).</p>" }
    ]
  },

  /* ============================================================= 5 */
  {
    id: "cond-access",
    icon: "🛂",
    title: "Conditional Access — First Policies",
    blurb: "The starter policy set and the signals-to-decision model.",
    blocks: [
      { type: "p", html: "Conditional Access is the Zero Trust enforcement point: <strong>if</strong> these signals, <strong>then</strong> grant, block, or require a control." },
      { type: "h3", text: "Signals → Decision model" },
      { type: "kv", items: [
        { k: "Signals (the IF)", v: "User/group, target app, device state, location/IP, client app, sign-in &amp; user risk." },
        { k: "Decision (the THEN)", v: "Block, or grant access with controls: require MFA, compliant device, app protection, password change." },
        { k: "Enforcement", v: "Policies are evaluated together; if any matching policy blocks, the user is blocked." }
      ]},
      { type: "h3", text: "Must-have starter policies" },
      { type: "olist", items: [
        "<strong>Block legacy authentication</strong> — kills protocols (IMAP/POP/SMTP-Auth) that can't do MFA. Do this first.",
        "<strong>Require MFA for all users</strong> — baseline across every cloud app.",
        "<strong>Phishing-resistant MFA for admins</strong> — require FIDO2 / Windows Hello / certificate for privileged roles.",
        "<strong>Require a compliant / hybrid-joined device</strong> — only Intune-managed, healthy devices reach sensitive apps.",
        "<strong>Sign-in risk → step-up or block</strong> — high risk blocks; medium requires MFA (uses Entra ID Protection).",
        "<strong>User risk → require secure password change</strong> — force SSPR-backed reset when the account looks compromised."
      ]},
      { type: "callout", variant: "warn", title: "Always do these two", html: "<p><strong>Break-glass accounts:</strong> create two cloud-only emergency admins and <em>exclude</em> them from every CA policy, or you can lock yourself out. <strong>Report-only mode:</strong> roll out new policies in report-only first to see impact before enforcing.</p>" },
      { type: "table", headers: ["Mistake", "Fix"], rows: [
        ["No break-glass exclusion", "Tenant lockout when MFA/IdP breaks."],
        ["Enforcing before report-only", "Surprise outages for users."],
        ["MFA but legacy auth still on", "Attackers just use the legacy bypass."]
      ]}
    ]
  },

  /* ============================================================= 6 */
  {
    id: "ports",
    icon: "🔌",
    title: "Common Ports & OSI",
    blurb: "The ports you must know cold, plus the layer models.",
    blocks: [
      { type: "table", headers: ["Port", "Service", "Note"], rows: [
        ["<strong>20 / 21</strong>", "FTP (data / control)", "Cleartext; prefer SFTP/FTPS."],
        ["<strong>22</strong>", "SSH / SFTP", "Encrypted remote shell &amp; file transfer."],
        ["<strong>23</strong>", "Telnet", "Cleartext — never use."],
        ["<strong>25 / 587</strong>", "SMTP / SMTP submission", "587 is the modern authenticated submission port."],
        ["<strong>53</strong>", "DNS", "UDP for queries, TCP for zone transfers."],
        ["<strong>80</strong>", "HTTP", "Cleartext web."],
        ["<strong>88</strong>", "Kerberos", "AD authentication — DCs listen here."],
        ["<strong>110</strong>", "POP3", "Legacy mail retrieval."],
        ["<strong>135</strong>", "RPC endpoint mapper", "Used by WMI / DCOM."],
        ["<strong>139</strong>", "NetBIOS Session", "Legacy SMB over NetBIOS."],
        ["<strong>143</strong>", "IMAP", "Mailbox sync."],
        ["<strong>389 / 636</strong>", "LDAP / LDAPS", "Directory queries; 636 is TLS."],
        ["<strong>443</strong>", "HTTPS", "TLS web — most modern traffic."],
        ["<strong>445</strong>", "SMB", "File shares &amp; lateral movement; block at the perimeter."],
        ["<strong>3389</strong>", "RDP", "Remote Desktop — never expose to the internet."],
        ["<strong>5985 / 5986</strong>", "WinRM (HTTP / HTTPS)", "PowerShell Remoting; 5986 is TLS."]
      ]},
      { type: "h3", text: "OSI vs TCP/IP" },
      { type: "table", headers: ["OSI layer", "TCP/IP", "Examples"], rows: [
        ["7 Application", "Application", "HTTP, DNS, SMTP, LDAP"],
        ["6 Presentation", "Application", "TLS, encoding, encryption"],
        ["5 Session", "Application", "Sessions, RPC"],
        ["4 Transport", "Transport", "TCP, UDP (ports)"],
        ["3 Network", "Internet", "IP, ICMP, routing"],
        ["2 Data Link", "Link", "Ethernet, MAC, switches"],
        ["1 Physical", "Link", "Cables, radio, signals"]
      ]},
      { type: "callout", variant: "tip", html: "<p>Mnemonic, layer 7 → 1: <strong>A</strong>ll <strong>P</strong>eople <strong>S</strong>eem <strong>T</strong>o <strong>N</strong>eed <strong>D</strong>ata <strong>P</strong>rocessing. A firewall ACL works at L3/L4 (IP + port); a WAF works at L7.</p>" }
    ]
  },

  /* ============================================================= 7 */
  {
    id: "ir",
    icon: "🚨",
    title: "Incident Response Playbook",
    blurb: "NIST lifecycle plus first-moves for the three incidents you'll get asked about.",
    blocks: [
      { type: "h3", text: "NIST SP 800-61 lifecycle" },
      { type: "table", headers: ["Phase", "What happens"], rows: [
        ["<strong>1. Preparation</strong>", "Logging, tooling, runbooks, roles, contacts — done before anything happens."],
        ["<strong>2. Detection &amp; Analysis</strong>", "Identify the event, triage, scope, confirm it's a real incident."],
        ["<strong>3. Containment, Eradication &amp; Recovery</strong>", "Isolate, remove the threat, then safely restore service."],
        ["<strong>4. Post-Incident Activity</strong>", "Lessons learned, fix root cause, update detections and runbooks."]
      ]},
      { type: "callout", variant: "info", html: "<p>Containment usually splits into <strong>short-term</strong> (isolate the host now) and <strong>long-term</strong> (rebuild clean). Don't wipe before you've preserved evidence.</p>" },
      { type: "h3", text: "Ransomware — first moves" },
      { type: "steps", items: [
        "<strong>Isolate</strong> affected hosts from the network (don't power off — preserve memory/evidence).",
        "Identify patient zero, the strain, and the blast radius.",
        "Protect backups and verify they're offline / immutable and clean.",
        "Reset credentials that may be exposed; revoke sessions; rotate <code>krbtgt</code> if a DC is involved.",
        "Recover from known-good backups; rebuild rather than trust infected hosts.",
        "Root-cause the entry vector and close it before reconnecting."
      ]},
      { type: "h3", text: "Phishing / BEC — first moves" },
      { type: "steps", items: [
        "Pull the malicious mail from all mailboxes (Defender for Office 365 / purge).",
        "Block the sender, URLs and any attachment hashes.",
        "Identify who clicked or entered credentials; force a reset and revoke sessions.",
        "Check the compromised mailbox for <strong>malicious inbox / forwarding rules</strong> and remove them.",
        "Review sign-in logs for token theft (AiTM) and unfamiliar locations.",
        "Notify affected users and finance if fraud was attempted."
      ]},
      { type: "h3", text: "Compromised account — first moves" },
      { type: "steps", items: [
        "<strong>Revoke all sessions / refresh tokens</strong> (Entra: revoke sign-in sessions).",
        "<strong>Reset the password</strong> to something new and strong.",
        "<strong>Re-register MFA</strong> — remove attacker-added authentication methods.",
        "<strong>Remove malicious inbox rules</strong> and forwarding the attacker created.",
        "Check for new app consents, added owners, or role assignments.",
        "Review audit logs to scope what the attacker touched."
      ]},
      { type: "callout", variant: "tip", html: "<p>For any account compromise, the order is muscle memory: <strong>revoke → reset → re-MFA → remove rules → review</strong>.</p>" }
    ]
  },

  /* ============================================================= 8 */
  {
    id: "mitre",
    icon: "🎯",
    title: "MITRE ATT&CK Tactics",
    blurb: "The 14 enterprise tactics in order, each with a Microsoft control.",
    blocks: [
      { type: "p", html: "Tactics are the attacker's <em>why</em> (the goal); techniques are the <em>how</em>. They roughly run left to right across a real intrusion." },
      { type: "table", headers: ["Tactic", "Goal (one line)", "Microsoft control example"], rows: [
        ["<strong>Reconnaissance</strong>", "Gather info on the target before attacking.", "Attack-surface reduction; Defender EASM."],
        ["<strong>Resource Development</strong>", "Build infrastructure (domains, accounts, malware).", "Threat intel in Defender XDR."],
        ["<strong>Initial Access</strong>", "Get the first foothold.", "Defender for Office 365 (anti-phishing); CA blocks legacy auth."],
        ["<strong>Execution</strong>", "Run attacker code on a host.", "Defender for Endpoint EDR; ASR rules."],
        ["<strong>Persistence</strong>", "Keep access across reboots.", "MDE detections; audit autoruns &amp; scheduled tasks."],
        ["<strong>Privilege Escalation</strong>", "Gain higher permissions.", "LAPS; Credential Guard; tiered admin."],
        ["<strong>Defense Evasion</strong>", "Avoid detection (clear logs, obfuscate).", "Tamper protection; 1102 log-clear alerts."],
        ["<strong>Credential Access</strong>", "Steal passwords, hashes, tokens.", "Credential Guard; Defender for Identity."],
        ["<strong>Discovery</strong>", "Map the environment from inside.", "MDI reconnaissance alerts; honeytoken accounts."],
        ["<strong>Lateral Movement</strong>", "Move host to host.", "Network segmentation; MDI lateral-movement alerts."],
        ["<strong>Collection</strong>", "Gather data of interest.", "Purview DLP; sensitivity labels."],
        ["<strong>Command &amp; Control</strong>", "Communicate with compromised hosts.", "MDE network protection; DNS filtering."],
        ["<strong>Exfiltration</strong>", "Steal data out of the network.", "DLP; Defender for Cloud Apps (MDA) controls."],
        ["<strong>Impact</strong>", "Destroy, encrypt, or disrupt (ransomware).", "Immutable backups; MDE ransomware protection."]
      ]},
      { type: "callout", variant: "interview", html: "<p>Name the framework precisely: <strong>MITRE ATT&amp;CK</strong> for adversary tactics &amp; techniques, the <strong>Cyber Kill Chain</strong> for the older 7-stage Lockheed Martin model. Interviewers love when you map an alert to a technique ID (e.g. T1558.003 Kerberoasting).</p>" }
    ]
  },

  /* ============================================================= 9 */
  {
    id: "powershell",
    icon: "💻",
    title: "PowerShell & Graph One-Liners",
    blurb: "Copy-paste commands for triage and identity tasks.",
    blocks: [
      { type: "callout", variant: "warn", html: "<p>The old <strong>MSOnline</strong> and <strong>AzureAD</strong> modules are retired — use <strong>Microsoft Graph PowerShell</strong> (<code>Microsoft.Graph</code>) for all Entra ID work.</p>" },
      { type: "h3", text: "Local triage" },
      { type: "code", lang: "powershell", caption: "Who is in local Administrators?", code: [
        "Get-LocalGroupMember -Group \"Administrators\""
      ]},
      { type: "code", lang: "powershell", caption: "Recent failed logons (Event ID 4625)", code: [
        "Get-WinEvent -FilterHashtable @{ LogName = \"Security\"; Id = 4625 } -MaxEvents 50 |",
        "  Select-Object TimeCreated, @{ N = \"User\"; E = { $_.Properties[5].Value } }, Message"
      ]},
      { type: "code", lang: "powershell", caption: "Defender / antivirus health on this device", code: [
        "Get-MpComputerStatus | Select-Object AMRunningMode, RealTimeProtectionEnabled, AntivirusSignatureLastUpdated"
      ]},
      { type: "h3", text: "Microsoft Graph (Entra ID)" },
      { type: "code", lang: "powershell", caption: "Connect with least-privilege scopes", code: [
        "Connect-MgGraph -Scopes \"User.Read.All\", \"UserAuthenticationMethod.Read.All\"",
        "Get-MgUser -All -Property DisplayName, UserPrincipalName, AccountEnabled | Select-Object DisplayName, UserPrincipalName"
      ]},
      { type: "code", lang: "powershell", caption: "Find users with no strong MFA method registered", code: [
        "Get-MgReportAuthenticationMethodUserRegistrationDetail -All |",
        "  Where-Object { $_.IsMfaCapable -eq $false } |",
        "  Select-Object UserPrincipalName, IsMfaRegistered, IsMfaCapable"
      ]},
      { type: "code", lang: "powershell", caption: "Disable (block sign-in for) a user", code: [
        "Update-MgUser -UserId \"jdoe@contoso.com\" -AccountEnabled:$false",
        "# Then revoke active sessions so existing tokens stop working:",
        "Revoke-MgUserSignInSession -UserId \"jdoe@contoso.com\""
      ]},
      { type: "callout", variant: "tip", html: "<p>Disabling an account does <em>not</em> kill live tokens — always pair it with <code>Revoke-MgUserSignInSession</code> during an incident.</p>" }
    ]
  },

  /* ============================================================= 10 */
  {
    id: "identity-flows",
    icon: "🪪",
    title: "Identity Protocols & Hybrid",
    blurb: "OAuth vs OIDC vs SAML vs SCIM, hybrid sign-in, and roles vs principals.",
    blocks: [
      { type: "h3", text: "The four protocols" },
      { type: "table", headers: ["Protocol", "Purpose", "Token / format"], rows: [
        ["<strong>OAuth 2.0</strong>", "Authorization — let an app call an API on your behalf.", "Access token (often JWT)."],
        ["<strong>OIDC</strong>", "Authentication built on OAuth2 — proves who you are.", "ID token (JWT)."],
        ["<strong>SAML 2.0</strong>", "Web SSO, common in enterprise apps.", "Signed XML assertion."],
        ["<strong>SCIM</strong>", "Auto-provision/deprovision users into apps.", "JSON over REST (not a sign-in token)."]
      ]},
      { type: "callout", variant: "tip", html: "<p>One-liner: <strong>OAuth = access, OIDC = identity, SAML = older XML SSO, SCIM = user provisioning.</strong> OIDC is OAuth2 plus an ID token.</p>" },
      { type: "h3", text: "Hybrid sign-in — where the password is checked" },
      { type: "table", headers: ["Method", "Where password is validated", "Trade-off"], rows: [
        ["<strong>PHS</strong> (Password Hash Sync)", "In Entra ID (a hash-of-the-hash is synced).", "Simplest &amp; most resilient; enables leaked-credential detection. Recommended default."],
        ["<strong>PTA</strong> (Pass-Through Auth)", "On-prem AD via a lightweight agent.", "Password never stored in cloud, but needs available agents on-prem."],
        ["<strong>Federation</strong> (e.g. AD FS)", "On-prem IdP that issues the token.", "Most control/flexibility, but most infrastructure and biggest attack surface."]
      ]},
      { type: "h3", text: "Roles vs principals (don't mix these up)" },
      { type: "table", headers: ["Pair", "Difference"], rows: [
        ["<strong>Azure RBAC</strong> vs <strong>Entra roles</strong>", "Azure RBAC controls <em>Azure resources</em> (subscriptions, VMs); Entra roles control the <em>directory/tenant</em> (users, apps, CA)."],
        ["<strong>App registration</strong>", "The global definition/blueprint of an app (one per app)."],
        ["<strong>Service principal</strong>", "The local instance/identity of that app in a tenant — what gets permissions."],
        ["<strong>Managed identity</strong>", "An Azure-managed service principal with no secrets you handle (system- or user-assigned)."]
      ]},
      { type: "callout", variant: "interview", html: "<p><strong>Why managed identities?</strong> They remove stored secrets/keys — Azure rotates the credential for you, so there's nothing to leak in code or config.</p>" }
    ]
  },

  /* ============================================================= 11 */
  {
    id: "star",
    icon: "⭐",
    title: "STAR Story Template",
    blurb: "Frame behavioural answers, plus three lab stories a junior can adapt.",
    blocks: [
      { type: "p", html: "STAR keeps behavioural answers focused: set the scene fast, then spend most of your time on <strong>Action</strong> and <strong>Result</strong>." },
      { type: "table", headers: ["Slot", "What to say", "Time"], rows: [
        ["<strong>S — Situation</strong>", "One or two sentences of context.", "~10%"],
        ["<strong>T — Task</strong>", "Your specific goal or responsibility.", "~10%"],
        ["<strong>A — Action</strong>", "What <em>you</em> did, step by step (use “I” not “we”).", "~60%"],
        ["<strong>R — Result</strong>", "The outcome, ideally measurable + what you learned.", "~20%"]
      ]},
      { type: "h3", text: "Blank fill-in template" },
      { type: "kv", items: [
        { k: "Situation", v: "______ (context: where, what system, what was at stake)." },
        { k: "Task", v: "______ (what I had to achieve)." },
        { k: "Action", v: "______ (the concrete steps I took, the tools I used)." },
        { k: "Result", v: "______ (outcome + metric + lesson learned)." }
      ]},
      { type: "h3", text: "Three ready-to-adapt lab stories" },
      { type: "callout", variant: "lab", title: "Story 1 — Built Conditional Access", html: "<p><strong>S:</strong> In my home M365 dev tenant I had no access controls. <strong>T:</strong> Enforce MFA without locking myself out. <strong>A:</strong> Created break-glass admins and excluded them, ran a require-MFA policy in report-only, reviewed impact, then enforced it and blocked legacy auth. <strong>R:</strong> All sign-ins required MFA, legacy protocols were closed, and I learned why report-only and break-glass exist.</p>" },
      { type: "callout", variant: "lab", title: "Story 2 — Caught a risky sign-in in Sentinel", html: "<p><strong>S:</strong> I ingested my tenant's sign-in logs into Sentinel. <strong>T:</strong> Detect suspicious authentication. <strong>A:</strong> Wrote a KQL query over <code>SigninLogs</code> filtering ResultType 50126 and grouping by user/IP, then built an analytics rule to alert on spikes. <strong>R:</strong> Caught a simulated password-spray and triaged it end to end, learning KQL and the alert lifecycle.</p>" },
      { type: "callout", variant: "lab", title: "Story 3 — Automated offboarding with Graph", html: "<p><strong>S:</strong> Manual leaver cleanup was error-prone. <strong>T:</strong> Make offboarding repeatable. <strong>A:</strong> Wrote a Microsoft Graph PowerShell script to disable the account, revoke sessions, and remove group memberships. <strong>R:</strong> A leaver was deprovisioned in seconds with an audit trail; I learned Graph scopes and least privilege.</p>" }
    ]
  },

  /* ============================================================= 12 */
  {
    id: "closing",
    icon: "🤝",
    title: "Interview Closers",
    blurb: "Questions to ask, instant-fail mistakes, and your 60-90s self-intro.",
    blocks: [
      { type: "h3", text: "Questions to ASK the interviewer" },
      { type: "list", items: [
        "What does success look like in the first 90 days of this role?",
        "How is the security team structured — SOC tiers, who owns identity, who owns endpoint?",
        "Which Microsoft tools do you run today (Sentinel, Defender XDR, Intune, Entra)?",
        "What's the biggest security challenge the team is focused on right now?",
        "How do alerts flow from detection to response here — what does on-call look like?",
        "How does the team keep skills current — labs, training budget, cert support?",
        "What do your strongest junior analysts do differently?",
        "What's the path from this role in a year or two?",
        "Is there anything in my background you'd like me to expand on before we finish?"
      ]},
      { type: "h3", text: "Things that instantly fail you" },
      { type: "callout", variant: "warn", title: "Avoid these", html: "<ul><li>Bluffing a confident wrong answer instead of reasoning out loud.</li><li>Bad-mouthing a former employer or teammate.</li><li>Not knowing the basics in the job description you applied for.</li><li>No questions for the interviewer (“No, I'm good” reads as no interest).</li><li>Claiming a tool or project you can't actually explain.</li><li>Sloppy security hygiene in your own examples (e.g. shared admin accounts, no MFA).</li><li>Rambling with no structure — no STAR, no point.</li></ul>" },
      { type: "h3", text: "Your 60-90 second self-intro" },
      { type: "olist", items: [
        "<strong>Present</strong> — who you are now and what you've been building (“I've been building hands-on Microsoft security skills...”).",
        "<strong>Path</strong> — one or two concrete proofs: a home lab, Conditional Access, KQL hunting, a cert in progress.",
        "<strong>Why this role</strong> — connect your stack to what this team needs, and show genuine interest."
      ]},
      { type: "callout", variant: "tip", html: "<p>Close strong: <strong>thank them, restate your interest in one sentence, and ask about next steps.</strong> Send a short thank-you note the same day.</p>" }
    ]
  }

];
