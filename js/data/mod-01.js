/* Module 1 — Windows OS & Security Fundamentals
   This file is the GOLD-STANDARD TEMPLATE for every other module:
   - JS strings use DOUBLE quotes "..."; HTML attributes inside use SINGLE quotes '...'.
   - Code blocks are arrays of lines; Windows paths use DOUBLE backslashes (C:\\Windows).
   - No backticks, no template literals.
   Block types: p, h, h3, list, olist, steps, quote, divider,
     callout {variant: info|tip|warn|danger|interview|lab|analogy},
     code {lang, caption, code:[...]}, table {headers, rows}, kv {items:[{k,v}]}. */
window.COURSE.modules.push({
  id: "mod-01",
  number: 1,
  icon: "🪟",
  title: "Windows OS & Security Fundamentals",
  tagline: "How Windows really works — accounts, permissions, processes, and the built-in security stack you'll be tested on.",
  estMinutes: 95,
  objectives: [
    "Explain how Windows separates <strong>authentication</strong> from <strong>authorization</strong>, and how SIDs, access tokens, and DACLs fit together.",
    "Reason correctly about <strong>NTFS vs. share permissions</strong> and effective access.",
    "Describe why <strong>LSASS</strong> and local-admin rights are the keys to credential theft — and the defenses (Credential Guard, least privilege).",
    "Name the built-in Windows security stack (Defender, BitLocker, Credential Guard, ASR, VBS) and the defense-in-depth layer each occupies.",
    "Hunt for compromise using key <strong>event IDs</strong> (4624/4625/4688/1102) and the common persistence locations."
  ],
  lessons: [
    /* ---------------------------------------------------------------- */
    {
      id: "1-1",
      title: "Why Windows is the centre of the cybersecurity universe",
      subtitle: "The lay of the land",
      blocks: [
        { type: "p", html: "Let me start the way I'd start a junior engineer's first week. Roughly <strong>70%+ of business desktops</strong> and a huge share of enterprise servers run Windows. Attackers know this. That means the overwhelming majority of real-world intrusions — phishing, ransomware, credential theft, lateral movement — happen <em>on or through Windows</em>. If you understand Windows deeply, you understand where most of the fighting actually takes place." },
        { type: "callout", variant: "analogy", html: "<p>Think of an operating system as the <strong>building management</strong> of a skyscraper: it decides who gets a keycard (authentication), which floors that card opens (authorization), keeps the lobby cameras rolling (logging), and runs the elevators and plumbing (processes & services). A security engineer is the building's head of security — you can't protect a building whose layout you don't know.</p>" },
        { type: "h", text: "Client vs. Server vs. Cloud" },
        { type: "p", html: "You will work with three flavours of Windows, and interviewers love to check you know the difference:" },
        { type: "kv", items: [
          { k: "Windows Client", v: "Windows 10 / 11 — what end-users run. The endpoint. Where phishing lands and where EDR (endpoint detection &amp; response) lives." },
          { k: "Windows Server", v: "Windows Server 2016 / 2019 / 2022 / 2025 — runs Active Directory, file shares, web apps, databases. The crown jewels are usually here." },
          { k: "Azure / Cloud", v: "The same Windows lineage, but the identity and management plane moves to <strong>Microsoft Entra ID</strong> and <strong>Intune</strong> (covered in later modules)." }
        ]},
        { type: "h", text: "Editions you should be able to name" },
        { type: "list", items: [
          "<strong>Windows 11 Home</strong> — consumer; <em>cannot</em> join a domain or be managed by Intune well. You'll rarely see it in enterprise.",
          "<strong>Windows 11 Pro</strong> — can join Active Directory / Entra ID, supports BitLocker, group policy.",
          "<strong>Windows 11 Enterprise</strong> — adds Credential Guard, Application Control (WDAC), advanced Defender features. The enterprise standard.",
          "<strong>Windows Server (Standard / Datacenter)</strong> — Datacenter adds unlimited virtualization rights and Software-Defined Networking."
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Why can't you join Windows Home to a domain?”</strong> Because domain join, Group Policy, and BitLocker management are deliberately gated to Pro/Enterprise/Education SKUs — Microsoft's licensing line. The practical security takeaway: <em>edition is a control</em>. If a user's machine is Home edition, you can't centrally manage or harden it, which is itself a risk finding.</p>" },
        { type: "callout", variant: "tip", html: "<p>Throughout this course, when you see a 🧪 <strong>Try it yourself</strong> box, open a Windows VM (or your own PC) and actually run the commands. Reading commands and running commands are two completely different skills, and interviewers can tell which one you have within 30 seconds.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "1-2",
      title: "Architecture: kernel, processes, services & the registry",
      blocks: [
        { type: "p", html: "You don't need to be a kernel developer, but you must hold a correct mental model of how Windows executes code and stores configuration. Almost every attack and every defence touches one of these four things: <strong>processes, services, the registry, and the file system</strong>." },
        { type: "h", text: "User mode vs. kernel mode" },
        { type: "p", html: "Windows runs code in two privilege rings. <strong>User mode</strong> is where your apps (browsers, Office, malware-laden documents) run — each in its own isolated virtual address space, so one crashing app can't take down others. <strong>Kernel mode</strong> is the trusted core: the kernel, device drivers, and hardware access. Code in kernel mode can do <em>anything</em>." },
        { type: "callout", variant: "danger", html: "<p>This boundary is why <strong>malicious or vulnerable drivers</strong> are so dangerous — a driver runs in kernel mode. The “Bring Your Own Vulnerable Driver” (BYOVD) technique abuses a legitimately-signed but buggy driver to get kernel execution and disable security tools. Microsoft's defence is the <strong>vulnerable driver blocklist</strong> (enabled by default on recent Windows).</p>" },
        { type: "h", text: "Processes, threads & services" },
        { type: "kv", items: [
          { k: "Process", v: "A running program with its own memory, a security token (who it runs as), and one or more threads. Example: <code>chrome.exe</code>." },
          { k: "Thread", v: "The unit the CPU actually schedules. A process has at least one." },
          { k: "Service", v: "A process that runs in the background without a logged-on user, started by the <strong>Service Control Manager (SCM)</strong>. Often runs as a high-privilege account like <code>LocalSystem</code>." }
        ]},
        { type: "p", html: "<strong>Why services matter for security:</strong> they start automatically, often run as <code>SYSTEM</code> (the most powerful local account), and are a favourite persistence and privilege-escalation target. A misconfigured service with a writable binary path is a classic local privilege-escalation finding." },
        { type: "code", lang: "powershell", caption: "Inspect processes and services with PowerShell", code: [
          "# Running processes with the account that owns them",
          "Get-Process | Select-Object Name, Id, Path -First 20",
          "Get-CimInstance Win32_Process | Select-Object Name, ProcessId, CommandLine",
          "",
          "# Services, their start mode, and the account they run as (huge for hardening)",
          "Get-CimInstance Win32_Service |",
          "  Select-Object Name, State, StartMode, StartName, PathName |",
          "  Where-Object { $_.StartMode -eq 'Auto' }"
        ]},
        { type: "h", text: "The registry — Windows' configuration database" },
        { type: "p", html: "The <strong>registry</strong> is a hierarchical database of settings for the OS, drivers, and apps. It is organised into <em>hives</em>. You will reference it constantly." },
        { type: "table", headers: ["Hive", "Holds", "Why a defender cares"], rows: [
          ["<code>HKLM</code> (HKEY_LOCAL_MACHINE)", "System-wide settings, services, installed software", "Persistence keys, service configs, security policy"],
          ["<code>HKCU</code> (HKEY_CURRENT_USER)", "Settings for the logged-on user", "Per-user auto-run malware, user policy"],
          ["<code>HKCR / HKU / HKCC</code>", "File associations, all users, current hardware", "File-type hijacks, COM hijacking"]
        ]},
        { type: "callout", variant: "warn", title: "Classic persistence keys to memorize", html: "<p>Attackers love auto-start (“ASEP”) locations. Two you must know cold:</p><p><code>HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run</code> and the matching <code>HKCU\\...\\Run</code>. Anything listed there launches at logon. <code>Run</code> keys, scheduled tasks, and services are the top-three persistence mechanisms you'll be asked about.</p>" },
        { type: "h", text: "File systems: NTFS, ReFS, FAT32/exFAT" },
        { type: "list", items: [
          "<strong>NTFS</strong> — the default. Supports <em>permissions (ACLs)</em>, auditing, encryption (EFS), compression, journaling, and alternate data streams. This is where Windows security lives.",
          "<strong>ReFS</strong> — Resilient File System, used for large data volumes and Storage Spaces; resilient to corruption but lacks some NTFS features.",
          "<strong>FAT32 / exFAT</strong> — no permissions at all. Used on USB sticks. <em>If a file has no ACL, anyone can read it</em> — relevant when data is copied to removable media."
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “What is an NTFS Alternate Data Stream (ADS) and why do attackers use it?”</strong> NTFS lets a file carry hidden secondary streams of data (<code>file.txt:hidden.exe</code>). Malware hides payloads in ADS because they don't show in a normal directory listing. The <strong>Zone.Identifier</strong> ADS is also how Windows tags files downloaded from the internet (Mark-of-the-Web) — which SmartScreen and Office use to decide whether to warn you.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "1-3",
      title: "Identity on a single machine: accounts, SIDs & tokens",
      blocks: [
        { type: "p", html: "Before identity goes to the cloud, it starts on one machine. Get this foundation wrong and Active Directory and Entra ID will never make sense. <strong>Authentication</strong> = proving who you are. <strong>Authorization</strong> = what you're allowed to do once proven. Windows separates these cleanly." },
        { type: "h", text: "Where local accounts live: the SAM" },
        { type: "p", html: "Local users and groups are stored in the <strong>SAM (Security Accounts Manager)</strong> database, a registry hive at <code>C:\\Windows\\System32\\config\\SAM</code>. Passwords are stored as <strong>hashes</strong> (NT hashes), never plaintext. Dumping the SAM to crack or pass those hashes is a core attacker objective." },
        { type: "h", text: "Built-in accounts you must know" },
        { type: "kv", items: [
          { k: "Administrator", v: "The built-in local admin (RID 500). Powerful; disabled by default on modern Windows but a prime target." },
          { k: "Guest", v: "Disabled by default; if enabled, a notorious foothold." },
          { k: "SYSTEM (LocalSystem)", v: "The OS itself. More powerful locally than Administrator. Services often run as SYSTEM." },
          { k: "LocalService / NetworkService", v: "Lower-privilege service accounts; NetworkService presents the computer's identity on the network." }
        ]},
        { type: "h", text: "SIDs — the real name of an account" },
        { type: "p", html: "Windows doesn't track you by username; it uses a <strong>Security Identifier (SID)</strong> — an immutable string like <code>S-1-5-21-...-1001</code>. Rename “Bob” to “Robert” and the SID is unchanged, so permissions follow. The trailing number is the <strong>RID (Relative ID)</strong>; <code>500</code> is always the Administrator, <code>512</code> is Domain Admins. Knowing well-known RIDs lets you spot privileged accounts instantly." },
        { type: "code", lang: "powershell", caption: "List local users, groups, and resolve a SID", code: [
          "Get-LocalUser",
          "Get-LocalGroup",
          "Get-LocalGroupMember -Group 'Administrators'",
          "",
          "# Who am I, and what is my SID and group membership?",
          "whoami /user        # shows your SID",
          "whoami /groups      # group SIDs + their privileges",
          "whoami /priv        # privileges held by your token"
        ]},
        { type: "h", text: "Access tokens & logon types" },
        { type: "p", html: "When you log on, the <strong>LSASS</strong> process builds you an <strong>access token</strong> — think of it as a wristband listing your SID, your group SIDs, and your privileges. Every time you touch a file or service, Windows checks your token against that object's permissions. The token, not your typed password, is what's used after logon — which is exactly why stealing tokens (“token impersonation”) is an attack." },
        { type: "callout", variant: "interview", title: "Logon types — a favourite interview table", html: "<p>Event logs record <em>how</em> someone authenticated. Know these:</p><ul><li><strong>Type 2 — Interactive</strong>: at the keyboard / console.</li><li><strong>Type 3 — Network</strong>: accessing a share or service over the network (most common in logs).</li><li><strong>Type 4 — Batch</strong>: scheduled task.</li><li><strong>Type 5 — Service</strong>: a service starting.</li><li><strong>Type 10 — RemoteInteractive</strong>: RDP.</li></ul><p>Spotting a Type 10 (RDP) logon to a server at 3am from an unusual account is the kind of detection you'll be asked to reason about.</p>" },
        { type: "callout", variant: "lab", html: "<p>On any Windows machine, run <code>whoami /all</code>. Find your SID, your groups, and your privileges. Notice whether <code>SeDebugPrivilege</code> or <code>SeImpersonatePrivilege</code> appears — those two are gold for privilege escalation, and you should be able to explain why (they allow touching other processes' memory / impersonating other tokens).</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "1-4",
      title: "NTFS permissions & access control (DACL, ACE, inheritance)",
      blocks: [
        { type: "p", html: "This is the lesson that separates people who <em>say</em> they know Windows from people who do. Authorization in Windows is enforced by <strong>security descriptors</strong> attached to objects (files, folders, registry keys, services, printers)." },
        { type: "h", text: "The anatomy of a permission" },
        { type: "kv", items: [
          { k: "Security descriptor", v: "The whole permission package on an object: owner + DACL + SACL." },
          { k: "DACL", v: "<strong>Discretionary Access Control List</strong> — the list of who can do what. This is “the permissions.”" },
          { k: "ACE", v: "<strong>Access Control Entry</strong> — one row in the DACL: a SID + allow/deny + rights (Read, Write, Modify, Full Control)." },
          { k: "SACL", v: "<strong>System Access Control List</strong> — the <em>auditing</em> list: which access attempts generate security log events." },
          { k: "Owner", v: "The account that owns the object; the owner can always change the DACL — which is why “taking ownership” is a privilege-escalation move." }
        ]},
        { type: "callout", variant: "analogy", html: "<p>The <strong>DACL is the guest list</strong> for a private party (who gets in and what they can touch). The <strong>SACL is the CCTV policy</strong> (whose entry attempts get recorded). Deny entries are bouncers who override the guest list. The <strong>owner</strong> is the host, who can rewrite the guest list at any time.</p>" },
        { type: "h", text: "Share permissions vs. NTFS permissions" },
        { type: "p", html: "A classic gotcha. A network folder can have <strong>two</strong> permission layers, and the <em>most restrictive of the two wins</em>:" },
        { type: "table", headers: ["", "Share permissions", "NTFS permissions"], rows: [
          ["Apply when", "Accessed over the network (SMB)", "Always — local and network"],
          ["Granularity", "Coarse (Read / Change / Full)", "Fine (13 special permissions)"],
          ["Best practice", "Set to <em>Everyone = Full</em> and control with NTFS, OR lock down here too", "Do the real access control here"]
        ]},
        { type: "callout", variant: "warn", html: "<p><strong>Effective access = the intersection.</strong> If Share says “Read” but NTFS says “Full Control,” a network user gets <em>Read</em> (the more restrictive). Locally (no share involved), only NTFS applies. Mixing these up is the #1 file-permission mistake juniors make.</p>" },
        { type: "h", text: "Inheritance & explicit Deny" },
        { type: "list", items: [
          "Permissions <strong>inherit</strong> from a parent folder to children by default. You can break inheritance and set explicit ACEs.",
          "<strong>Explicit Deny beats Allow.</strong> The evaluation order is: explicit Deny → explicit Allow → inherited Deny → inherited Allow. The first match that grants/denies the requested right wins.",
          "<strong>Effective Access</strong> (a tab in the file's Security dialog) computes a user's real, net rights after all groups, inheritance, and denies — use it instead of guessing."
        ]},
        { type: "code", lang: "powershell", caption: "Read and modify NTFS permissions", code: [
          "# View the ACL (DACL) of a folder",
          "Get-Acl 'C:\\Data\\Finance' | Format-List",
          "(Get-Acl 'C:\\Data\\Finance').Access   # list each ACE",
          "",
          "# Command-line equivalent, very common in the field:",
          "icacls C:\\Data\\Finance",
          "",
          "# Grant the 'Auditors' group Read+Execute, applied to this folder and below",
          "icacls C:\\Data\\Finance /grant 'Auditors:(OI)(CI)RX'",
          "",
          "# Find world-writable / weak ACLs (a common audit task)",
          "icacls C:\\Data\\Finance | findstr /i 'Everyone Users'"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “A user is in two groups — one Allows Modify, one Denies Write. What can they do?”</strong> The Deny on Write wins for writing, but the Modify-minus-Write rights (Read, Execute, Delete depending on the set) from the Allow still apply. Always reason ACE-by-ACE, and remember explicit Deny is evaluated before Allow. Bonus points for saying “I'd just use the <em>Effective Access</em> tab to confirm rather than reason in my head.”</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "1-5",
      title: "Authentication, LSASS, UAC & why local admin is dangerous",
      blocks: [
        { type: "p", html: "Now we connect identity to risk. The single most important security concept on a Windows endpoint is: <strong>credentials and tokens live in memory, and whoever is admin on the box can take them.</strong>" },
        { type: "h", text: "LSASS — the credential vault in RAM" },
        { type: "p", html: "<strong>LSASS (Local Security Authority Subsystem Service)</strong> handles authentication and caches credential material (hashes, Kerberos tickets) in its process memory so you aren't re-typing your password all day. That convenience is also the crown-jewel target: tools like Mimikatz read LSASS memory to steal NT hashes and Kerberos tickets." },
        { type: "callout", variant: "danger", title: "Credential theft chain (know this story)", html: "<p>Attacker lands on a workstation → gains local admin → reads LSASS → extracts the hash/ticket of <em>any account that has logged on to that machine</em>, including a roaming IT admin → reuses it (<strong>Pass-the-Hash</strong> / <strong>Pass-the-Ticket</strong>) to move to other machines. This is how a single workstation compromise becomes a domain-wide breach.</p>" },
        { type: "h", text: "Defences against LSASS theft (name-drop these)" },
        { type: "list", items: [
          "<strong>Credential Guard</strong> — uses virtualization-based security (VBS) to isolate LSASS secrets in a separate hypervisor-protected container so even admin/SYSTEM can't read them. On by default on Windows 11 Enterprise (with the hardware).",
          "<strong>LSASS as a Protected Process Light (PPL / RunAsPPL)</strong> — stops normal processes from opening LSASS memory.",
          "<strong>Defender ASR rule</strong> “Block credential stealing from LSASS” — blocks the access pattern.",
          "<strong>Don't let users be local admin</strong>, and don't log privileged accounts onto untrusted machines (tiered admin model)."
        ]},
        { type: "h", text: "UAC — User Account Control" },
        { type: "p", html: "UAC is why you see the “Do you want to allow this app to make changes?” prompt. When an admin logs on, Windows actually gives them <em>two</em> tokens: a filtered standard-user token for everyday work and a full admin token that is only “elevated” when needed. This is called <strong>Admin Approval Mode</strong>." },
        { type: "callout", variant: "warn", html: "<p>UAC is a <strong>convenience and friction-reduction boundary, not a hard security boundary</strong> — Microsoft has said so explicitly. Many “UAC bypasses” exist (auto-elevating binaries, fodhelper, etc.). Treat UAC as “speed bump that catches accidents and noisy malware,” not “wall that stops a determined attacker.” Saying this in an interview signals maturity.</p>" },
        { type: "code", lang: "cmd", caption: "Quick credential-hygiene checks", code: [
          ":: Who is a local administrator on this box?",
          "net localgroup administrators",
          "",
          ":: Is the built-in Administrator enabled?",
          "net user administrator",
          "",
          ":: Show your privileges (look for SeDebug / SeImpersonate)",
          "whoami /priv"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Why is making everyone a local admin such a big deal if they only run normal apps?”</strong> Because local admin = the ability to read LSASS, install drivers/services, disable security tools, and clear logs. One phished local-admin user can hand an attacker the keys to lateral movement. The principle of <strong>least privilege</strong> isn't bureaucracy; it's the single highest-ROI control on an endpoint.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "1-6",
      title: "The built-in Windows security stack",
      blocks: [
        { type: "p", html: "Windows ships with a genuinely strong, layered security stack — and modern interviews expect you to know what each piece does and which threat it counters. This is <strong>defence in depth</strong> built into the OS." },
        { type: "table", headers: ["Feature", "What it does", "Threat it counters"], rows: [
          ["<strong>Microsoft Defender Antivirus</strong>", "Built-in next-gen AV with cloud-delivered protection &amp; behaviour monitoring", "Malware, known &amp; novel"],
          ["<strong>Microsoft Defender Firewall</strong>", "Host-based stateful firewall (inbound/outbound rules per profile)", "Unwanted network connections, lateral movement"],
          ["<strong>BitLocker</strong>", "Full-volume encryption, keys sealed to the <strong>TPM</strong>", "Data theft from lost/stolen devices"],
          ["<strong>Credential Guard</strong>", "VBS-isolated LSASS secrets", "Pass-the-Hash / Pass-the-Ticket"],
          ["<strong>Attack Surface Reduction (ASR)</strong>", "Rules that block risky behaviours (e.g. Office spawning child processes)", "Malware delivery, living-off-the-land"],
          ["<strong>SmartScreen</strong>", "Reputation checks on downloads &amp; sites (uses Mark-of-the-Web)", "Phishing, malicious downloads"],
          ["<strong>WDAC / App Control</strong>", "Application allow-listing — only approved code runs", "Untrusted &amp; unsigned executables"],
          ["<strong>Secure Boot + TPM</strong>", "Verifies boot chain; hardware root of trust", "Bootkits, tampering"]
        ]},
        { type: "h", text: "Virtualization-Based Security (VBS) — the modern backbone" },
        { type: "p", html: "Modern Windows uses the hypervisor to create a small, isolated “virtual secure mode” that even the kernel can't tamper with. <strong>Credential Guard</strong> and <strong>HVCI (Memory Integrity)</strong> are built on VBS. When an interviewer asks “how does Windows protect credentials when the attacker is already SYSTEM?” — the answer is VBS isolation." },
        { type: "code", lang: "powershell", caption: "Check the security stack's status", code: [
          "# Defender AV status (real-time protection, signature age, tamper protection)",
          "Get-MpComputerStatus | Select-Object AMRunningMode, RealTimeProtectionEnabled, IsTamperProtected, AntivirusSignatureAge",
          "",
          "# BitLocker status per volume",
          "Get-BitLockerVolume | Select-Object MountPoint, VolumeStatus, EncryptionPercentage, ProtectionStatus",
          "",
          "# Is Credential Guard / VBS running?",
          "Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\\Microsoft\\Windows\\DeviceGuard |",
          "  Select-Object SecurityServicesRunning, VirtualizationBasedSecurityStatus",
          "",
          "# Firewall profiles",
          "Get-NetFirewallProfile | Select-Object Name, Enabled"
        ]},
        { type: "callout", variant: "tip", title: "Tamper Protection", html: "<p>Enable <strong>Tamper Protection</strong> on Defender. It stops malware (and even local admins) from disabling AV, turning off real-time protection, or removing it via registry/PowerShell. The first thing many malware families try is “turn off Defender” — Tamper Protection is the lock on that door.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Defence in depth on a Windows endpoint — walk me through the layers.”</strong> A clean answer climbs the stack: hardware (TPM, Secure Boot) → boot &amp; kernel integrity (VBS/HVCI) → identity (Credential Guard, no local admin) → execution control (WDAC, ASR, SmartScreen) → detection (Defender AV + EDR) → data (BitLocker) → recovery (backups, immutable). Naming a control <em>at each layer</em> is what gets the nod.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "1-7",
      title: "Visibility: logs, event IDs & where attackers hide",
      blocks: [
        { type: "p", html: "“You can't defend what you can't see.” The last Windows fundamental is <strong>telemetry</strong> — the logs that let a SOC analyst reconstruct what happened. This is the bread-and-butter of blue-team interviews." },
        { type: "h", text: "The Windows Event Log" },
        { type: "p", html: "Events live in channels viewable in <strong>Event Viewer</strong> (<code>eventvwr.msc</code>) or queried with PowerShell. The big three channels: <strong>Security</strong> (logons, privilege use, object access), <strong>System</strong> (drivers, services), and <strong>Application</strong> (app events). Security pros add <strong>Sysmon</strong> for far richer detail." },
        { type: "table", headers: ["Event ID", "Meaning", "Why you watch it"], rows: [
          ["<strong>4624</strong>", "Successful logon", "Baseline of who logged on, when, and the logon type"],
          ["<strong>4625</strong>", "Failed logon", "Spikes = password spraying / brute force"],
          ["<strong>4672</strong>", "Special privileges assigned at logon", "An admin/privileged logon just happened"],
          ["<strong>4688</strong>", "New process created (with command line if enabled)", "Catches living-off-the-land &amp; malicious scripts"],
          ["<strong>4720 / 4732</strong>", "User created / added to a privileged group", "Persistence &amp; privilege escalation"],
          ["<strong>1102</strong>", "Security log cleared", "Attackers clearing tracks — almost always suspicious"],
          ["<strong>4768 / 4769</strong>", "Kerberos TGT / service ticket requested", "Kerberoasting &amp; ticket attacks (Module 2)"]
        ]},
        { type: "code", lang: "powershell", caption: "Hunt in the event log", code: [
          "# Last 20 failed logons (4625) - look for spraying",
          "Get-WinEvent -FilterHashtable @{ LogName='Security'; Id=4625 } -MaxEvents 20 |",
          "  Select-Object TimeCreated, @{n='User';e={$_.Properties[5].Value}}",
          "",
          "# Was the security log ever cleared? (1102)",
          "Get-WinEvent -FilterHashtable @{ LogName='Security'; Id=1102 } -MaxEvents 5",
          "",
          "# Process-creation events (need 'Audit Process Creation' + cmdline logging on)",
          "Get-WinEvent -FilterHashtable @{ LogName='Security'; Id=4688 } -MaxEvents 20"
        ]},
        { type: "h", text: "Where attackers establish persistence (the hunt list)" },
        { type: "list", items: [
          "<strong>Run / RunOnce</strong> registry keys (HKLM &amp; HKCU)",
          "<strong>Scheduled Tasks</strong> (<code>schtasks /query</code> or <code>Get-ScheduledTask</code>)",
          "<strong>Services</strong> set to auto-start (especially with odd binary paths)",
          "<strong>Startup folders</strong> and <strong>WMI event subscriptions</strong>",
          "<strong>New local admin accounts</strong> or accounts added to privileged groups"
        ]},
        { type: "callout", variant: "tip", html: "<p>Sysinternals <strong>Autoruns</strong> is the single best free tool for enumerating every auto-start location at once, and it can check signatures against VirusTotal. Mentioning Sysinternals (Autoruns, Process Explorer, Procmon) in an interview instantly signals hands-on experience.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “You suspect a machine is compromised. What do you look at first?”</strong> A strong answer: “Running processes &amp; their command lines and network connections, recent 4624/4688 events, the auto-start locations (Run keys, scheduled tasks, services) via Autoruns, recently created accounts (4720), and whether the security log was cleared (1102) or Defender was tampered with. I'd preserve volatile data first if it may go to forensics.”</p>" },
        { type: "divider" },
        { type: "callout", variant: "tip", title: "Module 1 — Key takeaways", html: "<ul><li>Windows splits <strong>authentication</strong> (who you are) from <strong>authorization</strong> (DACLs on objects). Accounts are tracked by immutable <strong>SIDs</strong>, not names.</li><li>Credentials and tokens live in <strong>LSASS memory</strong>; local admin can steal them — which is why least privilege + Credential Guard matter most.</li><li>Effective file access = the <strong>intersection of Share and NTFS</strong>, with explicit Deny winning.</li><li>The built-in stack (Defender, Firewall, BitLocker, Credential Guard, ASR, WDAC, VBS/HVCI, Secure Boot) is real <strong>defence in depth</strong> — know the layer each one occupies.</li><li>Detection lives in the <strong>Event Log</strong> — memorise 4624/4625/4672/4688/4720/1102 — plus the persistence locations attackers reuse.</li></ul>" }
      ]
    }
  ],
  quiz: [
    { q: "What does a SID (Security Identifier) uniquely and permanently identify?", options: ["A user's password hash", "A security principal (user, group, computer) — and it never changes even if the account is renamed", "A network share", "A logon session ticket"], answer: 1, explain: "Windows authorizes by SID, not username. Renaming an account keeps the same SID, so permissions follow it. RID 500 = built-in Administrator." },
    { q: "A network folder has Share permission 'Read' for Everyone but NTFS permission 'Full Control' for Everyone. What is a remote user's effective access?", options: ["Full Control", "Read — the more restrictive of Share and NTFS wins over the network", "No access", "Modify"], answer: 1, explain: "Over the network both layers apply and the MOST restrictive wins, so the user gets Read. Locally (no share), only NTFS would apply, giving Full Control." },
    { q: "Why is the LSASS process such a high-value target for attackers?", options: ["It stores files on disk unencrypted", "It runs the firewall", "It caches credential material (NT hashes, Kerberos tickets) in memory, enabling Pass-the-Hash / Pass-the-Ticket", "It controls Windows Update"], answer: 2, explain: "LSASS handles authentication and caches secrets in RAM. An admin can read that memory (e.g., Mimikatz) and reuse the credentials laterally. Credential Guard isolates these secrets using VBS." },
    { q: "Which statement about UAC (User Account Control) is the most accurate?", options: ["It is a hard security boundary that fully stops privilege escalation", "It encrypts the disk", "It is a convenience/friction boundary (Admin Approval Mode) that can be bypassed and is not a guaranteed security boundary", "It replaces the need for antivirus"], answer: 2, explain: "Microsoft explicitly states UAC is not a security boundary. It reduces accidental/auto-elevation and catches noisy malware, but many bypasses exist. Treat it as a speed bump, not a wall." },
    { q: "Which Windows technology isolates credential secrets so that even a SYSTEM-level attacker cannot read them from LSASS?", options: ["BitLocker", "SmartScreen", "Credential Guard (built on Virtualization-Based Security)", "Windows Firewall"], answer: 2, explain: "Credential Guard uses VBS/the hypervisor to hold LSASS secrets in an isolated container outside the reach of the normal OS — the answer to 'how do you protect creds when the attacker is already admin?'" },
    { q: "Security event ID 1102 indicates what — and why does it matter?", options: ["A successful logon; baseline activity", "The Security event log was cleared; strongly associated with attackers covering their tracks", "A new USB device; data exfiltration", "A Windows update installed; patch tracking"], answer: 1, explain: "1102 = Security log cleared. Legitimate reasons are rare, so it's a high-signal indicator of an intruder destroying evidence. (4624 success, 4625 failure, 4688 process creation.)" },
    { q: "An attacker wants to survive a reboot. Which of these is a classic Windows PERSISTENCE location you'd hunt?", options: ["The CPU cache", "HKLM/HKCU ...\\CurrentVersion\\Run keys, Scheduled Tasks, and auto-start Services", "The BIOS clock", "The DNS resolver cache"], answer: 1, explain: "Run keys, scheduled tasks, and services are the top-three persistence mechanisms. Sysinternals Autoruns enumerates all auto-start locations at once." },
    { q: "Why can attackers hide data in an NTFS Alternate Data Stream (ADS)?", options: ["ADS data is encrypted by default", "Secondary streams (file.txt:hidden) don't appear in a normal directory listing", "ADS runs in kernel mode", "FAT32 supports them too"], answer: 1, explain: "NTFS files can carry hidden secondary streams that a normal 'dir' won't show. The Zone.Identifier ADS is also how Windows records Mark-of-the-Web for downloaded files." }
  ],
  flashcards: [
    { front: "Authentication vs. Authorization", back: "<strong>Authentication</strong> = proving who you are (logon). <strong>Authorization</strong> = what you may do once proven (checked against an object's DACL using your access token)." },
    { front: "What is a SID and what's special about RID 500?", back: "A Security Identifier uniquely & permanently identifies a principal (survives renames). The RID is the trailing number; <strong>500 = built-in Administrator</strong>, 512 = Domain Admins." },
    { front: "DACL vs. SACL", back: "<strong>DACL</strong> = the permissions list (who can do what, made of ACEs). <strong>SACL</strong> = the auditing list (which access attempts generate Security log events)." },
    { front: "Share vs. NTFS permissions — which wins?", back: "Over the network, the <strong>most restrictive of the two</strong> wins. Locally, only NTFS applies. Explicit Deny beats Allow." },
    { front: "Why is LSASS a top target?", back: "It caches credential material (NT hashes, Kerberos tickets) in memory. Reading it enables Pass-the-Hash / Pass-the-Ticket. Defence: Credential Guard (VBS), RunAsPPL, ASR rule." },
    { front: "Is UAC a security boundary?", back: "No — Microsoft says it's a convenience/friction boundary (Admin Approval Mode). Many bypasses exist. It catches accidents & noisy malware, not determined attackers." },
    { front: "Name the key logon types (event 4624).", back: "2 = Interactive (console), 3 = Network (share/service), 4 = Batch, 5 = Service, <strong>10 = RemoteInteractive (RDP)</strong>." },
    { front: "Key security event IDs", back: "4624 logon, 4625 failed logon, 4672 special privileges, 4688 process created, 4720 user created, 4732 added to group, <strong>1102 security log cleared</strong>." },
    { front: "What is VBS and what's built on it?", back: "Virtualization-Based Security uses the hypervisor to isolate a 'secure world.' <strong>Credential Guard</strong> and <strong>HVCI/Memory Integrity</strong> run on it — protecting secrets even from a SYSTEM-level attacker." },
    { front: "Top 3 Windows persistence mechanisms", back: "Run/RunOnce registry keys, Scheduled Tasks, and auto-start Services. Enumerate them all with Sysinternals <strong>Autoruns</strong>." },
    { front: "What does Tamper Protection do?", back: "Stops malware or even local admins from disabling Microsoft Defender (real-time protection, signatures) via registry/PowerShell/UI." },
    { front: "BitLocker + TPM — what threat does it stop?", back: "Full-volume encryption with keys sealed to the TPM. Protects <strong>data at rest</strong> on lost/stolen devices; does nothing once the OS is unlocked and running." }
  ]
});
