/* Module 3 — Cloud & Azure Fundamentals
   Same format rules as mod-01.js (the gold-standard template):
   - JS strings use DOUBLE quotes "..."; HTML attributes inside use SINGLE quotes '...'.
   - Code blocks are arrays of lines; any path uses DOUBLE backslashes.
   - No backticks, no template literals.
   Block types: p, h, h3, list, olist, steps, quote, divider,
     callout {variant: info|tip|warn|danger|interview|lab|analogy},
     code {lang, caption, code:[...]}, table {headers, rows}, kv {items:[{k,v}]}. */
window.COURSE.modules.push({
  id: "mod-03",
  number: 3,
  icon: "☁️",
  title: "Cloud & Azure Fundamentals",
  tagline: "Shared responsibility, the Azure hierarchy, RBAC, NSGs and managed identities — the cloud groundwork before Entra ID.",
  estMinutes: 85,
  objectives: [
    "Explain the <strong>shared responsibility model</strong> and how the line shifts across IaaS, PaaS, and SaaS.",
    "Navigate the Azure hierarchy (management group → subscription → resource group → resource) and the role of ARM.",
    "Distinguish <strong>Azure RBAC</strong> from <strong>Entra ID roles</strong> and apply least privilege at the right scope.",
    "Describe how NSGs, Azure Firewall, and Private Link secure a network, and how managed identities + Key Vault remove secrets from code.",
    "Explain what Defender for Cloud (Secure Score) and Azure Policy add for governance."
  ],
  lessons: [
    /* ---------------------------------------------------------------- */
    {
      id: "3-1",
      title: "Cloud concepts & the Shared Responsibility Model",
      subtitle: "Who secures what",
      blocks: [
        { type: "p", html: "Before we touch a single Azure portal blade, you need the mental model that every cloud interview circles back to: <strong>in the cloud, security is a shared job</strong>. The provider secures some layers, you secure the rest, and exactly where that line sits depends on the service model. Get this wrong and you'll either leave gaps open or waste time hardening things Microsoft already owns." },
        { type: "h", text: "The three service models" },
        { type: "p", html: "Cloud services are sold at three levels of abstraction. The further up you go, the less infrastructure you manage — and the less you're responsible for securing." },
        { type: "kv", items: [
          { k: "IaaS (Infrastructure as a Service)", v: "You rent raw compute, storage, networking. Example: <strong>Azure Virtual Machines</strong>. You still own the OS, patching, apps, and data — the provider only owns the physical kit and hypervisor." },
          { k: "PaaS (Platform as a Service)", v: "You deploy code/data onto a managed platform; the OS and runtime are handled for you. Example: <strong>Azure App Service</strong>, <strong>Azure SQL Database</strong>. You own the app config and data." },
          { k: "SaaS (Software as a Service)", v: "You consume finished software over the web. Example: <strong>Microsoft 365</strong>, <strong>Dynamics 365</strong>. You own essentially only your <em>data, identities, and access configuration</em>." }
        ]},
        { type: "callout", variant: "analogy", html: "<p>Think of it as <strong>getting dinner</strong>. <strong>IaaS</strong> is renting a commercial kitchen — they give you the building and the gas line, you do everything else. <strong>PaaS</strong> is a meal-kit delivery — ingredients prepped, you just cook and plate. <strong>SaaS</strong> is dining out — you only choose what to order and who you bring. In every case <em>some</em> responsibility is yours; the question is always how much.</p>" },
        { type: "h", text: "The Shared Responsibility line, drawn precisely" },
        { type: "p", html: "This table is the one I'd ask a candidate to reproduce on a whiteboard. <strong>You</strong> = customer, <strong>MS</strong> = Microsoft, <strong>shared</strong> = depends on configuration." },
        { type: "table", headers: ["Responsibility", "On-prem", "IaaS", "PaaS", "SaaS"], rows: [
          ["Data &amp; data classification", "You", "You", "You", "You"],
          ["Identities &amp; access management", "You", "You", "You", "You / shared"],
          ["Accounts &amp; identities config", "You", "You", "You", "You"],
          ["Application", "You", "You", "Shared", "MS"],
          ["Operating system", "You", "You", "MS", "MS"],
          ["Network controls", "You", "Shared", "Shared", "MS"],
          ["Host / hypervisor", "You", "MS", "MS", "MS"],
          ["Physical datacenter / network", "You", "MS", "MS", "MS"]
        ]},
        { type: "callout", variant: "tip", html: "<p>Two rows <strong>never leave you</strong>, no matter the model: <strong>your data</strong> and <strong>your identities/access</strong>. That is why the whole next chunk of this course is identity (Entra ID) — in the cloud, identity is the new perimeter, and it is always your job.</p>" },
        { type: "h", text: "Deployment models & physical resilience" },
        { type: "list", items: [
          "<strong>Public cloud</strong> — shared infrastructure run by Microsoft (multi-tenant). Most Azure.",
          "<strong>Private cloud</strong> — dedicated to one organisation (e.g. Azure Stack on-prem). More control, more cost.",
          "<strong>Hybrid cloud</strong> — public + private/on-prem connected together. The reality at most enterprises.",
          "<strong>Region</strong> — a geographic area of one or more datacenters (e.g. <em>East US</em>, <em>West Europe</em>). You pick regions for latency, data residency, and compliance.",
          "<strong>Availability Zones</strong> — physically separate datacenters <em>within</em> a region (independent power/cooling/network). Spread VMs across zones to survive a single datacenter failure.",
          "<strong>Region pairs</strong> — each region is paired with another in the same geography for replication and sequential updates; useful for disaster recovery."
        ]},
        { type: "h", text: "Why the cloud at all: elasticity & the money story" },
        { type: "kv", items: [
          { k: "Scalability", v: "Add capacity to meet demand — <em>scale up</em> (bigger VM) or <em>scale out</em> (more VMs)." },
          { k: "Elasticity", v: "Automatically scale out/in as load changes, then pay only for what you used." },
          { k: "CapEx (Capital Expenditure)", v: "Big up-front spend on owned hardware (the on-prem model). Depreciates; you guess capacity years ahead." },
          { k: "OpEx (Operational Expenditure)", v: "Pay-as-you-go consumption (the cloud model). No up-front kit; you scale spend with actual usage." }
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “In the Shared Responsibility Model, who is responsible for patching the operating system on an Azure VM versus in Azure SQL Database?”</strong> On an <strong>IaaS VM you patch the OS</strong> (Microsoft only owns the host/hypervisor down). On <strong>PaaS Azure SQL Database, Microsoft patches the OS and database engine</strong> — you own the data, logins, and firewall config. The killer follow-up: <em>what is always yours regardless of model?</em> Answer: your <strong>data and your identities/access</strong>.</p>" },
        { type: "callout", variant: "lab", html: "<p>Open the Azure Pricing Calculator (no account needed) and price a single B2s VM running 730 hours/month, then a Reserved Instance for the same VM. Note the difference. That gap — pay-as-you-go OpEx vs committed spend — is the lever every cloud cost conversation turns on.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "3-2",
      title: "The Azure management hierarchy & ARM",
      blocks: [
        { type: "p", html: "Azure is not a flat bag of resources — it is a strict <strong>hierarchy</strong>, and that hierarchy is what makes governance and access control possible at scale. If you can't draw this tree, you can't reason about where a permission or a policy actually applies." },
        { type: "h", text: "The four levels, top to bottom" },
        { type: "kv", items: [
          { k: "Management Group", v: "A container for <em>subscriptions</em> (and nested management groups). You apply policy and access once here and it cascades to everything below. The top is the special <strong>Tenant Root Group</strong>." },
          { k: "Subscription", v: "A billing and resource-management boundary. Resources live in subscriptions; costs roll up per subscription. A common isolation unit (e.g. <em>Prod</em> vs <em>Dev</em>)." },
          { k: "Resource Group", v: "A logical container for resources that share a lifecycle (deploy/manage/delete together). A resource belongs to exactly one resource group and one region for its metadata." },
          { k: "Resource", v: "The actual thing — a VM, storage account, NSG, key vault. The leaf of the tree." }
        ]},
        { type: "callout", variant: "analogy", html: "<p>The hierarchy is a <strong>company org chart</strong>. The Management Group is corporate HQ setting policy for the whole firm; Subscriptions are departments with their own budgets; Resource Groups are project teams; Resources are the individual employees doing the work. A rule set at HQ flows down to every employee unless deliberately overridden.</p>" },
        { type: "h", text: "ARM — the control plane" },
        { type: "p", html: "Every create/read/update/delete on any Azure resource goes through <strong>Azure Resource Manager (ARM)</strong> — the deployment and management <em>control plane</em>. The portal, Azure CLI, PowerShell, REST API, and Bicep/ARM templates all funnel through ARM. This matters for security because <strong>Azure RBAC and resource locks are enforced at the ARM layer</strong>, so they apply no matter which tool you use." },
        { type: "callout", variant: "tip", html: "<p>Learn the <strong>control plane vs data plane</strong> distinction now — it comes up constantly. The <em>control plane</em> manages the resource (create a storage account, set its firewall) via ARM. The <em>data plane</em> works with what's inside (read a blob, fetch a Key Vault secret) and often has its <em>own</em> authorization. Being a subscription Owner does not automatically let you read every blob — those are different planes.</p>" },
        { type: "h", text: "Tenant vs subscription — the one juniors confuse" },
        { type: "p", html: "A <strong>Microsoft Entra tenant</strong> is the <em>identity directory</em> — the place all your users, groups, and app identities live. A <strong>subscription</strong> is a <em>billing/resource container</em>. They are different things that <em>trust</em> each other: every subscription is associated with exactly one Entra tenant, which Azure uses to authenticate the people and services acting on it. One tenant can hold many subscriptions; you can move a subscription to a different tenant." },
        { type: "code", lang: "bash", caption: "Walk the hierarchy with Azure CLI", code: [
          "# Sign in, then see which tenant + subscription you are working in",
          "az login",
          "az account show --output table",
          "",
          "# List management groups (top of the tree)",
          "az account management-group list --output table",
          "",
          "# List subscriptions you can see",
          "az account list --output table",
          "",
          "# Resource groups inside the current subscription",
          "az group list --output table",
          "",
          "# Resources inside one resource group",
          "az resource list --resource-group rg-prod-web --output table"
        ]},
        { type: "h", text: "Tags — metadata that drives governance & cost" },
        { type: "p", html: "<strong>Tags</strong> are name/value pairs you attach to resources (e.g. <code>env=prod</code>, <code>owner=secops</code>, <code>costcenter=4412</code>). They power cost reporting, automation, and Azure Policy targeting. A resource group's tags do <em>not</em> automatically inherit to its resources unless a policy enforces it — a classic gotcha." },
        { type: "h", text: "Resource locks — the accidental-deletion seatbelt" },
        { type: "table", headers: ["Lock type", "What it blocks", "What it still allows"], rows: [
          ["<strong>CanNotDelete</strong>", "Deleting the resource", "Reading and modifying it"],
          ["<strong>ReadOnly</strong>", "Deleting <em>and</em> modifying", "Reading it only (acts like Reader)"]
        ]},
        { type: "callout", variant: "warn", html: "<p>Locks apply to the <strong>management/control plane</strong>, not the data plane. A <code>ReadOnly</code> lock on a storage account stops you changing its config — but it does <em>not</em> stop someone with data-plane access from writing blobs. And a lock overrides even an Owner's delete: removing the lock is its own permission (you need <code>Microsoft.Authorization/locks/*</code>).</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “What's the difference between an Entra tenant and a subscription?”</strong> The <strong>tenant is the identity directory</strong> (users, groups, app identities); the <strong>subscription is a billing/resource container</strong>. A subscription <em>trusts</em> exactly one tenant for authentication, but one tenant can be associated with many subscriptions. Mixing these up is the fastest way to flunk an Azure screen — they answer different questions: <em>who are you</em> (tenant) vs <em>what are you paying for / deploying into</em> (subscription).</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "3-3",
      title: "Azure RBAC — authorization for resources",
      blocks: [
        { type: "p", html: "Azure <strong>Role-Based Access Control (RBAC)</strong> is how you grant access to Azure <em>resources</em>. The entire model reduces to one sentence you should be able to recite: <strong>a role assignment = a security principal + a role definition + a scope</strong>. Master that triangle and RBAC stops being mysterious." },
        { type: "h", text: "The three parts of every role assignment" },
        { type: "kv", items: [
          { k: "Security principal (the WHO)", v: "A user, group, service principal, or managed identity that you're granting access to." },
          { k: "Role definition (the WHAT)", v: "A named collection of permissions — Actions/NotActions (control plane) and DataActions/NotDataActions (data plane). E.g. <em>Contributor</em>, <em>Reader</em>." },
          { k: "Scope (the WHERE)", v: "The boundary the access applies to: management group, subscription, resource group, or a single resource." }
        ]},
        { type: "h", text: "Built-in roles you must know cold" },
        { type: "table", headers: ["Role", "Can do", "Crucial limit"], rows: [
          ["<strong>Owner</strong>", "Full access to manage everything <em>and</em> grant access to others", "Effectively god at its scope"],
          ["<strong>Contributor</strong>", "Create/manage/delete almost all resource types", "<strong>Cannot grant access</strong> to others (no role assignments)"],
          ["<strong>Reader</strong>", "View everything in scope", "Cannot change anything"],
          ["<strong>User Access Administrator</strong>", "Manage user access — i.e. create role assignments", "Cannot manage the resources themselves"]
        ]},
        { type: "callout", variant: "warn", title: "The #1 RBAC interview trap", html: "<p><strong>Contributor cannot grant access.</strong> It can build, modify, and delete almost any resource — but it cannot create role assignments. To delegate access you need <strong>Owner</strong> or <strong>User Access Administrator</strong>. Splitting “manage resources” (Contributor) from “manage who has access” (User Access Administrator) is least-privilege done right.</p>" },
        { type: "h", text: "Scope inheritance" },
        { type: "p", html: "RBAC <strong>inherits downward</strong>: an assignment at a parent scope applies to every child. Grant <em>Reader</em> at a subscription and the principal can read every resource group and resource inside it. Assign at the <strong>narrowest scope that does the job</strong> — that is the whole point of least privilege in Azure." },
        { type: "code", lang: "bash", caption: "Manage role assignments with Azure CLI", code: [
          "# Who has access to a resource group, and via which role?",
          "az role assignment list --resource-group rg-prod-web --output table",
          "",
          "# Grant a user Reader at a resource-group scope (narrow!)",
          "az role assignment create \\",
          "  --assignee analyst@contoso.com \\",
          "  --role \"Reader\" \\",
          "  --scope \"/subscriptions/<sub-id>/resourceGroups/rg-prod-web\"",
          "",
          "# Inspect what a built-in role can actually do",
          "az role definition list --name \"Contributor\" --output jsonc"
        ]},
        { type: "code", lang: "powershell", caption: "The same checks in Az PowerShell", code: [
          "# List role assignments at a scope",
          "Get-AzRoleAssignment -ResourceGroupName rg-prod-web",
          "",
          "# Grant Reader at a resource group (splatting avoids line-continuation)",
          "$params = @{",
          "  SignInName         = \"analyst@contoso.com\"",
          "  RoleDefinitionName = \"Reader\"",
          "  ResourceGroupName  = \"rg-prod-web\"",
          "}",
          "New-AzRoleAssignment @params"
        ]},
        { type: "h", text: "Custom roles & deny assignments" },
        { type: "list", items: [
          "<strong>Custom roles</strong> — when no built-in role fits, define your own with explicit <code>Actions</code> / <code>NotActions</code> / <code>DataActions</code>. Use when a built-in role is too broad (e.g. you want “restart VMs but not delete them”).",
          "<strong>Deny assignments</strong> — explicitly <em>block</em> a principal from actions, and a deny <strong>always wins</strong> over an allow. You can't create these directly in normal RBAC; they're applied by Azure-managed features like <strong>Azure Blueprints</strong> and <strong>Managed Applications</strong> to protect locked-down resources.",
          "<strong>Effective access</strong> = the union of all your allow assignments at and above the scope, minus any deny assignments."
        ]},
        { type: "h", text: "Azure RBAC vs Entra ID roles — do not blur these" },
        { type: "table", headers: ["", "Azure RBAC", "Entra ID roles"], rows: [
          ["Governs", "Access to <strong>Azure resources</strong> (VMs, storage, networks)", "Access to <strong>Entra/identity features</strong> (users, groups, app registrations)"],
          ["Plane", "Resource / control plane (via ARM)", "Identity plane (Entra directory)"],
          ["Scoped to", "MG / subscription / resource group / resource", "The tenant (or administrative units)"],
          ["Example role", "Contributor, Reader, Storage Blob Data Reader", "Global Administrator, User Administrator"]
        ]},
        { type: "callout", variant: "danger", html: "<p>One scary overlap to know: a <strong>Global Administrator in Entra ID can elevate themselves to gain access to all Azure subscriptions</strong> in the tenant (a toggle in Entra properties grants them User Access Administrator at the root). So a tenant-level identity admin is, with one click, also a resource-plane superuser. Treat Global Admin and Owner-at-root with equal paranoia.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “A teammate is a Contributor on the production subscription but says they can't add a colleague to a resource. Why, and what would you give them?”</strong> Because <strong>Contributor cannot create role assignments</strong> — managing access is deliberately excluded. Grant the <strong>User Access Administrator</strong> role (ideally scoped to just the resource group, time-bound via PIM) so they can delegate access without gaining the broader power of Owner.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "3-4",
      title: "Azure networking for security",
      blocks: [
        { type: "p", html: "Network controls are still very much yours in IaaS, and shared in PaaS. The building blocks are simple, but interviewers love the details — especially how a <strong>Network Security Group</strong> actually evaluates a packet. Let's nail that." },
        { type: "h", text: "VNets & subnets" },
        { type: "p", html: "A <strong>Virtual Network (VNet)</strong> is your private, isolated network in Azure, defined by an address space (e.g. <code>10.0.0.0/16</code>). You carve it into <strong>subnets</strong> (e.g. <code>10.0.1.0/24</code> for web, <code>10.0.2.0/24</code> for data). Subnets are the natural place to apply segmentation and attach NSGs." },
        { type: "h", text: "Network Security Groups (NSG) — the cloud's stateful packet filter" },
        { type: "p", html: "An NSG is a basic, <strong>stateful</strong> L3/L4 firewall you attach to a <em>subnet</em> or a <em>NIC</em>. It holds a list of allow/deny rules evaluated in <strong>priority order</strong>. Three properties you must say in an interview:" },
        { type: "list", items: [
          "<strong>Stateful</strong> — if you allow an inbound flow, the return traffic is automatically allowed (and vice-versa). You don't write a matching reverse rule.",
          "<strong>5-tuple rules</strong> — each rule matches on source IP, source port, destination IP, destination port, and protocol (plus direction).",
          "<strong>Priority-ordered, lowest number first</strong> — rules run from priority 100 upward; the <em>first matching rule wins</em> and evaluation stops there."
        ]},
        { type: "callout", variant: "analogy", html: "<p>An NSG is a <strong>numbered checklist at a door</strong>. The guard reads from the top (lowest number) and acts on the <em>first</em> line that matches the visitor — allow or deny — then stops reading. Because it's <em>stateful</em>, once the guard lets you in, you're automatically allowed back out the same way without a second check.</p>" },
        { type: "h", text: "Default rules (you can't delete them, only override)" },
        { type: "p", html: "Every NSG ships with default rules at high priority numbers (65000+). <strong>Inbound:</strong> allow from within the VNet, allow from the Azure load balancer, then <strong>DenyAllInbound</strong> at 65500 — so inbound is <strong>deny-by-default</strong>. <strong>Outbound is different:</strong> the defaults allow VNet <em>and</em> <strong>Internet</strong> traffic out (<code>AllowInternetOutBound</code>, 65001) before <code>DenyAllOutBound</code> — so a VM can reach the internet outbound by default. And remember 65500 is the <em>highest number</em> = <em>lowest priority</em>, so it only wins when nothing else matched." },
        { type: "table", headers: ["Priority", "Name", "Direction", "Action"], rows: [
          ["65000", "AllowVnetInBound", "Inbound", "Allow (within VNet)"],
          ["65001", "AllowAzureLoadBalancerInBound", "Inbound", "Allow"],
          ["65500", "DenyAllInBound", "Inbound", "<strong>Deny (default catch-all)</strong>"],
          ["65000", "AllowVnetOutBound", "Outbound", "Allow"],
          ["65001", "AllowInternetOutBound", "Outbound", "<strong>Allow (to Internet — outbound is NOT deny-by-default)</strong>"],
          ["65500", "DenyAllOutBound", "Outbound", "Deny (only if nothing above matched)"]
        ]},
        { type: "code", lang: "bash", caption: "Inspect NSG rules with Azure CLI", code: [
          "# List the effective rules on an NSG, sorted as Azure sees them",
          "az network nsg rule list \\",
          "  --resource-group rg-prod-web \\",
          "  --nsg-name nsg-web \\",
          "  --output table",
          "",
          "# Add a rule: allow HTTPS in from the internet at priority 200",
          "az network nsg rule create \\",
          "  --resource-group rg-prod-web --nsg-name nsg-web \\",
          "  --name Allow-HTTPS-In --priority 200 \\",
          "  --direction Inbound --access Allow --protocol Tcp \\",
          "  --source-address-prefixes Internet --source-port-ranges \"*\" \\",
          "  --destination-port-ranges 443"
        ]},
        { type: "h", text: "Application Security Groups (ASG)" },
        { type: "p", html: "Instead of hard-coding IP addresses in NSG rules, you put NICs into an <strong>Application Security Group</strong> (e.g. <em>asg-web</em>, <em>asg-db</em>) and write rules <em>between groups</em> (“allow asg-web to asg-db on 1433”). Membership-based, so it scales as you add/remove VMs without rewriting rules." },
        { type: "h", text: "NSG vs Azure Firewall" },
        { type: "table", headers: ["", "NSG", "Azure Firewall"], rows: [
          ["Type", "Basic stateful L3/L4 filter (free)", "Managed, stateful network <em>firewall service</em> (paid)"],
          ["Layer", "IP / port / protocol (5-tuple)", "L3-L7, including <strong>FQDN filtering</strong> &amp; app rules"],
          ["Threat intelligence", "No", "<strong>Yes</strong> — block known-malicious IPs/domains"],
          ["Scope", "Subnet / NIC", "Centralised, VNet/hub-wide; full logging"],
          ["Use it for", "Micro-segmentation between subnets/VMs", "Central egress control, FQDN allow-lists, TLS inspection (Premium)"]
        ]},
        { type: "h", text: "Bastion, peering, and reaching PaaS privately" },
        { type: "kv", items: [
          { k: "Azure Bastion", v: "Managed jump-host that gives RDP/SSH to VMs <strong>through the portal over TLS</strong> — so your VMs need <em>no public IP and no open 3389/22</em> to the internet. Kills the single biggest IaaS attack surface." },
          { k: "VNet peering", v: "Connects two VNets so resources talk privately over the Azure backbone (no public internet, no VPN gateway needed). Non-transitive by default." },
          { k: "Service Endpoint", v: "Extends your VNet identity to a PaaS service (e.g. storage) over the Azure backbone; the service still has a public IP but can restrict to your subnet. Free." },
          { k: "Private Endpoint / Private Link", v: "Gives the PaaS service a <strong>private IP inside your VNet</strong>; traffic never touches a public endpoint. The modern, more secure choice — you can then turn off the service's public access entirely." }
        ]},
        { type: "callout", variant: "danger", html: "<p>Leaving <strong>RDP (3389) or SSH (22) open to <code>0.0.0.0/0</code></strong> on an NSG is one of the most exploited cloud misconfigurations — bots find it within minutes and brute-force. Defenders use <strong>Azure Bastion</strong> (no public management ports), <strong>Just-in-Time VM access</strong> in Defender for Cloud, or at minimum a tight source IP. If you see <em>Any</em> as the source on a management-port allow rule, that's an instant audit finding.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Describe how an NSG evaluates traffic.”</strong> Strong answer in one breath: “It's a <strong>stateful</strong> L3/L4 filter; rules match a <strong>5-tuple</strong> (src IP, src port, dst IP, dst port, protocol) plus direction and are evaluated by <strong>priority, lowest number first — the first match wins and evaluation stops</strong>. Because the last inbound rule is <em>DenyAllInbound</em> at 65500 (highest number = lowest priority), inbound is <strong>deny-by-default</strong> — though outbound permits VNet and Internet by default — and being stateful means I don't need a reverse rule for return traffic.”</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "3-5",
      title: "Identities for workloads: managed identities, SPNs & Key Vault",
      blocks: [
        { type: "p", html: "Humans aren't the only things that need to authenticate — your apps, VMs, and functions do too. The single biggest cloud-security win of the last decade is <strong>getting secrets out of code</strong>, and managed identities are how Azure does it. This is also a guaranteed interview topic." },
        { type: "h", text: "The problem managed identities solve" },
        { type: "p", html: "Classic anti-pattern: an app needs to read a database password or call a storage account, so a developer hard-codes a connection string or API key into config, source control, or an environment variable. Those secrets leak — in repos, logs, and breaches. A <strong>managed identity</strong> lets the workload authenticate to Entra ID and get tokens <em>with no secret stored anywhere in your code</em>; Azure handles the credential rotation for you." },
        { type: "h", text: "Two flavours of managed identity" },
        { type: "kv", items: [
          { k: "System-assigned", v: "Created on, tied to, and deleted with a <em>single</em> resource (e.g. one VM or app). 1:1 lifecycle. Use when only that one resource needs the identity." },
          { k: "User-assigned", v: "A standalone identity resource you create once and assign to <em>many</em> resources. Survives independently. Use when several workloads should share one identity, or you want the identity to outlive a single resource." }
        ]},
        { type: "h", text: "The terminology trio interviewers test" },
        { type: "table", headers: ["Concept", "What it is", "Credential management"], rows: [
          ["<strong>App registration</strong>", "The <em>definition/template</em> of an application in Entra ID (its app ID, reply URLs, permissions)", "Defines what the app is"],
          ["<strong>Service principal (SPN)</strong>", "The <em>instance</em> of that app in a tenant — the actual identity that gets role assignments and signs in", "<strong>You</strong> manage its secret/certificate (and rotation)"],
          ["<strong>Managed identity</strong>", "A special service principal whose credentials are <strong>fully managed by Azure</strong>", "<strong>Azure</strong> rotates it; no secret you ever see"]
        ]},
        { type: "callout", variant: "tip", html: "<p>The clean mental model: an <strong>app registration</strong> is the blueprint, a <strong>service principal</strong> is the actual identity built from that blueprint in your tenant, and a <strong>managed identity</strong> is a service principal where Microsoft holds and rotates the key for you. Prefer managed identities whenever the workload runs in Azure — there's simply no secret to leak.</p>" },
        { type: "code", lang: "bash", caption: "Create a system-assigned identity and grant it least-privilege access", code: [
          "# Turn on a system-assigned managed identity for a web app",
          "az webapp identity assign \\",
          "  --name app-contoso-web --resource-group rg-prod-web",
          "",
          "# Grant that identity rights to READ secrets from a specific key vault",
          "az role assignment create \\",
          "  --assignee <managed-identity-principal-id> \\",
          "  --role \"Key Vault Secrets User\" \\",
          "  --scope \"/subscriptions/<sub-id>/resourceGroups/rg-prod-web/providers/Microsoft.KeyVault/vaults/kv-contoso\""
        ]},
        { type: "h", text: "Azure Key Vault — the secret/key/cert store" },
        { type: "p", html: "<strong>Azure Key Vault</strong> centrally stores three things: <strong>secrets</strong> (passwords, connection strings), <strong>keys</strong> (cryptographic keys, optionally HSM-backed), and <strong>certificates</strong>. Your apps use a managed identity to fetch them at runtime, so nothing sensitive sits in code." },
        { type: "h", text: "Two authorization models for the data plane" },
        { type: "table", headers: ["", "Access policies (legacy)", "Azure RBAC (recommended)"], rows: [
          ["Granularity", "Per-vault permission lists (get/list/set...)", "Standard RBAC roles at vault or secret scope"],
          ["Scope", "Whole vault", "Vault, or even an individual secret"],
          ["Auditing &amp; consistency", "Separate model to learn", "Same RBAC you use everywhere; cleaner audit"],
          ["Example", "“Get + List on secrets”", "<em>Key Vault Secrets User</em>, <em>Key Vault Administrator</em>"]
        ]},
        { type: "callout", variant: "danger", title: "Soft delete & purge protection — turn them on", html: "<p><strong>Soft delete</strong> keeps deleted vaults/secrets recoverable for a retention window instead of vanishing instantly. <strong>Purge protection</strong> goes further: during the retention window, <em>not even an admin</em> can permanently purge the object. Without these, an attacker (or a fat-fingered admin) who deletes your encryption keys can make data unrecoverable — a destructive, irreversible action. Soft delete is on by default on new vaults; <strong>always also enable purge protection</strong> for anything holding encryption keys.</p>" },
        { type: "callout", variant: "interview", html: "<p><strong>Q: “Managed identity vs service principal vs app registration — what's the difference?”</strong> An <strong>app registration</strong> is the application's definition in Entra; a <strong>service principal</strong> is the concrete identity instance that gets roles and signs in; a <strong>managed identity</strong> is a service principal whose credentials Azure creates and rotates automatically. The security punchline: <em>use a managed identity when the workload runs in Azure so there is no secret in code to leak</em> — fall back to an app registration + service principal (with a managed secret) only when you must authenticate from outside Azure.</p>" },
        { type: "callout", variant: "lab", html: "<p>On an Azure VM with a managed identity, curl the Instance Metadata Service token endpoint at <code>169.254.169.254</code> and watch a bearer token come back with no secret involved. That endpoint is also why <strong>SSRF against a VM is so dangerous in the cloud</strong> — if an app can be tricked into fetching that URL, an attacker can steal the workload's token. Knowing both the convenience and the risk is what separates a fundamentals answer from a senior one.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "3-6",
      title: "Azure security & governance tooling",
      blocks: [
        { type: "p", html: "Now we step up to the platform-wide tools that let you <em>see</em> your security posture and <em>enforce</em> standards across the whole hierarchy. Three names you'll be expected to place: <strong>Defender for Cloud</strong>, <strong>Azure Policy</strong>, and <strong>Azure Monitor / Log Analytics</strong>." },
        { type: "h", text: "Microsoft Defender for Cloud" },
        { type: "p", html: "Defender for Cloud is Azure's <strong>cloud security posture management (CSPM)</strong> plus <strong>cloud workload protection (CWPP)</strong> platform. In plain terms: it tells you what's misconfigured (posture) and detects threats against your running workloads (protection)." },
        { type: "kv", items: [
          { k: "CSPM (posture)", v: "Continuously assesses resources against security best practices and produces recommendations. The free/foundational layer." },
          { k: "Secure Score", v: "A single percentage summarising how well your environment follows recommendations. Each fixed recommendation raises it — a clear, trackable “are we getting safer” metric." },
          { k: "CWPP (workload protection)", v: "The paid <em>Defender plans</em> (for Servers, Storage, SQL, Containers, Key Vault...) that add threat detection, alerts, and just-in-time VM access." },
          { k: "Regulatory compliance", v: "Maps your posture against standards (CIS, PCI-DSS, ISO 27001, NIST) and shows your pass/fail per control." },
          { k: "Agentless scanning", v: "Scans VM disks for vulnerabilities and secrets <em>without installing an agent</em>, by snapshotting the disk — lower friction, broad coverage." }
        ]},
        { type: "callout", variant: "tip", html: "<p><strong>Secure Score</strong> is the metric leadership actually cares about — it turns “are we secure?” into a number you can trend over time and tie to remediation work. When an interviewer asks how you'd measure and improve a cloud estate's posture, leading with <em>“raise the Secure Score by working the highest-impact recommendations first”</em> is exactly the answer they want.</p>" },
        { type: "h", text: "Azure Policy — enforcing the rules" },
        { type: "p", html: "<strong>Azure Policy</strong> evaluates resources against rules you define and acts on the result. It's about <em>governance and compliance of resource configuration</em>, not about who can do what. The effects you must name:" },
        { type: "table", headers: ["Effect", "What it does"], rows: [
          ["<strong>Audit</strong>", "Allows the action but flags non-compliant resources in reports (no blocking)"],
          ["<strong>Deny</strong>", "Blocks creation/update of a non-compliant resource outright"],
          ["<strong>DeployIfNotExists (DINE)</strong>", "Auto-deploys a remediation (e.g. enable diagnostic logs) when something is missing"],
          ["<strong>Modify</strong>", "Adds/updates properties or tags on a resource during create/update"],
          ["<strong>Initiative</strong>", "A <em>group</em> of policies managed and assigned as one unit (e.g. a CIS baseline)"]
        ]},
        { type: "callout", variant: "analogy", html: "<p><strong>RBAC vs Azure Policy</strong> is the cleanest pair in Azure. RBAC answers <strong>“who is allowed to do things?”</strong> (permissions). Policy answers <strong>“what is allowed to exist / how must it be configured?”</strong> (governance). RBAC is the bouncer checking IDs; Policy is the building code every room must satisfy. You can be fully authorized (RBAC) to create a storage account and still be <em>blocked by a Deny policy</em> if you forget to enable encryption.</p>" },
        { type: "code", lang: "bash", caption: "Assign a built-in policy and check compliance", code: [
          "# List built-in policy definitions matching a keyword",
          "az policy definition list --query \"[?contains(displayName,'storage')].displayName\" -o tsv",
          "",
          "# Assign a policy that denies storage accounts allowing public blob access",
          "az policy assignment create \\",
          "  --name deny-public-blob \\",
          "  --policy <policy-definition-id> \\",
          "  --scope \"/subscriptions/<sub-id>\"",
          "",
          "# Check compliance state across the subscription",
          "az policy state summarize --subscription <sub-id>"
        ]},
        { type: "h", text: "Azure Monitor & Log Analytics" },
        { type: "p", html: "<strong>Azure Monitor</strong> is the umbrella for metrics and logs. Logs land in a <strong>Log Analytics workspace</strong>, which you query with <strong>KQL (Kusto Query Language)</strong>. This is the data layer that feeds dashboards, alerts, and — in the next stage — Microsoft Sentinel (the SIEM). Centralising logs into a workspace is the prerequisite for any real cloud detection." },
        { type: "code", lang: "kusto", caption: "A first taste of KQL", code: [
          "// Sign-in failures in the last 24h, grouped by user (Entra logs)",
          "SigninLogs",
          "| where TimeGenerated > ago(24h)",
          "| where ResultType != 0",
          "| summarize Failures = count() by UserPrincipalName",
          "| sort by Failures desc"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “What's the difference between Azure RBAC and Azure Policy?”</strong> <strong>RBAC controls <em>who can perform actions</em></strong> on resources (permissions); <strong>Azure Policy controls <em>what resources may exist and how they must be configured</em></strong> (governance/compliance). They're complementary and both evaluated: you need RBAC <em>allow</em> to act, and the resulting resource must also pass any <em>Deny</em> policies. Bonus: name <strong>Secure Score</strong> as the metric from Defender for Cloud that quantifies posture.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "3-7",
      title: "Storage & data protection in Azure",
      blocks: [
        { type: "p", html: "We finish where the shared-responsibility model said you always own things: <strong>data</strong>. Azure Storage accounts are everywhere, and they are also the source of some of the most famous cloud breaches — almost always because of how access was configured. Let's make sure you never ship one of those." },
        { type: "h", text: "Three ways to authorize access to a storage account" },
        { type: "table", headers: ["Method", "How it works", "Security reality"], rows: [
          ["<strong>Account keys</strong>", "Two 512-bit master keys granting <em>full</em> access to the whole account", "Effectively root for the account. Leak one and it's game over. Rotate regularly or, better, disable."],
          ["<strong>SAS token</strong>", "A signed URL granting <em>scoped, time-limited</em> access (which services, which permissions, which IPs, until when)", "Great for delegation — but it's a bearer token: anyone holding the URL has the access until it expires."],
          ["<strong>Entra ID auth</strong>", "Authorize via Entra identities + RBAC <em>data</em> roles (no shared key)", "<strong>The recommended model</strong> — auditable, revocable, per-identity, no shared secret."]
        ]},
        { type: "h", text: "The Storage Blob Data roles (data-plane RBAC)" },
        { type: "p", html: "Crucial point that trips people up: <strong>control-plane roles do not grant data access</strong>. Being <em>Contributor</em> or even <em>Owner</em> on a storage account lets you manage the resource, but reading the actual blobs with an Entra identity requires a <em>data</em> role:" },
        { type: "kv", items: [
          { k: "Storage Blob Data Reader", v: "Read/list blobs via Entra auth. No write." },
          { k: "Storage Blob Data Contributor", v: "Read/write/delete blobs via Entra auth." },
          { k: "Storage Blob Data Owner", v: "Full data access including setting POSIX ACLs (Data Lake)." }
        ]},
        { type: "callout", variant: "warn", html: "<p>This is the <strong>control plane vs data plane</strong> split made concrete. <em>Owner</em> (control plane) can delete the storage account and even read its access <em>keys</em> — but to read a blob <em>with their own identity</em> they need a <em>Storage Blob Data</em> role. Many teams lock down keys, then wonder why Owners can't see blobs: the answer is they never assigned the data-plane role.</p>" },
        { type: "h", text: "SAS tokens — power and peril" },
        { type: "list", items: [
          "Define the narrowest possible <strong>scope</strong> (specific container/blob), <strong>permissions</strong> (read only if that's all that's needed), and a <strong>short expiry</strong>.",
          "Restrict by <strong>source IP</strong> and require <strong>HTTPS</strong> where you can.",
          "Prefer a <strong>user-delegation SAS</strong> (signed with an Entra credential) over an account-key SAS — it's tied to an identity and revocable.",
          "Remember it's a <strong>bearer token</strong>: it can't be individually revoked unless you rotate the signing key (for account-key SAS) or revoke the delegation. Treat a SAS URL like a password in transit — never log it or paste it in tickets."
        ]},
        { type: "h", text: "Encryption at rest" },
        { type: "kv", items: [
          { k: "Platform-managed keys (PMK)", v: "Azure encrypts all storage at rest by default with keys Microsoft manages. Zero effort, on automatically." },
          { k: "Customer-managed keys (CMK)", v: "You supply and control the key in <strong>Azure Key Vault</strong> — you can rotate or revoke it, which lets you cryptographically cut off access. Needed for stricter compliance (separation of duties, BYOK)." }
        ]},
        { type: "callout", variant: "danger", title: "Public blob / anonymous access — a whole breach class", html: "<p>Storage accounts can be set to allow <strong>anonymous public read</strong> on blobs or containers. Misconfigure this and your data is on the open internet with <em>no auth at all</em> — this is the cloud-era equivalent of the open S3 bucket, and it has leaked countless records (PII, backups, credentials). Modern guidance: set <strong>AllowBlobPublicAccess = false</strong> at the account level so no container can be made public, even by mistake, and use SAS or Entra auth for any sharing. Defender for Cloud and Azure Policy will both flag accounts that permit public access.</p>" },
        { type: "h", text: "Network restrictions on PaaS storage" },
        { type: "p", html: "Even with perfect auth, you should not expose a storage account to the entire internet. The storage <strong>firewall</strong> lets you deny public access by default and allow only specific VNets/subnets (via <em>service endpoints</em>) or — best — give it a <strong>private endpoint</strong> so it's reachable only from inside your VNet. Defence in depth: lock down <em>both</em> identity (who) and network (from where)." },
        { type: "code", lang: "bash", caption: "Harden a storage account", code: [
          "# Disable shared-key auth (force Entra ID) and block public blob access",
          "az storage account update \\",
          "  --name stcontosodata --resource-group rg-prod-web \\",
          "  --allow-blob-public-access false \\",
          "  --allow-shared-key-access false",
          "",
          "# Default-deny the storage firewall, then allow one subnet",
          "az storage account update \\",
          "  --name stcontosodata --resource-group rg-prod-web \\",
          "  --default-action Deny",
          "az storage account network-rule add \\",
          "  --account-name stcontosodata --resource-group rg-prod-web \\",
          "  --vnet-name vnet-prod --subnet snet-web"
        ]},
        { type: "callout", variant: "interview", html: "<p><strong>Q: “What are the risks of a SAS token, and how do you reduce them?”</strong> A SAS is a <strong>bearer token</strong> — whoever holds the URL has the granted access until it expires, and an account-key SAS can't be revoked without rotating the key. Reduce risk by minimising <strong>scope, permissions, and lifetime</strong>, restricting <strong>source IP</strong> and requiring HTTPS, preferring a <strong>user-delegation SAS</strong> (Entra-signed, revocable), and never logging the URL. Even better: skip SAS and use <strong>Entra ID + Storage Blob Data roles</strong> so every access is per-identity, auditable, and instantly revocable.</p>" },
        { type: "divider" },
        { type: "callout", variant: "tip", title: "Module 3 — Key takeaways", html: "<ul><li><strong>Shared Responsibility</strong> shifts with the model (IaaS &gt; PaaS &gt; SaaS = less yours), but <strong>your data and your identities/access are always yours</strong>.</li><li>The hierarchy is <strong>Management Group &gt; Subscription &gt; Resource Group &gt; Resource</strong>, all driven through <strong>ARM</strong>; a <strong>tenant</strong> (identity) is not a <strong>subscription</strong> (billing/resources).</li><li>An Azure RBAC assignment = <strong>principal + role + scope</strong>, inherits downward; <strong>Contributor can't grant access</strong>; Azure RBAC (resources) is distinct from <strong>Entra ID roles</strong> (identity).</li><li>An <strong>NSG is stateful</strong>, matches a <strong>5-tuple</strong>, evaluates by <strong>priority (lowest first, first match wins)</strong>, and is <strong>deny-by-default</strong>. Azure Firewall adds L7/FQDN/threat-intel; Bastion removes public RDP/SSH.</li><li>Use <strong>managed identities</strong> to get secrets out of code; know app registration vs service principal vs managed identity. Put secrets in <strong>Key Vault</strong> with <strong>soft delete + purge protection</strong>.</li><li><strong>Defender for Cloud</strong> = CSPM+CWPP and <strong>Secure Score</strong>; <strong>Azure Policy</strong> governs configuration (audit/deny/DINE) while <strong>RBAC</strong> governs permissions.</li><li>For storage: prefer <strong>Entra auth + Blob Data roles</strong> over keys/SAS, kill <strong>public blob access</strong>, and lock down the <strong>storage firewall / private endpoints</strong>.</li></ul>" }
      ]
    }
  ],
  quiz: [
    { q: "On an Azure IaaS Virtual Machine, who is responsible for patching the guest operating system?", options: ["Microsoft, always", "The customer — the VM OS is yours in the IaaS model", "Nobody; Azure VMs don't need patching", "It is split 50/50 by contract"], answer: 1, explain: "In IaaS, Microsoft owns the physical host and hypervisor; the customer owns the OS, apps, and data — including OS patching. In PaaS (e.g. Azure SQL Database) Microsoft would patch the OS/engine. Your data and identities are always yours in every model." },
    { q: "What is the difference between a Microsoft Entra tenant and an Azure subscription?", options: ["They are two names for the same thing", "The tenant is the identity directory (users/groups/apps); the subscription is a billing/resource container that trusts one tenant", "The subscription holds identities; the tenant holds billing", "A tenant can only ever have one subscription"], answer: 1, explain: "A tenant is the Entra identity directory. A subscription is a billing and resource boundary associated with exactly one tenant for authentication. One tenant can hold many subscriptions." },
    { q: "A user has the built-in Contributor role on a resource group. What can they NOT do?", options: ["Create or delete virtual machines", "Modify network settings", "Grant another user access (create role assignments)", "Read resource configuration"], answer: 2, explain: "Contributor can manage almost all resources but explicitly cannot create role assignments. Granting access requires Owner or User Access Administrator — separating 'manage resources' from 'manage who has access'." },
    { q: "Which statement about how a Network Security Group (NSG) evaluates traffic is correct?", options: ["It is stateless, so you must write a matching return rule for every flow", "Rules are evaluated by priority from highest number to lowest", "It is stateful, matches a 5-tuple, and processes rules by priority lowest-number-first with the first match winning", "It inspects application-layer FQDNs by default"], answer: 2, explain: "An NSG is a stateful L3/L4 filter matching a 5-tuple. Rules run by priority, lowest number first, and the first match wins (evaluation stops). Return traffic is auto-allowed. FQDN/L7 filtering is Azure Firewall, not NSG." },
    { q: "Why is leaving RDP (3389) open to 0.0.0.0/0 on an NSG considered a high-severity finding?", options: ["It uses too much bandwidth", "Internet-facing management ports are continuously brute-forced by bots and are a top initial-access vector", "RDP is deprecated", "It disables the storage firewall"], answer: 1, explain: "Open management ports to the whole internet are found and brute-forced within minutes. Use Azure Bastion (no public ports), Just-in-Time access, or a tightly scoped source IP instead of 'Any'." },
    { q: "What is the primary security advantage of a managed identity over a service principal with a client secret?", options: ["It is cheaper to license", "Azure creates and rotates the credential automatically, so there is no secret stored in your code to leak", "It grants Global Administrator rights", "It works only outside Azure"], answer: 1, explain: "A managed identity is a service principal whose credentials Azure fully manages and rotates. Nothing sensitive lives in code or config, eliminating the leaked-secret risk. Use it whenever the workload runs in Azure." },
    { q: "What does Secure Score in Microsoft Defender for Cloud represent?", options: ["The monthly Azure bill", "A percentage measuring how well your environment follows security recommendations, used to trend posture over time", "The number of users in the tenant", "The uptime SLA of a region"], answer: 1, explain: "Secure Score summarises posture as a single percentage; remediating recommendations raises it. It is the metric used to quantify and trend whether an environment is getting more secure." },
    { q: "An engineer is Owner on a storage account but cannot read its blobs using their own Entra identity. Why?", options: ["Owner is a fake role", "Control-plane roles like Owner do not grant data-plane access; reading blobs by identity needs a Storage Blob Data role", "The storage account is encrypted", "They must wait 24 hours for replication"], answer: 1, explain: "This is the control-plane vs data-plane split. Owner can manage the account and read its access keys, but reading blobs with an Entra identity requires a data role such as Storage Blob Data Reader/Contributor." }
  ],
  flashcards: [
    { front: "Shared Responsibility: what is ALWAYS the customer's job?", back: "Your <strong>data</strong> and your <strong>identities &amp; access</strong> — in every model (IaaS, PaaS, SaaS). The provider's share grows as you move IaaS &gt; PaaS &gt; SaaS." },
    { front: "IaaS vs PaaS vs SaaS — one example each", back: "<strong>IaaS</strong> = Azure Virtual Machines (you own the OS). <strong>PaaS</strong> = Azure App Service / Azure SQL Database (MS owns the OS). <strong>SaaS</strong> = Microsoft 365 (you own mostly just data &amp; access)." },
    { front: "The Azure management hierarchy (top to bottom)", back: "<strong>Management Group &gt; Subscription &gt; Resource Group &gt; Resource</strong>. Policy and RBAC set high up inherit downward. Everything is driven through <strong>ARM</strong> (the control plane)." },
    { front: "Entra tenant vs subscription", back: "<strong>Tenant</strong> = identity directory (users/groups/apps). <strong>Subscription</strong> = billing/resource container that trusts exactly one tenant. One tenant, many subscriptions." },
    { front: "Azure RBAC role assignment = ?", back: "<strong>Security principal + role definition + scope</strong>. It inherits downward (MG &gt; Sub &gt; RG &gt; resource). Assign at the narrowest scope that works." },
    { front: "Owner vs Contributor vs User Access Administrator", back: "Owner = manage everything + grant access. <strong>Contributor = manage resources but CANNOT grant access</strong>. User Access Administrator = manage access (role assignments) only." },
    { front: "Azure RBAC vs Entra ID roles", back: "<strong>Azure RBAC</strong> governs access to <strong>Azure resources</strong> (control plane via ARM). <strong>Entra ID roles</strong> govern <strong>identity features</strong> (users, groups, app registrations) in the directory." },
    { front: "Three things to say about an NSG", back: "<strong>Stateful</strong> (return traffic auto-allowed), matches a <strong>5-tuple</strong> (src/dst IP+port, protocol), evaluated by <strong>priority lowest-first, first match wins</strong>. Deny-by-default (DenyAllInbound at 65500)." },
    { front: "NSG vs Azure Firewall", back: "NSG = free, basic, stateful L3/L4 filter on subnet/NIC. Azure Firewall = managed service with <strong>L3-L7, FQDN filtering, and threat intelligence</strong>, centralised with full logging." },
    { front: "Service Endpoint vs Private Endpoint", back: "<strong>Service Endpoint</strong>: PaaS keeps a public IP but restricts to your subnet over the backbone (free). <strong>Private Endpoint/Private Link</strong>: PaaS gets a <strong>private IP inside your VNet</strong>; you can disable public access entirely." },
    { front: "App registration vs service principal vs managed identity", back: "<strong>App registration</strong> = the app's definition. <strong>Service principal</strong> = the identity instance that gets roles/signs in (you manage its secret). <strong>Managed identity</strong> = a service principal whose secret Azure creates &amp; rotates — no secret in code." },
    { front: "RBAC vs Azure Policy", back: "<strong>RBAC</strong> = who can do things (permissions). <strong>Azure Policy</strong> = what may exist / how it must be configured (governance; effects audit/deny/DeployIfNotExists). You need RBAC allow AND must pass Deny policies." }
  ]
});
