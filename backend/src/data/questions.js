// 30 Progressive Offensive Security Questions
// Categories: Reconnaissance, Exploitation, Post-Exploitation, Privilege Escalation, Persistence

const questions = [
  // Level 1-5: Basic Reconnaissance
  {
    id: 1,
    level: 1,
    category: "Reconnaissance",
    question: "What does OSINT stand for in cybersecurity?",
    options: [
      "Open Source Intelligence",
      "Operating System Integration",
      "Online Security Interface",
      "Operational System Information"
    ],
    correctAnswer: 0,
    difficulty: "easy",
    points: 10
  },
  {
    id: 2,
    level: 2,
    category: "Reconnaissance",
    question: "Which tool is commonly used for network scanning and port discovery?",
    options: ["Wireshark", "Nmap", "Burp Suite", "Metasploit"],
    correctAnswer: 1,
    difficulty: "easy",
    points: 10
  },
  {
    id: 3,
    level: 3,
    category: "Reconnaissance",
    question: "What protocol does the 'ping' command use to test network connectivity?",
    options: ["TCP", "UDP", "ICMP", "HTTP"],
    correctAnswer: 2,
    difficulty: "easy",
    points: 10
  },
  {
    id: 4,
    level: 4,
    category: "Reconnaissance",
    question: "Which Nmap flag performs a SYN stealth scan?",
    options: ["-sT", "-sS", "-sU", "-sV"],
    correctAnswer: 1,
    difficulty: "easy",
    points: 15
  },
  {
    id: 5,
    level: 5,
    category: "Reconnaissance",
    question: "What is the purpose of DNS enumeration in offensive security?",
    options: [
      "To encrypt DNS traffic",
      "To discover subdomains and network infrastructure",
      "To block DNS queries",
      "To speed up DNS resolution"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    points: 15
  },

  // Level 6-10: Web Application Security
  {
    id: 6,
    level: 6,
    category: "Web Exploitation",
    question: "What does XSS stand for in web application security?",
    options: [
      "Cross-Site Scripting",
      "External Security System",
      "XML Security Standard",
      "X-ray Security Scan"
    ],
    correctAnswer: 0,
    difficulty: "easy",
    points: 10
  },
  {
    id: 7,
    level: 7,
    category: "Web Exploitation",
    question: "Which HTTP method is typically used in a CSRF attack?",
    options: ["GET and POST", "PUT", "DELETE", "OPTIONS"],
    correctAnswer: 0,
    difficulty: "medium",
    points: 15
  },
  {
    id: 8,
    level: 8,
    category: "Web Exploitation",
    question: "What is SQL injection primarily used to exploit?",
    options: [
      "Operating system vulnerabilities",
      "Database queries",
      "Network protocols",
      "Firewall rules"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    points: 15
  },
  {
    id: 9,
    level: 9,
    category: "Web Exploitation",
    question: "Which tool is most commonly used for intercepting and modifying web traffic?",
    options: ["Nmap", "Wireshark", "Burp Suite", "Aircrack-ng"],
    correctAnswer: 2,
    difficulty: "medium",
    points: 20
  },
  {
    id: 10,
    level: 10,
    category: "Web Exploitation",
    question: "What does the OWASP Top 10 represent?",
    options: [
      "Top 10 hacking tools",
      "Top 10 most critical web application security risks",
      "Top 10 programming languages",
      "Top 10 security certifications"
    ],
    correctAnswer: 1,
    difficulty: "easy",
    points: 10
  },

  // Level 11-15: Exploitation Techniques
  {
    id: 11,
    level: 11,
    category: "Exploitation",
    question: "What is a buffer overflow attack?",
    options: [
      "Flooding a network with traffic",
      "Writing data beyond the allocated memory buffer",
      "Overloading a web server",
      "Filling up disk space"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    points: 20
  },
  {
    id: 12,
    level: 12,
    category: "Exploitation",
    question: "What is Metasploit primarily used for?",
    options: [
      "Network monitoring",
      "Exploitation framework and vulnerability testing",
      "Antivirus scanning",
      "Web browsing"
    ],
    correctAnswer: 1,
    difficulty: "easy",
    points: 15
  },
  {
    id: 13,
    level: 13,
    category: "Exploitation",
    question: "What is a reverse shell?",
    options: [
      "A shell that runs backwards",
      "A connection where the target connects back to the attacker",
      "An encrypted shell session",
      "A shell with reversed permissions"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    points: 20
  },
  {
    id: 14,
    level: 14,
    category: "Exploitation",
    question: "What does RCE stand for in cybersecurity?",
    options: [
      "Remote Code Execution",
      "Reverse Connection Exploit",
      "Rapid Cyber Entry",
      "Root Command Environment"
    ],
    correctAnswer: 0,
    difficulty: "medium",
    points: 15
  },
  {
    id: 15,
    level: 15,
    category: "Exploitation",
    question: "Which technique involves exploiting a race condition in file operations?",
    options: ["TOCTOU", "XSS", "CSRF", "SQLi"],
    correctAnswer: 0,
    difficulty: "hard",
    points: 25
  },

  // Level 16-20: Post-Exploitation
  {
    id: 16,
    level: 16,
    category: "Post-Exploitation",
    question: "What is lateral movement in a network?",
    options: [
      "Moving files between servers",
      "Moving from one compromised system to another within a network",
      "Physical movement of servers",
      "Load balancing traffic"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    points: 20
  },
  {
    id: 17,
    level: 17,
    category: "Post-Exploitation",
    question: "What is Mimikatz commonly used for?",
    options: [
      "Network scanning",
      "Extracting passwords and credentials from Windows",
      "Web vulnerability scanning",
      "Packet sniffing"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    points: 20
  },
  {
    id: 18,
    level: 18,
    category: "Post-Exploitation",
    question: "What is data exfiltration?",
    options: [
      "Encrypting data on a system",
      "Unauthorized transfer of data from a compromised system",
      "Deleting system logs",
      "Creating backup copies"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    points: 20
  },
  {
    id: 19,
    level: 19,
    category: "Post-Exploitation",
    question: "What is the purpose of covering tracks after exploitation?",
    options: [
      "To improve system performance",
      "To remove evidence of compromise and maintain access",
      "To install security updates",
      "To optimize network traffic"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    points: 20
  },
  {
    id: 20,
    level: 20,
    category: "Post-Exploitation",
    question: "What is pivoting in penetration testing?",
    options: [
      "Changing attack strategies",
      "Using a compromised system as a base to attack other systems",
      "Rotating between different tools",
      "Switching network interfaces"
    ],
    correctAnswer: 1,
    difficulty: "hard",
    points: 25
  },

  // Level 21-25: Privilege Escalation
  {
    id: 21,
    level: 21,
    category: "Privilege Escalation",
    question: "What is the goal of privilege escalation?",
    options: [
      "To gain higher-level access than initially obtained",
      "To increase network bandwidth",
      "To improve system performance",
      "To reduce security levels"
    ],
    correctAnswer: 0,
    difficulty: "easy",
    points: 15
  },
  {
    id: 22,
    level: 22,
    category: "Privilege Escalation",
    question: "What is a SUID binary in Linux privilege escalation?",
    options: [
      "A system utility for installation",
      "A file that runs with the permissions of its owner",
      "A network protocol",
      "A disk encryption tool"
    ],
    correctAnswer: 1,
    difficulty: "hard",
    points: 25
  },
  {
    id: 23,
    level: 23,
    category: "Privilege Escalation",
    question: "Which Windows command shows current user privileges?",
    options: ["ipconfig", "netstat", "whoami /priv", "tasklist"],
    correctAnswer: 2,
    difficulty: "medium",
    points: 20
  },
  {
    id: 24,
    level: 24,
    category: "Privilege Escalation",
    question: "What is kernel exploitation used for?",
    options: [
      "Updating the operating system",
      "Gaining root/system level access by exploiting OS vulnerabilities",
      "Improving kernel performance",
      "Installing device drivers"
    ],
    correctAnswer: 1,
    difficulty: "hard",
    points: 25
  },
  {
    id: 25,
    level: 25,
    category: "Privilege Escalation",
    question: "What is DLL hijacking?",
    options: [
      "Deleting library files",
      "Replacing legitimate DLLs with malicious ones to execute code",
      "Downloading libraries",
      "Compressing DLL files"
    ],
    correctAnswer: 1,
    difficulty: "hard",
    points: 25
  },

  // Level 26-30: Advanced Topics & Persistence
  {
    id: 26,
    level: 26,
    category: "Persistence",
    question: "What is persistence in offensive security?",
    options: [
      "Continuously scanning a network",
      "Maintaining long-term access to a compromised system",
      "Keeping services running",
      "Storing data permanently"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    points: 20
  },
  {
    id: 27,
    level: 27,
    category: "Persistence",
    question: "Which Windows registry key is commonly used for persistence?",
    options: [
      "HKEY_USERS",
      "HKEY_CURRENT_CONFIG",
      "HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
      "HKEY_CLASSES_ROOT"
    ],
    correctAnswer: 2,
    difficulty: "hard",
    points: 25
  },
  {
    id: 28,
    level: 28,
    category: "Advanced",
    question: "What is a zero-day exploit?",
    options: [
      "An exploit that takes zero days to develop",
      "A vulnerability unknown to the software vendor",
      "An exploit that only works on day zero",
      "A patched vulnerability"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    points: 20
  },
  {
    id: 29,
    level: 29,
    category: "Advanced",
    question: "What is the purpose of a Command and Control (C2) server?",
    options: [
      "To control website content",
      "To manage compromised systems remotely",
      "To coordinate network traffic",
      "To control access permissions"
    ],
    correctAnswer: 1,
    difficulty: "hard",
    points: 25
  },
  {
    id: 30,
    level: 30,
    category: "Advanced",
    question: "What is Advanced Persistent Threat (APT)?",
    options: [
      "A new type of malware",
      "A prolonged and targeted cyberattack by sophisticated threat actors",
      "An automated penetration testing tool",
      "A network protocol"
    ],
    correctAnswer: 1,
    difficulty: "hard",
    points: 30
  }
];

module.exports = questions;
