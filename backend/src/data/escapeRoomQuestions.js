// 30 Challenging Cyberpunk Escape Room Puzzles
// Confusingly similar options, balanced lengths, intermediate-to-hard difficulty

const escapeRoomPuzzles = [
  {
    id: 1,
    level: 1,
    category: "Network Infiltration",
    question: "During a Man-in-the-Middle attack on HTTPS traffic, which technique allows an attacker to decrypt and inspect encrypted communications without triggering browser warnings?",
    options: [
      "Installing a self-signed certificate authority in the victim's trusted root store",
      "Installing a legitimate certificate authority from an untrusted vendor source",
      "Installing a trusted certificate authority that was compromised by the attacker",
      "Installing a self-signed certificate from the target website's hosting provider"
    ],
    correctAnswer: 0,
    difficulty: "intermediate",
    points: 50
  },
  {
    id: 2,
    level: 2,
    category: "Web Exploitation",
    question: "In a sophisticated SQL injection attack against a login form with prepared statements, which bypass technique exploits second-order SQL injection vulnerabilities?",
    options: [
      "Injecting payloads that are stored in database and executed during subsequent queries",
      "Injecting payloads that bypass input validation by encoding them in hexadecimal format",
      "Injecting payloads through HTTP headers that are processed before parameterization",
      "Injecting payloads that are concatenated with user input before database execution"
    ],
    correctAnswer: 0,
    difficulty: "intermediate",
    points: 50
  },
  {
    id: 3,
    level: 3,
    category: "Memory Corruption",
    question: "When exploiting a buffer overflow in a modern Linux system with ASLR enabled, which technique provides the most reliable method for bypassing address space randomization?",
    options: [
      "Information disclosure to leak memory addresses followed by calculating offsets dynamically",
      "Brute-forcing memory addresses by attempting multiple exploitation attempts sequentially",
      "Using return-oriented programming with gadgets from statically-linked library functions",
      "Disabling ASLR temporarily through kernel parameter modification and system reboots"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 4,
    level: 4,
    category: "Wireless Security",
    question: "During a WPA2-Enterprise penetration test, which attack vector exploits the authentication mechanism to capture credentials without cracking the PSK?",
    options: [
      "Setting up a rogue access point with the same SSID to capture RADIUS credentials",
      "Setting up a legitimate access point to intercept and decrypt wireless communications",
      "Capturing the four-way handshake and performing offline dictionary attacks on PSK",
      "Setting up a fake authentication server that mirrors the legitimate RADIUS server"
    ],
    correctAnswer: 0,
    difficulty: "intermediate",
    points: 50
  },
  {
    id: 5,
    level: 5,
    category: "Active Directory",
    question: "In an Active Directory environment, which technique allows lateral movement while avoiding detection by security monitoring tools that track process creation?",
    options: [
      "Using WMI or DCOM for remote code execution without creating new process trees",
      "Creating scheduled tasks on remote systems that execute commands at specified intervals",
      "Using PowerShell remoting with encrypted sessions to execute commands on remote hosts",
      "Injecting shellcode into existing processes using reflective DLL injection techniques"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 6,
    level: 6,
    category: "Cryptography",
    question: "When attacking an implementation of RSA with improper padding, which attack exploits the mathematical relationship between chosen ciphertexts?",
    options: [
      "Bleichenbacher's adaptive chosen-ciphertext attack on PKCS#1 v1.5 padding oracle",
      "Timing attack on RSA decryption operations to determine private key bits sequentially",
      "Fault injection attack during RSA computation to recover the private key material",
      "Lattice-based attack exploiting weak random number generation in RSA key creation"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 7,
    level: 7,
    category: "Cloud Security",
    question: "In AWS environments, which privilege escalation technique exploits misconfigured IAM policies to gain administrative access to S3 buckets?",
    options: [
      "Leveraging iam:PassRole with lambda:CreateFunction to execute code with elevated privileges",
      "Modifying bucket policies through the AWS CLI to grant public read access to objects",
      "Exploiting cross-account access configurations that allow unauthorized resource access",
      "Using stolen access keys to enumerate resources and identify misconfigured permissions"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 8,
    level: 8,
    category: "Container Security",
    question: "When escaping a Docker container to compromise the host system, which technique exploits kernel vulnerabilities through container namespaces?",
    options: [
      "Exploiting DirtyCoW or similar kernel vulnerabilities from within the container context",
      "Mounting the host filesystem into the container through Docker volume misconfigurations",
      "Using privileged container mode to access host devices and bypass namespace isolation",
      "Exploiting Docker daemon API exposure to create containers with host process namespace"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 9,
    level: 9,
    category: "API Security",
    question: "In a GraphQL API implementation, which attack technique bypasses rate limiting and extracts sensitive data through query complexity exploitation?",
    options: [
      "Crafting deeply nested queries that cause exponential database lookups and resource exhaustion",
      "Using introspection queries to map the entire schema and identify hidden data endpoints",
      "Batching multiple queries in a single request to bypass per-request rate limiting controls",
      "Exploiting field suggestions and auto-completion to discover undocumented API endpoints"
    ],
    correctAnswer: 0,
    difficulty: "intermediate",
    points: 50
  },
  {
    id: 10,
    level: 10,
    category: "Post-Exploitation",
    question: "After gaining initial access, which technique maintains persistence on a Windows system while evading EDR detection through LOLBAS abuse?",
    options: [
      "Creating WMI event subscriptions that execute PowerShell scripts on system events",
      "Modifying Windows registry Run keys to launch malicious executables at system startup",
      "Installing scheduled tasks that trigger payload execution at regular time intervals",
      "Creating Windows services that automatically start malicious code during boot sequence"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 11,
    level: 11,
    category: "Mobile Security",
    question: "When analyzing an obfuscated Android APK, which technique reveals the actual malicious behavior hidden through code virtualization?",
    options: [
      "Dynamic analysis with runtime instrumentation using Frida to hook Java methods",
      "Static analysis using JADX-GUI to decompile and examine the Dalvik bytecode",
      "Network traffic analysis to identify command and control communication patterns",
      "Emulator detection bypass combined with behavioral analysis in sandbox environment"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 12,
    level: 12,
    category: "Binary Exploitation",
    question: "In modern exploitation with DEP and CFG enabled, which technique chains vulnerabilities to achieve arbitrary code execution reliably?",
    options: [
      "Return-oriented programming followed by VirtualProtect to mark memory as executable",
      "Heap spraying combined with use-after-free to control program execution flow",
      "Format string vulnerability to overwrite GOT entries and redirect execution",
      "Stack pivoting to a controlled memory region containing shellcode payload"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 13,
    level: 13,
    category: "Forensics",
    question: "During incident response on a compromised Windows system, which artifact provides the most reliable timeline of lateral movement activities?",
    options: [
      "Windows Event ID 4624 (successful logon) correlated with network connection logs",
      "Prefetch files showing recently executed programs across different time periods",
      "Registry hives containing user activity timestamps and recently accessed resources",
      "NTFS $MFT journal entries showing file system modifications and access patterns"
    ],
    correctAnswer: 0,
    difficulty: "intermediate",
    points: 50
  },
  {
    id: 14,
    level: 14,
    category: "Social Engineering",
    question: "In a sophisticated spear-phishing campaign targeting executives, which technique increases credential harvesting success while bypassing email security?",
    options: [
      "Domain spoofing with DMARC bypass through subdomain hijacking and lookalike domains",
      "Creating convincing email templates that mimic legitimate corporate communications",
      "Embedding malicious macros in documents that exploit Microsoft Office vulnerabilities",
      "Using link shorteners and redirects to mask phishing URLs in email message bodies"
    ],
    correctAnswer: 0,
    difficulty: "intermediate",
    points: 50
  },
  {
    id: 15,
    level: 15,
    category: "Privilege Escalation",
    question: "On a Linux system with SELinux enforcing, which technique escalates privileges through exploiting trusted privileged processes?",
    options: [
      "Exploiting SUID binaries with command injection or path traversal vulnerabilities",
      "Kernel exploitation to disable SELinux enforcement and gain root access directly",
      "Sudo misconfiguration exploitation to execute commands as privileged system users",
      "Exploiting world-writable files in privileged processes' library search paths"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 16,
    level: 16,
    category: "Malware Analysis",
    question: "When reverse engineering ransomware with anti-debugging techniques, which approach reveals the encryption routine without triggering detection?",
    options: [
      "Transparent debugging using hardware breakpoints and kernel-mode debugging tools",
      "Static analysis using IDA Pro with symbolic execution to trace encryption logic",
      "Emulation in a controlled sandbox environment with modified system call handlers",
      "Manual code analysis by examining assembly instructions and identifying patterns"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 17,
    level: 17,
    category: "OSINT",
    question: "During reconnaissance for a penetration test, which technique discovers internal corporate infrastructure exposed through misconfigured services?",
    options: [
      "Shodan dorks combined with reverse IP lookup to identify internet-facing assets",
      "Google dorking to find indexed sensitive documents and configuration file backups",
      "LinkedIn scraping to build organizational charts and identify potential targets",
      "DNS zone transfers and subdomain enumeration to map the external attack surface"
    ],
    correctAnswer: 0,
    difficulty: "intermediate",
    points: 50
  },
  {
    id: 18,
    level: 18,
    category: "Password Cracking",
    question: "When cracking NTLM hashes obtained from Active Directory, which attack method provides optimal time-to-crack ratio for complex passwords?",
    options: [
      "Hybrid attack combining dictionary words with rule-based mutations and masks",
      "Rainbow table lookup for pre-computed hashes covering common password patterns",
      "Brute-force attack using GPUs with optimized hashcat kernels for NTLM algorithm",
      "Pass-the-hash attacks to reuse credentials without actually cracking the hash"
    ],
    correctAnswer: 0,
    difficulty: "intermediate",
    points: 50
  },
  {
    id: 19,
    level: 19,
    category: "Network Protocols",
    question: "In an enterprise network using 802.1X authentication, which technique bypasses port security to gain unauthorized network access?",
    options: [
      "MAC address spoofing of authenticated devices combined with VLAN hopping attacks",
      "ARP spoofing to intercept traffic between gateway and legitimate authenticated clients",
      "Rogue DHCP server deployment to assign IP addresses to unauthorized devices",
      "Physical layer attacks by tapping into ethernet cables for passive traffic capture"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 20,
    level: 20,
    category: "Steganography",
    question: "When exfiltrating data through network-based steganography, which covert channel provides maximum bandwidth while evading DLP solutions?",
    options: [
      "DNS tunneling using TXT records with base64-encoded data in subdomain queries",
      "ICMP tunneling by embedding data in echo request and reply packet payloads",
      "HTTP header manipulation to hide data in custom or unusual header field values",
      "TLS handshake manipulation to encode data in cipher suite selection patterns"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 21,
    level: 21,
    category: "IoT Hacking",
    question: "When compromising an IoT device with limited attack surface, which hardware-based technique extracts firmware for vulnerability analysis?",
    options: [
      "UART/JTAG interface exploitation to dump flash memory containing firmware image",
      "Firmware extraction through intercepted OTA update mechanism using MITM attacks",
      "Physical chip-off technique using hot air rework station to desolder flash memory",
      "Side-channel attacks monitoring power consumption during cryptographic operations"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 22,
    level: 22,
    category: "SSRF Exploitation",
    question: "In a web application vulnerable to Server-Side Request Forgery, which technique accesses internal cloud metadata services despite URL filtering?",
    options: [
      "URL encoding variations and DNS rebinding to bypass blacklist-based protections",
      "HTTP parameter pollution to confuse the URL parser and access restricted resources",
      "Using alternative IP representations like decimal, octal, or hexadecimal notation",
      "Exploiting URL redirection endpoints to indirectly access internal services"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 23,
    level: 23,
    category: "Blockchain Security",
    question: "When exploiting a smart contract vulnerability, which technique allows draining funds through reentrancy attacks on Ethereum?",
    options: [
      "Recursively calling the withdrawal function before the balance update is committed",
      "Front-running transactions by monitoring mempool and submitting higher gas prices",
      "Integer overflow in token balance calculations causing unexpected fund transfers",
      "Exploiting delegate call vulnerabilities to execute code in contract's context"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 24,
    level: 24,
    category: "Zero-Day Research",
    question: "During vulnerability research on closed-source software, which fuzzing technique discovers memory corruption bugs most efficiently?",
    options: [
      "Coverage-guided fuzzing with instrumentation to track code paths and mutations",
      "Grammar-based fuzzing using protocol specifications to generate valid test cases",
      "Mutation-based fuzzing by modifying known-good inputs with random bit flips",
      "Symbolic execution combined with constraint solving to reach deep code paths"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 25,
    level: 25,
    category: "Rootkit Development",
    question: "When implementing a kernel-mode rootkit on modern Windows, which technique hides processes from detection by security software?",
    options: [
      "Direct kernel object manipulation by unlinking EPROCESS structures from linked lists",
      "Hooking system service dispatch table to intercept and filter process enumeration",
      "Implementing minifilter driver to intercept and modify file system operations",
      "Using undocumented kernel APIs to manipulate process creation callback routines"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 26,
    level: 26,
    category: "Red Team Operations",
    question: "During a red team engagement, which C2 framework technique provides resilient command and control with domain fronting?",
    options: [
      "Routing traffic through CDN services using SNI manipulation to hide true destination",
      "Using encrypted messaging apps like Telegram as C2 channels for command delivery",
      "Implementing peer-to-peer C2 architecture with compromised hosts as relay nodes",
      "Tunneling C2 traffic through legitimate cloud services using their API endpoints"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 27,
    level: 27,
    category: "Supply Chain Attack",
    question: "In a software supply chain attack, which vector provides persistent access across multiple customer environments most effectively?",
    options: [
      "Compromising the vendor's build pipeline to inject malicious code into signed binaries",
      "Typosquatting popular package names in public repositories to distribute malware",
      "Backdooring open-source dependencies used by the target organization's software",
      "Exploiting weak code signing practices to distribute modified legitimate software"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 28,
    level: 28,
    category: "Advanced Evasion",
    question: "When bypassing advanced EDR solutions with behavioral monitoring, which technique executes malicious code without triggering heuristic detection?",
    options: [
      "Process hollowing using legitimate signed binaries as a host for injected payload",
      "Fileless malware execution entirely in memory without touching disk storage",
      "DLL sideloading to execute code through legitimate application loading process",
      "Living-off-the-land by abusing built-in Windows tools for malicious purposes"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 29,
    level: 29,
    category: "Threat Hunting",
    question: "When hunting for APT activity in enterprise logs, which indicator most reliably identifies command and control beacon traffic?",
    options: [
      "Regular outbound connections to external IPs at consistent time intervals",
      "Unusual DNS queries to newly registered or suspicious domain names",
      "Encrypted HTTPS traffic to uncommon geographic locations or IP ranges",
      "Spikes in network traffic volume during off-hours suggesting data exfiltration"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  },
  {
    id: 30,
    level: 30,
    category: "Final Challenge",
    question: "In the most sophisticated attacks combining multiple vectors, which kill chain phase is most critical for defenders to break the attack sequence?",
    options: [
      "Command and Control establishment, as it prevents exfiltration and lateral movement",
      "Initial exploitation phase, as preventing entry stops the entire attack sequence",
      "Privilege escalation stage, as it limits the attacker's access to critical resources",
      "Persistence mechanism deployment, as removing it prevents long-term compromise"
    ],
    correctAnswer: 0,
    difficulty: "hard",
    points: 50
  }
];

module.exports = escapeRoomPuzzles;
