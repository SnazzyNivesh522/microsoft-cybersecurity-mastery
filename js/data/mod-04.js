/* Module 4 — Microsoft Entra ID (Identity & Access)
   Same rules as the gold-standard template (mod-01.js):
   - JS strings use DOUBLE quotes "..."; HTML attributes inside use SINGLE quotes '...'.
   - Code blocks are arrays of lines; double every backslash.
   - No backticks, no template literals.
   Block types: p, h, h3, list, olist, steps, quote, divider,
     callout {variant: info|tip|warn|danger|interview|lab|analogy},
     code {lang, caption, code:[...]}, table {headers, rows}, kv {items:[{k,v}]}. */
window.COURSE.modules.push({
  id: "mod-04",
  number: 4,
  icon: "🆔",
  title: "Microsoft Entra ID (Identity & Access)",
  tagline: "Cloud identity done right: Conditional Access, MFA, PIM, Identity Protection, app registrations, and hybrid identity — the heart of Zero Trust.",
  estMinutes: 110,
  objectives: [
    "Explain what Microsoft Entra ID is — and is <em>not</em> — compared with on-prem Active Directory.",
    "Design <strong>Conditional Access</strong> policies and choose <strong>phishing-resistant MFA</strong>.",
    "Apply least privilege with <strong>PIM</strong> (eligible vs. active) and risk-based <strong>Identity Protection</strong>.",
    "Untangle app registrations, service principals, and managed identities — and spot consent-phishing.",
    "Compare <strong>PHS, PTA, and Federation</strong> for hybrid identity and their trade-offs.",
    "Explain how token theft can bypass MFA and the controls that stop it."
  ],
  lessons: [
    /* ---------------------------------------------------------------- */
    {
      id: "4-1",
      title: "What Entra ID is (and is NOT)",
      subtitle: "Cloud identity is a different animal",
      blocks: [
        { type: "p", html: "Let me say the single most important sentence in this entire module before anything else: <strong>Microsoft Entra ID is not Active Directory in the cloud.</strong> The names look similar, Microsoft put them in the same family on purpose, and that confusion has sunk more interview candidates than any other single mistake. If you walk out of this lesson with one thing, let it be the difference between a <em>domain controller</em> and a <em>cloud identity provider</em>." },
        { type: "callout", variant: "analogy", html: "<p>On-prem <strong>Active Directory</strong> is like the <strong>security desk inside one building</strong> — it knows the floor plan, hands out physical keys (Kerberos tickets), and assumes everyone walks through its lobby. <strong>Entra ID</strong> is the <strong>global airline loyalty programme</strong> — it doesn't care which building you're in; it issues a verifiable membership token you can present to any partner (app) anywhere on the internet. One assumes a perimeter; the other assumes there is no perimeter.</p>" },
        { type: "h", text: "Entra ID is IDaaS — Identity-as-a-Service" },
        { type: "p", html: "Entra ID is a <strong>cloud-based identity and access management (IAM) service</strong>. Its job is to authenticate users and applications and decide what they can access, over the open internet, for SaaS apps (Microsoft 365, Salesforce, ServiceNow), your own apps, and Azure resources. It is the <strong>identity control plane</strong> for the entire Microsoft cloud." },
        { type: "h", text: "What Entra ID does NOT have (memorise this list)" },
        { type: "p", html: "This is the table interviewers reach for. Entra ID deliberately drops the on-prem protocols and concepts and speaks modern web standards instead:" },
        { type: "table", headers: ["On-prem Active Directory", "Microsoft Entra ID"], rows: [
          ["LDAP, Kerberos, NTLM", "OAuth 2.0, OpenID Connect (OIDC), SAML, SCIM, Microsoft Graph (REST)"],
          ["Organizational Units (OUs)", "Administrative Units &amp; groups (no OU tree)"],
          ["Group Policy (GPO)", "Conditional Access + Intune policies (MDM/MAM)"],
          ["Domain / forest / trusts", "Tenant (a single directory) + cross-tenant access / B2B"],
          ["Domain join, FSMO roles, DCs", "Entra join / registration; no domain controllers to patch"],
          ["You run &amp; patch the servers", "Microsoft runs it; you configure policy"]
        ]},
        { type: "callout", variant: "danger", html: "<p>Do not say Entra ID has &quot;OUs and GPOs&quot; in an interview. It has <strong>neither</strong>. There is no LDAP bind, no Kerberos ticket, no NTLM. If an app needs those, it talks to on-prem AD (or Microsoft Entra Domain Services, a separate managed-domain product). Entra ID's currency is the <strong>token</strong>, not the ticket.</p>" },
        { type: "h", text: "The Azure AD to Entra ID rename — what actually changed" },
        { type: "p", html: "In 2023 Microsoft renamed <strong>Azure Active Directory (Azure AD)</strong> to <strong>Microsoft Entra ID</strong>. By 2026 the new name is everywhere in the portal and docs, but understand this clearly: <strong>the rename is cosmetic.</strong> The login endpoints (<code>login.microsoftonline.com</code>), the APIs, the MSAL authentication libraries, the app IDs, and the PowerShell cmdlet nouns did <em>not</em> change. &quot;Azure AD&quot; and &quot;Entra ID&quot; are the same product." },
        { type: "kv", items: [
          { k: "SKU: Entra ID Free", v: "Bundled with any Microsoft cloud subscription. Basic user/group management, SSO, security defaults." },
          { k: "SKU: Entra ID P1", v: "Adds Conditional Access, dynamic groups, self-service password reset with writeback, Entra Connect health." },
          { k: "SKU: Entra ID P2", v: "Everything in P1 plus <strong>Privileged Identity Management (PIM)</strong> and <strong>Identity Protection</strong> (risk-based policies, access reviews). This is the licence that gets tested." }
        ]},
        { type: "h", text: "Tenant = one directory" },
        { type: "p", html: "A <strong>tenant</strong> is a single, dedicated, isolated instance of Entra ID that you get when your organisation signs up for a Microsoft cloud service. It has a default domain like <code>contoso.onmicrosoft.com</code> and a globally-unique <strong>Tenant ID</strong> (a GUID). All your users, groups, apps, and policies live inside it. Apps can be <strong>single-tenant</strong> (only your org) or <strong>multi-tenant</strong> (sign-ins from any Entra tenant) — a distinction that matters enormously for the security of app registrations (Lesson 7)." },
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;What is the difference between Active Directory and Microsoft Entra ID?&quot;</strong> The crisp answer: &quot;AD is an on-prem directory built for the LAN — it uses LDAP, Kerberos and NTLM, organises objects in OUs, and is managed with Group Policy. Entra ID is a cloud IDaaS built for the internet — it uses OAuth 2.0, OIDC, SAML and SCIM, has no OUs or GPOs, and is managed with Conditional Access and Intune. They solve the same problem — who are you and what can you access — for two different worlds, and Entra Connect bridges them.&quot; That answer alone clears most identity rounds.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "4-2",
      title: "Objects: users, groups, devices, service principals",
      blocks: [
        { type: "p", html: "Everything in a tenant is an <strong>object</strong> in the directory, and security work is fundamentally about understanding which objects exist, where they came from, and what they can do. There are four object families you must know cold: <strong>users, groups, devices, and identities for applications (service principals)</strong>." },
        { type: "h", text: "Users — three origins, three risk profiles" },
        { type: "kv", items: [
          { k: "Cloud-only user", v: "Created directly in Entra ID. Authenticates against the cloud. No on-prem footprint." },
          { k: "Synced (hybrid) user", v: "Mastered in on-prem AD and synchronised up by Entra Connect (Lesson 8). The on-prem object is authoritative — you edit it on-prem, not in the cloud." },
          { k: "Guest (B2B) user", v: "An external identity invited into your tenant (a partner's email, another tenant). <code>UserType = Guest</code>. Often over-permissioned and under-reviewed — a real audit hot-spot." }
        ]},
        { type: "callout", variant: "warn", html: "<p>Guest sprawl is a genuine breach vector. Every guest is an external party with a foothold in your directory. Use <strong>access reviews</strong> (Lesson 4) to expire stale guests, and apply Conditional Access to guests just like employees. &quot;Who are all my guests and what can they see?&quot; is a question you should be able to answer on demand.</p>" },
        { type: "h", text: "Groups — the two questions that define them" },
        { type: "p", html: "Every Entra group is defined by two independent choices: its <strong>type</strong> and its <strong>membership style</strong>." },
        { type: "table", headers: ["Choice", "Options", "What it means"], rows: [
          ["Group type", "<strong>Security</strong> vs <strong>Microsoft 365</strong>", "Security groups grant access (apps, roles, resources). M365 groups also create a shared mailbox, calendar, SharePoint site and Teams team — collaboration, not just access."],
          ["Membership", "<strong>Assigned</strong> vs <strong>Dynamic</strong>", "Assigned = you add/remove members by hand. Dynamic = membership is computed from a rule over user/device attributes (needs Entra ID P1)."]
        ]},
        { type: "p", html: "A <strong>dynamic membership rule</strong> is a small query, e.g. <code>(user.department -eq &quot;Finance&quot;) -and (user.accountEnabled -eq true)</code>. It is powerful and dangerous: change a user's department and they silently gain or lose access. Treat the rules as code and review them." },
        { type: "h", text: "Devices — a one-line preview (full detail in Module 6)" },
        { type: "list", items: [
          "<strong>Entra registered</strong> — typically personal / BYOD; the user signs in to apps but the org doesn't own the device identity fully.",
          "<strong>Entra joined</strong> — cloud-only corporate device; its primary identity is Entra ID (no on-prem domain).",
          "<strong>Entra hybrid joined</strong> — joined to on-prem AD <em>and</em> registered to Entra ID, for organisations mid-migration.",
          "Why it matters: device state is a first-class <strong>Conditional Access signal</strong> — &quot;only a compliant or hybrid-joined device may open this app.&quot;"
        ]},
        { type: "h", text: "Identities for applications — the one juniors get wrong" },
        { type: "kv", items: [
          { k: "App registration", v: "The global <em>definition / blueprint</em> of an application — its app ID, redirect URIs, secrets/certs, and the permissions it requests. It lives in its home tenant. Think &quot;the application's passport design.&quot;" },
          { k: "Enterprise app (service principal)", v: "The <em>local instance</em> of that app inside <strong>your</strong> tenant — the actual identity that gets assignments, consent, and sign-in logs. A multi-tenant app has one registration but a service principal in every tenant that uses it." },
          { k: "Administrative Unit (AU)", v: "A container that scopes <em>admin</em> permissions to a subset of users/groups/devices (e.g. &quot;Helpdesk-EU can only reset passwords for EU users&quot;). The closest thing Entra has to an OU, but for delegation, not policy." }
        ]},
        { type: "code", lang: "powershell", caption: "Explore directory objects with the Microsoft Graph PowerShell SDK", code: [
          "# The modern way. MSOnline & AzureAD modules were RETIRED in 2025 - do not use them.",
          "Install-Module Microsoft.Graph -Scope CurrentUser",
          "Connect-MgGraph -Scopes 'User.Read.All','Group.Read.All','Directory.Read.All'",
          "",
          "# List users and flag the guests (the audit you'll do constantly)",
          "Get-MgUser -All -Property DisplayName,UserPrincipalName,UserType,AccountEnabled |",
          "  Select-Object DisplayName, UserPrincipalName, UserType, AccountEnabled",
          "",
          "# Create a cloud-only user (splatting keeps it to one logical command)",
          "$pwd = @{ Password = 'Tr@nsient-P@ss-2026!'; ForceChangePasswordNextSignIn = $true }",
          "$params = @{ DisplayName='Ada Lovelace'; UserPrincipalName='ada@contoso.onmicrosoft.com';",
          "             MailNickname='ada'; AccountEnabled=$true; PasswordProfile=$pwd }",
          "New-MgUser @params",
          "",
          "# Inspect groups and find dynamic ones (membership driven by a rule)",
          "Get-MgGroup -All -Property DisplayName,GroupTypes,SecurityEnabled,MembershipRule |",
          "  Select-Object DisplayName, SecurityEnabled,",
          "    @{n='Dynamic';e={ $_.GroupTypes -contains 'DynamicMembership' }}, MembershipRule",
          "",
          "# Service principals = the enterprise-app identities living in this tenant",
          "Get-MgServicePrincipal -All -Property DisplayName,AppId,ServicePrincipalType |",
          "  Select-Object DisplayName, AppId, ServicePrincipalType -First 20"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;What is the difference between an app registration and an enterprise application (service principal)?&quot;</strong> &quot;The app registration is the global blueprint of the app — created once, in its home tenant, holding the app ID, redirect URIs, credentials and requested permissions. The service principal (shown as an &lsquo;enterprise application&rsquo;) is the local representation of that app inside a specific tenant — it is the security identity that receives consent, role/user assignments and sign-in logs. One registration, potentially many service principals.&quot; Bonus: mention that a <strong>managed identity</strong> is a special service principal Azure manages for you with no secret to leak (Lesson 7).</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "4-3",
      title: "Authentication methods & passwordless",
      blocks: [
        { type: "p", html: "Authentication is where attacks land first, because <strong>passwords are the weakest control we have</strong>. They get phished, sprayed, reused, and dumped. This lesson is the journey from &quot;password alone&quot; up to <strong>phishing-resistant, passwordless MFA</strong> — and why the rung you stand on decides whether a phishing email becomes a breach." },
        { type: "h", text: "The MFA ladder — not all factors are equal" },
        { type: "table", headers: ["Method", "Strength", "Notes"], rows: [
          ["Password only", "Weak", "Single factor. Phishable, sprayable, reusable. Never sufficient alone."],
          ["SMS / voice OTP", "Low MFA", "Better than nothing, but SIM-swap and real-time phishing defeat it. Being deprecated as a primary factor."],
          ["Microsoft Authenticator (number matching)", "Good MFA", "Push with <strong>number matching</strong> defeats &lsquo;MFA fatigue&rsquo; bombing — you must type a number shown on the sign-in screen, so blind approvals fail."],
          ["FIDO2 passkeys / security keys", "<strong>Phishing-resistant</strong>", "Public-key crypto bound to the real domain. A fake site cannot capture anything reusable."],
          ["Windows Hello for Business", "<strong>Phishing-resistant</strong>", "Biometric/PIN unlocks a hardware-backed (TPM) key pair. Passwordless on the device."],
          ["Certificate-based auth (CBA)", "<strong>Phishing-resistant</strong>", "Smartcard / PKI certificate authenticates directly to Entra ID. Common in government/regulated environments."]
        ]},
        { type: "callout", variant: "tip", title: "Phishing-resistant MFA is the goal", html: "<p>FIDO2, Windows Hello for Business, and certificate-based auth are <strong>phishing-resistant</strong> because the credential is cryptographically bound to the legitimate site. An attacker-in-the-middle phishing kit (like Evilginx) can steal a password and even an SMS/push code, but it <em>cannot</em> replay a FIDO2 assertion. When an interviewer asks how to stop credential phishing, &quot;move admins to phishing-resistant MFA&quot; is the senior answer.</p>" },
        { type: "h", text: "Self-service password reset (SSPR) & Smart Lockout" },
        { type: "list", items: [
          "<strong>SSPR</strong> lets users reset or unlock their own password after passing extra verification — fewer helpdesk tickets and fewer dangerous &quot;reset over the phone&quot; social-engineering openings. With <strong>password writeback</strong> the new password flows back to on-prem AD (hybrid).",
          "<strong>Smart Lockout</strong> locks an account after repeated bad guesses but is smart about it — it distinguishes the real user (familiar location) from a botnet spraying from many IPs, so attackers get locked out without locking the legitimate user out."
        ]},
        { type: "h", text: "Entra Password Protection — kill the weak passwords at the source" },
        { type: "p", html: "Entra <strong>Password Protection</strong> enforces a <strong>global banned-password list</strong> (Microsoft-maintained, from real breach/spray data) plus your own <strong>custom banned list</strong> (your company name, products, local sports teams — the words attackers guess first). An on-prem agent extends the same checks to your domain controllers so &quot;Contoso2026!&quot; gets rejected everywhere." },
        { type: "callout", variant: "danger", title: "Block legacy / basic authentication", html: "<p><strong>Legacy authentication</strong> (basic auth: older Office clients, IMAP, POP, SMTP AUTH, and other protocols that send username+password directly) <em>cannot perform MFA</em>. That means an attacker who has a sprayed password can sign in through a legacy endpoint and <strong>bypass every MFA policy you have</strong>. Historically the large majority of password-spray compromises rode in over legacy auth. Microsoft has retired basic auth in Exchange Online, but you must still explicitly block legacy auth with Conditional Access (Lesson 5). This is policy #1, every time.</p>" },
        { type: "code", lang: "powershell", caption: "Review authentication methods and registration", code: [
          "Connect-MgGraph -Scopes 'UserAuthenticationMethod.Read.All','Policy.Read.All'",
          "",
          "# Which strong methods has a given user registered?",
          "Get-MgUserAuthenticationMethod -UserId 'ada@contoso.onmicrosoft.com' |",
          "  Select-Object Id, AdditionalProperties",
          "",
          "# Tenant-wide registration & MFA-capable report (great for an audit deck)",
          "Get-MgReportAuthenticationMethodUserRegistrationDetail |",
          "  Select-Object UserPrincipalName, IsMfaCapable, IsPasswordlessCapable,",
          "    IsSsprRegistered, MethodsRegistered",
          "",
          "# Read the authentication methods policy (which methods are enabled tenant-wide)",
          "Get-MgPolicyAuthenticationMethodPolicy | Select-Object -ExpandProperty AuthenticationMethodConfigurations |",
          "  Select-Object Id, State"
        ]},
        { type: "callout", variant: "lab", html: "<p>In your test tenant, register the <strong>Microsoft Authenticator</strong> app for your account and watch <strong>number matching</strong> in action — note that you must type the number shown on the PC, you cannot just tap &lsquo;Approve&rsquo;. Then add a <strong>FIDO2 passkey</strong> if you have a security key or a phone passkey, and compare the sign-in experience. Feeling the difference between &quot;approve a push&quot; and &quot;present a hardware key&quot; makes the phishing-resistance argument click.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;A user has MFA enabled but their account was still compromised. How?&quot;</strong> Three classic answers and you should know all three: <strong>(1) legacy authentication</strong> bypassed MFA entirely; <strong>(2) MFA-fatigue / push-bombing</strong> — the user blindly approved a prompt (number matching fixes this); or <strong>(3) token theft</strong> via an attacker-in-the-middle phishing proxy that stole the session cookie <em>after</em> MFA. Mitigations: block legacy auth, enforce number matching, move to phishing-resistant MFA, and add token protection / sign-in-risk policies (Lessons 5 and 6).</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "4-4",
      title: "Roles, least privilege & PIM",
      blocks: [
        { type: "p", html: "Identity is the new perimeter, and <strong>privileged identity is the keep inside the castle</strong>. A single compromised Global Administrator equals a compromised tenant — every mailbox, every file, every policy. This lesson is about who gets the powerful roles, the principle of least privilege, and the P2 feature that makes standing privilege a thing of the past: <strong>PIM</strong>." },
        { type: "h", text: "Entra built-in roles you must be able to name" },
        { type: "kv", items: [
          { k: "Global Administrator", v: "God mode over Entra ID and dependent services. Microsoft's guidance: fewer than 5, ideally cloud-only, all on phishing-resistant MFA + PIM. The crown jewels." },
          { k: "Privileged Role Administrator", v: "Can grant/manage other admin roles and PIM settings. Almost as dangerous as Global Admin — it can <em>make</em> Global Admins." },
          { k: "User Administrator", v: "Manages users and groups, resets passwords (with limits). Common helpdesk-tier role." },
          { k: "Security Administrator", v: "Manages security features — Conditional Access, Identity Protection, Defender. Read/configure security posture." },
          { k: "Security Reader / Global Reader", v: "Read-only visibility. Perfect for auditors and analysts — least privilege in action." }
        ]},
        { type: "callout", variant: "tip", html: "<p><strong>Least privilege, concretely:</strong> don't hand someone Global Administrator because it's easy. Pick the most specific role that does the job (a helpdesk agent needs <em>User Administrator</em> or even just <em>Password Administrator</em>, not GA), scope it with an <strong>administrative unit</strong> if you can, and make it <strong>eligible</strong> rather than permanent via PIM. Every standing GA you remove is one fewer account an attacker can phish into total control.</p>" },
        { type: "h", text: "Entra roles vs Azure RBAC — two different planes" },
        { type: "table", headers: ["", "Entra ID roles", "Azure RBAC roles"], rows: [
          ["Control over", "The directory: users, groups, apps, CA, devices", "Azure <em>resources</em>: VMs, storage, subscriptions, networks"],
          ["Example roles", "Global Admin, User Admin, Security Admin", "Owner, Contributor, Reader, Storage Blob Data Reader"],
          ["Scope", "Tenant-wide (or scoped by Administrative Unit)", "Management group / subscription / resource group / resource"],
          ["Assigned where", "Entra admin center / Microsoft Graph", "Azure resource scope (the Access control / IAM blade)"]
        ]},
        { type: "callout", variant: "warn", html: "<p>These two are <strong>separate systems</strong>. Being Global Administrator in Entra does NOT automatically give you control over Azure resource billing or VMs — though a GA can <em>elevate</em> themselves to gain Azure access (the &quot;User Access Administrator at root&quot; toggle), which is itself something to audit. Confusing &quot;directory admin&quot; with &quot;resource admin&quot; is a classic interview trip-wire.</p>" },
        { type: "h", text: "Privileged Identity Management (PIM) — just-in-time admin (P2)" },
        { type: "p", html: "PIM replaces <strong>standing privilege</strong> (you are an admin 24/7) with <strong>just-in-time privilege</strong> (you are <em>eligible</em>, and you activate the role only when you need it, for a limited time)." },
        { type: "kv", items: [
          { k: "Eligible assignment", v: "You CAN activate the role but you do not hold it right now. No standing power = nothing for an attacker to steal at rest." },
          { k: "Active assignment", v: "You hold the role right now. PIM makes these time-bound and, ideally, rare." },
          { k: "Activation", v: "An eligible user requests the role, satisfies conditions (MFA, justification, sometimes approval), and gets it for a capped window (e.g. 4 hours), then it auto-expires." },
          { k: "Access reviews", v: "Periodic recertification — &quot;does this person still need to be eligible for this role?&quot; Stale access is removed. Also used for guests and group membership." }
        ]},
        { type: "code", lang: "powershell", caption: "Inspect role assignments and PIM eligibility via Graph", code: [
          "Connect-MgGraph -Scopes 'RoleManagement.Read.Directory','RoleEligibilitySchedule.Read.Directory'",
          "",
          "# Who holds directory roles right now (ACTIVE assignments)?",
          "Get-MgRoleManagementDirectoryRoleAssignment -ExpandProperty Principal,RoleDefinition |",
          "  Select-Object @{n='Role';e={$_.RoleDefinition.DisplayName}},",
          "    @{n='Who';e={$_.Principal.AdditionalProperties.displayName}}",
          "",
          "# PIM ELIGIBLE assignments (can activate, but not standing) - the modern model",
          "Get-MgRoleManagementDirectoryRoleEligibilitySchedule -ExpandProperty Principal,RoleDefinition |",
          "  Select-Object @{n='Role';e={$_.RoleDefinition.DisplayName}},",
          "    @{n='Who';e={$_.Principal.AdditionalProperties.displayName}}, Status",
          "",
          "# Hunt for the riskiest finding: standing Global Administrators",
          "$ga = Get-MgDirectoryRole -Filter \"displayName eq 'Global Administrator'\"",
          "Get-MgDirectoryRoleMember -DirectoryRoleId $ga.Id |",
          "  ForEach-Object { $_.AdditionalProperties.userPrincipalName }"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;In PIM, what is the difference between an eligible and an active assignment?&quot;</strong> &quot;An <strong>active</strong> assignment means the user holds the role continuously — standing privilege. An <strong>eligible</strong> assignment means the user can <em>activate</em> the role just-in-time when they need it, after satisfying conditions like MFA, a justification and sometimes approval, and it expires automatically. The security win is that an eligible admin has no standing power for an attacker to steal — most of the time the privileged account is, effectively, a normal user.&quot; Add that PIM needs <strong>Entra ID P2</strong> and pairs with <strong>access reviews</strong> for recertification.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "4-5",
      title: "Conditional Access — the policy engine",
      subtitle: "The Zero Trust enforcement point",
      blocks: [
        { type: "p", html: "If Entra ID is the brain of Microsoft cloud security, <strong>Conditional Access (CA) is its decision cortex</strong>. This is the most important single topic in a Microsoft identity interview, and the centrepiece of this whole module. Get fluent in it and you will out-answer most candidates." },
        { type: "callout", variant: "analogy", html: "<p>Conditional Access is an <strong>airport security checkpoint that adapts to the traveller</strong>. A known passenger, on a corporate-managed device, flying from the home country during business hours sails through. A first-time passenger, on an unknown phone, from a high-risk country at 3am, gets pulled aside for extra screening (MFA) — or refused boarding entirely (block). Same gate, different scrutiny based on the <em>signals</em>.</p>" },
        { type: "h", text: "The if-this-then-that model" },
        { type: "p", html: "Every CA policy is fundamentally: <strong>IF (these signals are true) THEN (make this access decision)</strong>. The engine evaluates assignments (signals) and, if they match, applies access controls." },
        { type: "table", headers: ["SIGNALS (the IF)", "ACCESS DECISION (the THEN)"], rows: [
          ["<strong>Users / groups</strong> (who) — include/exclude, guests, roles", "<strong>Block access</strong> — the hard stop"],
          ["<strong>Target resource</strong> (which app / action)", "<strong>Grant with controls</strong>: require MFA"],
          ["<strong>Device state</strong> — compliant (Intune) or hybrid-joined", "require <strong>compliant or hybrid-joined device</strong>"],
          ["<strong>Location</strong> — named locations, countries, IP ranges", "require <strong>approved client app</strong> / app protection policy"],
          ["<strong>Sign-in risk &amp; user risk</strong> (from Identity Protection)", "require <strong>password change</strong> (for risk)"],
          ["<strong>Client app</strong> — browser, modern, or <em>legacy</em> auth", "<strong>Session controls</strong> — sign-in frequency, no persistent browser, token protection"]
        ]},
        { type: "callout", variant: "tip", title: "Report-only mode — always test first", html: "<p>New CA policies go live for everyone the instant you enable them — and a bad policy can lock out your admins or the whole company in seconds. <strong>Report-only mode</strong> evaluates the policy against real sign-ins and logs &quot;what would have happened&quot; <em>without enforcing it</em>. Run every new policy in report-only first, review the impact in the sign-in logs, and ALWAYS keep a <strong>break-glass / emergency-access account</strong> excluded from all CA policies. The classic outage story is &quot;we required compliant devices and locked out every admin including ourselves.&quot;</p>" },
        { type: "h", text: "The four must-have policies (know these by heart)" },
        { type: "olist", items: [
          "<strong>Block legacy authentication</strong> — target the legacy/other-clients condition and block. Without this, MFA can be bypassed (Lesson 3). This is the #1 policy.",
          "<strong>Require MFA for administrators</strong> — target the privileged directory roles and require MFA (ideally phishing-resistant). Admins are the prime phishing target.",
          "<strong>Require MFA for all users</strong> — the baseline. Excludes only break-glass accounts. Massively reduces account takeover.",
          "<strong>Require a compliant or hybrid-joined device for corporate apps</strong> — only managed, healthy devices reach sensitive resources. This is device-based Zero Trust."
        ]},
        { type: "code", lang: "powershell", caption: "List Conditional Access policies and find the gaps", code: [
          "Connect-MgGraph -Scopes 'Policy.Read.All'",
          "",
          "# Enumerate every CA policy with its state (enabled / disabled / reportOnly)",
          "Get-MgIdentityConditionalAccessPolicy -All |",
          "  Select-Object DisplayName, State,",
          "    @{n='Apps';e={ $_.Conditions.Applications.IncludeApplications -join ',' }},",
          "    @{n='Grant';e={ $_.GrantControls.BuiltInControls -join ',' }}",
          "",
          "# Audit gap: is there any ENABLED policy that blocks legacy auth?",
          "Get-MgIdentityConditionalAccessPolicy -All |",
          "  Where-Object { $_.Conditions.ClientAppTypes -contains 'exchangeActiveSync' -or",
          "                 $_.Conditions.ClientAppTypes -contains 'other' } |",
          "  Select-Object DisplayName, State",
          "",
          "# Tip: build/edit policies in report-only first, then flip State to 'enabled'."
        ]},
        { type: "callout", variant: "danger", html: "<p>Conditional Access is also a target. An attacker with <strong>Conditional Access Administrator</strong> or Global Admin rights can <em>weaken</em> CA — adding their own account to an exclusion, disabling the legacy-auth block, or carving an exception. Monitor CA policy changes in the audit log and lock down who can edit policies with PIM. The policy engine is only as strong as the protection around <em>editing</em> it.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;Explain Conditional Access and give me the policies you'd deploy first.&quot;</strong> Lead with the model: &quot;CA is Entra's if-this-then-that policy engine and the Zero Trust enforcement point — it evaluates <em>signals</em> (user, app, device state, location, client app, sign-in/user risk) and makes an <em>access decision</em> (block, or grant with controls like MFA or a compliant device).&quot; Then list the four: <strong>block legacy auth, MFA for admins, MFA for all users, require a compliant device for corporate apps</strong>. Close with operational maturity: &quot;I'd roll each out in report-only first and always keep break-glass accounts excluded.&quot; That is a hire-grade answer.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "4-6",
      title: "Identity Protection — risk-based security",
      blocks: [
        { type: "p", html: "Conditional Access decides <em>based on signals</em>. <strong>Identity Protection</strong> (Entra ID P2) is the engine that produces one of the most powerful signals of all: <strong>risk</strong>. It uses Microsoft's vast telemetry — trillions of signals across the cloud — and machine learning to flag when a sign-in or an account looks compromised, then lets Conditional Access act on it automatically." },
        { type: "h", text: "Two kinds of risk — and they are not the same" },
        { type: "kv", items: [
          { k: "Sign-in risk", v: "The probability that <em>this particular sign-in</em> was not the legitimate user. It is about the <strong>session</strong> — odd location, anonymous IP, unfamiliar properties. Acted on in real time." },
          { k: "User risk", v: "The probability that the <em>identity itself</em> is compromised — most strongly, the user's credentials appeared in a known leak. It is about the <strong>account</strong>, and tends to persist until remediated." }
        ]},
        { type: "h", text: "Detections you should be able to name" },
        { type: "table", headers: ["Detection", "Risk type", "What it catches"], rows: [
          ["<strong>Leaked credentials</strong>", "User", "The user's username/password appeared in a breach dump or paste site Microsoft monitors."],
          ["<strong>Impossible / atypical travel</strong>", "Sign-in", "Sign-ins from two locations too far apart to travel between in the elapsed time."],
          ["<strong>Anonymous IP / Tor</strong>", "Sign-in", "Sign-in from an anonymising proxy or the Tor network — attackers hiding origin."],
          ["<strong>Password spray</strong>", "Sign-in", "A pattern of many accounts hit with a few common passwords from shared infrastructure."],
          ["<strong>Unfamiliar sign-in properties</strong>", "Sign-in", "Device, browser, location, or ISP that doesn't match the user's history."]
        ]},
        { type: "callout", variant: "tip", title: "Leaked credentials needs Password Hash Sync", html: "<p>A practical detail interviewers love: for <strong>hybrid</strong> (on-prem-synced) users, the <strong>leaked credentials</strong> detection only works if you use <strong>Password Hash Sync</strong> (PHS) — Microsoft needs a hash of the password in the cloud to match it against breach data. Choose Pass-through Authentication or pure Federation and you lose this protection for synced users. That is a strong argument for PHS even when you authenticate elsewhere (Lesson 8).</p>" },
        { type: "h", text: "Risk-based Conditional Access — closing the loop" },
        { type: "p", html: "Identity Protection's whole point is automated response. You wire the risk levels into Conditional Access so the system reacts at machine speed, 24/7, with no analyst in the loop:" },
        { type: "list", items: [
          "<strong>High sign-in risk</strong> &rarr; block, or require MFA before granting (prove it's really you, right now).",
          "<strong>High user risk</strong> &rarr; require a secure password change (and MFA) to self-remediate and clear the risk.",
          "<strong>Medium risk</strong> &rarr; require MFA. <strong>Low/no risk</strong> &rarr; allow with normal controls (no friction for the legitimate user)."
        ]},
        { type: "code", lang: "powershell", caption: "Pull risky users and risk detections from Graph", code: [
          "Connect-MgGraph -Scopes 'IdentityRiskyUser.Read.All','IdentityRiskEvent.Read.All'",
          "",
          "# Currently risky users (the queue you triage)",
          "Get-MgRiskyUser -Filter \"riskState eq 'atRisk'\" |",
          "  Select-Object UserPrincipalName, RiskLevel, RiskState, RiskLastUpdatedDateTime",
          "",
          "# Recent risk detections with the detection type and source",
          "Get-MgRiskDetection -Top 25 |",
          "  Select-Object UserPrincipalName, RiskEventType, RiskLevel,",
          "    IpAddress, DetectedDateTime, @{n='City';e={ $_.Location.City }}",
          "",
          "# After investigating a false positive, dismiss the user's risk",
          "# Invoke-MgDismissRiskyUser -UserIds @('<userObjectId>')"
        ]},
        { type: "callout", variant: "warn", html: "<p>Do not confuse <strong>Microsoft Entra ID Protection</strong> with <strong>Microsoft Defender for Identity (MDI)</strong>. Identity Protection watches <em>cloud</em> identities and sign-ins in Entra ID. Defender for Identity is a sensor on your <em>on-prem domain controllers</em> that detects AD attacks like Kerberoasting, Pass-the-Hash and DCSync (Module 2). Different products, different worlds — name them correctly.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;What's the difference between user risk and sign-in risk, and how would you use them?&quot;</strong> &quot;Sign-in risk scores a single session — is <em>this login</em> the real user? — and is acted on in real time, e.g. high sign-in risk forces MFA or blocks. User risk scores the <em>account</em> — is the identity itself compromised, most notably from leaked credentials? — and high user risk should force a secure password change to remediate. You feed both into risk-based Conditional Access so Entra responds automatically. It needs Entra ID P2.&quot;</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "4-7",
      title: "Applications, OAuth & consent",
      blocks: [
        { type: "p", html: "Modern apps don't ask for your password — they ask Entra ID for a <strong>token</strong> that grants them limited, scoped access to your data. That is OAuth 2.0 and OpenID Connect. It is brilliant, and it is also the soil in which one of the nastiest modern attacks grows: <strong>consent phishing</strong>. Understand permissions and consent and you understand how attackers steal data without ever touching a password." },
        { type: "h", text: "Delegated vs application permissions — the core distinction" },
        { type: "kv", items: [
          { k: "Delegated permissions", v: "The app acts <strong>on behalf of a signed-in user</strong>, and can never exceed what that user could do themselves. Effective access = the intersection of the granted scope and the user's own rights. Used by interactive apps." },
          { k: "Application permissions", v: "The app acts <strong>as itself, with no user present</strong> (daemons, background services). These are app-wide and powerful — &quot;read ALL mailboxes,&quot; not &quot;read the signed-in user's mailbox.&quot; They <strong>always require admin consent</strong>." }
        ]},
        { type: "callout", variant: "danger", html: "<p>Application permissions like <code>Mail.ReadWrite</code> or <code>Directory.ReadWrite.All</code> are <strong>tenant-wide superpowers</strong>. A service principal holding them can read every mailbox or modify the whole directory — no user, no MFA, no Conditional Access on a normal user account. Over-permissioned app registrations and leaked client secrets are how attackers achieve quiet, persistent, MFA-immune access. Audit application permissions as carefully as you audit Global Admins.</p>" },
        { type: "h", text: "Consent — who gets to say yes" },
        { type: "p", html: "When an app requests permissions, someone must <strong>consent</strong>. <strong>User consent</strong> lets a user approve low-risk delegated scopes for themselves. <strong>Admin consent</strong> is required for high-privilege or application permissions and grants for the whole tenant. The danger is leaving user consent wide open." },
        { type: "callout", variant: "warn", title: "The illicit consent grant attack (consent phishing)", html: "<p>The attacker registers a malicious multi-tenant app with an innocent name and emails users a legitimate-looking Microsoft consent link. The victim clicks &lsquo;Accept&rsquo; on a <em>real</em> Microsoft sign-in page, granting the attacker's app delegated permissions like <code>Mail.Read</code> and <code>offline_access</code>. Now the attacker has a <strong>refresh token</strong> reading the victim's mail — and <strong>resetting the password or MFA does not revoke it</strong>, because the user authorised the app, not a stolen credential. This bypasses MFA by design.</p>" },
        { type: "h", text: "Defences against consent phishing" },
        { type: "list", items: [
          "<strong>Restrict user consent</strong> — allow users to consent only to verified-publisher apps for low-risk permissions, or disable user consent entirely.",
          "<strong>Admin consent workflow</strong> — when a user needs an app, they request it and an admin reviews and approves, instead of self-service granting.",
          "<strong>Review enterprise apps regularly</strong> — hunt for apps with risky delegated/application permissions and unfamiliar publishers; revoke the suspicious ones.",
          "<strong>Educate users</strong> — a consent prompt for &lsquo;read your mail and stay signed in&rsquo; from an unknown app is exactly as dangerous as a password phish."
        ]},
        { type: "h", text: "Tokens, workload identities & their Conditional Access" },
        { type: "p", html: "OAuth issues three tokens you should know at a high level: the <strong>access token</strong> (short-lived, presented to the API to prove authorisation), the <strong>ID token</strong> (OIDC; proves <em>who the user is</em> to the app), and the <strong>refresh token</strong> (long-lived; used to silently obtain new access tokens without re-prompting). Stealing a refresh token or session cookie is how attackers ride past MFA after the fact." },
        { type: "kv", items: [
          { k: "App registration", v: "The application's blueprint and credentials (secret or certificate) — a secret in code is a leak waiting to happen." },
          { k: "Service principal", v: "The app's identity inside a tenant that consent and permissions attach to." },
          { k: "Managed identity", v: "A service principal that <strong>Azure creates and rotates for you</strong>, with <em>no secret</em> to store or leak. Always prefer it for Azure-hosted workloads." },
          { k: "Conditional Access for workload identities", v: "CA isn't only for humans — you can scope service principals by location/risk so a leaked secret can't be used from anywhere on earth." }
        ]},
        { type: "code", lang: "powershell", caption: "Audit app permissions and risky consent grants", code: [
          "Connect-MgGraph -Scopes 'Application.Read.All','Directory.Read.All'",
          "",
          "# Service principals that hold APPLICATION (app-only) permissions to Microsoft Graph",
          "$graph = Get-MgServicePrincipal -Filter \"appId eq '00000003-0000-0000-c000-000000000000'\"",
          "Get-MgServicePrincipalAppRoleAssignedTo -ServicePrincipalId $graph.Id |",
          "  Select-Object PrincipalDisplayName, AppRoleId, CreatedDateTime",
          "",
          "# Delegated grants (OAuth2PermissionGrants) - hunt for risky scopes like Mail.Read",
          "Get-MgOauth2PermissionGrant -All |",
          "  Where-Object { $_.Scope -match 'Mail|offline_access|Files|Directory' } |",
          "  Select-Object ClientId, ConsentType, Scope",
          "",
          "# Tenant consent policy - is user consent locked down?",
          "(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions |",
          "  Select-Object PermissionGrantPoliciesAssigned"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;Walk me through the illicit consent grant attack and how token theft bypasses MFA.&quot;</strong> &quot;The attacker tricks a user into consenting to a malicious app on a genuine Microsoft consent page. The app receives delegated permissions plus <code>offline_access</code>, so it gets a long-lived <strong>refresh token</strong> to the user's data — no password stolen, and MFA already satisfied during the legitimate sign-in. Resetting the password or re-enrolling MFA doesn't revoke the app's grant; you have to <em>revoke the app and its tokens</em>. Defences: restrict user consent, require an admin-consent workflow, review enterprise apps, prefer phishing-resistant MFA and token protection, and apply Conditional Access to workload identities.&quot;</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "4-8",
      title: "Hybrid identity (Entra Connect)",
      blocks: [
        { type: "p", html: "Most real organisations are not cloud-only — they have years of on-prem Active Directory and they are not throwing it away. <strong>Hybrid identity</strong> bridges the two so a user has <em>one</em> identity and one password across on-prem and cloud. The bridge is <strong>Microsoft Entra Connect Sync</strong>, and its design choices have outsized security consequences." },
        { type: "callout", variant: "analogy", html: "<p>Entra Connect is a <strong>customs-and-immigration bridge</strong> between two countries (on-prem AD and the Entra ID cloud). It copies citizen records across the border on a schedule so everyone is recognised on both sides. But a bridge cuts both ways — whoever controls the bridge, or the country on either end, can flood the other. <strong>Compromise on-prem AD and the breach can cascade into the cloud across that bridge.</strong></p>" },
        { type: "h", text: "What Entra Connect Sync does" },
        { type: "p", html: "Entra Connect runs on a server in your environment and <strong>synchronises objects from on-prem AD up to Entra ID</strong> — users, groups, and (optionally) password hashes. The on-prem object stays authoritative for synced users: you manage them on-prem and the changes flow up. It is the engine that creates &quot;synced&quot; users from Lesson 2." },
        { type: "h", text: "The three sign-in options — the table you'll be drilled on" },
        { type: "table", headers: ["Method", "Where the password is verified", "Trade-off"], rows: [
          ["<strong>Password Hash Sync (PHS)</strong>", "In the cloud — a (re-)hash of the password hash is synced to Entra ID", "Simplest, most resilient (works if on-prem is down). Enables <strong>leaked-credential detection</strong>. Microsoft's recommended default."],
          ["<strong>Pass-through Authentication (PTA)</strong>", "On-prem — a lightweight agent validates the password against your DCs in real time", "Passwords never stored in cloud, but you depend on on-prem agents being up; no leaked-cred detection for synced users."],
          ["<strong>Federation / AD FS</strong>", "On-prem — an entire federation server farm (AD FS) issues SAML tokens", "Most flexible/complex. <strong>Biggest attack surface</strong> — you run and secure the whole farm; target of the <strong>Golden SAML</strong> attack."]
        ]},
        { type: "p", html: "<strong>Seamless SSO</strong> is an add-on (for PHS or PTA) that silently signs domain-joined users in on the corporate network — no password prompt — so users get the federation-like experience without running AD FS." },
        { type: "callout", variant: "danger", title: "The sync account & on-prem-to-cloud cascade", html: "<p>The Entra Connect <strong>sync (connector) account is extremely privileged</strong> — it can write to many directory objects, and historically Connect servers held credentials capable of replicating directory data. If an attacker who already owns on-prem AD reaches the Connect server, they can pivot into the cloud tenant. And <strong>Golden SAML</strong> — stealing the AD FS token-signing certificate — lets an attacker forge SAML tokens to impersonate <em>any</em> cloud user, bypassing MFA entirely. Treat the Connect server and AD FS as <strong>Tier-0 / Control-plane</strong> assets, as protected as a domain controller.</p>" },
        { type: "code", lang: "powershell", caption: "Check hybrid configuration from the cloud side (Graph)", code: [
          "Connect-MgGraph -Scopes 'Organization.Read.All','Directory.Read.All'",
          "",
          "# Is directory sync enabled, and when did it last run?",
          "Get-MgOrganization |",
          "  Select-Object DisplayName, OnPremisesSyncEnabled, OnPremisesLastSyncDateTime",
          "",
          "# Which users are synced from on-prem vs cloud-only?",
          "Get-MgUser -All -Property DisplayName,UserPrincipalName,OnPremisesSyncEnabled |",
          "  Group-Object OnPremisesSyncEnabled |",
          "  Select-Object Name, Count",
          "",
          "# On the Connect server itself you'd use the AADConnect/ADSync module, e.g.:",
          "# Get-ADSyncConnector ; Get-ADSyncScheduler ; Start-ADSyncSyncCycle -PolicyType Delta"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: &quot;Compare Password Hash Sync, Pass-through Authentication, and Federation.&quot;</strong> &quot;<strong>PHS</strong> verifies the password in the cloud using a synced hash — simplest, most resilient, and it uniquely enables leaked-credential detection, so it's the recommended default. <strong>PTA</strong> verifies on-prem via lightweight agents, keeping passwords off the cloud but adding an on-prem dependency. <strong>Federation/AD FS</strong> verifies on-prem with a full federation farm — most flexible but the largest attack surface and the target of Golden SAML. From a security standpoint I steer organisations toward PHS, and I treat the Connect server and any AD FS box as Tier-0 assets.&quot;</p>" },
        { type: "p", html: "<strong>Where this fits:</strong> this lesson is the seam between the on-prem world of <a href='#/module/mod-02'>Module 2 (Active Directory)</a> — where Kerberos, NTLM and attacks like DCSync and Golden Ticket live — and the cloud-first, never-trust-always-verify philosophy of <a href='#/module/mod-09'>Module 9 (Zero Trust)</a>. Hybrid identity is exactly where attackers try to pivot from one to the other, which is why mastering the bridge is mastering modern enterprise defence." },
        { type: "divider" },
        { type: "callout", variant: "tip", title: "Module 4 — Key takeaways", html: "<ul><li><strong>Entra ID is cloud IDaaS, not AD in the cloud</strong> — OAuth/OIDC/SAML/SCIM/Graph, no LDAP/Kerberos/NTLM, no OUs or GPOs. The Azure AD rename is purely cosmetic; P2 adds PIM + Identity Protection.</li><li>Know your <strong>objects</strong>: cloud-only vs synced vs guest users; security vs M365 and assigned vs dynamic groups; and especially <strong>app registration (blueprint) vs service principal (tenant identity) vs managed identity (no secret)</strong>.</li><li><strong>Phishing-resistant MFA</strong> (FIDO2, Windows Hello, CBA) beats push/SMS; <strong>block legacy auth</strong> because it bypasses MFA entirely.</li><li><strong>PIM</strong> turns standing privilege into just-in-time: eligible vs active, time-bound activation, access reviews — and Entra roles are NOT Azure RBAC.</li><li><strong>Conditional Access</strong> is the Zero Trust enforcement point: signals &rarr; decision. Memorise the four policies — block legacy auth, MFA for admins, MFA for all, compliant device for corp apps — and always use report-only + break-glass.</li><li><strong>Identity Protection</strong> (P2) supplies user risk vs sign-in risk for risk-based CA; don't confuse it with on-prem Defender for Identity.</li><li><strong>Consent phishing</strong> grants attackers token-based, MFA-immune access — restrict user consent and use an admin-consent workflow.</li><li><strong>Hybrid</strong>: PHS (recommended) vs PTA vs Federation; the Connect server and AD FS are Tier-0 because on-prem compromise can cascade to the cloud (Golden SAML).</li></ul>" }
      ]
    }
  ],
  quiz: [
    { q: "Which set of protocols and concepts does Microsoft Entra ID use (as opposed to on-prem Active Directory)?", options: ["LDAP, Kerberos, NTLM, OUs and Group Policy", "OAuth 2.0, OpenID Connect, SAML, SCIM and Microsoft Graph — with no OUs or GPOs", "DNS, DHCP and WINS only", "Only proprietary protocols with no industry standards"], answer: 1, explain: "Entra ID is a cloud IDaaS that speaks modern web standards (OAuth/OIDC/SAML/SCIM/Graph). It has no LDAP/Kerberos/NTLM, no Organizational Units, and no Group Policy — it uses Conditional Access and Intune instead." },
    { q: "What changed technically when Azure AD was renamed to Microsoft Entra ID?", options: ["The login URLs, APIs and PowerShell cmdlets all changed", "Almost nothing — the rename is cosmetic; login endpoints, APIs, MSAL libraries and cmdlet nouns are unchanged", "It became an on-prem product", "MFA was removed from the product"], answer: 1, explain: "The Azure AD to Entra ID rebrand is cosmetic. Endpoints like login.microsoftonline.com, the Graph/MSAL APIs, app IDs and PowerShell cmdlets did not change. SKUs are now Entra ID Free, P1 and P2 (P2 adds PIM and Identity Protection)." },
    { q: "What is the difference between an app registration and an enterprise application (service principal)?", options: ["They are two names for the same object", "The app registration is the global blueprint of the app; the service principal is the app's local identity inside a specific tenant", "An app registration is a user account; a service principal is a group", "The service principal is created on-prem and the registration in the cloud"], answer: 1, explain: "The app registration (blueprint) is created once in the home tenant and holds the app ID, redirect URIs, credentials and requested permissions. The service principal (shown as an enterprise app) is the per-tenant identity that receives consent, assignments and sign-in logs." },
    { q: "In Privileged Identity Management (PIM), what does an 'eligible' role assignment mean?", options: ["The user holds the role permanently", "The user can activate the role just-in-time after meeting conditions (MFA, justification, sometimes approval); it is not standing privilege", "The role has been permanently deleted", "The user is blocked from the role"], answer: 1, explain: "Eligible = can activate when needed, time-bound, with conditions; the user has no standing power for an attacker to steal. Active = holds the role now. PIM requires Entra ID P2 and pairs with access reviews." },
    { q: "Why must you block legacy (basic) authentication in Conditional Access?", options: ["It is slower than modern auth", "Legacy auth cannot perform MFA, so an attacker with a sprayed password can sign in and bypass all your MFA policies", "It uses too much bandwidth", "It only works on mobile devices"], answer: 1, explain: "Legacy/basic auth protocols send username and password directly and cannot do MFA. Historically most password-spray compromises rode in over legacy auth, bypassing MFA. Blocking legacy auth is the #1 Conditional Access policy." },
    { q: "Which describes the Conditional Access model correctly?", options: ["It encrypts data at rest using the TPM", "It evaluates signals (user, app, device state, location, client app, risk) and makes an access decision (block, or grant with controls like MFA or a compliant device)", "It is the same thing as Group Policy in the cloud", "It only controls Azure VM access"], answer: 1, explain: "Conditional Access is Entra's if-this-then-that policy engine and the Zero Trust enforcement point: signals in, access decision out. Roll new policies out in report-only mode first and always exclude break-glass accounts." },
    { q: "In Microsoft Entra Identity Protection, what is the difference between user risk and sign-in risk?", options: ["They are identical", "User risk scores whether the account/identity is compromised (e.g. leaked credentials); sign-in risk scores whether a specific session is the legitimate user", "User risk is for guests only; sign-in risk is for admins only", "Sign-in risk applies only on-prem"], answer: 1, explain: "Sign-in risk = is THIS session the real user (acted on in real time). User risk = is the IDENTITY itself compromised (e.g. leaked credentials, remediated with a secure password change). Both feed risk-based Conditional Access. Requires Entra ID P2." },
    { q: "How does the illicit consent grant (consent phishing) attack bypass MFA?", options: ["It cracks the password offline", "It tricks a user into consenting to a malicious app on a genuine Microsoft page, giving the app a refresh token to the user's data — which a password reset or MFA re-enrollment does not revoke", "It disables the firewall", "It steals the BitLocker key"], answer: 1, explain: "The user authorises the app (MFA already satisfied during the real sign-in), so the attacker's app holds a long-lived refresh token. Resetting the password or MFA doesn't revoke it — you must revoke the app/tokens. Defend with restricted user consent and an admin-consent workflow." }
  ],
  flashcards: [
    { front: "Active Directory vs Microsoft Entra ID", back: "<strong>AD</strong> = on-prem directory for the LAN: LDAP, Kerberos, NTLM, OUs, Group Policy, domain controllers. <strong>Entra ID</strong> = cloud IDaaS for the internet: OAuth/OIDC/SAML/SCIM/Graph, no OUs/GPOs, managed with Conditional Access + Intune." },
    { front: "Did the Azure AD to Entra ID rename change anything technical?", back: "No — it's <strong>cosmetic</strong>. Login URLs, APIs, MSAL libraries and PowerShell cmdlets are unchanged. SKUs: Entra ID Free, P1, and <strong>P2 (adds PIM + Identity Protection)</strong>." },
    { front: "Which PowerShell modules are current for Entra ID?", back: "The <strong>Microsoft Graph PowerShell SDK</strong> (Connect-MgGraph, Get-MgUser...) or the Microsoft Entra PowerShell module. The legacy <strong>MSOnline and AzureAD</strong> modules were RETIRED in 2025 — do not use Get-MsolUser / Get-AzureADUser." },
    { front: "App registration vs service principal vs managed identity", back: "<strong>App registration</strong> = global blueprint (app ID, redirect URIs, credentials, requested perms). <strong>Service principal</strong> = the app's identity inside a tenant (gets consent/assignments). <strong>Managed identity</strong> = a service principal Azure creates and rotates with <em>no secret to leak</em>." },
    { front: "Cloud-only vs synced vs guest (B2B) users", back: "<strong>Cloud-only</strong> = created in Entra ID. <strong>Synced</strong> = mastered in on-prem AD via Entra Connect (on-prem is authoritative). <strong>Guest</strong> = external B2B identity (UserType=Guest) — audit and access-review these." },
    { front: "Security vs Microsoft 365 groups; assigned vs dynamic", back: "<strong>Security</strong> groups grant access; <strong>M365</strong> groups also create mailbox/SharePoint/Teams. <strong>Assigned</strong> = manual members; <strong>Dynamic</strong> = membership from a rule over attributes (needs P1) — change an attribute and access changes silently." },
    { front: "What makes MFA phishing-resistant?", back: "The credential is cryptographically bound to the real domain. <strong>FIDO2 passkeys, Windows Hello for Business, certificate-based auth</strong> — an attacker-in-the-middle can't replay them. Push/number-matching and especially SMS are weaker." },
    { front: "Why block legacy authentication?", back: "Legacy/basic auth (older Office, IMAP/POP/SMTP AUTH) <strong>cannot do MFA</strong>, so a sprayed password bypasses every MFA policy. Blocking it is the #1 Conditional Access policy." },
    { front: "Eligible vs active assignment in PIM", back: "<strong>Eligible</strong> = can activate just-in-time (MFA/justification/approval, time-bound) — no standing power to steal. <strong>Active</strong> = holds the role now. PIM needs Entra ID P2; pair with access reviews." },
    { front: "Entra roles vs Azure RBAC", back: "<strong>Entra roles</strong> control the directory (Global Admin, User Admin, Security Admin), tenant-wide. <strong>Azure RBAC</strong> (Owner/Contributor/Reader) controls Azure <em>resources</em> at management group/subscription/RG/resource scope. Separate systems." },
    { front: "The four must-have Conditional Access policies", back: "1) Block legacy auth. 2) Require MFA for admins. 3) Require MFA for all users. 4) Require a compliant or hybrid-joined device for corporate apps. Test in report-only; always exclude break-glass accounts." },
    { front: "PHS vs PTA vs Federation (Entra Connect)", back: "<strong>PHS</strong> = verify in cloud via synced hash; simplest, most resilient, enables leaked-credential detection (recommended). <strong>PTA</strong> = verify on-prem via agents. <strong>Federation/AD FS</strong> = full farm, biggest attack surface, target of <strong>Golden SAML</strong>." }
  ]
});
