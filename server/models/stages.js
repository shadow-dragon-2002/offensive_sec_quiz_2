export const stages = [
  // RECONNAISSANCE (Stages 1-6)
  {
    id: 1,
    phase: "RECONNAISSANCE",
    title: "Port Scanning Fundamentals",
    description: "Identifying network entry points during initial reconnaissance",
    question: "What is the primary purpose of a SYN scan in network reconnaissance?",
    options: [
      "To identify open ports without completing the TCP handshake, making it stealthier",
      "To establish full connections with all ports to determine service versions",
      "To encrypt network traffic during the reconnaissance phase",
      "To automatically exploit any vulnerable services discovered on open ports"
    ],
    correctAnswer: 0,
    points: 100
  },
  {
    id: 2,
    phase: "RECONNAISSANCE",
    title: "Network Enumeration Tools",
    description: "Selecting appropriate tools for information gathering",
    question: "Which tool is specifically designed for passive network reconnaissance without sending packets to the target?",
    options: [
      "Nmap with aggressive scanning (-A flag)",
      "Shodan search engine for internet-connected devices",
      "Metasploit Framework with auxiliary scanners",
      "Wireshark with active network injection enabled"
    ],
    correctAnswer: 1,
    points: 150
  },
  {
    id: 3,
    phase: "RECONNAISSANCE",
    title: "OSINT Techniques",
    description: "Leveraging open-source intelligence for target profiling",
    question: "During OSINT gathering, what information source provides the most reliable technical infrastructure details about a target organization?",
    options: [
      "Social media profiles of employees on LinkedIn and Twitter",
      "DNS records, WHOIS data, and autonomous system numbers",
      "Company press releases and marketing material on their website",
      "Job postings on career portals mentioning required skills"
    ],
    correctAnswer: 1,
    points: 150
  },
  {
    id: 4,
    phase: "RECONNAISSANCE",
    title: "Wireless Network Analysis",
    description: "Assessing wireless security during reconnaissance",
    question: "What is the primary weakness of WPA2-PSK that makes it vulnerable to offline brute-force attacks?",
    options: [
      "The SSID is broadcasted in cleartext allowing easy identification",
      "The four-way handshake can be captured and cracked offline",
      "Wireless access points automatically respond to deauth packets",
      "WPA2 uses deprecated encryption algorithms that are easily broken"
    ],
    correctAnswer: 1,
    points: 200
  },
  {
    id: 5,
    phase: "RECONNAISSANCE",
    title: "SSL/TLS Certificate Analysis",
    description: "Extracting intelligence from certificate transparency logs",
    question: "Why are Certificate Transparency (CT) logs valuable during reconnaissance?",
    options: [
      "They provide historical password hashes for domain administrators",
      "They reveal all subdomains and internal hostnames for a target",
      "They contain source code repositories of web applications",
      "They automatically decrypt HTTPS traffic for penetration testers"
    ],
    correctAnswer: 1,
    points: 200
  },
  {
    id: 6,
    phase: "RECONNAISSANCE",
    title: "Physical Security Assessment",
    description: "Identifying physical access vulnerabilities",
    question: "What physical security measure provides the LEAST protection against tailgating attacks?",
    options: [
      "Security guards stationed at all building entrances 24/7",
      "Turnstiles with badge readers requiring individual authentication",
      "Security cameras recording all entry and exit points continuously",
      "Mantrap vestibules with double-door interlocking mechanisms"
    ],
    correctAnswer: 2,
    points: 150
  },

  // SCANNING (Stages 7-11)
  {
    id: 7,
    phase: "SCANNING",
    title: "Vulnerability Scanner Methodology",
    description: "Understanding automated vulnerability detection limitations",
    question: "What is the primary limitation of automated vulnerability scanners compared to manual testing?",
    options: [
      "They cannot detect any vulnerabilities in modern web applications",
      "They struggle with business logic flaws and context-dependent issues",
      "They require root access on the target system to function properly",
      "They automatically exploit all discovered vulnerabilities without permission"
    ],
    correctAnswer: 1,
    points: 150
  },
  {
    id: 8,
    phase: "SCANNING",
    title: "API Security Testing",
    description: "Identifying API endpoint vulnerabilities",
    question: "Which technique is most effective for discovering hidden API endpoints during security testing?",
    options: [
      "Analyzing JavaScript files and mobile app binaries for API calls",
      "Sending random SQL injection payloads to known endpoints only",
      "Using only the official API documentation provided by developers",
      "Performing DDoS attacks to trigger error messages with hidden paths"
    ],
    correctAnswer: 0,
    points: 200
  },
  {
    id: 9,
    phase: "SCANNING",
    title: "Service Enumeration",
    description: "Extracting detailed service information",
    question: "What Nmap NSE script provides the most comprehensive SMB enumeration without authentication?",
    options: [
      "smb-vuln-ms17-010 for detecting EternalBlue vulnerability only",
      "smb-enum-shares which requires valid domain credentials first",
      "smb-os-discovery to identify OS version and computer name",
      "smb-brute-force for automated password guessing on accounts"
    ],
    correctAnswer: 2,
    points: 200
  },
  {
    id: 10,
    phase: "SCANNING",
    title: "NoSQL Injection Detection",
    description: "Identifying NoSQL database injection points",
    question: "Which payload is most effective for detecting MongoDB NoSQL injection in login forms?",
    options: [
      "username[$ne]=null&password[$ne]=null to bypass authentication",
      "username=admin'--&password=anything for SQL comment injection",
      "username=<script>alert(1)</script> for XSS vulnerability testing",
      "username=../../etc/passwd for path traversal detection"
    ],
    correctAnswer: 0,
    points: 250
  },
  {
    id: 11,
    phase: "SCANNING",
    title: "Network Topology Mapping",
    description: "Understanding network architecture through scanning",
    question: "What technique reveals internal network topology from an external position without exploiting vulnerabilities?",
    options: [
      "Analyzing TTL values and traceroute responses to infer routing",
      "Brute-forcing SSH credentials to access internal routers directly",
      "Exploiting buffer overflows in edge firewall devices for access",
      "Social engineering employees to provide network diagrams willingly"
    ],
    correctAnswer: 0,
    points: 200
  },

  // EXPLOITATION (Stages 12-18)
  {
    id: 12,
    phase: "EXPLOITATION",
    title: "SQL Injection - Authentication Bypass",
    description: "Exploiting database query vulnerabilities",
    question: "Which SQL injection payload is most likely to bypass a login form checking username and password?",
    options: [
      "admin' OR '1'='1' -- to make the WHERE clause always true",
      "admin\"); DROP TABLE users; -- to delete the database table",
      "admin<script>alert('XSS')</script> to test for XSS vulnerabilities",
      "admin' AND SLEEP(10) -- to perform time-based blind injection"
    ],
    correctAnswer: 0,
    points: 200
  },
  {
    id: 13,
    phase: "EXPLOITATION",
    title: "Cross-Site Scripting (XSS) Exploitation",
    description: "Executing malicious scripts in victim browsers",
    question: "What is the primary difference between reflected and stored XSS attacks?",
    options: [
      "Reflected XSS requires user interaction while stored XSS is automatic",
      "Stored XSS persists in database and affects all users visiting the page",
      "Reflected XSS is more dangerous because it bypasses all filters",
      "Stored XSS only works on localhost while reflected works remotely"
    ],
    correctAnswer: 1,
    points: 200
  },
  {
    id: 14,
    phase: "EXPLOITATION",
    title: "Remote Code Execution (RCE)",
    description: "Achieving arbitrary code execution on target systems",
    question: "In a PHP web application, which vulnerability most commonly leads to Remote Code Execution?",
    options: [
      "Improper output encoding allowing HTML injection in responses",
      "Unvalidated file uploads accepting executable PHP webshells",
      "Missing HTTPS encryption on login forms transmitting credentials",
      "Verbose error messages revealing internal file paths to users"
    ],
    correctAnswer: 1,
    points: 300
  },
  {
    id: 15,
    phase: "EXPLOITATION",
    title: "Server-Side Request Forgery (SSRF)",
    description: "Forcing servers to make unintended requests",
    question: "What makes SSRF vulnerabilities particularly dangerous in cloud environments?",
    options: [
      "They allow attackers to change DNS records for the domain permanently",
      "They enable access to metadata endpoints exposing cloud credentials",
      "They automatically grant root access to all virtual machines instantly",
      "They corrupt the cloud provider's infrastructure affecting all customers"
    ],
    correctAnswer: 1,
    points: 300
  },
  {
    id: 16,
    phase: "EXPLOITATION",
    title: "JWT Algorithm Confusion",
    description: "Exploiting JSON Web Token implementation flaws",
    question: "How does the JWT algorithm confusion attack (alg: none) bypass authentication?",
    options: [
      "It removes the signature verification by changing algorithm to 'none'",
      "It encrypts the token payload preventing server from reading claims",
      "It sets the expiration date to year 2099 making tokens never expire",
      "It changes the user role in the token without needing cryptographic keys"
    ],
    correctAnswer: 0,
    points: 350
  },
  {
    id: 17,
    phase: "EXPLOITATION",
    title: "Deserialization Attacks",
    description: "Exploiting unsafe object deserialization",
    question: "Why is deserializing untrusted data particularly dangerous in Java applications?",
    options: [
      "It causes memory leaks that crash the application after some time",
      "It allows attackers to instantiate arbitrary classes leading to RCE",
      "It exposes source code of the application to unauthorized users",
      "It disables all authentication mechanisms temporarily for testing"
    ],
    correctAnswer: 1,
    points: 350
  },
  {
    id: 18,
    phase: "EXPLOITATION",
    title: "XML External Entity (XXE) Injection",
    description: "Exploiting XML parsers to read arbitrary files",
    question: "What is the primary goal of an XXE attack against an XML parser?",
    options: [
      "To modify XML schema definitions changing application behavior",
      "To read local files or trigger SSRF via external entity resolution",
      "To inject JavaScript code that executes in users' browsers",
      "To perform SQL injection through XML attribute values only"
    ],
    correctAnswer: 1,
    points: 300
  },

  // PRIVILEGE_ESCALATION (Stages 19-23)
  {
    id: 19,
    phase: "PRIVILEGE_ESCALATION",
    title: "Linux Privilege Escalation Basics",
    description: "Elevating access on compromised Linux systems",
    question: "What is the first step in a methodical Linux privilege escalation after gaining initial access?",
    options: [
      "Immediately running a kernel exploit without testing it first",
      "Enumerating SUID binaries, sudo permissions, and cron jobs",
      "Installing a rootkit to maintain persistence before escalating",
      "Deleting all log files to cover tracks of the initial compromise"
    ],
    correctAnswer: 1,
    points: 200
  },
  {
    id: 20,
    phase: "PRIVILEGE_ESCALATION",
    title: "SUID Binary Exploitation",
    description: "Abusing setuid binaries for privilege elevation",
    question: "Which SUID binary is commonly misconfigured and exploitable for privilege escalation?",
    options: [
      "/bin/ls which lists directory contents for all users safely",
      "/usr/bin/find which can execute commands with elevated privileges",
      "/bin/cat which displays file contents without modification rights",
      "/usr/bin/who which shows currently logged in users harmlessly"
    ],
    correctAnswer: 1,
    points: 250
  },
  {
    id: 21,
    phase: "PRIVILEGE_ESCALATION",
    title: "Sudo Misconfiguration",
    description: "Exploiting improper sudo rules",
    question: "What sudo misconfiguration allows privilege escalation via environment variables?",
    options: [
      "Allowing all users to run 'sudo apt update' for system updates",
      "Permitting 'sudo -l' command to list available sudo permissions",
      "Enabling NOPASSWD for scripts that don't sanitize PATH variable",
      "Requiring password authentication for every sudo command executed"
    ],
    correctAnswer: 2,
    points: 300
  },
  {
    id: 22,
    phase: "PRIVILEGE_ESCALATION",
    title: "Windows Token Impersonation",
    description: "Stealing authentication tokens on Windows",
    question: "What Windows privilege is required to perform token impersonation attacks?",
    options: [
      "SeDebugPrivilege which allows debugging of processes and reading memory",
      "SeShutdownPrivilege which only controls system shutdown operations",
      "SeTimeZonePrivilege which changes time zone settings exclusively",
      "SeRemoteShutdownPrivilege for shutting down remote computers only"
    ],
    correctAnswer: 0,
    points: 350
  },
  {
    id: 23,
    phase: "PRIVILEGE_ESCALATION",
    title: "Kernel Exploit Assessment",
    description: "Evaluating kernel vulnerabilities for escalation",
    question: "Why should kernel exploits be used as a last resort during privilege escalation?",
    options: [
      "They are guaranteed to fail on all modern operating systems always",
      "They can cause system instability or crashes affecting all users",
      "They require physical access to the server's console for execution",
      "They only work during specific hours based on system uptime"
    ],
    correctAnswer: 1,
    points: 250
  },

  // LATERAL_MOVEMENT (Stages 24-27)
  {
    id: 24,
    phase: "LATERAL_MOVEMENT",
    title: "Lateral Movement Fundamentals",
    description: "Moving through compromised networks",
    question: "What is the primary goal of lateral movement after initial compromise?",
    options: [
      "To immediately exfiltrate all data from the initially compromised system",
      "To access additional systems and escalate to domain administrator level",
      "To install cryptominers on every discovered system for profit",
      "To delete all security logs preventing incident response teams"
    ],
    correctAnswer: 1,
    points: 200
  },
  {
    id: 25,
    phase: "LATERAL_MOVEMENT",
    title: "Kerberoasting Attack",
    description: "Extracting service account credentials",
    question: "What makes Kerberoasting effective against Active Directory environments?",
    options: [
      "It requires domain admin privileges before extracting any tickets",
      "It requests encrypted service tickets crackable offline without detection",
      "It automatically grants domain admin access without cracking passwords",
      "It disables all security monitoring tools on domain controllers permanently"
    ],
    correctAnswer: 1,
    points: 300
  },
  {
    id: 26,
    phase: "LATERAL_MOVEMENT",
    title: "Pass-the-Hash Technique",
    description: "Authenticating with password hashes",
    question: "Why is Pass-the-Hash effective even when plaintext passwords are unknown?",
    options: [
      "It generates valid passwords from NTLM hashes using rainbow tables",
      "It authenticates using captured NTLM hashes without knowing passwords",
      "It forces domain controllers to reset all user passwords automatically",
      "It disables Windows authentication requiring physical key cards only"
    ],
    correctAnswer: 1,
    points: 300
  },
  {
    id: 27,
    phase: "LATERAL_MOVEMENT",
    title: "SMB Relay Attacks",
    description: "Relaying authentication attempts",
    question: "What Windows protocol configuration makes SMB relay attacks possible?",
    options: [
      "Enabling SMB signing on all servers prevents relay attacks entirely",
      "Disabling SMB signing allows relaying authentication to other hosts",
      "Using NTLMv2 authentication automatically prevents all relay attacks",
      "Installing Windows updates blocks SMB protocol from functioning fully"
    ],
    correctAnswer: 1,
    points: 350
  },

  // EXFILTRATION (Stages 28-30)
  {
    id: 28,
    phase: "EXFILTRATION",
    title: "Data Exfiltration Methods",
    description: "Extracting data from compromised networks",
    question: "Which data exfiltration technique is hardest for network monitoring to detect?",
    options: [
      "Uploading gigabytes of data via FTP on port 21 during business hours",
      "Sending encrypted data over HTTPS to legitimate cloud storage services",
      "Using ICMP ping packets with large payloads continuously for hours",
      "Emailing entire databases as attachments to external email addresses"
    ],
    correctAnswer: 1,
    points: 300
  },
  {
    id: 29,
    phase: "EXFILTRATION",
    title: "DNS Tunneling",
    description: "Covert data exfiltration via DNS queries",
    question: "Why is DNS tunneling effective for bypassing network restrictions?",
    options: [
      "DNS traffic is usually allowed outbound and rarely inspected deeply",
      "DNS automatically encrypts all traffic preventing any inspection",
      "DNS queries can transmit terabytes of data in single requests",
      "DNS servers automatically delete logs of all queries immediately"
    ],
    correctAnswer: 0,
    points: 350
  },
  {
    id: 30,
    phase: "EXFILTRATION",
    title: "Steganography Techniques",
    description: "Hiding data within innocuous files",
    question: "What makes steganography useful for covert data exfiltration?",
    options: [
      "It encrypts data so strongly that no algorithm can ever decrypt it",
      "It embeds data within images or files appearing normal to inspection",
      "It automatically transfers files at speeds faster than normal protocols",
      "It requires no tools and can be done mentally without computers"
    ],
    correctAnswer: 1,
    points: 400
  }
];
