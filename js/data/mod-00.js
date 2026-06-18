/* Module 0 — Foundations: Before You Begin
   This file mirrors the GOLD-STANDARD TEMPLATE (mod-01.js):
   - JS strings use DOUBLE quotes "..."; HTML attributes inside use SINGLE quotes '...'.
   - Code blocks are arrays of lines; any backslash is DOUBLED.
   - No backticks, no template literals.
   Block types: p, h, h3, list, olist, steps, quote, divider,
     callout {variant: info|tip|warn|danger|interview|lab|analogy},
     code {lang, caption, code:[...]}, table {headers, rows}, kv {items:[{k,v}]}. */
window.COURSE.modules.push({
  id: "mod-00",
  number: 0,
  icon: "🧱",
  title: "Foundations: Before You Begin",
  tagline: "The absolute basics — how computers, networks, crypto, and the cloud work — so every later module clicks.",
  estMinutes: 70,
  objectives: [
    "You can explain hardware vs software, what an operating system does, and the difference between a client and a server.",
    "You can describe IP addresses, ports, protocols, DNS, and the TCP three-way handshake in plain language.",
    "You can define the CIA triad, authentication vs authorization, least privilege, and the difference between hashing, encryption, and encoding.",
    "You can explain what an identity provider, SSO, MFA, and a cloud tenant are, and tell IaaS, PaaS, and SaaS apart.",
    "You can outline a basic attack lifecycle and say what malware, phishing, ransomware, a SOC, and MITRE ATT&amp;CK are.",
    "You can set up a free practice lab and plan a sensible study path through this course."
  ],
  lessons: [
    /* ---------------------------------------------------------------- */
    {
      id: "0-1",
      title: "How computers run software",
      subtitle: "The ground floor",
      blocks: [
        { type: "p", html: "Welcome. This module assumes you know <em>nothing</em>, and that is exactly the right starting point. Every later lesson in this course quietly relies on a handful of ideas — operating systems, processes, networks, hashing, the cloud — and if those ideas are fuzzy, the rest never quite lands. So we are going to build the ground floor first, slowly and in plain English. By the end you will own the vocabulary that the rest of the course speaks." },
        { type: "callout", variant: "analogy", title: "A computer is a kitchen", html: "<p>Picture a restaurant kitchen. The <strong>hardware</strong> is the physical stuff — the stoves, knives, fridge, and worktops. The <strong>software</strong> is the recipes and the instructions for using all that equipment. The <strong>operating system</strong> is the head chef who decides which dish gets which stove, who works next, and who is allowed into the walk-in freezer. You can have the finest equipment in the world, but without the head chef coordinating it, nothing useful comes out.</p>" },
        { type: "h", text: "Hardware vs software" },
        { type: "p", html: "<strong>Hardware</strong> is the physical machine: the <strong>CPU</strong> (the processor — the &quot;brain&quot; that does the calculations), memory chips, storage drives, and network card. <strong>Software</strong> is the set of instructions that tells the hardware what to do. Software comes in two broad kinds: the <strong>operating system</strong> (the master program) and <strong>applications</strong> (the programs you actually use, like a browser or a game)." },
        { type: "h", text: "What an operating system actually does" },
        { type: "p", html: "An <strong>operating system (OS)</strong> — Windows, macOS, Linux, Android — sits between your apps and the hardware and manages everything. Its main jobs:" },
        { type: "list", items: [
          "<strong>Runs programs</strong> — starts, pauses, and stops them, and shares the CPU fairly between them.",
          "<strong>Manages memory and storage</strong> — decides what lives in fast memory and what is saved to disk.",
          "<strong>Controls hardware</strong> — talks to the keyboard, screen, disk, and network card so apps don't have to.",
          "<strong>Enforces security</strong> — decides <em>who</em> (which user or program) is allowed to do <em>what</em>. This last job is why an OS sits at the heart of cybersecurity."
        ]},
        { type: "h", text: "Client vs server" },
        { type: "p", html: "These two words appear constantly, so let's nail them now. A <strong>client</strong> is the computer that <em>asks</em> for something; a <strong>server</strong> is the computer that <em>provides</em> it. When you open a website, your laptop is the client and a machine in a data centre is the server. The very same computer can be a client in one conversation and a server in another — &quot;client&quot; and &quot;server&quot; are roles, not types of machine." },
        { type: "kv", items: [
          { k: "Client", v: "The requester. Your laptop, phone, or browser. Usually one person uses it. This is the &quot;endpoint&quot; where phishing lands." },
          { k: "Server", v: "The provider. A usually-always-on machine that answers many clients — a web server, a file server, a mail server. The valuable data often lives here." }
        ]},
        { type: "h", text: "Processes and threads" },
        { type: "p", html: "When you launch a program, the OS creates a <strong>process</strong> — a running instance of that program, with its own slice of memory and its own identity (which user it runs as). Inside a process are one or more <strong>threads</strong>, which are the individual streams of work the CPU actually executes. One process (say, your browser) can have many threads doing things at once — one rendering a page, another playing audio." },
        { type: "callout", variant: "analogy", html: "<p>A <strong>process</strong> is like a single project team with its own locked office (its memory). The <strong>threads</strong> are the workers inside that office, each doing a task, all sharing the same desks and whiteboard. Workers in one office can't just walk into another team's locked office — and that isolation is a security feature.</p>" },
        { type: "h", text: "RAM vs disk" },
        { type: "p", html: "Two kinds of storage, and the difference matters enormously in security:" },
        { type: "table", headers: ["", "RAM (memory)", "Disk (storage)"], rows: [
          ["Speed", "Very fast", "Slower"],
          ["When it forgets", "Loses everything when power is cut (volatile)", "Keeps data when powered off (persistent)"],
          ["Holds", "Programs that are running right now, and their live data", "Files, the OS itself, anything saved for later"],
          ["Security angle", "Passwords and keys often sit here unencrypted while in use — a prime theft target", "Data here can be encrypted at rest (e.g. with BitLocker)"]
        ]},
        { type: "p", html: "Remember this line: <strong>secrets often live in RAM in the clear</strong> while a program is using them. That single fact explains a huge category of attacks you'll meet later." },
        { type: "h", text: "The file system" },
        { type: "p", html: "The <strong>file system</strong> is how the OS organises data on a disk into <strong>files</strong> (individual documents, programs, images) and <strong>folders</strong> (also called directories) that contain them, arranged in a tree. A <strong>path</strong> is the address of a file in that tree — for example <code>C:\\Users\\Alex\\report.docx</code> on Windows, or <code>/home/alex/report.docx</code> on Linux. Modern file systems also store <strong>permissions</strong> that say who may read or change each file." },
        { type: "h", text: "What a virtual machine (VM) is" },
        { type: "p", html: "A <strong>virtual machine (VM)</strong> is a complete computer that exists only in software. A program called a <strong>hypervisor</strong> pretends to be hardware, so you can run a whole second operating system inside a window on your real computer. The VM thinks it has its own CPU, memory, and disk, but they are really slices of the host machine's resources." },
        { type: "callout", variant: "tip", html: "<p>VMs are a security engineer's best friend. You can run malware or test attacks inside a VM that is <strong>isolated</strong> from your real machine, then throw the VM away when you're done. In Lesson 0-6 you'll set up a free lab built entirely on VMs and cloud services — no risk to your own laptop.</p>" },
        { type: "callout", variant: "interview", title: "Warm-up question", html: "<p><strong>Q: &quot;In plain terms, what's the difference between a process and a program?&quot;</strong> A clean answer: &quot;A <em>program</em> is the recipe sitting on disk — a file of instructions. A <em>process</em> is what you get when the OS actually runs it: a live instance with its own memory and identity. You can run the same program three times and get three separate processes.&quot; Interviewers ask warm-ups like this early to check your mental model is solid before going deeper.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "0-2",
      title: "Networking in 20 minutes",
      subtitle: "How machines talk",
      blocks: [
        { type: "p", html: "Almost every attack crosses a network at some point, so a working picture of how machines talk to each other is non-negotiable. The good news: the core ideas are simple, and you only need a handful of them. Let's build up from a single message between two computers." },
        { type: "callout", variant: "analogy", title: "The postal system", html: "<p>Think of network communication as posting a letter. The <strong>IP address</strong> is the building's street address (which computer). The <strong>port</strong> is the apartment number inside that building (which program). The <strong>protocol</strong> is the language and etiquette the letter is written in, so the recipient knows how to read it. And <strong>DNS</strong> is the phone book that turns a friendly name like <em>example.com</em> into the actual street address.</p>" },
        { type: "h", text: "IP address, port, protocol" },
        { type: "kv", items: [
          { k: "IP address", v: "A number that identifies a computer on a network — like <code>192.168.1.10</code> (IPv4) or a longer IPv6 form. It says <em>which machine</em>." },
          { k: "Port", v: "A number from 0&ndash;65535 that identifies <em>which program</em> on that machine should get the message. A web server usually listens on port 443." },
          { k: "Protocol", v: "The agreed set of rules for the conversation — HTTP for web pages, SMTP for email, SSH for remote shells. It defines the &quot;language&quot; both sides speak." }
        ]},
        { type: "p", html: "Put together, an IP address plus a port (written <code>192.168.1.10:443</code>) points at one specific program on one specific machine — the exact &quot;apartment&quot; the message is delivered to." },
        { type: "h", text: "TCP vs UDP" },
        { type: "p", html: "Once you know <em>where</em> to send data, you need a way to actually send it. The two workhorses are TCP and UDP:" },
        { type: "table", headers: ["", "TCP", "UDP"], rows: [
          ["Style", "Reliable — confirms every delivery", "Fast — fire and forget, no confirmation"],
          ["Analogy", "A phone call: you say hello, the other side replies, you know they're there", "A postcard: you send it and hope it arrives"],
          ["Best for", "Web pages, email, file transfer — anything that must arrive intact", "Video calls, streaming, DNS lookups — speed matters more than the odd lost piece"]
        ]},
        { type: "h", text: "The TCP three-way handshake" },
        { type: "p", html: "Before TCP sends real data, the two computers do a quick three-step greeting to agree they're both ready. You'll see this named in tools and interviews, so learn the steps:" },
        { type: "olist", items: [
          "<strong>SYN</strong> — the client says &quot;let's talk&quot; (synchronize).",
          "<strong>SYN-ACK</strong> — the server replies &quot;sure, I hear you&quot; (synchronize + acknowledge).",
          "<strong>ACK</strong> — the client confirms &quot;great, beginning now&quot; (acknowledge)."
        ]},
        { type: "p", html: "After those three messages the connection is established and real data flows. A flood of half-finished handshakes (lots of SYNs with no final ACK) is a classic denial-of-service technique called a <strong>SYN flood</strong>." },
        { type: "h", text: "DNS — names into addresses" },
        { type: "p", html: "Humans remember names; computers route by numbers. <strong>DNS (Domain Name System)</strong> is the internet's directory that translates a name like <code>portal.example.com</code> into an IP address your machine can actually connect to. Because nearly every connection starts with a DNS lookup, DNS logs are a goldmine for spotting suspicious activity, and DNS itself is a frequent target for tampering." },
        { type: "h", text: "Common ports you should recognise" },
        { type: "p", html: "Certain services almost always live on certain ports. You don't need to memorise the whole list today, but these come up again and again across this course:" },
        { type: "table", headers: ["Port", "Service", "What it's for"], rows: [
          ["<strong>80</strong>", "HTTP", "Unencrypted web traffic"],
          ["<strong>443</strong>", "HTTPS", "Encrypted web traffic (HTTP over TLS)"],
          ["<strong>22</strong>", "SSH", "Secure remote command-line access to a server"],
          ["<strong>3389</strong>", "RDP", "Remote Desktop — graphical remote access to Windows"],
          ["<strong>53</strong>", "DNS", "Name-to-IP lookups"],
          ["<strong>445</strong>", "SMB", "Windows file sharing (a famous lateral-movement path)"],
          ["<strong>389 / 636</strong>", "LDAP / LDAPS", "Directory queries (Active Directory) — plain / encrypted"],
          ["<strong>88</strong>", "Kerberos", "The authentication protocol used by Active Directory"],
          ["<strong>25 / 587</strong>", "SMTP", "Sending email between mail servers / from a client"]
        ]},
        { type: "h", text: "Firewall vs proxy" },
        { type: "p", html: "Two devices you'll hear about constantly — and they do different jobs:" },
        { type: "kv", items: [
          { k: "Firewall", v: "A gatekeeper that <strong>allows or blocks</strong> traffic based on rules (which IPs, which ports, which direction). Think of a bouncer checking a guest list at the door." },
          { k: "Proxy", v: "A <strong>middleman</strong> that traffic flows <em>through</em>. It can inspect, log, cache, or filter the requests, and it hides the real client behind itself. Think of a mailroom that opens, checks, and re-sends your post." }
        ]},
        { type: "h", text: "The layers: OSI and TCP/IP (light touch)" },
        { type: "p", html: "Network people describe communication as a stack of <strong>layers</strong>, each handling one job and handing off to the next. The formal model is the seven-layer <strong>OSI model</strong>; in practice people use the simpler four-layer <strong>TCP/IP model</strong>. You don't need to recite all seven yet — just hold the idea that data is wrapped layer by layer, like an envelope inside an envelope:" },
        { type: "table", headers: ["Layer (plain name)", "Job", "Example"], rows: [
          ["Application", "The program's own language", "HTTP, DNS, SMTP"],
          ["Transport", "Reliable or fast delivery + ports", "TCP, UDP"],
          ["Network (Internet)", "Routing between networks by IP", "IP addresses"],
          ["Link (physical)", "Getting bits across the actual wire or air", "Ethernet, Wi-Fi"]
        ]},
        { type: "callout", variant: "tip", html: "<p>A handy memory hook: when something &quot;doesn't connect,&quot; troubleshoot up the stack. Is the cable/Wi-Fi alive (Link)? Does the IP route (Network)? Is the port open (Transport)? Is the app speaking the right protocol (Application)? Working layer by layer beats random guessing.</p>" },
        { type: "callout", variant: "interview", title: "Warm-up question", html: "<p><strong>Q: &quot;What happens, step by step, when you type a website name and press Enter?&quot;</strong> A confident beginner answer: &quot;My machine asks <strong>DNS</strong> to turn the name into an <strong>IP address</strong>. It opens a <strong>TCP</strong> connection to that IP on <strong>port 443</strong> using the three-way <strong>handshake</strong>, sets up encryption (<strong>HTTPS</strong>), then sends an HTTP request and gets the page back.&quot; This single question lets an interviewer check DNS, IP, ports, TCP, and HTTPS all at once.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "0-3",
      title: "Security fundamentals",
      subtitle: "The mental toolkit",
      blocks: [
        { type: "p", html: "Now we layer security on top of the computing and networking basics. These are the concepts the entire field is built on — the words in this lesson will appear in literally every module that follows. Learn them once, properly, here." },
        { type: "h", text: "The CIA triad" },
        { type: "p", html: "Security goals are usually summed up by three letters: <strong>C-I-A</strong>. (No relation to the spy agency — it's a memory aid.) Every control you ever deploy is protecting at least one of these:" },
        { type: "table", headers: ["Letter", "Goal", "Example control"], rows: [
          ["<strong>Confidentiality</strong>", "Keep data secret from those who shouldn't see it", "Encryption; access permissions"],
          ["<strong>Integrity</strong>", "Keep data accurate and untampered-with", "Hashing / checksums; digital signatures"],
          ["<strong>Availability</strong>", "Keep systems and data usable when needed", "Backups; redundancy; anti-DoS protection"]
        ]},
        { type: "callout", variant: "analogy", title: "CIA as a bank vault", html: "<p><strong>Confidentiality</strong> is the locked vault door — only authorised people see the gold. <strong>Integrity</strong> is the careful ledger — nobody can secretly add or remove an entry without it being caught. <strong>Availability</strong> is the bank actually being open when customers arrive. A bank that fails any one of the three has failed at its job — and so has a security program.</p>" },
        { type: "h", text: "Authentication vs authorization" },
        { type: "p", html: "Two words that sound alike and are constantly confused. Learn the split cold:" },
        { type: "kv", items: [
          { k: "Authentication (AuthN)", v: "<strong>Proving who you are.</strong> Showing your passport at the airport. Done with passwords, codes, fingerprints, etc." },
          { k: "Authorization (AuthZ)", v: "<strong>What you're allowed to do</strong> once you've proven who you are. Your boarding pass lets you into <em>your</em> seat, not the cockpit." }
        ]},
        { type: "h", text: "Least privilege" },
        { type: "p", html: "<strong>Least privilege</strong> means giving each person or program <em>only</em> the access it needs to do its job, and nothing more. A cinema usher needs to open the screening-room doors, not the safe. If that usher's keys are stolen, the damage is limited. Least privilege is, dollar for dollar, one of the highest-value security ideas in existence." },
        { type: "h", text: "Defense in depth" },
        { type: "p", html: "<strong>Defense in depth</strong> means stacking multiple independent layers of protection, so that if one fails the next still holds. A castle doesn't rely on a single wall — it has a moat, an outer wall, an inner wall, locked doors, and guards. In computing that's a firewall, plus antivirus, plus least privilege, plus encryption, plus backups. No single control is perfect, so we never bet everything on one." },
        { type: "h", text: "Threat, vulnerability, risk, and exploit" },
        { type: "p", html: "These four are used precisely in security, and mixing them up marks you as a beginner. Here's the clean set:" },
        { type: "kv", items: [
          { k: "Vulnerability", v: "A weakness — an unlocked window in a house." },
          { k: "Threat", v: "Something that could exploit that weakness — a burglar in the neighbourhood." },
          { k: "Exploit", v: "The actual method or tool used to take advantage of the weakness — the act of climbing through that window." },
          { k: "Risk", v: "The chance and the cost of it actually going wrong. Formally, <strong>risk = likelihood &times; impact</strong>." }
        ]},
        { type: "p", html: "So: an unlocked window is a <em>vulnerability</em>; a burglar is a <em>threat</em>; climbing through is an <em>exploit</em>; and the odds-times-damage of being robbed is the <em>risk</em>. Risk is what we actually manage, because we can rarely fix every vulnerability — we prioritise by likelihood and impact." },
        { type: "h", text: "Hashing vs encryption vs encoding" },
        { type: "p", html: "Three things that all &quot;scramble&quot; data but for completely different reasons. Confusing them is a classic interview trap, so let's separate them carefully:" },
        { type: "table", headers: ["", "Reversible?", "Needs a key?", "Purpose"], rows: [
          ["<strong>Encoding</strong>", "Yes, trivially", "No", "Format data for transport (e.g. Base64). <em>Not</em> security — anyone can reverse it."],
          ["<strong>Encryption</strong>", "Yes, with the key", "Yes", "Keep data secret (confidentiality). Reversible only by key holders."],
          ["<strong>Hashing</strong>", "No (one-way)", "No", "Produce a fixed fingerprint to check integrity or store passwords. Cannot be un-hashed."]
        ]},
        { type: "callout", variant: "analogy", html: "<p><strong>Encoding</strong> is translating a sentence into Morse code — anyone with the chart reads it back; it hides nothing. <strong>Encryption</strong> is locking the sentence in a box you need a key to open. <strong>Hashing</strong> is feeding the sentence through a meat grinder: you get a unique paste you can compare against another, but you can never reconstruct the original sentence.</p>" },
        { type: "h", text: "Why passwords are salted and hashed" },
        { type: "p", html: "Good systems <em>never</em> store your password as plain text. Instead they store a <strong>hash</strong> of it. When you log in, the system hashes what you typed and compares the two fingerprints — it can check you without ever knowing your actual password. To stop attackers from pre-computing hashes of common passwords, each one is first mixed with a unique random value called a <strong>salt</strong>. Salting means two users with the same password still get different stored hashes, defeating bulk cracking." },
        { type: "callout", variant: "danger", html: "<p>If a database stores passwords in <strong>plain text</strong> (or merely encoded with something like Base64), a single breach hands every credential to the attacker. &quot;We store passwords salted and hashed&quot; should be the bare-minimum answer — and you should be able to explain <em>why</em> the salt matters, not just that it's there.</p>" },
        { type: "h", text: "Symmetric vs asymmetric crypto (high level)" },
        { type: "p", html: "Encryption comes in two families. You just need the shape of each:" },
        { type: "kv", items: [
          { k: "Symmetric", v: "<strong>One shared key</strong> locks and unlocks. Fast, great for bulk data — but both sides must already share the secret key. Like a single house key everyone copies." },
          { k: "Asymmetric", v: "<strong>A key pair</strong>: a public key anyone can use to lock, and a private key only the owner uses to unlock. Solves the &quot;how do we share a secret with a stranger&quot; problem. Underpins HTTPS." }
        ]},
        { type: "p", html: "In real life they team up: asymmetric crypto is used at the start of an HTTPS connection to safely agree on a fast symmetric key, then symmetric crypto encrypts the actual traffic. You don't need the math today — just remember <em>one shared key</em> vs <em>a public/private pair</em>." },
        { type: "callout", variant: "interview", title: "Warm-up question", html: "<p><strong>Q: &quot;Is hashing a kind of encryption?&quot;</strong> The answer that earns a nod: &quot;No. Encryption is <em>reversible</em> with a key — it protects confidentiality. Hashing is <em>one-way</em> with no key — it produces a fingerprint for integrity checks and password storage, and you can't get the original back.&quot; Many candidates blur these, so getting it crisp signals you've got real foundations.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "0-4",
      title: "Identity, on-prem vs cloud",
      subtitle: "Who you are, and where your stuff lives",
      blocks: [
        { type: "p", html: "Modern security is built around <strong>identity</strong> — proving and managing who (or what) is acting in a system. This lesson defines the identity words you'll need, then explains the on-premises vs cloud split and the famous IaaS/PaaS/SaaS model. It directly sets up Active Directory in Module 2 and Microsoft Entra ID in Module 4." },
        { type: "h", text: "Identity, directory, and identity provider" },
        { type: "kv", items: [
          { k: "Identity", v: "A digital record of <em>who someone (or something) is</em> — a user account, but also a server or an app can have an identity." },
          { k: "Directory", v: "The organised database that stores all those identities, their groups, and their attributes. Think of it as the company phone book plus an org chart." },
          { k: "Identity provider (IdP)", v: "The trusted service that <strong>verifies identities and vouches for them</strong> to other apps. When an app says &quot;sign in with Microsoft,&quot; Microsoft is acting as the IdP." }
        ]},
        { type: "callout", variant: "analogy", title: "The IdP as a passport office", html: "<p>An <strong>identity provider</strong> is like a passport office. It does the hard work of verifying who you are and issues a trusted document. Then, at every border (each app you visit), the guard doesn't re-investigate your whole life — they just trust the passport the office issued. That's why a single trustworthy IdP can let you into dozens of apps.</p>" },
        { type: "h", text: "SSO and MFA in plain terms" },
        { type: "kv", items: [
          { k: "Single Sign-On (SSO)", v: "Sign in <strong>once</strong> with your IdP, then reach many apps without retyping your password for each. One trusted login, many doors." },
          { k: "Multi-Factor Authentication (MFA)", v: "Prove who you are with <strong>two or more different kinds of evidence</strong>: something you know (password), something you have (a phone or token), something you are (a fingerprint)." }
        ]},
        { type: "p", html: "MFA matters because passwords get stolen, guessed, and reused all the time. Adding a second factor means a stolen password alone is not enough to get in. It is one of the single most effective controls against account takeover, which is why nearly every later module recommends it." },
        { type: "h", text: "On-premises vs cloud" },
        { type: "p", html: "<strong>On-premises</strong> (&quot;on-prem&quot;) means the servers physically live in <em>your</em> building or data centre, and your team owns and maintains them. <strong>Cloud</strong> means you rent computing from a provider like Microsoft Azure, who owns the data centres, and you reach it over the internet. Most real organisations today are <strong>hybrid</strong> — part on-prem, part cloud — which is exactly the world this course prepares you for." },
        { type: "h", text: "IaaS, PaaS, SaaS" },
        { type: "p", html: "Cloud services come in three levels, depending on how much the provider manages for you versus how much you manage yourself." },
        { type: "callout", variant: "analogy", title: "Pizza as a service", html: "<p>The classic analogy: making dinner. <strong>On-prem</strong> = you grow the wheat and make everything from scratch. <strong>IaaS</strong> = you buy ready-made dough and toppings (the raw ingredients) and bake at home. <strong>PaaS</strong> = you order a take-and-bake pizza; the hard parts are done, you just pop it in your oven. <strong>SaaS</strong> = the pizza is delivered hot to your door; you only eat. The further down the list, the less you manage.</p>" },
        { type: "table", headers: ["Model", "What you rent", "You manage", "Example"], rows: [
          ["<strong>IaaS</strong> (Infrastructure)", "Virtual machines, storage, networks", "The OS, apps, and data on top", "Azure Virtual Machines"],
          ["<strong>PaaS</strong> (Platform)", "A ready platform to run your code", "Just your app and data", "Azure App Service"],
          ["<strong>SaaS</strong> (Software)", "A finished application", "Only your data and settings", "Microsoft 365, Outlook online"]
        ]},
        { type: "h", text: "What a tenant is" },
        { type: "p", html: "A <strong>tenant</strong> is your organisation's own dedicated, isolated space inside a shared cloud service. Even though Microsoft runs one giant cloud serving millions of customers, each customer gets a walled-off tenant — your users, data, and settings can't see or touch another company's. The name comes from apartments: many tenants share one building, but each has their own locked unit." },
        { type: "h", text: "How this sets up later modules" },
        { type: "list", items: [
          "<strong>Active Directory (Module 2)</strong> is the classic <em>on-premises</em> directory and identity provider that runs inside a company's own data centre.",
          "<strong>Microsoft Entra ID (Module 4)</strong> — formerly Azure AD — is the <em>cloud</em> identity provider that powers SSO and MFA for Microsoft 365 and thousands of apps, organised by tenant.",
          "Most organisations connect the two so identities flow between on-prem AD and cloud Entra ID — the <strong>hybrid identity</strong> world you'll learn to secure."
        ]},
        { type: "callout", variant: "interview", title: "Warm-up question", html: "<p><strong>Q: &quot;Explain SaaS versus PaaS versus IaaS in one sentence each.&quot;</strong> A tidy answer: &quot;With <strong>IaaS</strong> I rent the raw machines and manage the OS upward; with <strong>PaaS</strong> I just bring my code and the platform runs it; with <strong>SaaS</strong> I just use a finished app and only own my data.&quot; Then the killer follow-up: &quot;In each model, who's responsible for security?&quot; — the answer being the <strong>shared responsibility model</strong>, where the higher you go, the more the provider handles and the less you do.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "0-5",
      title: "The attacker's playbook (gentle intro)",
      subtitle: "Knowing the other side",
      blocks: [
        { type: "p", html: "To defend, it helps to understand how attackers actually operate. This is a deliberately gentle preview — we're not going deep yet — but by the end you'll recognise the common threats by name and understand the rough shape of an attack. It sets up the offensive and defensive modules (8 and 9) later." },
        { type: "h", text: "The threats by name" },
        { type: "kv", items: [
          { k: "Malware", v: "&quot;Malicious software&quot; — any program written to do harm: steal data, spy, or take control. An umbrella term." },
          { k: "Phishing", v: "A <strong>trick message</strong> (usually email) that fools you into clicking a bad link, opening a bad file, or handing over your password. It targets the human, not the machine." },
          { k: "Ransomware", v: "Malware that <strong>encrypts your files and demands payment</strong> for the key. It attacks the &quot;A&quot; in CIA — availability — by holding your data hostage." }
        ]},
        { type: "callout", variant: "analogy", title: "A burglary in stages", html: "<p>A serious attack is rarely one dramatic moment; it's a sequence, like a planned burglary. First the burglar finds a way in (an unlocked window). Then they quietly explore the house to learn the layout. They grab the keys to other rooms. They move from room to room. Only at the end do they actually take the valuables. Defenders win by spotting and stopping the burglar at <em>any</em> stage — not just the last one.</p>" },
        { type: "h", text: "The attack lifecycle in plain words" },
        { type: "p", html: "Most intrusions follow a recognisable arc. Learn this rough five-step story; it's the backbone of how defenders think:" },
        { type: "olist", items: [
          "<strong>Get in</strong> — the attacker gains a first foothold, often via phishing or a vulnerable service.",
          "<strong>Look around</strong> — they quietly explore the network to learn what's there (reconnaissance).",
          "<strong>Grab credentials</strong> — they steal usernames, passwords, hashes, or tickets to gain more power.",
          "<strong>Spread</strong> — they use those credentials to move from machine to machine (lateral movement).",
          "<strong>Impact</strong> — finally they act on their goal: steal data, deploy ransomware, or cause damage."
        ]},
        { type: "p", html: "The crucial insight: there are <em>many</em> steps between &quot;get in&quot; and &quot;impact.&quot; Each one is a chance for a defender to detect and stop the attack. That gap is where blue teams live." },
        { type: "h", text: "MITRE ATT&amp;CK — a shared map" },
        { type: "p", html: "Security teams worldwide describe attacker behaviour using a common catalogue called <strong>MITRE ATT&amp;CK</strong>. It organises real-world attacker actions into <strong>tactics</strong> (the <em>why</em> — the goal of a step, like &quot;Credential Access&quot;) and <strong>techniques</strong> (the <em>how</em> — the specific method). Because everyone uses the same map and vocabulary, an analyst in one company can describe an attack and an analyst in another instantly understands it." },
        { type: "callout", variant: "analogy", html: "<p>MITRE ATT&amp;CK is like a shared, numbered field guide to animal behaviour. Instead of one person saying &quot;the thing snuck around&quot; and another saying &quot;it crept,&quot; everyone points to the same entry in the guide. That shared language is what lets defenders compare notes and build detections that travel between teams.</p>" },
        { type: "h", text: "SOC and the blue team" },
        { type: "kv", items: [
          { k: "SOC (Security Operations Center)", v: "The team (and the room/system) that <strong>monitors, detects, and responds</strong> to security events around the clock. The watchtower of an organisation." },
          { k: "Blue team", v: "The <strong>defenders</strong> — the people who build protections, hunt for intruders, and respond to incidents. (The <strong>red team</strong> is the friendly attackers who test the defences.)" }
        ]},
        { type: "p", html: "Most security careers — and most of this course — lean toward the blue team: understanding attacks well enough to detect and stop them. You'll meet the SOC's tools and workflows properly in Modules 8 and 9." },
        { type: "callout", variant: "interview", title: "Warm-up question", html: "<p><strong>Q: &quot;What's the difference between a virus, malware, and ransomware?&quot;</strong> A clear answer: &quot;<strong>Malware</strong> is the umbrella term for any malicious software. A <strong>virus</strong> is one specific kind that spreads by attaching to other files. <strong>Ransomware</strong> is another kind that encrypts your data and demands payment.&quot; Getting the category-versus-example relationship right is exactly the kind of clarity interviewers listen for.</p>" }
      ]
    },
    /* ---------------------------------------------------------------- */
    {
      id: "0-6",
      title: "How to use this course & build a free lab",
      subtitle: "Setting yourself up to win",
      blocks: [
        { type: "p", html: "You've now got the vocabulary. This final lesson is about <em>how to actually learn the rest</em> — a sensible study path, study techniques that really work, and how to build a completely free practice lab so you can get your hands dirty without spending a penny or risking your own machine." },
        { type: "h", text: "The suggested study path" },
        { type: "p", html: "Work through the modules roughly in order, <strong>0 &rarr; 10</strong>. Each builds on the last. Module 0 (this one) is the on-ramp; later modules go deep on Windows, identity, the cloud, attacks, and defence. If a later module ever feels like it assumes something, come back here — the term is almost certainly defined in one of these six lessons." },
        { type: "olist", items: [
          "<strong>Read</strong> a lesson once, gently, just to get the shape.",
          "<strong>Re-read</strong> and this time say each new term out loud in your own words.",
          "<strong>Do</strong> the lab or commands where one is offered — reading and doing are different skills.",
          "<strong>Self-test</strong> with the quiz and flashcards before moving on."
        ]},
        { type: "h", text: "Active-recall study tips" },
        { type: "p", html: "The single biggest upgrade to your studying is to stop passively re-reading and start actively <strong>recalling</strong>. The struggle of pulling an answer from memory is what builds durable knowledge:" },
        { type: "list", items: [
          "<strong>Close the page and explain it.</strong> After each lesson, say the key idea aloud from memory, then check. If you can't explain it simply, you don't yet own it.",
          "<strong>Use the flashcards as questions, not answers.</strong> Cover the back and force yourself to produce it.",
          "<strong>Space it out.</strong> Reviewing a little over several days beats one long cram — your memory strengthens on each retrieval.",
          "<strong>Teach it.</strong> Explaining a concept to someone (or a rubber duck) instantly exposes the gaps."
        ]},
        { type: "callout", variant: "analogy", html: "<p>Studying by re-reading is like watching someone lift weights and expecting to get stronger. <strong>Active recall</strong> — making your brain do the lifting by retrieving the answer — is the actual workout. The little burn of &quot;wait, what was that term again?&quot; is the muscle growing.</p>" },
        { type: "h", text: "Build a free practice lab" },
        { type: "p", html: "You can practise everything in this course for free, using Microsoft's own offers. Two pieces give you a full Microsoft 365 and Azure environment to break and rebuild safely:" },
        { type: "table", headers: ["What", "Gives you", "Cost"], rows: [
          ["<strong>Microsoft 365 Developer tenant</strong>", "Your own M365 tenant with test users, Entra ID, and Office apps to experiment with identity", "Free (renewable for active developers)"],
          ["<strong>Azure free account</strong>", "Credit plus always-free services to spin up virtual machines and cloud resources", "Free starter credit; many services free ongoing"]
        ]},
        { type: "steps", items: [
          "Sign up for the <strong>Microsoft 365 Developer Program</strong> to get a free tenant pre-loaded with sample users — your own safe identity playground.",
          "Create a <strong>free Azure account</strong> with the starter credit to practise spinning up and securing virtual machines.",
          "Always build in <strong>VMs or your free tenant</strong>, never on your daily-driver laptop — so a mistake (or test malware) can be thrown away.",
          "Take a quick <strong>snapshot</strong> of a VM before risky experiments so you can roll back in seconds."
        ]},
        { type: "callout", variant: "warn", title: "Lab safety", html: "<p>A practice lab is for <em>your own</em> tenant and machines only. Never point any tool, scan, or technique at systems you don't own or lack written permission to test — that crosses from learning into something illegal. Keep your lab isolated, and treat any sample malware as live: handle it only inside a throwaway VM.</p>" },
        { type: "h", text: "Why hands-on matters for interviews" },
        { type: "p", html: "Reading about a concept and having actually <em>done</em> it are worlds apart, and interviewers can tell within a couple of questions. Someone who has personally created a tenant, enabled MFA, and watched a sign-in log light up talks about it with a confidence that no amount of reading produces. A small home lab is the cheapest, fastest way to turn &quot;I've heard of that&quot; into &quot;I've done that.&quot;" },
        { type: "callout", variant: "lab", html: "<p>Your very first lab task, due before Module 1: sign up for the free Microsoft 365 Developer tenant, sign in, and find the list of sample users. That's it. The goal is simply to <em>have a place to practise</em> — every later module will give you something concrete to try in it.</p>" },
        { type: "divider" },
        { type: "callout", variant: "tip", title: "Module 0 — Key takeaways", html: "<ul><li><strong>Hardware</strong> is the physical machine; the <strong>OS</strong> is the master program that runs apps, manages memory, and enforces security. A <strong>process</strong> is a running program; <strong>RAM</strong> is fast but forgets, and secrets often sit there in the clear.</li><li>Networking = <strong>IP</strong> (which machine) + <strong>port</strong> (which program) + <strong>protocol</strong> (the language). <strong>DNS</strong> turns names into IPs, and <strong>TCP</strong> sets up reliably via the <strong>SYN / SYN-ACK / ACK</strong> handshake.</li><li>The <strong>CIA triad</strong> (Confidentiality, Integrity, Availability) is the goal. <strong>AuthN</strong> is who you are; <strong>AuthZ</strong> is what you may do. Apply <strong>least privilege</strong> and <strong>defense in depth</strong>.</li><li><strong>Hashing</strong> is one-way (integrity, password storage), <strong>encryption</strong> is reversible with a key (secrecy), <strong>encoding</strong> is not security at all. Passwords are <strong>salted and hashed</strong>, never stored plain.</li><li>An <strong>identity provider</strong> vouches for who you are, enabling <strong>SSO</strong> and <strong>MFA</strong>. Cloud comes as <strong>IaaS / PaaS / SaaS</strong>, each in your own isolated <strong>tenant</strong>.</li><li>Attacks follow a lifecycle — get in, look around, grab credentials, spread, impact — mapped by <strong>MITRE ATT&amp;CK</strong> and defended by the <strong>SOC / blue team</strong>. Build a free lab and learn by doing.</li></ul>" }
      ]
    }
  ],
  quiz: [
    { q: "What is the key difference between RAM and disk that matters most for security?", options: ["RAM is bigger than disk", "RAM is volatile (loses data on power off) and often holds secrets like passwords in the clear while in use; disk is persistent and can be encrypted at rest", "Disk is always faster than RAM", "RAM stores the operating system permanently"], answer: 1, explain: "RAM is fast but volatile and frequently holds credentials and keys unencrypted while a program uses them, which makes it a prime theft target. Disk keeps data when powered off and can be encrypted at rest." },
    { q: "In the TCP three-way handshake, what is the correct order of messages?", options: ["ACK, SYN, SYN-ACK", "SYN, ACK, SYN-ACK", "SYN, SYN-ACK, ACK", "SYN-ACK, SYN, ACK"], answer: 2, explain: "The client sends SYN, the server replies SYN-ACK, and the client confirms with ACK. After those three messages the TCP connection is established and real data flows." },
    { q: "Which port is standard for HTTPS (encrypted web traffic)?", options: ["80", "22", "443", "53"], answer: 2, explain: "443 is HTTPS (HTTP over TLS). 80 is plain HTTP, 22 is SSH, and 53 is DNS. Recognising these common ports is foundational across the whole course." },
    { q: "Which statement correctly distinguishes hashing from encryption?", options: ["Both are reversible with a key", "Hashing is one-way with no key (for integrity and password storage); encryption is reversible with a key (for confidentiality)", "Encryption is one-way; hashing is reversible", "They are two words for the same thing"], answer: 1, explain: "Hashing is a one-way fingerprint you cannot reverse, used for integrity checks and storing passwords. Encryption is reversible with the correct key and protects confidentiality." },
    { q: "An organisation rents virtual machines from Azure but installs and manages the operating system and applications itself. Which cloud model is this?", options: ["SaaS", "PaaS", "IaaS", "On-premises"], answer: 2, explain: "Renting the raw infrastructure (VMs, storage, networking) while managing the OS and apps yourself is IaaS. In PaaS you'd only bring your code; in SaaS you'd just use a finished app." },
    { q: "In risk terms, an unlocked window is best described as which of the following?", options: ["A threat", "An exploit", "A vulnerability", "A risk"], answer: 2, explain: "A vulnerability is the weakness itself (the unlocked window). A threat is the burglar, the exploit is the act of climbing through, and risk is likelihood times impact." },
    { q: "What does MITRE ATT&amp;CK provide to defenders?", options: ["Antivirus software you install on endpoints", "A shared catalogue of attacker tactics and techniques so teams can describe and compare attacker behaviour using common language", "A firewall ruleset", "A password manager"], answer: 1, explain: "MITRE ATT&amp;CK is a shared map of real-world attacker behaviour, organised into tactics (the goal) and techniques (the method), giving defenders a common vocabulary." }
  ],
  flashcards: [
    { front: "Hardware vs software vs operating system", back: "<strong>Hardware</strong> is the physical machine (CPU, memory, disk). <strong>Software</strong> is the instructions. The <strong>operating system</strong> is the master program that runs apps, manages memory and hardware, and enforces security." },
    { front: "Client vs server", back: "A <strong>client</strong> requests; a <strong>server</strong> provides. They are roles, not machine types — the same computer can be a client in one conversation and a server in another." },
    { front: "Process vs thread", back: "A <strong>process</strong> is a running instance of a program with its own memory and identity. A <strong>thread</strong> is a stream of work inside it; one process can have many threads." },
    { front: "IP vs port vs protocol", back: "<strong>IP</strong> = which machine. <strong>Port</strong> = which program on it. <strong>Protocol</strong> = the language/rules of the conversation (HTTP, SSH, DNS)." },
    { front: "TCP three-way handshake", back: "<strong>SYN</strong> (client: let's talk) &rarr; <strong>SYN-ACK</strong> (server: I hear you) &rarr; <strong>ACK</strong> (client: beginning now). Then data flows. A flood of half-open SYNs is a SYN-flood DoS." },
    { front: "What does DNS do?", back: "The <strong>Domain Name System</strong> translates human names (example.com) into IP addresses computers can connect to. Nearly every connection starts with a DNS lookup." },
    { front: "The CIA triad", back: "<strong>Confidentiality</strong> (keep secret), <strong>Integrity</strong> (keep accurate/untampered), <strong>Availability</strong> (keep usable). Every control protects at least one of these." },
    { front: "Authentication vs authorization", back: "<strong>Authentication</strong> = proving who you are (passport). <strong>Authorization</strong> = what you're allowed to do once proven (boarding pass to your seat, not the cockpit)." },
    { front: "Hashing vs encryption vs encoding", back: "<strong>Hashing</strong> = one-way fingerprint (integrity, passwords). <strong>Encryption</strong> = reversible with a key (confidentiality). <strong>Encoding</strong> = trivially reversible formatting, not security." },
    { front: "IdP, SSO, MFA, tenant", back: "An <strong>identity provider</strong> verifies and vouches for who you are. <strong>SSO</strong> = sign in once, reach many apps. <strong>MFA</strong> = two or more kinds of proof. A <strong>tenant</strong> = your isolated space in a shared cloud." }
  ]
});
