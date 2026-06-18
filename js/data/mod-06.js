/* Module 6 — Microsoft Intune & Endpoint Management
   Same house style as mod-01.js:
   - JS strings use DOUBLE quotes "..."; HTML attributes inside use SINGLE quotes '...'.
   - Code blocks are arrays of lines; Windows paths use DOUBLE backslashes (C:\\Windows).
   - No backticks, no template literals. */
window.COURSE.modules.push({
  id: "mod-06",
  number: 6,
  icon: "📱",
  title: "Microsoft Intune & Endpoint Management",
  tagline: "Cloud MDM/MAM done right: enrollment & Autopilot, compliance policies feeding Conditional Access, security baselines, and selective wipe.",
  estMinutes: 90,
  objectives: [
    "Distinguish <strong>MDM from MAM</strong> and protect BYOD with App Protection Policies (no full enrollment).",
    "Explain the <strong>compliance → Conditional Access</strong> loop that is the core Zero Trust device control.",
    "Describe enrollment, <strong>Windows Autopilot</strong>, and the Entra device-join states.",
    "Apply security baselines and configuration profiles to harden endpoints.",
    "Choose correctly between <strong>selective wipe</strong> and full wipe for lost or offboarded devices."
  ],
  lessons: [
    /* ---------------------------------------------------------------- */
    {
      id: "6-1",
      title: "What Intune is — cloud unified endpoint management",
      subtitle: "MDM + MAM = UEM",
      blocks: [
        { type: "p", html: "Let me clear up the naming first, because interviewers use it as a trap. The brand <strong>&quot;Microsoft Endpoint Manager&quot;</strong> is <strong>retired</strong>. The product is now simply <strong>Microsoft Intune</strong>, and you administer it from the <strong>Microsoft Intune admin center</strong> at <code>intune.microsoft.com</code>. If a candidate still calls it &quot;Endpoint Manager&quot; or &quot;the SCCM cloud thing,&quot; I know they haven't touched it recently." },
        { type: "p", html: "Intune is a cloud service that does two jobs that together make up <strong>Unified Endpoint Management (UEM)</strong>:" },
        { type: "kv", items: [
          { k: "MDM — Mobile Device Management", v: "Manages the <em>whole device</em>: enroll it, push configuration, enforce encryption, check compliance, and wipe it. The org has a management relationship with the device." },
          { k: "MAM — Mobile Application Management", v: "Manages just the <em>corporate app and its data</em> on a device you do NOT fully control (BYOD). Containerize, protect, and selectively wipe corporate data only." },
          { k: "UEM", v: "MDM + MAM across all platforms from one console — laptops, phones, tablets, and servers, all governed the same way." }
        ]},
        { type: "callout", variant: "analogy", html: "<p>Think of a company campus. <strong>MDM is owning the building</strong> — you control the locks, the wiring, the thermostat, the whole structure. <strong>MAM is renting one secure office suite inside a building you don't own</strong> — you can lock that suite, shred its documents, and require a badge to enter it, but you can't touch the rest of the landlord's building. BYOD is the classic &quot;rent the suite&quot; case.</p>" },
        { type: "h", text: "Intune vs. Configuration Manager vs. co-management" },
        { type: "p", html: "On-premises endpoint management is <strong>Microsoft Configuration Manager</strong> (the product people still call &quot;SCCM&quot; or &quot;ConfigMgr&quot;). It manages domain-joined devices on your corporate network with a heavy on-prem infrastructure. Running Configuration Manager and Intune <em>together</em> on the same device is called <strong>co-management</strong> — you split workloads, gradually moving them from on-prem to cloud." },
        { type: "table", headers: ["", "Configuration Manager", "Intune", "Co-management"], rows: [
          ["Where it lives", "On-premises servers", "Cloud (SaaS)", "Both, on the same device"],
          ["Best for", "Domain-joined corporate PCs", "Mobile, remote, BYOD, cloud-native PCs", "Migration from on-prem to cloud"],
          ["Identity plane", "On-prem Active Directory", "Microsoft Entra ID", "Hybrid (both)"],
          ["Network reliance", "Needs corporate network/VPN", "Manages over the internet", "Mixed"]
        ]},
        { type: "h", text: "Supported platforms" },
        { type: "list", items: [
          "<strong>Windows</strong> 10/11 (and Windows 365 Cloud PCs)",
          "<strong>macOS</strong>",
          "<strong>iOS / iPadOS</strong>",
          "<strong>Android</strong> (Enterprise: work profile, fully managed, dedicated/kiosk)",
          "<strong>Linux</strong> (Ubuntu desktop — compliance and basic config, narrower than the others)"
        ]},
        { type: "h", text: "Why cloud management beats traditional imaging" },
        { type: "p", html: "The old way was <strong>imaging</strong>: build a &quot;golden image&quot; of Windows, capture it, and lay it down on every machine over the network, then domain-join it. It needed on-prem infrastructure, the device on the corporate LAN, and a tech to touch it. The cloud way is <strong>provisioning</strong> with <strong>Windows Autopilot</strong> — a brand-new device ships from the OEM straight to the user, who signs in with their work account over any internet connection and the device configures itself. No image, no VPN, no IT visit. That is the headline reason organizations move to Intune." },
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;What's the difference between MDM and MAM, and when would you use each?&quot;</strong> MDM manages the <em>whole device</em> (full enrollment) and is right for corporate-owned hardware. MAM (App Protection Policies) manages only the <em>corporate app and its data</em> without enrolling the device, which is the right answer for <strong>BYOD</strong> — you protect company data on a personal phone without taking control of the user's personal device. Saying &quot;MAM enables BYOD without enrollment&quot; is the line that lands.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "6-2",
      title: "Device identity & enrollment",
      blocks: [
        { type: "p", html: "Before Intune can manage a device, two things have to happen: the device gets an <strong>identity in Microsoft Entra ID</strong>, and it gets <strong>enrolled</strong> into Intune for management. These are related but distinct, and mixing them up is a classic junior mistake. This lesson bridges directly to Module 4 (Entra ID)." },
        { type: "h", text: "The three Entra device states (know these cold)" },
        { type: "table", headers: ["State", "What it means", "Typical use"], rows: [
          ["<strong>Entra registered</strong>", "Device has an Entra identity but the user signs in with a <em>personal</em> account; org gets a lightweight relationship", "BYOD — personal phones and laptops"],
          ["<strong>Entra joined</strong>", "Device is joined ONLY to Entra ID (cloud), no on-prem AD; user signs in with their work account", "Cloud-native corporate devices (the modern default)"],
          ["<strong>Hybrid Entra joined</strong>", "Device is joined to <em>both</em> on-prem Active Directory AND Entra ID", "Orgs still tied to on-prem AD / Group Policy during migration"]
        ]},
        { type: "callout", variant: "tip", html: "<p>The modern target state is <strong>Entra joined</strong> — fully cloud, no on-prem AD dependency. <strong>Hybrid Entra joined</strong> is a transition state, not a destination; it exists so existing on-prem investments keep working while you move to the cloud. If someone tells you hybrid join is &quot;more secure,&quot; push back — it's just <em>more legacy</em>.</p>" },
        { type: "h", text: "Enrollment methods" },
        { type: "kv", items: [
          { k: "Automatic enrollment", v: "When a device is Entra joined or a user registers it, MDM enrollment into Intune happens automatically (configured under MDM auto-enrollment scope in Entra). The smooth, hands-off path." },
          { k: "Windows Autopilot", v: "Zero-touch provisioning for new Windows devices. The OEM pre-registers the device's hardware hash to your tenant; the user just signs in and it self-configures." },
          { k: "Apple enrollment", v: "Apple Business Manager + Automated Device Enrollment (ADE) for corporate Macs/iPhones; or user-driven enrollment for BYOD via the Company Portal app." },
          { k: "Android enrollment", v: "Android Enterprise modes: personally-owned work profile (BYOD), fully managed, and dedicated/kiosk (corporate)." },
          { k: "BYOD", v: "User installs the Company Portal app and enrolls their personal device, OR uses App Protection Policies (MAM) with no enrollment at all." }
        ]},
        { type: "h", text: "Windows Autopilot — the user-driven flow" },
        { type: "steps", items: [
          "IT (or the OEM/reseller) uploads the device's <strong>hardware hash</strong> to the tenant, registering it as an Autopilot device, and assigns it a deployment profile.",
          "The device ships sealed straight to the end user — IT never touches it.",
          "The user unboxes it, connects to any network, and reaches the out-of-box experience (OOBE).",
          "Autopilot recognizes the hardware hash, applies your branding, and prompts the user to sign in with their <strong>work account</strong>.",
          "Sign-in <strong>Entra joins</strong> the device and triggers automatic Intune enrollment.",
          "Intune pushes apps, configuration, compliance, and security policies (the Enrollment Status Page shows progress) — the device arrives at the desktop already corporate-ready."
        ]},
        { type: "code", lang: "powershell", caption: "Capture a device's Autopilot hardware hash (run on the device)", code: [
          "# Install the community script and export this device's hardware hash to CSV",
          "Install-Script -Name Get-WindowsAutopilotInfo -Force",
          "",
          "# Write the hash to a file you then upload to Intune > Devices > Enrollment > Autopilot",
          "Get-WindowsAutopilotInfo -OutputFile C:\\Temp\\AutopilotHash.csv",
          "",
          "# Or register directly to the tenant online (prompts for sign-in)",
          "Get-WindowsAutopilotInfo -Online"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;Explain Entra registered vs. Entra joined vs. Hybrid Entra joined.&quot;</strong> Registered = personal/BYOD device with a lightweight org link (personal sign-in). Joined = cloud-only corporate device, signed in with a work account, no on-prem AD. Hybrid joined = joined to both on-prem AD and Entra, used during cloud migration. The key insight to add: <em>Entra joined is the modern default; hybrid is a legacy bridge, not a security upgrade.</em></p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "6-3",
      title: "Compliance policies — the key security loop",
      blocks: [
        { type: "p", html: "This is the most important lesson in the module, and the one interviewers probe hardest. A <strong>compliance policy</strong> defines what a <em>healthy</em> device looks like. Intune evaluates each device against that definition and stamps it <strong>compliant</strong> or <strong>noncompliant</strong>. That single signal is then consumed by <strong>Entra Conditional Access</strong> to decide whether the device may reach corporate resources. This Intune + Conditional Access loop is <strong>the</strong> device control in a Zero Trust architecture." },
        { type: "h", text: "What you check in a compliance policy" },
        { type: "list", items: [
          "<strong>Disk encryption on</strong> — BitLocker (Windows) / FileVault (macOS)",
          "<strong>Minimum OS version</strong> — block devices missing critical patches",
          "<strong>Microsoft Defender Antivirus real-time protection on</strong> and signatures up to date",
          "<strong>Secure Boot / TPM / Code Integrity</strong> required (Windows health attestation)",
          "<strong>Not jailbroken / not rooted</strong> (iOS / Android)",
          "<strong>Password / PIN required</strong>, with minimum complexity and length",
          "<strong>Device risk level below a threshold</strong> — fed live from Microsoft Defender for Endpoint"
        ]},
        { type: "callout", variant: "analogy", html: "<p>Compliance policy is the <strong>health inspection</strong> and Conditional Access is the <strong>door of the restaurant</strong>. Intune is the inspector who walks the kitchen and posts a pass/fail grade in the window. Conditional Access is the host at the door who refuses to seat anyone if the grade says &quot;fail.&quot; The inspector doesn't lock the door, and the host doesn't inspect the kitchen — but together they keep sick devices out.</p>" },
        { type: "h", text: "The end-to-end loop — be able to narrate this" },
        { type: "steps", items: [
          "Intune evaluates the device against the compliance policy on a schedule (and on check-in).",
          "Intune writes the result — <strong>compliant</strong> or <strong>noncompliant</strong> — back to the device object in <strong>Entra ID</strong>.",
          "The user tries to reach a resource (Exchange Online, SharePoint, a SaaS app).",
          "<strong>Entra Conditional Access</strong> evaluates the sign-in and reads the device's compliance state as a condition.",
          "If the policy requires a compliant device and the device is noncompliant, access is <strong>blocked</strong> (or limited / forced through remediation).",
          "Optionally, a <strong>noncompliance action</strong> emails the user, gives a grace period, then marks the device noncompliant if not fixed."
        ]},
        { type: "table", headers: ["Layer", "Owner", "Job in the loop"], rows: [
          ["Compliance policy", "Intune", "Define &amp; measure device health → set compliant/noncompliant"],
          ["Device risk score", "Defender for Endpoint", "Feed real-time threat risk (low/medium/high) into compliance"],
          ["Conditional Access", "Entra ID", "Read compliance state &amp; gate access to resources"],
          ["The result", "Zero Trust", "Only healthy, known devices touch corporate data"]
        ]},
        { type: "code", lang: "powershell", caption: "List managed devices and their compliance state via Microsoft Graph PowerShell", code: [
          "# Connect with the right delegated permission scope",
          "Connect-MgGraph -Scopes 'DeviceManagementManagedDevices.Read.All'",
          "",
          "# Pull every managed device with its compliance state and OS",
          "Get-MgDeviceManagementManagedDevice |",
          "  Select-Object DeviceName, OperatingSystem, ComplianceState, LastSyncDateTime |",
          "  Sort-Object ComplianceState",
          "",
          "# Show only the NONCOMPLIANT devices (your worklist)",
          "Get-MgDeviceManagementManagedDevice -Filter \"complianceState eq 'noncompliant'\" |",
          "  Select-Object DeviceName, UserPrincipalName, OperatingSystem, LastSyncDateTime"
        ]},
        { type: "callout", variant: "danger", html: "<p>A compliance policy with <strong>no Conditional Access policy behind it does almost nothing</strong>. By itself, a noncompliant device just gets a label and maybe an email — it can still reach email and files. Compliance is the <em>measurement</em>; Conditional Access is the <em>enforcement</em>. Deploying one without the other is a common (and dangerous) misconfiguration that gives a false sense of security.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;Walk me through how a device compliance policy actually blocks access.&quot;</strong> Intune evaluates the device against the policy and writes compliant/noncompliant to the Entra device object. When the user signs in to a resource, Entra Conditional Access reads that state; a CA policy that requires a compliant device blocks the sign-in if it's noncompliant. The risk signal can be enriched live by Defender for Endpoint. Land it with: <em>&quot;Intune measures, Conditional Access enforces — that pairing is the Zero Trust device control.&quot;</em></p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "6-4",
      title: "Configuration & hardening",
      blocks: [
        { type: "p", html: "Compliance tells you whether a device is healthy; <strong>configuration</strong> is how you <em>make</em> it healthy and keep it that way. Intune gives you several tools, and interviewers expect you to know which to reach for." },
        { type: "h", text: "The configuration toolbox" },
        { type: "kv", items: [
          { k: "Settings Catalog", v: "A searchable list of essentially every individual setting Intune can manage. The modern, granular way to build a configuration profile from scratch — you pick exactly the settings you want." },
          { k: "Security Baselines", v: "Microsoft's pre-configured, hardened sets of recommended settings (Windows, Microsoft Defender for Endpoint, Microsoft Edge). A vetted starting point so you don't harden from zero." },
          { k: "Endpoint Security policies", v: "Focused policies for security workloads: antivirus, disk encryption, firewall, ASR, EDR onboarding, and account protection." },
          { k: "Administrative Templates (ADMX)", v: "The familiar Group Policy ADMX settings, delivered from the cloud — eases the transition for admins who know GPO." }
        ]},
        { type: "callout", variant: "tip", title: "Baselines vs. Settings Catalog", html: "<p>Use a <strong>Security Baseline</strong> as your hardened <em>starting point</em> — it bakes in Microsoft's recommendations across hundreds of settings at once. Use the <strong>Settings Catalog</strong> for <em>precise, custom</em> configuration when you need a specific setting or want full control over exactly what's applied. Many shops deploy a baseline, then layer Settings Catalog profiles for org-specific tweaks. Don't stack two baselines on one device — overlapping settings cause conflicts.</p>" },
        { type: "h", text: "Endpoint Security policies you must know" },
        { type: "list", items: [
          "<strong>Antivirus</strong> — configure Microsoft Defender (real-time protection, cloud protection, scan schedule, Tamper Protection).",
          "<strong>Disk encryption</strong> — turn on BitLocker and <strong>escrow the recovery key to Entra ID</strong> so you can recover it later.",
          "<strong>Firewall</strong> — Defender Firewall rules and profiles (domain / private / public).",
          "<strong>Attack Surface Reduction (ASR) rules</strong> — block risky behaviours (Office spawning child processes, credential theft from LSASS, etc.).",
          "<strong>Endpoint detection and response (EDR)</strong> — onboard the device to Microsoft Defender for Endpoint.",
          "<strong>Account protection</strong> — Windows Hello for Business, Credential Guard, local admin group membership control."
        ]},
        { type: "callout", variant: "danger", html: "<p>BitLocker without <strong>key escrow to Entra ID</strong> is a disaster waiting to happen. If a user forgets their PIN or the TPM trips into recovery and there's no escrowed key, the data is gone — encryption working exactly as designed has now locked <em>you</em> out. Always confirm recovery keys are backing up to Entra; it's a standard audit finding.</p>" },
        { type: "steps", items: [
          "In the Intune admin center, go to <strong>Endpoint security &gt; Disk encryption</strong>.",
          "Create a policy for <strong>Windows &gt; BitLocker</strong>.",
          "Require encryption for the OS drive and fixed drives.",
          "Set <strong>&quot;Save BitLocker recovery information to Microsoft Entra ID&quot;</strong> to <em>Yes</em>, and require it before encrypting.",
          "Assign the policy to a device group and confirm keys appear under the device's <strong>Recovery keys</strong> tab."
        ]},
        { type: "code", lang: "powershell", caption: "Verify hardening landed on the endpoint", code: [
          "# Is BitLocker on and protected for the OS volume?",
          "Get-BitLockerVolume | Select-Object MountPoint, VolumeStatus, ProtectionStatus, EncryptionPercentage",
          "",
          "# Defender real-time protection + Tamper Protection",
          "Get-MpComputerStatus | Select-Object RealTimeProtectionEnabled, IsTamperProtected, AMRunningMode",
          "",
          "# Which ASR rules are configured and in what mode?",
          "Get-MpPreference | Select-Object -ExpandProperty AttackSurfaceReductionRules_Ids"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;Security baseline or Settings Catalog — when do you use which?&quot;</strong> Start from a <strong>Security Baseline</strong> for a hardened, Microsoft-recommended foundation across many settings at once; reach for the <strong>Settings Catalog</strong> for granular, org-specific configuration of individual settings. Bonus: mention that you avoid overlapping multiple baselines on the same device to prevent conflicts, and that Endpoint Security policies are where BitLocker, AV, firewall, and ASR actually get configured.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "6-5",
      title: "App management: MDM apps vs MAM / App Protection Policies",
      blocks: [
        { type: "p", html: "Intune does two very different things with apps: it <em>deploys</em> apps to managed devices (MDM), and it <em>protects corporate data inside apps</em> on devices it doesn't manage (MAM). Keeping these straight is one of the highest-value interview distinctions in the whole module." },
        { type: "h", text: "Deploying apps (MDM app management)" },
        { type: "kv", items: [
          { k: "Win32 apps", v: "Package the installer into a <code>.intunewin</code> file with the Content Prep Tool, define install/uninstall commands and detection rules, and deploy. The workhorse for traditional Windows software." },
          { k: "Microsoft Store apps", v: "Deploy modern apps directly from the Store, including automatic updates." },
          { k: "Line-of-business (LOB) apps", v: "Upload your in-house app package (MSI, APK, IPA, etc.) directly." },
          { k: "Web links", v: "Pin a web app or URL to the device as if it were an app." }
        ]},
        { type: "code", lang: "cmd", caption: "Package a Win32 app into .intunewin for upload", code: [
          ":: Wrap an installer folder into a single .intunewin file",
          ":: -c source folder, -s the setup file, -o output folder",
          "IntuneWinAppUtil.exe -c C:\\Apps\\MyApp -s setup.exe -o C:\\Apps\\Output",
          "",
          ":: Then in Intune: Apps > Windows > Add > 'Windows app (Win32)',",
          ":: upload the .intunewin, set install/uninstall commands and a detection rule."
        ]},
        { type: "h", text: "App Protection Policies (APP / MAM-WE)" },
        { type: "p", html: "<strong>App Protection Policies (APP)</strong> — also called <strong>MAM-WE</strong> (MAM without enrollment) — protect corporate data <em>inside specific managed apps</em> on a device that is NOT fully enrolled. This is how you enable <strong>BYOD</strong>: a user's personal phone never gets enrolled, you never see their photos, but the corporate data in Outlook and Teams is locked down." },
        { type: "list", items: [
          "<strong>Containerize corporate data</strong> — keep org data inside managed apps, separate from personal apps.",
          "<strong>Encrypt</strong> corporate data within the app.",
          "<strong>Block copy/paste, Save As, and sharing</strong> from managed (work) apps into unmanaged (personal) apps.",
          "<strong>Require an app PIN or biometric</strong> to open the corporate app.",
          "<strong>Selective wipe</strong> — remove only the corporate data from the app, leaving everything personal untouched.",
          "<strong>Conditional Launch</strong> — set conditions (min OS version, jailbreak/root check, max PIN attempts) that, if failed, block the app or wipe its corporate data."
        ]},
        { type: "callout", variant: "analogy", html: "<p>An App Protection Policy is a <strong>briefcase with a combination lock that you hand an employee</strong>. They carry it in their own car (personal phone). You can demand the combination (PIN), require the briefcase be shredded remotely if lost (selective wipe), and forbid moving papers out of the briefcase into their glovebox (block copy/paste to personal apps) — all without ever owning or searching their car.</p>" },
        { type: "h", text: "MDM vs MAM — the contrast that matters" },
        { type: "table", headers: ["", "MDM (full enrollment)", "MAM / App Protection Policy"], rows: [
          ["Scope of control", "The whole device", "Just the app and its corporate data"],
          ["Best for", "Corporate-owned devices", "BYOD / personal devices"],
          ["Enrollment required?", "Yes", "No (MAM-WE)"],
          ["Wipe option", "Full wipe or selective", "Selective wipe of corporate data only"],
          ["User privacy", "Org sees device inventory", "Org never sees personal data"]
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;How do you protect company data on an employee's personal phone without taking over the phone?&quot;</strong> Use an <strong>App Protection Policy (MAM-WE)</strong> — no enrollment. It containerizes and encrypts corporate data in managed apps, requires an app PIN, blocks copy/paste to personal apps, and supports <strong>selective wipe</strong> of only the corporate data. The phone stays the user's; only the company data is governed. That single answer demonstrates you understand MDM vs MAM in practice.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "6-6",
      title: "Device actions & lifecycle",
      blocks: [
        { type: "p", html: "Once devices are managed, you need to act on them remotely — especially when one is lost, stolen, repurposed, or retired. Intune exposes <strong>remote actions</strong> per device, and the single distinction interviewers chase here is <strong>selective wipe vs. full wipe</strong>." },
        { type: "h", text: "Remote actions in the admin center" },
        { type: "table", headers: ["Action", "What it does", "When to use it"], rows: [
          ["<strong>Retire</strong>", "<em>Selective wipe</em> — removes corporate data, apps, and policies; leaves personal data and the OS intact", "Employee leaves; reclaiming a BYOD device"],
          ["<strong>Wipe</strong>", "<em>Full wipe</em> — factory reset, erases everything on the device", "Lost/stolen corporate device; redeploying hardware"],
          ["<strong>Fresh Start / Autopilot Reset</strong>", "Reset Windows, removing apps/settings but optionally keeping user data; re-provisions via Autopilot", "Recycle a corporate PC for a new user"],
          ["<strong>Remote lock</strong>", "Locks the device immediately", "Device temporarily out of sight / suspected lost"],
          ["<strong>Reset passcode</strong>", "Clears or resets the device passcode", "User locked out of their device"],
          ["<strong>Sync</strong>", "Forces the device to check in and pull latest policy", "Speed up a config/compliance change"],
          ["<strong>BitLocker key rotation</strong>", "Generates a new BitLocker recovery key and escrows it to Entra", "After a key may have been exposed"]
        ]},
        { type: "callout", variant: "warn", title: "Selective wipe vs. full wipe — say it precisely", html: "<p><strong>Selective wipe (Retire)</strong> removes only <em>corporate</em> data and management; personal data and the device survive. <strong>Full wipe (Wipe)</strong> factory-resets the entire device, destroying <em>everything</em>. On a personal BYOD phone you almost always use <strong>selective wipe</strong> (or an App Protection Policy wipe) — full-wiping someone's personal phone is both unnecessary and a legal/HR problem.</p>" },
        { type: "h", text: "Lost / stolen device playbook" },
        { type: "steps", items: [
          "Confirm the report and identify the device in Intune (Devices &gt; All devices).",
          "Immediately issue a <strong>Remote lock</strong> to stop casual access.",
          "If it's a corporate device with sensitive data, issue a <strong>full Wipe</strong>; if BYOD, issue a <strong>Retire / selective wipe</strong> (or the App Protection wipe).",
          "Rotate or revoke credentials and <strong>revoke the user's Entra sessions / refresh tokens</strong> so cached access dies.",
          "Confirm <strong>BitLocker</strong> protected the data at rest (recovery key safely in Entra), and rotate the key.",
          "Document the incident, and once recovered or replaced, re-provision via <strong>Autopilot</strong>."
        ]},
        { type: "code", lang: "powershell", caption: "Trigger remote actions via Microsoft Graph PowerShell", code: [
          "Connect-MgGraph -Scopes 'DeviceManagementManagedDevices.PrivilegedOperations.All'",
          "",
          "# Find the device by name to get its managed device Id",
          "$d = Get-MgDeviceManagementManagedDevice -Filter \"deviceName eq 'LAPTOP-ALEX'\"",
          "",
          "# Selective wipe (Retire): remove corporate data only",
          "Invoke-MgRetireDeviceManagementManagedDevice -ManagedDeviceId $d.Id",
          "",
          "# Full wipe (factory reset) - destructive, corporate device only",
          "# Clear-MgDeviceManagementManagedDevice -ManagedDeviceId $d.Id"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;A user lost their personal phone that has the company's email on it. What do you do?&quot;</strong> Because it's BYOD, you do NOT full-wipe their phone. You issue a <strong>selective wipe (Retire)</strong> or the App Protection Policy wipe to remove only corporate data, <strong>revoke the user's Entra sessions/tokens</strong>, and reset their password. Full wipe is reserved for corporate-owned devices. Calling out the privacy/legal reason for selective wipe is exactly what a senior wants to hear.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "6-7",
      title: "Intune in Zero Trust + operations",
      blocks: [
        { type: "p", html: "Let's zoom out. Intune isn't just a management tool — it's the <strong>device pillar of Zero Trust</strong>. Zero Trust says &quot;never trust, always verify,&quot; and for devices that means: <em>only known, healthy, low-risk devices get access</em>. Intune supplies those signals; Entra Conditional Access enforces them." },
        { type: "h", text: "Device signals that feed Zero Trust" },
        { type: "list", items: [
          "<strong>Managed &amp; known</strong> — is the device enrolled / Entra joined?",
          "<strong>Compliant</strong> — does it meet the compliance policy (encryption, OS version, AV on)?",
          "<strong>Low risk</strong> — what does <strong>Microsoft Defender for Endpoint</strong> say the device's threat level is right now?",
          "These combine into the Conditional Access decision: <em>allow, block, or require remediation</em>."
        ]},
        { type: "h", text: "Defender for Endpoint integration (risk gates access)" },
        { type: "steps", items: [
          "Connect Microsoft Defender for Endpoint to Intune (the MDE connector) and onboard devices via an Endpoint Security EDR policy.",
          "Defender for Endpoint continuously computes each device's <strong>risk score</strong> (low / medium / high) from detected threats and behaviours.",
          "Your Intune <strong>compliance policy</strong> includes a rule: &quot;require the device risk score to be at or below X.&quot;",
          "If Defender raises the risk above the threshold, Intune flips the device to <strong>noncompliant</strong>.",
          "<strong>Conditional Access</strong> reads the noncompliant state and blocks access until the threat is remediated and risk drops."
        ]},
        { type: "callout", variant: "analogy", html: "<p>Defender for Endpoint is the <strong>doctor taking the device's temperature</strong>, Intune is the <strong>nurse who writes &quot;unfit for duty&quot; on the chart</strong> when the fever is too high, and Conditional Access is the <strong>security guard who won't let &quot;unfit&quot; staff onto the factory floor</strong>. A live fever (high risk) automatically pulls the badge until the patient recovers.</p>" },
        { type: "h", text: "Delegated administration: RBAC and Scope Tags" },
        { type: "p", html: "In a real org you don't give everyone global admin. Intune has its own <strong>role-based access control (RBAC)</strong> — built-in roles like Help Desk Operator, Policy and Profile Manager, and Endpoint Security Manager grant only the permissions a job needs. <strong>Scope Tags</strong> then limit <em>which objects</em> a role can see and act on — for example, the &quot;London&quot; help desk only manages London-tagged devices and policies. RBAC = what you can do; Scope Tags = what you can do it to." },
        { type: "kv", items: [
          { k: "Intune RBAC role", v: "A set of permissions (e.g. Help Desk Operator can run remote actions but not change baselines)." },
          { k: "Scope Tag", v: "A label on devices/policies/groups that limits which objects a role assignment applies to (geography, department, business unit)." },
          { k: "Assignment", v: "Binds a role + members + scope (groups) + scope tags together — the actual grant." }
        ]},
        { type: "h", text: "Reporting & Endpoint analytics" },
        { type: "list", items: [
          "<strong>Compliance &amp; configuration reports</strong> — which devices passed/failed and why.",
          "<strong>App install status</strong> and <strong>policy deployment</strong> success/failure.",
          "<strong>Endpoint analytics</strong> — startup performance, application reliability, and a proactive remediations engine to fix common issues automatically.",
          "<strong>Audit logs</strong> — who changed what in the tenant (accountability)."
        ]},
        { type: "code", lang: "powershell", caption: "Quick operational pulls via Microsoft Graph PowerShell", code: [
          "Connect-MgGraph -Scopes 'DeviceManagementManagedDevices.Read.All'",
          "",
          "# Count devices by compliance state",
          "Get-MgDeviceManagementManagedDevice |",
          "  Group-Object ComplianceState |",
          "  Select-Object Name, Count",
          "",
          "# Devices that haven't checked in for a while (stale, possible risk)",
          "Get-MgDeviceManagementManagedDevice |",
          "  Where-Object { $_.LastSyncDateTime -lt (Get-Date).AddDays(-30) } |",
          "  Select-Object DeviceName, UserPrincipalName, LastSyncDateTime"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;How does Microsoft Defender for Endpoint risk gate access to corporate resources?&quot;</strong> MDE computes a live device risk score and shares it with Intune. The Intune compliance policy has a max-allowed-risk rule; if risk exceeds it, the device is marked noncompliant. Entra Conditional Access then blocks the device until remediation drops the risk. End to end: <em>MDE risk → Intune compliance → Conditional Access enforcement</em>. That chain is the Zero Trust device story in one sentence.</p>" },
        { type: "divider" },
        { type: "callout", variant: "tip", title: "Module 6 — Key takeaways", html: "<ul><li><strong>Intune</strong> (not &quot;Endpoint Manager&quot;) is cloud <strong>UEM = MDM + MAM</strong>, run from the Intune admin center; on-prem is <strong>Configuration Manager</strong>, and running both is <strong>co-management</strong>.</li><li>Devices get an Entra identity — <strong>registered (BYOD)</strong>, <strong>Entra joined (cloud-native)</strong>, or <strong>hybrid joined (legacy bridge)</strong> — then enroll (auto-enroll, <strong>Autopilot</strong> zero-touch, Apple/Android, or BYOD).</li><li>The killer combo: <strong>Intune compliance measures</strong> device health (encryption, OS, AV, Defender risk) and <strong>Entra Conditional Access enforces</strong> it. Compliance without CA does almost nothing.</li><li>Harden with <strong>Security Baselines</strong> (vetted starting point) + <strong>Settings Catalog</strong> (granular) + <strong>Endpoint Security</strong> policies; always escrow the <strong>BitLocker key to Entra</strong>.</li><li><strong>MAM / App Protection Policies</strong> protect corporate data on BYOD <em>without enrollment</em>; <strong>selective wipe (Retire)</strong> removes only corporate data, <strong>full Wipe</strong> factory-resets the whole device.</li><li>Operate with <strong>RBAC + Scope Tags</strong> for delegated admin, and use reporting + <strong>Endpoint analytics</strong> for visibility.</li></ul>" }
      ]
    }
  ],
  quiz: [
    { q: "What is the current, correct name and portal for Microsoft's cloud endpoint management?", options: ["Microsoft Endpoint Manager, managed at endpoint.microsoft.com", "Microsoft Intune, administered from the Microsoft Intune admin center (intune.microsoft.com)", "System Center Configuration Manager, in the cloud console", "Azure Device Manager, in the Azure portal"], answer: 1, explain: "The 'Microsoft Endpoint Manager' brand is retired. The product is Microsoft Intune and the portal is the Microsoft Intune admin center at intune.microsoft.com. On-prem is Microsoft Configuration Manager." },
    { q: "Which best describes the difference between MDM and MAM?", options: ["MDM manages apps only; MAM manages the whole device", "MDM manages the whole device (full enrollment); MAM (App Protection Policies) manages only the corporate app/data without enrollment — ideal for BYOD", "They are two names for the same thing", "MAM requires Configuration Manager; MDM does not"], answer: 1, explain: "MDM = whole-device management via full enrollment (corporate devices). MAM / App Protection Policies protect just the corporate app and its data without enrolling the device, which is how BYOD is enabled." },
    { q: "How does a device compliance policy actually block access to corporate resources?", options: ["Intune itself blocks the network connection", "Intune marks the device compliant/noncompliant and writes it to Entra; Entra Conditional Access reads that state and blocks noncompliant devices", "The device firewall blocks outbound traffic", "It deletes the user's account"], answer: 1, explain: "Intune measures health and stamps compliant/noncompliant on the Entra device object. Conditional Access enforces by reading that state. Compliance without a Conditional Access policy does almost nothing." },
    { q: "Which Entra device state is the modern, cloud-native default for corporate devices with no on-prem AD dependency?", options: ["Entra registered", "Entra joined", "Hybrid Entra joined", "Workgroup joined"], answer: 1, explain: "Entra joined = joined only to Entra ID (cloud), signed in with a work account. Registered = BYOD/personal; Hybrid joined = both on-prem AD and Entra (a legacy migration bridge, not a security upgrade)." },
    { q: "What does Windows Autopilot provide?", options: ["A golden-image capture and deployment tool", "Zero-touch provisioning: a new device ships to the user, who signs in with a work account and the device self-configures and enrolls", "A way to image servers over the LAN", "Automatic antivirus signature updates"], answer: 1, explain: "Autopilot pre-registers the device's hardware hash to the tenant; the user just signs in and it Entra-joins, auto-enrolls in Intune, and pulls apps/policies — no imaging, no IT visit, no VPN." },
    { q: "What is the difference between selective wipe (Retire) and full wipe (Wipe) in Intune?", options: ["They are identical", "Selective wipe removes only corporate data and management (personal data and OS survive); full wipe factory-resets the entire device", "Selective wipe encrypts the disk; full wipe decrypts it", "Full wipe only removes corporate apps"], answer: 1, explain: "Retire (selective wipe) removes only corporate data/apps/policies, ideal for BYOD. Wipe (full) factory-resets everything, used for corporate or lost/stolen devices. Don't full-wipe a personal phone." },
    { q: "When configuring BitLocker via Intune, what is a critical setting you must not forget?", options: ["Disable the TPM", "Escrow the BitLocker recovery key to Microsoft Entra ID", "Turn off real-time protection during encryption", "Use FAT32 for the OS volume"], answer: 1, explain: "Without escrowing the recovery key to Entra ID, a forgotten PIN or a TPM-triggered recovery can permanently lock you out of the data. Key escrow to Entra is a standard requirement and audit check." },
    { q: "How does Microsoft Defender for Endpoint gate access to resources?", options: ["It blocks the device at the router", "MDE computes a live device risk score → Intune compliance flips noncompliant if risk is too high → Conditional Access blocks until remediated", "It uninstalls corporate apps automatically", "It changes the user's password"], answer: 1, explain: "MDE shares a device risk score with Intune; the compliance policy's max-risk rule marks high-risk devices noncompliant; Conditional Access then blocks them. The chain is MDE risk → Intune compliance → Conditional Access." }
  ],
  flashcards: [
    { front: "Intune branding & portal (current)", back: "The 'Microsoft Endpoint Manager' brand is <strong>retired</strong>. The product is <strong>Microsoft Intune</strong>, run from the <strong>Microsoft Intune admin center</strong> (intune.microsoft.com)." },
    { front: "MDM vs MAM", back: "<strong>MDM</strong> = manage the whole device (full enrollment, corporate). <strong>MAM</strong> (App Protection Policies) = manage only the corporate app/data without enrollment — enables <strong>BYOD</strong>." },
    { front: "What is co-management?", back: "Running <strong>Microsoft Configuration Manager</strong> (on-prem) and <strong>Intune</strong> (cloud) together on the same device, splitting workloads — used during cloud migration." },
    { front: "Entra registered vs joined vs hybrid joined", back: "<strong>Registered</strong> = BYOD/personal (lightweight link). <strong>Entra joined</strong> = cloud-only corporate (modern default). <strong>Hybrid joined</strong> = on-prem AD + Entra (legacy migration bridge)." },
    { front: "Windows Autopilot — one line", back: "Zero-touch provisioning: device's hardware hash is pre-registered to the tenant; user signs in with a work account and it Entra-joins, auto-enrolls in Intune, and self-configures. No imaging." },
    { front: "The compliance → Conditional Access loop", back: "Intune evaluates the device and writes compliant/noncompliant to Entra; <strong>Conditional Access</strong> reads that state to allow/block access. Intune <em>measures</em>, CA <em>enforces</em>." },
    { front: "Compliance policy without Conditional Access?", back: "Does almost nothing — a noncompliant device just gets a label/email and can still reach resources. CA is what actually enforces the block." },
    { front: "Security Baseline vs Settings Catalog", back: "<strong>Baseline</strong> = Microsoft's hardened, recommended set of settings as a starting point. <strong>Settings Catalog</strong> = granular, pick-exactly-what-you-want individual settings. Don't stack two baselines." },
    { front: "App Protection Policy (APP / MAM-WE) capabilities", back: "Containerize + encrypt corporate data, require app PIN, block copy/paste to personal apps, Conditional Launch, and <strong>selective wipe</strong> of corporate data only — all without enrolling the device." },
    { front: "Selective wipe vs full wipe", back: "<strong>Retire (selective wipe)</strong> = remove only corporate data/management; personal data + OS survive (use for BYOD). <strong>Wipe (full)</strong> = factory reset everything (corporate / lost-stolen)." },
    { front: "BitLocker via Intune — critical setting", back: "Always <strong>escrow the recovery key to Microsoft Entra ID</strong>. Without it, a forgotten PIN or TPM recovery permanently locks you out of the data." },
    { front: "Intune RBAC vs Scope Tags", back: "<strong>RBAC role</strong> = what permissions you have (e.g. Help Desk Operator). <strong>Scope Tag</strong> = which objects those permissions apply to (e.g. only London devices). RBAC = what you can do; Scope Tag = to what." }
  ]
});
