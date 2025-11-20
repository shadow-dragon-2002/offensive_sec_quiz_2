/**
 * 30 Progressive Offensive Security Questions
 * Organized into 6 Attack Phases (5 questions each)
 * Point values: 100-500 based on difficulty
 */

const stages = [
  // ============================================================
  // PHASE 1: RECONNAISSANCE (Stages 1-6)
  // ============================================================
  {
    id: 1,
    phase: "RECONNAISSANCE",
    title: "Port Scanning Fundamentals",
    description: "Understanding network reconnaissance techniques for target discovery",
    question: "What is the primary purpose of conducting a port scan during the reconnaissance phase of a penetration test?",
    options: [
      "To identify open ports and services running on a target system for potential vulnerabilities",
      "To install backdoors on the target system for later exploitation phases",
      "To encrypt all network traffic between the attacker and target system",
      "To automatically patch vulnerabilities found on the target system"
    ],
    correctAnswer: 0,
    points: 100
  },
  {
    id: 2,
    phase: "RECONNAISSANCE",
    title: "Stealth Scanning Techniques",
    description: "Advanced methods for evading detection during network reconnaissance",
    question: "Which Nmap scan type sends a SYN packet and waits for a SYN-ACK response, making it harder to detect than a full TCP connection scan?",
    options: [
      "TCP Connect Scan (-sT) which completes the three-way handshake fully",
      "SYN Stealth Scan (-sS) which never completes the connection establishment",
      "UDP Scan (-sU) which uses connectionless protocol for port discovery",
      "FIN Scan (-sF) which sends FIN packets to closed ports only"
    ],
    correctAnswer: 1,
    points: 150
  },
  {
    id: 3,
    phase: "RECONNAISSANCE",
    title: "OSINT and Information Gathering",
    description: "Collecting intelligence from publicly available sources",
    question: "During OSINT (Open Source Intelligence) gathering, which technique would be MOST effective for discovering hidden subdomains of a target organization?",
    options: [
      "Performing a simple Google search for the company name and products",
      "Using DNS zone transfer requests and certificate transparency logs analysis",
      "Sending phishing emails to employees to gather internal information",
      "Scanning all IP addresses in the organization's network range sequentially"
    ],
    correctAnswer: 1,
    points: 200
  },
  {
    id: 4,
    phase: "RECONNAISSANCE",
    title: "Wireless Network Reconnaissance",
    description: "Identifying and analyzing wireless access points and security",
    question: "When performing wireless reconnaissance, what does a deauthentication attack during WPA2 handshake capture accomplish?",
    options: [
      "It permanently disables the wireless access point's broadcasting capability",
      "It forces clients to reconnect, allowing capture of the four-way handshake for offline cracking",
      "It automatically cracks the WPA2 password and provides network access immediately",
      "It upgrades the access point's security from WPA2 to WPA3 encryption"
    ],
    correctAnswer: 1,
    points: 250
  },
  {
    id: 5,
    phase: "RECONNAISSANCE",
    title: "SSL/TLS Certificate Analysis",
    description: "Extracting information from security certificates",
    question: "What valuable reconnaissance information can be extracted from analyzing an organization's SSL/TLS certificates?",
    options: [
      "The private keys used for encrypting all organizational communications",
      "Employee social security numbers and financial account information",
      "Subdomains, alternative names, and infrastructure details listed in certificate metadata",
      "Real-time packet contents of all encrypted HTTPS communications"
    ],
    correctAnswer: 2,
    points: 200
  },
  {
    id: 6,
    phase: "RECONNAISSANCE",
    title: "Physical Security Testing",
    description: "Assessing physical access controls and vulnerabilities",
    question: "In a physical penetration test, what is 'tailgating' and why is it an effective social engineering technique?",
    options: [
      "Following a vehicle closely to read its license plate for database lookups",
      "Following an authorized person through a secure door without proper authentication, exploiting human courtesy",
      "Installing a GPS tracker on an employee's car to monitor their movements",
      "Stealing the tail section of an employee badge to create a counterfeit"
    ],
    correctAnswer: 1,
    points: 150
  },

  // ============================================================
  // PHASE 2: SCANNING (Stages 7-11)
  // ============================================================
  {
    id: 7,
    phase: "SCANNING",
    title: "Vulnerability Scanner Fundamentals",
    description: "Automated tools for identifying system weaknesses",
    question: "When using vulnerability scanners like Nessus or OpenVAS, what is the primary advantage of authenticated scans over unauthenticated scans?",
    options: [
      "Authenticated scans run faster because they skip unnecessary network packets",
      "Authenticated scans can access system internals to detect missing patches and configuration issues more accurately",
      "Authenticated scans automatically fix all vulnerabilities they discover in real-time",
      "Authenticated scans are completely undetectable by intrusion detection systems"
    ],
    correctAnswer: 1,
    points: 150
  },
  {
    id: 8,
    phase: "SCANNING",
    title: "API Security Testing",
    description: "Identifying vulnerabilities in REST and GraphQL APIs",
    question: "What type of vulnerability is most commonly found when testing REST APIs that lack proper input validation and rate limiting?",
    options: [
      "Buffer overflow attacks that crash the entire API server infrastructure",
      "Mass assignment vulnerabilities allowing modification of unintended object properties",
      "SQL injection only in database queries with no other security implications",
      "Physical memory corruption leading to complete system compromise"
    ],
    correctAnswer: 1,
    points: 200
  },
  {
    id: 9,
    phase: "SCANNING",
    title: "Service Enumeration",
    description: "Identifying versions and configurations of running services",
    question: "During service enumeration, you discover an SMB service running on port 445. Which enumeration technique would reveal user accounts without credentials?",
    options: [
      "Performing a full port scan on all 65535 ports simultaneously",
      "Using null session enumeration to list users via RPC and IPC$ share",
      "Sending ICMP echo requests to determine if the host is alive",
      "Installing a keylogger on the target system to capture passwords"
    ],
    correctAnswer: 1,
    points: 250
  },
  {
    id: 10,
    phase: "SCANNING",
    title: "NoSQL Injection Techniques",
    description: "Exploiting NoSQL databases through injection attacks",
    question: "In a MongoDB-based application, which payload would bypass authentication by exploiting NoSQL injection if the login query uses JSON?",
    options: [
      "username=admin' OR '1'='1 which is traditional SQL injection syntax",
      "username[$ne]=invalid&password[$ne]=invalid to match not-equal operators",
      "username=<script>alert('XSS')</script> for cross-site scripting",
      "username=admin--comment which comments out the password check"
    ],
    correctAnswer: 1,
    points: 300
  },
  {
    id: 11,
    phase: "SCANNING",
    title: "Network Topology Mapping",
    description: "Understanding network architecture and segmentation",
    question: "What technique combines traceroute results with OSINT to create a comprehensive map of an organization's network topology?",
    options: [
      "Running a single ping command to the organization's main website",
      "Analyzing TTL values, hop counts, and correlating with BGP routing data",
      "Guessing IP addresses randomly until one responds to requests",
      "Installing network monitoring software on employee workstations"
    ],
    correctAnswer: 1,
    points: 250
  },

  // ============================================================
  // PHASE 3: EXPLOITATION (Stages 12-18)
  // ============================================================
  {
    id: 12,
    phase: "EXPLOITATION",
    title: "SQL Injection - Authentication Bypass",
    description: "Exploiting database queries to gain unauthorized access",
    question: "Given a login form vulnerable to SQL injection, which payload would most likely bypass authentication in a typical 'SELECT * FROM users WHERE username='$user' AND password='$pass'' query?",
    options: [
      "username=user&password=pass123 which tries common credentials normally",
      "username=admin' OR '1'='1'--&password=anything to make condition always true",
      "username=<img src=x>&password=<script>alert(1)</script> for XSS",
      "username=../../etc/passwd&password=root for path traversal"
    ],
    correctAnswer: 1,
    points: 200
  },
  {
    id: 13,
    phase: "EXPLOITATION",
    title: "SQL Injection - Data Extraction",
    description: "Using UNION queries to extract sensitive information",
    question: "In SQL injection, what is the purpose of using UNION SELECT statements, and what must be true for them to work successfully?",
    options: [
      "UNION combines two tables permanently, and both must have identical names",
      "UNION merges query results, requiring the same number of columns with compatible data types",
      "UNION encrypts the query output, requiring a decryption key for access",
      "UNION deletes all records from both tables simultaneously without logging"
    ],
    correctAnswer: 1,
    points: 300
  },
  {
    id: 14,
    phase: "EXPLOITATION",
    title: "Cross-Site Scripting (XSS)",
    description: "Injecting malicious scripts into web applications",
    question: "What distinguishes Stored (Persistent) XSS from Reflected XSS in terms of attack persistence and risk?",
    options: [
      "Stored XSS is saved in the database and executes for all users viewing the content; Reflected XSS requires victim interaction with a malicious link",
      "Stored XSS only affects the attacker's browser; Reflected XSS compromises the entire server",
      "Stored XSS is completely harmless; Reflected XSS gives full administrative access",
      "Stored XSS runs only once; Reflected XSS persists forever in browser cache"
    ],
    correctAnswer: 0,
    points: 250
  },
  {
    id: 15,
    phase: "EXPLOITATION",
    title: "Remote Code Execution (RCE)",
    description: "Achieving arbitrary command execution on target systems",
    question: "In a PHP web application with unrestricted file upload, how would you achieve remote code execution?",
    options: [
      "Upload a text file named readme.txt with installation instructions only",
      "Upload a PHP shell disguised with double extension or bypass filters, then access it via web browser to execute commands",
      "Upload a Microsoft Word document containing your resume and cover letter",
      "Upload a valid image file and hope it automatically grants administrator access"
    ],
    correctAnswer: 1,
    points: 350
  },
  {
    id: 16,
    phase: "EXPLOITATION",
    title: "Server-Side Request Forgery (SSRF)",
    description: "Forcing servers to make unintended requests",
    question: "What makes SSRF particularly dangerous in cloud environments like AWS, and what can an attacker access?",
    options: [
      "SSRF allows reading local files only, with no network implications whatsoever",
      "SSRF can access cloud metadata endpoints (e.g., 169.254.169.254) to retrieve IAM credentials, API keys, and sensitive configuration",
      "SSRF only works on Windows servers and has no effect on Linux systems",
      "SSRF automatically installs updates on all cloud instances simultaneously"
    ],
    correctAnswer: 1,
    points: 400
  },
  {
    id: 17,
    phase: "EXPLOITATION",
    title: "JWT Token Manipulation",
    description: "Exploiting JSON Web Token implementation flaws",
    question: "What vulnerability exists when a JWT implementation accepts 'alg': 'none' in the token header, and how can it be exploited?",
    options: [
      "It enables military-grade encryption that cannot be broken by any means",
      "It allows signature verification to be bypassed, letting attackers modify token contents without proper authentication",
      "It automatically logs out all users from the application permanently",
      "It converts all user accounts to read-only mode without exceptions"
    ],
    correctAnswer: 1,
    points: 350
  },
  {
    id: 18,
    phase: "EXPLOITATION",
    title: "Insecure Deserialization",
    description: "Exploiting object deserialization vulnerabilities",
    question: "Why is deserializing untrusted data dangerous, particularly in languages like Java, Python (pickle), or PHP?",
    options: [
      "Deserialization improves application performance and enhances security significantly",
      "Malicious serialized objects can trigger arbitrary code execution during the deserialization process through magic methods or gadget chains",
      "Deserialization only affects memory usage with no security implications",
      "Deserialization automatically updates all system libraries to latest versions"
    ],
    correctAnswer: 1,
    points: 400
  },

  // ============================================================
  // PHASE 4: PRIVILEGE ESCALATION (Stages 19-23)
  // ============================================================
  {
    id: 19,
    phase: "PRIVILEGE_ESCALATION",
    title: "Linux Privilege Escalation Basics",
    description: "Gaining elevated access on Linux systems",
    question: "After gaining initial access to a Linux system as a low-privileged user, what is the first thing you should check for privilege escalation opportunities?",
    options: [
      "Immediately delete all system logs to cover tracks before enumeration",
      "Check for SUID binaries, sudo permissions, writable services, and kernel vulnerabilities using enumeration scripts",
      "Randomly try to execute 'rm -rf /' commands hoping for admin access",
      "Shut down the system and restart it in safe mode for access"
    ],
    correctAnswer: 1,
    points: 200
  },
  {
    id: 20,
    phase: "PRIVILEGE_ESCALATION",
    title: "SUID Binary Exploitation",
    description: "Leveraging misconfigured SUID permissions",
    question: "You find a SUID binary '/usr/bin/custom_tool' that executes system commands without proper input validation. How would you escalate privileges?",
    options: [
      "Delete the binary and hope that creates a security vulnerability elsewhere",
      "Exploit the binary to execute privileged commands like spawning a root shell (e.g., if it calls system() without sanitization)",
      "Rename the binary and expect to automatically become root user immediately",
      "Copy the binary to your home directory to gain its permissions"
    ],
    correctAnswer: 1,
    points: 300
  },
  {
    id: 21,
    phase: "PRIVILEGE_ESCALATION",
    title: "Sudo Misconfigurations",
    description: "Exploiting overly permissive sudo rules",
    question: "Running 'sudo -l' reveals you can execute '/usr/bin/vim' as root without a password. How does this lead to privilege escalation?",
    options: [
      "Vim cannot be used for privilege escalation under any circumstances ever",
      "Use vim's command mode to execute shell commands (e.g., :!bash or :set shell=/bin/bash :shell) to spawn a root shell",
      "Simply opening a file with vim automatically grants permanent root access",
      "Vim will crash the system, forcing it to boot into recovery mode"
    ],
    correctAnswer: 1,
    points: 350
  },
  {
    id: 22,
    phase: "PRIVILEGE_ESCALATION",
    title: "Windows Token Impersonation",
    description: "Exploiting Windows access tokens for escalation",
    question: "What is token impersonation in Windows, and which tool commonly leverages it for privilege escalation?",
    options: [
      "Token impersonation means copying coins, and no tools exist for this purpose",
      "It's stealing access tokens from privileged processes to impersonate higher-privileged accounts; tools like Incognito or Potato exploits leverage this",
      "Token impersonation only works on Windows 95 and has been patched everywhere",
      "It refers to authentication cookies in web browsers with no OS implications"
    ],
    correctAnswer: 1,
    points: 400
  },
  {
    id: 23,
    phase: "PRIVILEGE_ESCALATION",
    title: "Kernel Exploits",
    description: "Exploiting operating system kernel vulnerabilities",
    question: "When should kernel exploits be used for privilege escalation, and what are the risks?",
    options: [
      "Kernel exploits should be used first always, as they have no risks whatsoever",
      "As a last resort when other methods fail, since kernel exploits can crash systems, cause data loss, and are often detected by security tools",
      "Kernel exploits automatically fix all system vulnerabilities without side effects",
      "Kernel exploits only work on embedded systems like IoT devices exclusively"
    ],
    correctAnswer: 1,
    points: 400
  },

  // ============================================================
  // PHASE 5: LATERAL MOVEMENT (Stages 24-27)
  // ============================================================
  {
    id: 24,
    phase: "LATERAL_MOVEMENT",
    title: "Lateral Movement Fundamentals",
    description: "Moving across network segments after initial compromise",
    question: "What is the primary goal of lateral movement in a penetration test, and why is it necessary?",
    options: [
      "Lateral movement means physically relocating servers to different rooms for redundancy",
      "It involves moving from the initially compromised system to other systems in the network to access critical assets and domain controllers",
      "Lateral movement is installing antivirus software on all networked computers",
      "It refers to sideways network cable installations for better organization"
    ],
    correctAnswer: 1,
    points: 250
  },
  {
    id: 25,
    phase: "LATERAL_MOVEMENT",
    title: "Kerberoasting Attack",
    description: "Extracting and cracking service account credentials",
    question: "What is Kerberoasting, and what type of accounts does it target in Active Directory environments?",
    options: [
      "Kerberoasting is a cooking technique unrelated to cybersecurity completely",
      "It requests service tickets for service accounts with SPNs, extracts encrypted passwords, and cracks them offline to compromise service accounts",
      "Kerberoasting deletes all user accounts from Active Directory permanently",
      "It's a legitimate Windows update process that improves authentication security"
    ],
    correctAnswer: 1,
    points: 350
  },
  {
    id: 26,
    phase: "LATERAL_MOVEMENT",
    title: "Pass-the-Hash Attack",
    description: "Authenticating with stolen password hashes",
    question: "How does a Pass-the-Hash attack work, and why doesn't the attacker need to crack the password?",
    options: [
      "The attacker uses the NTLM hash directly for authentication without knowing the plaintext password, since Windows accepts hash-based authentication",
      "Pass-the-Hash means sharing passwords via email with other attackers globally",
      "The attack requires cracking every single hash before any authentication occurs",
      "Pass-the-Hash only works on Linux systems and has no Windows equivalent"
    ],
    correctAnswer: 0,
    points: 400
  },
  {
    id: 27,
    phase: "LATERAL_MOVEMENT",
    title: "SMB and PsExec",
    description: "Leveraging Windows file sharing for remote execution",
    question: "What role does the SMB protocol play in lateral movement, and how is it commonly exploited?",
    options: [
      "SMB is only used for printer sharing and cannot facilitate lateral movement",
      "SMB allows file and service sharing; attackers use it with tools like PsExec, WMI, or EternalBlue to execute commands on remote Windows systems",
      "SMB automatically blocks all lateral movement attempts without exception",
      "SMB is a Linux-only protocol that doesn't exist on Windows systems"
    ],
    correctAnswer: 1,
    points: 350
  },

  // ============================================================
  // PHASE 6: EXFILTRATION (Stages 28-30)
  // ============================================================
  {
    id: 28,
    phase: "EXFILTRATION",
    title: "Data Exfiltration Techniques",
    description: "Covertly extracting sensitive information",
    question: "Which data exfiltration method is MOST likely to evade network monitoring tools that focus on common protocols?",
    options: [
      "Sending gigabytes of data via unencrypted FTP during business hours",
      "Using DNS tunneling or ICMP covert channels to encode data in seemingly legitimate traffic",
      "Emailing all confidential files to personal Gmail accounts with subject 'SECRET DATA'",
      "Uploading files to public cloud storage with company name in folder titles"
    ],
    correctAnswer: 1,
    points: 350
  },
  {
    id: 29,
    phase: "EXFILTRATION",
    title: "Steganography",
    description: "Hiding data within innocent-looking files",
    question: "How can steganography be used for data exfiltration, and what makes it effective at evading detection?",
    options: [
      "Steganography only works with audio files and cannot hide data in images",
      "It embeds secret data within normal files (images, audio, video) so the files appear innocent to security tools while carrying hidden payloads",
      "Steganography is the study of dinosaurs and has no cybersecurity applications",
      "It automatically encrypts all network traffic without any file modification"
    ],
    correctAnswer: 1,
    points: 400
  },
  {
    id: 30,
    phase: "EXFILTRATION",
    title: "Advanced Covert Channels",
    description: "Using unconventional methods for data extraction",
    question: "In a highly monitored environment, you've compromised a blockchain smart contract platform. How could you use this for covert data exfiltration?",
    options: [
      "Smart contracts cannot be used for any security operations whatsoever",
      "Encode stolen data in blockchain transaction metadata, smart contract logs, or comments since blockchain traffic is often trusted and less monitored",
      "Smart contracts automatically alert security teams to all exfiltration attempts",
      "Blockchain technology prevents all forms of data exfiltration by design"
    ],
    correctAnswer: 1,
    points: 500
  }
];

module.exports = stages;
