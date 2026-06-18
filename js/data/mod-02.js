/* Module 2 — Active Directory & On-Prem Identity
   Follows the mod-01 gold-standard template:
   - JS strings use DOUBLE quotes "..."; HTML attributes inside use SINGLE quotes '...'.
   - Code blocks are arrays of lines; Windows paths use DOUBLE backslashes (C:\\Windows).
   - No backticks, no template literals.
   Block types: p, h, h3, list, olist, steps, quote, divider,
     callout {variant: info|tip|warn|danger|interview|lab|analogy},
     code {lang, caption, code:[...]}, table {headers, rows}, kv {items:[{k,v}]}. */
window.COURSE.modules.push({
  id: "mod-02",
  number: 2,
  icon: "🏛️",
  title: "Active Directory & On-Prem Identity",
  tagline: "Domains, forests, Kerberos, Group Policy — and the AD attacks (Kerberoasting, DCSync, Golden Ticket) every blue-teamer is grilled on.",
  estMinutes: 100,
  objectives: [
    "Describe AD structure (forest, domain, OU, GPO) and explain why the <strong>forest</strong> — not the domain — is the security boundary.",
    "Explain <strong>Kerberos vs. NTLM</strong>, the ticket flow (TGT/TGS/SPN), and where each protocol is used.",
    "Walk through the major AD attacks — <strong>Kerberoasting, DCSync, Golden/Silver Ticket, Pass-the-Hash</strong> — and how each works.",
    "Recommend concrete AD defenses: tiered admin, LAPS, gMSA, Protected Users, and the events to monitor.",
    "Locate identity data (NTDS.dit, the krbtgt account) and explain why it is so sensitive."
  ],
  lessons: [
    /* ---------------------------------------------------------------- */
    {
      id: "2-1",
      title: "What Active Directory is & how it's structured",
      subtitle: "The directory at the heart of the enterprise",
      blocks: [
        { type: "p", html: "In Module 1 identity started on one machine — the SAM database, local users, local SIDs. That model collapses the moment you have more than a handful of computers. Nobody wants to create the same account on 5,000 machines. <strong>Active Directory (AD)</strong> solves that: it is a <strong>centralised directory service</strong> that stores users, groups, computers, and policy once, and lets every domain-joined machine ask it “who is this and what may they do?”" },
        { type: "callout", variant: "analogy", html: "<p>Think of Active Directory as the <strong>head office HR + facilities database</strong> for a whole company. Instead of every branch keeping its own paper list of employees and door codes, there's one authoritative directory: hire someone once, and every building, every shared printer, every app trusts that record. A <strong>Domain Controller</strong> is a branch of that head office that can answer questions and check ID cards.</p>" },
        { type: "h", text: "It's a database that speaks LDAP" },
        { type: "p", html: "Under the hood AD is a <strong>database</strong> queried with the <strong>LDAP</strong> protocol (Lightweight Directory Access Protocol, TCP 389 / 636 for LDAPS). That database lives in a single file on each Domain Controller: <code>NTDS.dit</code> (in <code>C:\\Windows\\NTDS\\</code>). That file contains every object — <em>including the password hashes of every account in the domain</em>. Memorise that fact now: NTDS.dit is the crown jewel, and several attacks later in this module exist purely to get its contents." },
        { type: "h", text: "Domains, trees & forests" },
        { type: "kv", items: [
          { k: "Domain", v: "An administrative + replication boundary of objects sharing a namespace, e.g. <code>corp.contoso.com</code>. Authentication and policy are managed here." },
          { k: "Tree", v: "One or more domains sharing a contiguous DNS namespace in a parent-child hierarchy, e.g. <code>contoso.com</code> ➜ <code>emea.contoso.com</code>. Linked by automatic two-way transitive trusts." },
          { k: "Forest", v: "One or more trees sharing a common schema, configuration, and Global Catalog. The forest is the <strong>top of the tree</strong> and — this is the key exam point — the true <strong>security boundary</strong>." }
        ]},
        { type: "callout", variant: "warn", title: "The forest is the security boundary — NOT the domain", html: "<p>Juniors say “the domain is the security boundary.” Wrong, and interviewers pounce on it. Because all domains in a forest trust each other and share a schema, an attacker who becomes <strong>Enterprise Admin</strong> or who compromises the forest root effectively owns <em>every</em> domain in the forest. If you need to truly isolate two environments, you need <strong>separate forests</strong>, not separate domains.</p>" },
        { type: "h", text: "Organizational Units (OUs)" },
        { type: "p", html: "Inside a domain you organise objects into <strong>Organizational Units (OUs)</strong> — folder-like containers. OUs exist for two practical reasons: <strong>(1)</strong> to attach <strong>Group Policy</strong> (settings) to a set of objects, and <strong>(2)</strong> to <strong>delegate administration</strong> (e.g. let the helpdesk reset passwords only for the Sales OU). OUs are <em>not</em> for assigning permissions to files — that's what groups are for (next lesson)." },
        { type: "h", text: "Domain Controllers & the Global Catalog" },
        { type: "list", items: [
          "<strong>Domain Controller (DC)</strong> — a server running the AD DS role that holds a writable copy of the domain database, authenticates users (it runs the Kerberos KDC), and applies policy. You always want at least two for resilience.",
          "<strong>Global Catalog (GC)</strong> — a special DC role holding a partial, read-only copy of <em>every</em> object in the <em>entire forest</em>. It answers forest-wide searches and is required at logon to resolve Universal group membership (TCP 3268 / 3269).",
          "<strong>RODC</strong> — a Read-Only Domain Controller, used in low-trust locations like branch offices; it can cache only selected credentials."
        ]},
        { type: "h", text: "The 5 FSMO roles" },
        { type: "p", html: "Most of AD is multi-master — any DC can take changes and they replicate to the others. But five jobs cannot tolerate conflicts, so they live on a single DC each. These are the <strong>FSMO (Flexible Single Master Operation)</strong> roles. Two are <em>forest-wide</em>, three are <em>per-domain</em>. Name all five in an interview and you instantly sound senior." },
        { type: "table", headers: ["FSMO role", "Scope", "What it does"], rows: [
          ["<strong>Schema Master</strong>", "Forest (1 per forest)", "The only DC allowed to modify the AD schema (object/attribute definitions)."],
          ["<strong>Domain Naming Master</strong>", "Forest (1 per forest)", "Controls adding/removing domains and application partitions in the forest."],
          ["<strong>RID Master</strong>", "Domain (1 per domain)", "Hands out blocks of RIDs to each DC so new SIDs are always unique."],
          ["<strong>PDC Emulator</strong>", "Domain (1 per domain)", "Authoritative time source, primary for password changes, account lockout, GPO edits. The most important one to keep healthy."],
          ["<strong>Infrastructure Master</strong>", "Domain (1 per domain)", "Keeps cross-domain object references (SID-to-name) up to date."]
        ]},
        { type: "callout", variant: "tip", html: "<p>Mnemonic for the two <em>forest-wide</em> roles: <strong>S</strong>chema and <strong>D</strong>omain-Naming are unique to the whole forest (think “<strong>S</strong>tructure &amp; <strong>D</strong>esign”). The other three (RID, PDC, Infrastructure) repeat in every domain. The <strong>PDC Emulator</strong> is the one a security analyst cares about most, because it's the time master — and Kerberos breaks if clocks drift.</p>" },
        { type: "h", text: "Sites & replication" },
        { type: "p", html: "AD models physical topology with <strong>Sites</strong> (defined by IP subnets). Replication of the NTDS.dit between DCs is fast within a site and scheduled/compressed between sites over <em>site links</em>. Sites also help a client find the nearest DC at logon. For a defender, replication matters because the <strong>DCSync</strong> attack (Lesson 6) masquerades as a DC asking for replication data." },
        { type: "code", lang: "powershell", caption: "Discover the forest, domain, DCs and FSMO holders", code: [
          "# Forest and domain shape",
          "Get-ADForest  | Select-Object Name, ForestMode, Domains, GlobalCatalogs, SchemaMaster, DomainNamingMaster",
          "Get-ADDomain  | Select-Object DNSRoot, DomainMode, PDCEmulator, RIDMaster, InfrastructureMaster",
          "",
          "# List every Domain Controller in the domain",
          "Get-ADDomainController -Filter * | Select-Object Name, Site, IsGlobalCatalog, OperatingSystem",
          "",
          "# Old-school but reliable FSMO check",
          "netdom query fsmo"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Is the domain or the forest the security boundary in Active Directory?”</strong> The <strong>forest</strong> is the security boundary. Domains are administrative and replication boundaries, but every domain in a forest shares a schema and trusts the others, so a forest-level compromise (e.g. Enterprise Admin or the forest-root DC) reaches every domain. True isolation between two business units requires separate <em>forests</em>.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "2-2",
      title: "Objects: users, groups, computers & OUs",
      blocks: [
        { type: "p", html: "Everything in AD is an <strong>object</strong> with attributes. The four you live and breathe are <strong>users, groups, computers, and OUs</strong>. Getting groups right — their <em>type</em> and their <em>scope</em> — is one of the most common things that goes wrong in real networks and a favourite whiteboard question." },
        { type: "h", text: "Security groups vs. distribution groups" },
        { type: "kv", items: [
          { k: "Security group", v: "Has a SID and can be placed on an ACL — i.e. you grant <em>permissions</em> to it. This is what you use for access control. Can also be emailed." },
          { k: "Distribution group", v: "No SID, cannot be used for permissions. It exists only as an email distribution list (used by Exchange). Putting one on a DACL does nothing." }
        ]},
        { type: "callout", variant: "warn", html: "<p>A classic real-world bug: an admin grants a folder to a <em>distribution</em> group and is baffled when nobody gets access. Distribution groups carry no SID, so they're invisible to the access-check. If it controls access, it must be a <strong>security</strong> group.</p>" },
        { type: "h", text: "Group SCOPE — Domain Local, Global, Universal" },
        { type: "p", html: "Scope controls <em>where a group can have members from</em> and <em>where it can be used</em>. This is the bit people muddle, so here it is plainly:" },
        { type: "table", headers: ["Scope", "Can contain members from", "Can be granted permission in"], rows: [
          ["<strong>Global</strong>", "Only its own domain (users, computers, other Global groups)", "Any domain in the forest (and trusting forests)"],
          ["<strong>Domain Local</strong>", "Any domain / trusted forest (users, Global, Universal, other Domain Local)", "Only the domain it lives in"],
          ["<strong>Universal</strong>", "Any domain in the forest", "Any domain in the forest"]
        ]},
        { type: "callout", variant: "tip", title: "AGDLP — the rule that keeps groups sane", html: "<p>Microsoft's best practice for nesting: <strong>A</strong>ccounts go into <strong>G</strong>lobal groups, Global groups go into <strong>D</strong>omain <strong>L</strong>ocal groups, and the Domain Local group is what you grant the <strong>P</strong>ermission to. Across multiple domains you add Universal in the middle: <strong>AGUDLP</strong> (A ➜ G ➜ U ➜ DL ➜ P). It means you grant permissions to <em>one</em> Domain Local group on the resource and manage <em>who</em> via Global groups — clean, auditable, scalable.</p>" },
        { type: "h", text: "Computers are objects too" },
        { type: "p", html: "When a machine joins the domain it gets a <strong>computer account</strong> — a first-class security principal with its own SID and its own password (a machine password that rotates automatically every 30 days by default). Computers authenticate, receive policy, and can be placed in OUs. Domain Controllers are computer objects in the special <code>Domain Controllers</code> OU." },
        { type: "h", text: "OUs vs. groups — don't confuse them" },
        { type: "list", items: [
          "<strong>OUs</strong> are for <em>management</em>: link Group Policy to them and delegate admin rights over them. You do not grant file permissions to an OU.",
          "<strong>Groups</strong> are for <em>permissions</em>: a security group's SID goes on a DACL to grant access. You do not link a GPO to a group (you can <em>filter</em> a GPO by group, which is different)."
        ]},
        { type: "h", text: "Privileged groups you must memorise" },
        { type: "p", html: "Interviewers love well-known privileged groups and their RIDs. Be able to rattle these off and say why each is dangerous." },
        { type: "table", headers: ["Group", "RID", "Power"], rows: [
          ["<strong>Domain Admins</strong>", "512", "Full control of the domain; member of local Administrators on every domain-joined machine. The everyday crown jewel."],
          ["<strong>Enterprise Admins</strong>", "519", "Forest-wide admin across <em>all</em> domains. Lives only in the forest-root domain. The true top."],
          ["<strong>Schema Admins</strong>", "518", "Can modify the schema (rare, dangerous, permanent changes). Keep it empty except when actively changing the schema."],
          ["<strong>Account Operators</strong>", "548", "Can create/modify most accounts and groups — an under-appreciated path to escalation; treat as near-tier-0."],
          ["<strong>Administrators (built-in)</strong>", "544", "The domain's built-in Administrators group on the DCs themselves."]
        ]},
        { type: "code", lang: "powershell", caption: "Enumerate users, groups and computers (RSAT ActiveDirectory module)", code: [
          "# Find a user and key security attributes",
          "Get-ADUser -Identity jsmith -Properties MemberOf, LastLogonDate, PasswordNeverExpires, ServicePrincipalName",
          "",
          "# Who is in Domain Admins right now? (audit this regularly)",
          "Get-ADGroupMember -Identity 'Domain Admins' -Recursive | Select-Object Name, objectClass",
          "",
          "# All computers, oldest OS first (find legacy = risk)",
          "Get-ADComputer -Filter * -Properties OperatingSystem, LastLogonDate |",
          "  Sort-Object OperatingSystem | Select-Object Name, OperatingSystem, LastLogonDate",
          "",
          "# Accounts whose password never expires (a finding)",
          "Get-ADUser -Filter 'PasswordNeverExpires -eq $true' -Properties PasswordNeverExpires | Select-Object Name"
        ]},
        { type: "callout", variant: "lab", html: "<p>In a lab domain, run <code>Get-ADGroupMember -Identity 'Domain Admins' -Recursive</code>. Note <strong>-Recursive</strong> — attackers nest a group inside a privileged group so a flat membership view looks clean. Always enumerate recursively, then ask: does every one of these accounts <em>truly</em> need domain-wide power?</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Explain AGDLP.”</strong> <strong>A</strong>ccounts ➜ <strong>G</strong>lobal groups ➜ <strong>D</strong>omain <strong>L</strong>ocal groups ➜ <strong>P</strong>ermission on the resource. You assign rights to the Domain Local group on the resource, control membership via Global groups, and never put user accounts directly on ACLs. It scales, it's auditable, and it survives reorganisations. Bonus: <strong>AGUDLP</strong> inserts Universal groups for multi-domain forests.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "2-3",
      title: "Authentication: Kerberos vs NTLM",
      blocks: [
        { type: "p", html: "Active Directory supports two authentication protocols: <strong>Kerberos</strong> (the default, modern, ticket-based) and <strong>NTLM</strong> (the legacy, challenge-response fallback). You must be able to explain both flows cold — half of the AD attacks in Lesson 6 are abuses of exactly these handshakes." },
        { type: "h", text: "Kerberos — the ticket system" },
        { type: "p", html: "Every DC runs the <strong>KDC (Key Distribution Center)</strong>. Kerberos works on the idea that you authenticate <em>once</em> to get a master ticket, then exchange that for service-specific tickets — so your password is sent across the wire essentially never after the first step." },
        { type: "callout", variant: "analogy", html: "<p>Kerberos is a <strong>theme park</strong>. At the gate you show ID once and get a <strong>day wristband (the TGT)</strong>. To ride a specific attraction you swap the wristband for a <strong>single-ride ticket (a service ticket / TGS)</strong> at the booth. The ride operator only checks the ride ticket — they never see your ID again. The KDC is the gate + ticket booths; an <strong>SPN</strong> is the name of the attraction.</p>" },
        { type: "olist", items: [
          "<strong>AS-REQ / AS-REP</strong> — At logon the client proves it knows the user's password (it timestamps a request encrypted with the password-derived key — that's <em>pre-authentication</em>). The KDC's Authentication Service replies with a <strong>TGT (Ticket Granting Ticket)</strong>, encrypted with the <strong>krbtgt</strong> account's key so only the KDC can read it.",
          "<strong>TGS-REQ / TGS-REP</strong> — To reach a service (a file share, SQL, etc.) the client presents the TGT and asks for that service by its <strong>SPN (Service Principal Name)</strong>. The KDC's Ticket Granting Service returns a <strong>service ticket (TGS)</strong> encrypted with the <em>service account's</em> key.",
          "<strong>AP-REQ</strong> — The client presents the service ticket to the service. The service decrypts it with its own key, trusts the contents, and grants access. With <strong>mutual authentication</strong> the service also proves <em>its</em> identity back to the client."
        ]},
        { type: "kv", items: [
          { k: "SPN (Service Principal Name)", v: "The unique name of a service instance, e.g. <code>MSSQLSvc/sql01.corp.contoso.com:1433</code>. Kerberos uses it to find which account's key to encrypt the ticket with. SPNs are central to Kerberoasting." },
          { k: "krbtgt account", v: "A hidden domain account whose password key encrypts every TGT. Whoever knows its hash can forge any TGT — that is the Golden Ticket attack." },
          { k: "PAC (Privilege Attribute Certificate)", v: "A blob inside the ticket carrying the user's SIDs and group memberships, so the service knows your authorization without re-querying AD." },
          { k: "Time-sync requirement", v: "Tickets are timestamped; if client and DC clocks differ by more than the tolerance (5 minutes default) authentication fails. This is why the PDC Emulator is the authoritative time source." }
        ]},
        { type: "callout", variant: "warn", title: "Why clock skew breaks Kerberos", html: "<p>Because tickets include timestamps to prevent replay, a workstation whose clock has drifted &gt;5 minutes from the DC simply <em>cannot</em> authenticate with Kerberos and silently falls back to NTLM (or fails). “Users can't log on after a time/VM-snapshot issue” is a real-world Kerberos symptom — fix the time source (it chains up to the PDC Emulator).</p>" },
        { type: "h", text: "NTLM — the legacy fallback" },
        { type: "p", html: "<strong>NTLM</strong> is a challenge-response protocol used when Kerberos can't be: connecting to a host by IP address (no SPN), local accounts, workgroup machines, or older software. Flow: the server sends a random <em>challenge</em>; the client encrypts it with the user's <strong>NT hash</strong> and returns the <em>response</em>; the server (or the DC, via Netlogon) verifies it." },
        { type: "table", headers: ["", "Kerberos", "NTLM"], rows: [
          ["Style", "Ticket-based, uses a trusted KDC", "Direct challenge-response, no third party in the basic case"],
          ["Mutual auth", "Yes (server can prove itself)", "<strong>No</strong> — client can't verify the server"],
          ["Credentials on wire", "Encrypted tickets; password not resent", "A response derived from the NT hash"],
          ["Key weaknesses", "Kerberoasting, AS-REP roasting, Golden/Silver tickets", "<strong>Relay-able</strong> and <strong>Pass-the-Hash</strong> — the hash <em>is</em> the credential"],
          ["When used", "Default for domain auth by name/SPN", "Fallback: IP-based, local accounts, legacy apps"]
        ]},
        { type: "callout", variant: "danger", html: "<p>NTLM's fatal flaw: the NT hash functions as the password forever. An attacker who steals the hash never needs to crack it — they <strong>Pass-the-Hash</strong> straight into other systems. NTLM is also <strong>relay-able</strong>: an attacker who tricks you into authenticating to <em>them</em> can forward your authentication to a third server as you. This is why modern guidance is to <em>audit and then disable NTLM</em> wherever possible.</p>" },
        { type: "code", lang: "cmd", caption: "Inspect tickets, SPNs and secure channels", code: [
          ":: List the Kerberos tickets cached in your current session",
          "klist",
          "",
          ":: Find accounts that have an SPN set (these are Kerberoastable)",
          "setspn -Q */*",
          "setspn -L svc_sql        :: list SPNs for a specific account",
          "",
          ":: Verify the secure channel / which DC authenticated you",
          "nltest /sc_query:corp.contoso.com",
          "nltest /dsgetdc:corp.contoso.com"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Why is Kerberos preferred over NTLM?”</strong> Kerberos provides <strong>mutual authentication</strong> (the server proves itself too), doesn't pass a reusable secret on the wire, and centralises trust in the KDC — so it isn't relay-able the way NTLM is and isn't directly vulnerable to Pass-the-Hash. NTLM remains as a fallback for IP-based access, local accounts and legacy software, which is precisely why hardened environments audit and disable it.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "2-4",
      title: "Group Policy (GPO)",
      blocks: [
        { type: "p", html: "<strong>Group Policy</strong> is how you push configuration and security settings to thousands of users and computers from one place. A <strong>GPO (Group Policy Object)</strong> is a bundle of settings; you <em>link</em> it to a Site, Domain, or OU and it applies to the objects underneath. It is the single most powerful management lever in AD — and therefore a powerful attack lever too." },
        { type: "callout", variant: "analogy", html: "<p>Think of GPOs as <strong>company dress codes posted on the wall</strong>. There's a code on the lobby (Site), one for the whole building (Domain), and one for each department's floor (OU). If two codes conflict, the one posted <em>closest to your desk</em> (the OU) is the one you follow. That “closest wins” rule is the whole game.</p>" },
        { type: "h", text: "Processing order: L-S-D-O-U (last writer wins)" },
        { type: "p", html: "GPOs apply in a fixed order, and where settings conflict, the <em>later</em> one overwrites the earlier. Remember <strong>LSDOU</strong>:" },
        { type: "olist", items: [
          "<strong>L</strong>ocal — the machine's own local policy (applies first, weakest).",
          "<strong>S</strong>ite — policies linked to the AD Site.",
          "<strong>D</strong>omain — policies linked to the domain (e.g. the Default Domain Policy with the password policy).",
          "<strong>O</strong>rganizational <strong>U</strong>nit — policies on the OU, processed parent-to-child, the <em>nearest OU last</em>. Because it applies last, the OU closest to the object normally wins."
        ]},
        { type: "h", text: "Overriding the order: Block Inheritance & Enforced" },
        { type: "kv", items: [
          { k: "Block Inheritance", v: "Set on an OU to stop GPOs from higher up (Site/Domain) flowing down to it. Use sparingly — it makes troubleshooting painful." },
          { k: "Enforced (formerly No Override)", v: "Set on a GPO link to force it to apply and win conflicts <em>even through</em> a Block Inheritance and even against closer OUs. Enforced beats everything." },
          { k: "Security filtering", v: "Restrict a GPO to apply only to specific users/computers/groups (via the GPO's ACL) rather than everyone in the linked container." },
          { k: "WMI filtering", v: "Apply a GPO only where a WMI query is true, e.g. only on laptops or only on Windows 11." }
        ]},
        { type: "callout", variant: "tip", html: "<p>The override hierarchy in one line: <strong>Enforced links win over everything</strong>; otherwise the GPO processed <em>last</em> (closest OU) wins; <strong>Block Inheritance</strong> stops inherited GPOs <em>unless</em> they're Enforced. When two GPOs are linked at the <em>same</em> container, the one with the lower <strong>Link Order number</strong> wins.</p>" },
        { type: "h", text: "What GPOs do for security" },
        { type: "list", items: [
          "<strong>Password &amp; lockout policy</strong> (set in the Default Domain Policy; fine-grained policies override per-group).",
          "<strong>Account &amp; audit policy</strong> — turn on the logging from Module 1 (process creation 4688, logon auditing) at scale.",
          "<strong>User Rights Assignment</strong> — e.g. who may log on locally, who may “Log on as a service,” deny RDP to privileged accounts on workstations (key for the tiered model in Lesson 7).",
          "<strong>Security Options</strong> — disable LM/NTLMv1, enable SMB signing, restrict NTLM, configure UAC.",
          "<strong>Software / scripts / drive maps / firewall rules</strong> deployed centrally."
        ]},
        { type: "callout", variant: "danger", title: "The GPP cpassword vulnerability (MS14-025)", html: "<p>Older <strong>Group Policy Preferences (GPP)</strong> let admins push a local-account password (e.g. set the local Administrator password) via a GPO. The password was stored in an XML file in <code>SYSVOL</code> (the world-readable policy share) encrypted with an <strong>AES key Microsoft published in its own documentation</strong>. Any authenticated user could read SYSVOL, grab the <code>cpassword</code> value, and trivially decrypt it. MS14-025 removed the ability to set new ones, but <em>old XML files often still sit in SYSVOL</em>. Hunt for them — it's a five-minute domain-admin win for attackers and a standard pentest finding.</p>" },
        { type: "code", lang: "cmd", caption: "Apply, refresh and audit Group Policy", code: [
          ":: What policies apply to me / this computer, and from where?",
          "gpresult /r",
          "gpresult /h C:\\Temp\\gpreport.html   :: full HTML report",
          "",
          ":: Force a re-apply now instead of waiting for the 90-min cycle",
          "gpupdate /force",
          "",
          ":: Hunt for the GPP cpassword leak in SYSVOL",
          "findstr /S /I cpassword \\\\corp.contoso.com\\SYSVOL\\corp.contoso.com\\Policies\\*.xml"
        ]},
        { type: "code", lang: "powershell", caption: "Manage GPOs with the GroupPolicy module", code: [
          "Get-GPO -All | Select-Object DisplayName, GpoStatus, ModificationTime",
          "Get-GPOReport -Name 'Default Domain Policy' -ReportType Html -Path C:\\Temp\\ddp.html",
          "",
          "# Where is a GPO linked, and is the link Enforced?",
          "(Get-GPInheritance -Target 'OU=Workstations,DC=corp,DC=contoso,DC=com').GpoLinks"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Two GPOs set the same setting to different values — which wins?”</strong> By default the one processed <strong>last</strong> wins, and LSDOU means the GPO on the <em>closest OU</em> is processed last, so it normally wins over Domain/Site. The exceptions: a link marked <strong>Enforced</strong> always wins (even over Block Inheritance and closer OUs), and at the <em>same</em> container the lowest <strong>link order number</strong> wins. I'd confirm the real result with <code>gpresult /r</code> rather than reason it out.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "2-5",
      title: "DNS, trusts & boundaries",
      blocks: [
        { type: "p", html: "Two infrastructure topics quietly underpin everything in AD: <strong>DNS</strong> (how clients <em>find</em> domain services) and <strong>trusts</strong> (how separate domains/forests authenticate each other). Get either wrong and AD breaks in confusing ways — and both are exam staples." },
        { type: "h", text: "AD's hard dependency on DNS" },
        { type: "p", html: "Active Directory cannot function without DNS. Clients don't know where the DCs are — they <em>ask DNS</em>. AD publishes <strong>SRV (service) records</strong> that advertise “here is a Kerberos KDC,” “here is an LDAP server,” “here is a Global Catalog” for each domain and site. If DNS is misconfigured, clients can't locate a DC and logon, Group Policy, and replication all fail." },
        { type: "kv", items: [
          { k: "SRV records", v: "Service-locator records like <code>_ldap._tcp.dc._msdcs.corp.contoso.com</code> and <code>_kerberos._tcp</code>. They tell clients which host and port provides each AD service." },
          { k: "_msdcs zone", v: "A special DNS zone holding the locator records that make domain controller discovery and forest-wide GC location work. If <code>_msdcs</code> is broken, replication and trusts break." },
          { k: "Dynamic DNS (DDNS)", v: "DCs and clients register their own records automatically; AD-integrated DNS zones are stored in AD itself and replicate with it." }
        ]},
        { type: "callout", variant: "tip", html: "<p>Field rule of thumb: <strong>~80% of weird AD problems are really DNS problems.</strong> Domain-joined machines should point <em>only</em> at internal DCs/DNS servers — never at a public resolver like 8.8.8.8 as their primary — or SRV lookups for the domain fail and logons get slow or break.</p>" },
        { type: "h", text: "Trusts — letting one domain trust another" },
        { type: "p", html: "A <strong>trust</strong> is an authentication link that lets users in one domain/forest be authenticated by another. Within a forest, parent-child trusts are created automatically. You create explicit trusts to reach <em>other</em> forests (e.g. after a merger)." },
        { type: "table", headers: ["Property", "Meaning"], rows: [
          ["<strong>Direction: one-way</strong>", "Domain A trusts Domain B — users in B can access resources in A, but not vice-versa. (Trust direction is opposite to access direction.)"],
          ["<strong>Direction: two-way</strong>", "Both domains trust each other; users in either can be granted access in the other."],
          ["<strong>Transitive</strong>", "Trust flows through a chain: if A trusts B and B trusts C, then A trusts C. Intra-forest and forest trusts are transitive."],
          ["<strong>Non-transitive</strong>", "Trust stops at the two named domains; it does not chain. External trusts are non-transitive."],
          ["<strong>Parent-child</strong>", "Automatic, two-way, transitive trusts created between domains in the same tree/forest."],
          ["<strong>Forest trust</strong>", "An explicit trust between two whole forests' root domains; transitive within each forest. Used for mergers and B2B."]
        ]},
        { type: "callout", variant: "warn", title: "Trusts widen the attack surface", html: "<p>A trust says “I will accept tickets issued by that other authority.” If the trusted forest is compromised, that compromise can ride the trust into yours. This is the practical reason the <strong>forest is the security boundary</strong>: a trust extends authentication across forests, but it does not magically make two forests one security domain — you must still defend each, and design trusts with the least access needed.</p>" },
        { type: "h", text: "SID filtering — the guardrail on a trust" },
        { type: "p", html: "Every Kerberos ticket carries a <strong>SID History</strong> field (originally for migrations, so a moved user keeps access via their old SID). An attacker in a trusted-but-compromised forest could stuff a <em>privileged SID from your forest</em> into SID History and try to ride the trust as your Domain Admin. <strong>SID filtering</strong> (a.k.a. quarantine) is the defence: the trusting domain strips foreign SIDs that don't belong to the trusted domain. It is enabled by default on forest and external trusts — <em>do not disable it</em> without a very good reason." },
        { type: "code", lang: "powershell", caption: "Check DNS locator records and existing trusts", code: [
          "# Confirm the domain's SRV records resolve (DC locator health)",
          "nslookup -type=SRV _ldap._tcp.dc._msdcs.corp.contoso.com",
          "Resolve-DnsName -Type SRV _kerberos._tcp.corp.contoso.com",
          "",
          "# List all trusts and their direction/transitivity",
          "Get-ADTrust -Filter * | Select-Object Name, Direction, TrustType, IntraForest, SIDFilteringQuarantined",
          "",
          "# Old-school trust check",
          "nltest /domain_trusts /all_trusts"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Why is the forest the security boundary, and what does SID filtering protect against?”</strong> Because all domains in a forest share a schema and auto-trust each other, so compromise spreads forest-wide; separate forests + explicit trusts are how you isolate. <strong>SID filtering</strong> protects a trust by discarding foreign SIDs (especially privileged ones smuggled in via SID History) from tickets crossing the trust, blocking a compromised trusted forest from escalating into yours.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "2-6",
      title: "Attacking Active Directory",
      subtitle: "The big interview lesson",
      blocks: [
        { type: "p", html: "This is the lesson interviewers spend the most time on. You don't need to <em>run</em> these attacks to land a blue-team job, but you absolutely must be able to <strong>explain how each works, what it abuses, and how to defend</strong>. We'll walk the attacker's path: enumerate ➜ steal/forge credentials ➜ escalate to domain dominance." },
        { type: "callout", variant: "danger", title: "Everything below assumes a foothold", html: "<p>Almost every AD attack starts <em>after</em> the attacker has one domain account (from phishing) or one compromised workstation. From there, AD's openness — any user can query the directory and request tickets — does a lot of the work. That openness is the recurring theme.</p>" },
        { type: "h", text: "1. Enumeration (BloodHound & attack paths)" },
        { type: "p", html: "Any authenticated user can read most of AD. Tools like <strong>BloodHound</strong> (with the SharpHound collector) gather users, groups, sessions, ACLs, and trusts, then use <strong>graph theory</strong> to compute the shortest path from “the account I control” to “Domain Admin.” It turns a sprawling directory into a literal map of attack paths (e.g. <em>“user A can reset user B's password, B is in a group that has GenericAll over a DA — three hops to domain takeover”</em>). Defenders run it too, to find and cut those paths first." },
        { type: "h", text: "2. Kerberoasting" },
        { type: "p", html: "The single most-asked AD attack. <strong>Any authenticated user can request a service ticket (TGS) for any account that has an SPN.</strong> That ticket is encrypted with the <em>service account's password key</em>. The attacker requests the ticket, takes it offline, and brute-forces/cracks it — recovering the service account's plaintext password. Service accounts are juicy because they're often highly privileged and have weak, non-expiring passwords." },
        { type: "olist", items: [
          "Find accounts with an SPN (<code>setspn -Q */*</code> or an LDAP query) — these are user accounts running services.",
          "Request a TGS for that SPN (legitimate Kerberos, generates a normal-looking event 4769).",
          "Export the encrypted ticket and crack it offline with Hashcat/John — no further interaction with the DC, so it's quiet.",
          "Recover the service account password and log in as that (often privileged) account."
        ]},
        { type: "callout", variant: "tip", title: "Kerberoasting defences", html: "<ul><li>Use <strong>Group Managed Service Accounts (gMSA)</strong> / dMSA — the domain generates and rotates a 240-character random password no human knows, so cracking is infeasible.</li><li>If you must use a normal service account, give it a <strong>long (25+ char) random password</strong> and rotate it.</li><li><strong>Minimise SPNs</strong> and never put service accounts in Domain Admins.</li><li>Prefer <strong>AES</strong> encryption (disable RC4) — RC4 tickets crack far faster.</li><li>Watch event <strong>4769</strong>, especially RC4 ticket requests for many SPNs from one user in a short window.</li></ul>" },
        { type: "h", text: "3. AS-REP Roasting" },
        { type: "p", html: "A cousin of Kerberoasting. If an account has <strong>“Do not require Kerberos pre-authentication”</strong> set, the KDC will hand out the encrypted AS-REP <em>without the attacker proving they know the password</em>. That AS-REP is encrypted with the user's password key, so the attacker cracks it offline — no foothold credential even needed if the account is known. <strong>Defence:</strong> never disable pre-authentication (audit for <code>DONT_REQ_PREAUTH</code>) and use strong passwords." },
        { type: "h", text: "4. Credential reuse: Pass-the-Hash, Pass-the-Ticket, Overpass-the-Hash" },
        { type: "table", headers: ["Technique", "What is reused", "Idea"], rows: [
          ["<strong>Pass-the-Hash (PtH)</strong>", "An NTLM hash", "NTLM treats the hash as the credential, so the attacker authenticates with the hash directly — no cracking needed. (NTLM only.)"],
          ["<strong>Pass-the-Ticket (PtT)</strong>", "A stolen Kerberos ticket (TGT or TGS)", "Inject a ticket lifted from LSASS into a new session and use it until it expires."],
          ["<strong>Overpass-the-Hash</strong>", "An NTLM hash ➜ a Kerberos TGT", "Use the stolen NT hash to request a real TGT (a.k.a. pass-the-key), upgrading an NTLM secret into Kerberos access."]
        ]},
        { type: "h", text: "5. Golden Ticket vs Silver Ticket" },
        { type: "p", html: "These are <em>forgery</em> attacks — the attacker doesn't request a legitimate ticket, they mint their own." },
        { type: "kv", items: [
          { k: "Golden Ticket", v: "Forge a <strong>TGT</strong> using the <strong>krbtgt account's hash</strong>. Because every TGT is encrypted with the krbtgt key, anyone with that hash can forge a TGT for <em>any user with any group membership</em> — including a non-existent Domain Admin — valid for years. It is total, persistent domain compromise." },
          { k: "Silver Ticket", v: "Forge a <strong>service ticket (TGS)</strong> using a single <em>service account's</em> hash. Scope is limited to that one service, but it's stealthier because the KDC is never contacted (no 4769 on the DC)." }
        ]},
        { type: "callout", variant: "danger", title: "Why the Golden Ticket is catastrophic", html: "<p>The <strong>krbtgt</strong> account's key signs and encrypts every TGT in the domain. Steal that hash (typically via DCSync or by reading NTDS.dit) and you can forge a ticket asserting you are <em>anyone</em>, in <em>any</em> group, for a lifetime you choose — bypassing password resets entirely. The only true remediation is to <strong>reset the krbtgt password twice</strong> (twice, because two key versions are kept) to invalidate every forged ticket. That's why “protect krbtgt” is treated as protecting the kingdom.</p>" },
        { type: "h", text: "6. DCSync" },
        { type: "p", html: "DCs replicate the directory — including password hashes — to each other using the <strong>Directory Replication Service (DRS)</strong> protocol. <strong>DCSync</strong> abuses this: a tool (Mimikatz, Impacket secretsdump) <em>pretends to be a DC</em> and asks a real DC to replicate account secrets — pulling the NT hash of any user, including <strong>krbtgt</strong> and Domain Admins, <em>without ever touching the DC's disk or LSASS</em>." },
        { type: "callout", variant: "warn", title: "What rights does DCSync need?", html: "<p>DCSync does <em>not</em> require local admin on a DC. It needs the directory <strong>extended rights</strong> normally held only by DCs and high admins: <strong>Replicating Directory Changes</strong> and <strong>Replicating Directory Changes All</strong> (and often <em>Replicating Directory Changes In Filtered Set</em>) on the domain object. A common escalation is finding a non-tier-0 account that was <em>accidentally granted</em> these replication rights. Audit who holds them — this is a classic interview answer.</p>" },
        { type: "h", text: "7. LLMNR / NBT-NS poisoning + NTLM relay" },
        { type: "p", html: "When a Windows host can't resolve a name via DNS, it falls back to broadcast protocols <strong>LLMNR</strong> and <strong>NBT-NS</strong> asking “does anyone know this host?” An attacker on the LAN (with <strong>Responder</strong>) answers “yes, it's me,” the victim then authenticates to the attacker, leaking an NTLMv2 response to crack — or, worse, the attacker <strong>relays</strong> that authentication straight to another server (e.g. via <strong>ntlmrelayx</strong>) and acts as the victim. <strong>Defence:</strong> disable LLMNR &amp; NBT-NS via GPO, enforce <strong>SMB signing</strong>, and disable/restrict NTLM." },
        { type: "h", text: "Mapping to MITRE ATT&CK" },
        { type: "table", headers: ["Attack", "ATT&CK technique"], rows: [
          ["Kerberoasting", "T1558.003 — Steal or Forge Kerberos Tickets: Kerberoasting"],
          ["AS-REP Roasting", "T1558.004 — Steal or Forge Kerberos Tickets: AS-REP Roasting"],
          ["Golden Ticket", "T1558.001 — Steal or Forge Kerberos Tickets: Golden Ticket"],
          ["Pass-the-Hash", "T1550.002 — Use Alternate Authentication Material: Pass the Hash"],
          ["DCSync", "T1003.006 — OS Credential Dumping: DCSync"],
          ["LLMNR/NBT-NS poisoning", "T1557.001 — Adversary-in-the-Middle: LLMNR/NBT-NS Poisoning and SMB Relay"]
        ]},
        { type: "code", lang: "powershell", caption: "Defensive hunting: find what attackers will target", code: [
          "# Kerberoastable accounts (user accounts with an SPN)",
          "Get-ADUser -Filter { ServicePrincipalName -like '*' } -Properties ServicePrincipalName |",
          "  Select-Object Name, ServicePrincipalName",
          "",
          "# AS-REP roastable accounts (pre-auth disabled)",
          "Get-ADUser -Filter { DoesNotRequirePreAuth -eq $true } -Properties DoesNotRequirePreAuth |",
          "  Select-Object Name",
          "",
          "# Who can DCSync? Look for replication rights in the domain ACL",
          "(Get-Acl ('AD:\\' + (Get-ADDomain).DistinguishedName)).Access |",
          "  Where-Object { $_.ObjectType -eq '1131f6aa-9c07-11d1-f79f-00c04fc2dcd2' } |",
          "  Select-Object IdentityReference, ActiveDirectoryRights"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Walk me through Kerberoasting and how you'd defend against it.”</strong> Any authenticated user requests a TGS for an account that has an SPN; the ticket is encrypted with that service account's password key, so the attacker cracks it offline to recover the plaintext — service accounts are targeted because they're often privileged with weak, static passwords. Defences: <strong>gMSA</strong> (long auto-rotated passwords), strong/long passwords on the rest, fewer SPNs, keep service accounts out of Domain Admins, prefer AES over RC4, and alert on bursts of event <strong>4769</strong> (especially RC4) from one user.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "2-7",
      title: "Defending Active Directory",
      blocks: [
        { type: "p", html: "Now the blue-team payoff. AD's biggest weakness is that privileged credentials get scattered onto ordinary machines, where Module 1's credential-theft chain harvests them. Modern AD defence is mostly about <strong>containing privilege</strong> and <strong>watching the right events</strong>. These controls are exactly what an interviewer wants to hear you propose." },
        { type: "h", text: "The tiered administration model (Tier 0/1/2)" },
        { type: "p", html: "The cornerstone. You split assets and admin accounts into tiers and <strong>forbid credentials from flowing downward</strong> — a Tier 0 account must never log on to a Tier 1 or Tier 2 machine, because anything you log on to can steal your token/hash." },
        { type: "table", headers: ["Tier", "Contains", "Rule"], rows: [
          ["<strong>Tier 0</strong>", "Domain Controllers, AD, ADFS, PKI, the krbtgt — anything that controls identity", "Tier 0 admin accounts log on ONLY to Tier 0 systems. Compromise here = whole forest."],
          ["<strong>Tier 1</strong>", "Member servers and applications (file, SQL, web)", "Tier 1 admins manage servers but never touch DCs or workstations with privileged creds."],
          ["<strong>Tier 2</strong>", "Workstations and end-user devices", "Helpdesk/workstation admins live here; never reach up to servers or DCs."]
        ]},
        { type: "callout", variant: "analogy", html: "<p>Tiering is <strong>watertight bulkheads on a ship</strong>. A breach in one compartment shouldn't sink the vessel. The fatal mistake is a Domain Admin who RDPs into a help-desk workstation to “fix something” — that pokes a hole between Tier 0 and Tier 2, and one stolen token floods every compartment.</p>" },
        { type: "h", text: "LAPS — kill the shared local-admin password" },
        { type: "p", html: "Every workstation imaged from the same template often shares the <em>same</em> local Administrator password. Steal it once (e.g. Pass-the-Hash) and you own every machine. <strong>Windows LAPS</strong> (Local Administrator Password Solution, now built into Windows) sets a <strong>unique, random, auto-rotated</strong> local admin password per machine and stores it securely in AD (or Entra ID), readable only by authorised admins. It single-handedly stops lateral movement via a shared local-admin credential." },
        { type: "h", text: "Protected Users group" },
        { type: "p", html: "Add sensitive accounts (admins) to the built-in <strong>Protected Users</strong> group and Windows hardens them automatically: <strong>no NTLM, no DES/RC4, no Kerberos delegation, no long-lived ticket caching, and credentials aren't cached</strong>. It dramatically shrinks what an attacker can steal and reuse — but test first, since it can break legacy apps that rely on NTLM or delegation." },
        { type: "h", text: "Disable / limit NTLM and legacy protocols" },
        { type: "list", items: [
          "Audit NTLM first (event <strong>8004</strong> via the “Network Security: Restrict NTLM” policies), then restrict and disable it where nothing legitimate breaks.",
          "Disable <strong>LLMNR</strong> and <strong>NBT-NS</strong> via GPO and enforce <strong>SMB signing</strong> to kill poisoning + relay.",
          "Disable <strong>RC4</strong> Kerberos and require <strong>AES</strong>; remove SMBv1 and LM/NTLMv1 entirely."
        ]},
        { type: "h", text: "Rotate the krbtgt password — twice" },
        { type: "callout", variant: "danger", title: "krbtgt rotation", html: "<p>If a Golden Ticket is suspected — or just as periodic hygiene — reset the <strong>krbtgt</strong> account password. You must do it <strong>twice</strong>, with replication completing between resets, because AD keeps the current and previous key version; only after the second reset is every forged TGT invalidated. Use Microsoft's official reset script; do not just click “reset password” twice in a row without letting replication catch up, or you'll break Kerberos.</p>" },
        { type: "h", text: "Monitor the events that matter" },
        { type: "table", headers: ["Event ID", "Meaning", "Hunt for"], rows: [
          ["<strong>4768</strong>", "Kerberos TGT requested (AS-REQ)", "AS-REP roasting patterns; logons from odd hosts"],
          ["<strong>4769</strong>", "Kerberos service ticket requested (TGS)", "Kerberoasting — many SPNs / RC4 requests from one account"],
          ["<strong>4624</strong>", "Successful logon (with logon type)", "Tier-0 accounts logging on to Tier 1/2 (tier violations); odd Type 10 RDP"],
          ["<strong>4672</strong>", "Special privileges assigned at logon", "Where and when privileged logons happen — baseline and alert on anomalies"]
        ]},
        { type: "callout", variant: "tip", title: "Microsoft Defender for Identity (MDI)", html: "<p>Deploy <strong>Microsoft Defender for Identity</strong> sensors directly on your <strong>Domain Controllers</strong> (and AD FS / AD CS). MDI reads DC traffic and events to detect exactly the attacks in Lesson 6 — DCSync, Golden Ticket, Pass-the-Hash, reconnaissance, suspicious replication — and feeds them into the wider Microsoft 365 Defender / XDR portal. It's the purpose-built detection layer for on-prem AD and a name worth dropping in interviews.</p>" },
        { type: "code", lang: "powershell", caption: "A quick AD hardening audit", code: [
          "# Is anyone NOT a DC granted replication (DCSync) rights? Investigate any result.",
          "(Get-Acl ('AD:\\' + (Get-ADDomain).DistinguishedName)).Access |",
          "  Where-Object { $_.ActiveDirectoryRights -match 'ExtendedRight' } |",
          "  Select-Object IdentityReference, ActiveDirectoryRights -Unique",
          "",
          "# Who is in tier-0 groups? Keep these tiny.",
          "'Domain Admins','Enterprise Admins','Schema Admins','Account Operators' |",
          "  ForEach-Object { Get-ADGroupMember -Identity $_ -Recursive | Select-Object @{n='Group';e={$_}}, Name }",
          "",
          "# Confirm Protected Users membership for your admins",
          "Get-ADGroupMember -Identity 'Protected Users'"
        ]},
        { type: "h", text: "Bridge to the cloud" },
        { type: "p", html: "Everything in this module is <strong>on-premises</strong> AD — Kerberos, NTLM, GPO, DCs. Most organisations now also run <strong>Microsoft Entra ID</strong> (formerly Azure AD), a <em>cloud</em> identity service that does <em>not</em> use Kerberos, NTLM, OUs, or GPOs — it uses modern protocols (OAuth 2.0, OpenID Connect, SAML), Conditional Access, and MFA. The two are usually synchronised and bridged (Entra Connect, hybrid join), and that bridge is its own attack surface. We cover Entra ID in depth in <strong>Module 4</strong>." },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “What's the difference between Active Directory and Entra ID?”</strong> On-prem <strong>AD</strong> is a directory service for a corporate network: it uses <strong>Kerberos/NTLM/LDAP</strong>, organises objects in <strong>domains/forests/OUs</strong>, and is managed with <strong>Group Policy</strong> — built for domain-joined Windows machines on a LAN. <strong>Entra ID</strong> is a <strong>cloud</strong> identity provider for SaaS and modern apps: it uses <strong>OAuth/OIDC/SAML</strong>, has no OUs/GPOs/Kerberos, and is secured with Conditional Access and MFA. They're complementary, commonly synced in a hybrid setup — they are <em>not</em> the same product with a new name.</p>" },
        { type: "divider" },
        { type: "callout", variant: "tip", title: "Module 2 — Key takeaways", html: "<ul><li>AD is an <strong>LDAP-queried database</strong> stored in <strong>NTDS.dit</strong> on Domain Controllers; the <strong>forest is the security boundary</strong>, and the five <strong>FSMO</strong> roles (Schema, Domain Naming, RID, PDC Emulator, Infrastructure) are single-master jobs.</li><li>Use <strong>security</strong> groups for permissions and the <strong>AGDLP/AGUDLP</strong> nesting; know the privileged groups (Domain Admins 512, Enterprise 519, Schema 518, Account Operators 548).</li><li><strong>Kerberos</strong> (KDC, TGT via krbtgt key, service tickets by SPN, mutual auth, time-sync) is preferred; <strong>NTLM</strong> is the legacy, relay-able, Pass-the-Hash-able fallback.</li><li><strong>GPO</strong> applies <strong>LSDOU</strong> (closest OU wins) with Enforced beating Block Inheritance; old <strong>GPP cpassword</strong> XML in SYSVOL is a free domain win for attackers.</li><li>Headline attacks: <strong>Kerberoasting</strong> &amp; <strong>AS-REP roasting</strong> (crack tickets offline), <strong>DCSync</strong> (needs Replicating Directory Changes rights), <strong>Golden Ticket</strong> (forge TGTs with the krbtgt hash — reset krbtgt twice). Defend with <strong>tiering, LAPS, Protected Users, NTLM reduction, monitoring 4768/4769/4624/4672, and Defender for Identity</strong>.</li></ul>" }
      ]
    }
  ],
  quiz: [
    { q: "In Active Directory, what is the true security boundary?", options: ["The Organizational Unit (OU)", "The domain", "The forest", "The site"], answer: 2, explain: "Domains are administrative/replication boundaries, but all domains in a forest share a schema and trust each other, so a forest-level compromise reaches every domain. Real isolation requires separate forests." },
    { q: "Which file on a Domain Controller stores the AD database, including every account's password hashes?", options: ["SAM", "NTDS.dit", "SYSVOL", "ntuser.dat"], answer: 1, explain: "NTDS.dit (in C:\\Windows\\NTDS) is the AD database holding all objects and their secrets. It is the crown jewel; attacks like DCSync exist to extract its hashes." },
    { q: "Which two FSMO roles are forest-wide (exactly one per forest)?", options: ["RID Master and PDC Emulator", "Schema Master and Domain Naming Master", "Infrastructure Master and RID Master", "PDC Emulator and Infrastructure Master"], answer: 1, explain: "Schema Master and Domain Naming Master are unique to the whole forest. RID Master, PDC Emulator, and Infrastructure Master each exist once per domain." },
    { q: "Following AGDLP best practice, where do you assign the permission on a resource?", options: ["Directly to the user account", "To a Global group", "To the Domain Local group", "To an Organizational Unit"], answer: 2, explain: "AGDLP: Accounts go in Global groups, Global groups go in Domain Local groups, and the Domain Local group is granted the Permission on the resource. Membership is managed via the Global groups." },
    { q: "Why is Kerberos generally preferred over NTLM?", options: ["It is faster on the wire", "It provides mutual authentication and is not relay-able or directly vulnerable to Pass-the-Hash", "It does not require a domain controller", "It works without time synchronisation"], answer: 1, explain: "Kerberos offers mutual auth (the server proves itself), centralises trust in the KDC, and does not resend a reusable secret. NTLM lacks mutual auth and is relay-able and Pass-the-Hash-able." },
    { q: "Two GPOs set the same setting to different values. By default, which wins?", options: ["The one linked highest (Site)", "The Local Group Policy", "The one processed last — typically the GPO on the closest OU (LSDOU)", "Whichever was created first"], answer: 2, explain: "Processing order is Local, Site, Domain, OU (LSDOU); the last applied wins, so the closest OU normally wins. Exceptions: an Enforced link always wins, and at the same container the lowest link order wins." },
    { q: "Kerberoasting works because any authenticated user can do what?", options: ["Read the NTDS.dit file directly", "Request a service ticket (TGS) for any account that has an SPN, then crack it offline", "Reset any user's password", "Become a Domain Controller"], answer: 1, explain: "A TGS is encrypted with the service account's password key. The attacker requests it for an SPN-bearing account and cracks it offline to recover the plaintext. Defences: gMSA, strong passwords, fewer SPNs, AES over RC4." },
    { q: "What rights does an account need to perform a DCSync attack?", options: ["Local administrator on a Domain Controller", "Membership in Account Operators", "The 'Replicating Directory Changes' and 'Replicating Directory Changes All' extended rights on the domain", "Physical access to the server"], answer: 2, explain: "DCSync abuses the directory replication protocol; it needs the replication extended rights (normally held only by DCs and high admins), NOT local admin on a DC. Audit who holds these rights." }
  ],
  flashcards: [
    { front: "Where does AD store its data, and what's inside it?", back: "In <strong>NTDS.dit</strong> on each Domain Controller (queried via LDAP). It holds every object — and the <strong>password hashes</strong> of every account. The crown jewel." },
    { front: "Domain vs Forest — which is the security boundary?", back: "The <strong>forest</strong>. Domains are admin/replication boundaries, but a forest shares one schema and auto-trusts internally, so forest compromise = total compromise. Isolate with separate forests." },
    { front: "Name the 5 FSMO roles and their scope.", back: "Forest-wide: <strong>Schema Master</strong>, <strong>Domain Naming Master</strong>. Per-domain: <strong>RID Master</strong>, <strong>PDC Emulator</strong> (time master), <strong>Infrastructure Master</strong>." },
    { front: "Security vs Distribution group", back: "<strong>Security</strong> groups have a SID and can be placed on ACLs (permissions). <strong>Distribution</strong> groups have no SID — email lists only; useless for access control." },
    { front: "AGDLP", back: "<strong>A</strong>ccounts ➜ <strong>G</strong>lobal groups ➜ <strong>D</strong>omain <strong>L</strong>ocal groups ➜ grant the <strong>P</strong>ermission to the Domain Local group on the resource. Add Universal (AGUDLP) for multi-domain forests." },
    { front: "Key privileged groups and RIDs", back: "<strong>Domain Admins 512</strong>, <strong>Enterprise Admins 519</strong> (forest-wide), <strong>Schema Admins 518</strong>, <strong>Account Operators 548</strong>. Keep them tiny; audit recursively." },
    { front: "Kerberos flow in one breath", back: "AS-REQ/REP (prove password, get <strong>TGT</strong> encrypted with the <strong>krbtgt</strong> key) ➜ TGS-REQ/REP (present TGT, name a service by its <strong>SPN</strong>, get a service ticket) ➜ AP-REQ (present ticket to service; mutual auth). Needs synced clocks." },
    { front: "What is krbtgt and why is a Golden Ticket catastrophic?", back: "<strong>krbtgt</strong> is the account whose key encrypts every TGT. With its hash an attacker forges a TGT for <em>anyone, any group</em>, for years. Fix: <strong>reset krbtgt twice</strong> (lets replication catch up between)." },
    { front: "Kerberoasting + defences", back: "Any user requests a TGS for an SPN-bearing account and cracks it offline (it's encrypted with the service account's key). Defend with <strong>gMSA</strong>, long passwords, fewer SPNs, AES over RC4, watch event 4769." },
    { front: "DCSync — what and what rights?", back: "Pretend to be a DC and ask a real DC to replicate secrets (pulls any hash, incl. krbtgt). Needs <strong>Replicating Directory Changes (All)</strong> extended rights — NOT local admin on a DC." },
    { front: "Pass-the-Hash vs Pass-the-Ticket vs Overpass-the-Hash", back: "<strong>PtH</strong>: reuse an NTLM hash directly (NTLM only). <strong>PtT</strong>: inject a stolen Kerberos ticket. <strong>Overpass-the-Hash</strong>: use an NT hash to request a real Kerberos TGT." },
    { front: "AD vs Entra ID", back: "<strong>AD</strong> = on-prem directory: Kerberos/NTLM/LDAP, domains/forests/OUs, Group Policy. <strong>Entra ID</strong> = cloud IdP: OAuth/OIDC/SAML, Conditional Access/MFA, no OUs/GPOs/Kerberos. Complementary, often synced (Module 4)." }
  ]
});
