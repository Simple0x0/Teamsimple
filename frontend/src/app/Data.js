const blogData = [
    {
        BlogID: 1,
        BlogImage: 'sudohack.jpg',
        Title: 'Root Vulnerability in Linux',
        Slug: 'root_vulnerability_in_linux',
        Content: 'More than this -- This is a short description of a root Vulnerability in Linux and explains how an attacker can exploit this vulnerability using a simple CVE. This is a short description of a root vulnerability in Linux and explains how an attacker can exploit this vulnerability using a simple CVE.',
        Summary: 'This is a short description of a root vulnerability in Linux and explains how an attacker can exploit this vulnerability using a simple CVE. This is a short description of a root vulnerability in Linux and explains how an attacker can exploit this vulnerability using a simple CVE. ',
        PublishDate: 'Feb 20, 2025',
        LastUpdated: 'Feb 25, 2025',
        Status: 'Published',
        Author: {
            AuthorID: 5,
            Name: 'Simple0x0',
            Email: 'simple0x0@example.com'
        },
        Category: {
            CategoryID: 3,
            Name: 'Cybersecurity'
        },
        Tags: ['Hacking', 'Privilege Escalation', 'Linux Exploits']
    },
    {
        BlogID: 2,
        BlogImage: 'ai_risks.jpg',
        Title: 'The Risks of AI in Cybersecurity',
        Slug: 'the_risks_of_ai_in_cybersecurity',
        Content: 'AI is revolutionizing cybersecurity, but...',
        Summary: ' AI is being used to enhance cybersecurity AI is being used to enhance cybersecurity AI is being used to enhance cybersecurity...',
        PublishDate: 'Feb 18, 2025',
        LastUpdated: 'Feb 22, 2025',
        Status: 'Published',
        Author: {
            AuthorID: 7,
            Name: 'CyberGuardian',
            Email: 'cyberguardian@example.com'
        },
        Category: {
            CategoryID: 2,
            Name: 'Artificial Intelligence'
        },
        Tags: ['AI', 'Cybersecurity', 'Machine Learning']
    },
    {
        BlogID: 3,
        BlogImage: 'malware_attacks.jpg',
        Title: 'Understanding Malware Attacks',
        Slug: 'understanding_malware_attacks',
        Content: 'Malware has been a major threat for decades...',
        Summary: 'A deep dive into the evolution of malware  malware',
        PublishDate: 'Feb 15, 2025',
        LastUpdated: 'Feb 20, 2025',
        Status: 'Published',
        Author: {
            AuthorID: 6,
            Name: 'TechNinja',
            Email: 'techninja@example.com'
        },
        Category: {
            CategoryID: 4,
            Name: 'Malware Analysis'
        },
        Tags: ['Malware', 'Cybersecurity', 'Threat Analysis']
    },
    {
        BlogID: 1,
        BlogImage: 'sudohack.jpg',
        Title: 'Root Vulnerability in Linux',
        Slug: 'root_vulnerability_in_linux',
        Content: 'More than this -- This is a short description of a root Vulnerability in Linux and explains how an attacker can exploit this vulnerability using a simple CVE. This is a short description of a root vulnerability in Linux and explains how an attacker can exploit this vulnerability using a simple CVE.',
        Summary: 'This is a short description of a root vulnerability in Linux and explains how an attacker can exploit this vulnerability using a simple CVE. This is a short description of a root vulnerability in Linux and explains how an attacker can exploit this vulnerability using a simple CVE. ',
        PublishDate: 'Feb 20, 2025',
        LastUpdated: 'Feb 25, 2025',
        Status: 'Published',
        Author: {
            AuthorID: 5,
            Name: 'Simple0x0',
            Email: 'simple0x0@example.com'
        },
        Category: {
            CategoryID: 3,
            Name: 'Cybersecurity'
        },
        Tags: ['Hacking', 'Privilege Escalation', 'Linux Exploits']
    },
    {
        BlogID: 2,
        BlogImage: 'ai_risks.jpg',
        Title: 'The Risks of AI in Cybersecurity',
        Slug: 'the_risks_of_ai_in_cybersecurity',
        Content: 'AI is revolutionizing cybersecurity, but...',
        Summary: ' AI is being used to enhance cybersecurity AI is being used to enhance cybersecurity AI is being used to enhance cybersecurity...',
        PublishDate: 'Feb 18, 2025',
        LastUpdated: 'Feb 22, 2025',
        Status: 'Published',
        Author: {
            AuthorID: 7,
            Name: 'CyberGuardian',
            Email: 'cyberguardian@example.com'
        },
        Category: {
            CategoryID: 2,
            Name: 'Artificial Intelligence'
        },
        Tags: ['AI', 'Cybersecurity', 'Machine Learning']
    },
    {
        BlogID: 3,
        BlogImage: 'malware_attacks.jpg',
        Title: 'Understanding Malware Attacks',
        Slug: 'understanding_malware_attacks',
        Content: 'Malware has been a major threat for decades...',
        Summary: 'A deep dive into the evolution of malware  malware',
        PublishDate: 'Feb 15, 2025',
        LastUpdated: 'Feb 20, 2025',
        Status: 'Published',
        Author: {
            AuthorID: 6,
            Name: 'TechNinja',
            Email: 'techninja@example.com'
        },
        Category: {
            CategoryID: 4,
            Name: 'Malware Analysis'
        },
        Tags: ['Malware', 'Cybersecurity', 'Threat Analysis']
    },
    {
        BlogID: 1,
        BlogImage: 'sudohack.jpg',
        Title: 'Root Vulnerability in Linux',
        Slug: 'root_vulnerability_in_linux',
        Content: 'More than this -- This is a short description of a root Vulnerability in Linux and explains how an attacker can exploit this vulnerability using a simple CVE. This is a short description of a root vulnerability in Linux and explains how an attacker can exploit this vulnerability using a simple CVE.',
        Summary: 'This is a short description of a root vulnerability in Linux and explains how an attacker can exploit this vulnerability using a simple CVE. This is a short description of a root vulnerability in Linux and explains how an attacker can exploit this vulnerability using a simple CVE. ',
        PublishDate: 'Feb 20, 2025',
        LastUpdated: 'Feb 25, 2025',
        Status: 'Published',
        Author: {
            AuthorID: 5,
            Name: 'Simple0x0',
            Email: 'simple0x0@example.com'
        },
        Category: {
            CategoryID: 3,
            Name: 'Cybersecurity'
        },
        Tags: ['Hacking', 'Privilege Escalation', 'Linux Exploits']
    }
];

const writeupData = [
    {
        WriteUpID: 1,
        MachineName: "HTB_001",
        OsType: "Linux",
        Slug: "htb_001_linux_machine",
        Difficulty: "Easy",
        Category: {
            CategoryID: 4,
            Name: "HackTheBox"
        },
        Tags: [
            "HTB",
            "Linux",
            "Enumeration"
        ],
        Summary: "This write-up covers the exploitation of the HTB_001 Linux machine focusing on enumeration techniques.",
        Content: "We start by scanning the machine with Nmap, followed by enumeration of open ports and services. After gaining initial access, we escalate privileges using a local vulnerability.",
        IPAddress: "192.168.1.10",
        Author: {
            AuthorID: 1,
            Name: "CyberExplorer",
            Email: "cyberexplorer@example.com"
        },
        ToolsUsed: "Nmap, Netcat, LinPEAS",
        DateCreated: "2025-02-15T10:00:00",
        DateModified: "2025-02-16T12:30:00",
        References: "https://www.exploit-db.com/exploits/1234",
        Status: "Published",
        WriteImage: "htb_001_image.png",
        TotalLikes: 25
    },
    {
        WriteUpID: 2,
        MachineName: "TryHackMe_002",
        OsType: "Windows",
        Slug: "tryhackme_002_windows_machine",
        Difficulty: "Medium",
        Category: {
            CategoryID: 5,
            Name: "TryHackMe"
        },
        Tags: [
            "TryHackMe",
            "Windows",
            "Privilege Escalation"
        ],
        Summary: "This write-up discusses the steps to escalate privileges on a TryHackMe Windows machine.",
        Content: "After scanning and identifying open ports, we found a vulnerable service that allowed us to escalate privileges. We also cover bypassing Windows Defender.",
        IPAddress: "192.168.1.20",
        Author: {
            AuthorID: 2,
            Name: "RootMaster",
            Email: "rootmaster@example.com"
        },
        ToolsUsed: "Nmap, PowerShell, Metasploit",
        DateCreated: "2025-02-18T14:00:00",
        DateModified: "2025-02-19T11:00:00",
        References: "https://www.tryhackme.com/room/002",
        Status: "Published",
        WriteImage: "thm_002_image.png",
        TotalLikes: 30
    },
    {
        WriteUpID: 3,
        MachineName: "HTB_003",
        OsType: "Linux",
        Slug: "htb_003_linux_machine",
        Difficulty: "Hard",
        Category: {
            CategoryID: 4,
            Name: "HackTheBox"
        },
        Tags: [
            "HTB",
            "Linux",
            "Buffer Overflow"
        ],
        Summary: "This write-up covers the exploitation of the HTB_003 Linux machine with a buffer overflow technique.",
        Content: "The write-up begins with an Nmap scan to identify open ports and services, followed by using a buffer overflow vulnerability to exploit the system.",
        IPAddress: "192.168.1.30",
        Author: {
            AuthorID: 3,
            Name: "VulnHunter",
            Email: "vulnhunter@example.com"
        },
        ToolsUsed: "Nmap, GDB, Python",
        DateCreated: "2025-02-20T08:30:00",
        DateModified: "2025-02-21T10:00:00",
        References: "https://www.exploit-db.com/exploits/5678",
        Status: "Published",
        WriteImage: "htb_003_image.png",
        TotalLikes: 40
    },
    {
        WriteUpID: 4,
        MachineName: "TryHackMe_003",
        OsType: "Windows",
        Slug: "tryhackme_003_windows_machine",
        Difficulty: "Hard",
        Category: {
            CategoryID: 5,
            Name: "TryHackMe"
        },
        Tags: [
            "TryHackMe",
            "Windows",
            "Remote Code Execution"
        ],
        Summary: "This write-up covers exploiting a remote code execution vulnerability on a TryHackMe Windows machine.",
        Content: "The exploitation begins with finding a vulnerable service, followed by exploiting the vulnerability to execute code remotely.",
        IPAddress: "192.168.1.40",
        Author: {
            AuthorID: 4,
            Name: "ExploitWizard",
            Email: "exploitwizard@example.com"
        },
        ToolsUsed: "Nmap, Metasploit, Python",
        DateCreated: "2025-02-22T09:00:00",
        DateModified: "2025-02-23T11:00:00",
        References: "https://www.tryhackme.com/room/003",
        Status: "Published",
        WriteImage: "thm_003_image.png",
        TotalLikes: 45
    },
    {
        WriteUpID: 5,
        MachineName: "HTB_004",
        OsType: "Linux",
        Slug: "htb_004_linux_machine",
        Difficulty: "Medium",
        Category: {
            CategoryID: 4,
            Name: "HackTheBox"
        },
        Tags: [
            "HTB",
            "Linux",
            "Privilege Escalation"
        ],
        Summary: "This write-up focuses on privilege escalation techniques on a HackTheBox Linux machine.",
        Content: "We gain initial access via a weak service and later escalate privileges using a kernel vulnerability.",
        IPAddress: "192.168.1.50",
        Author: {
            AuthorID: 5,
            Name: "CyberWarrior",
            Email: "cyberwarrior@example.com"
        },
        ToolsUsed: "Nmap, Netcat, LinPEAS",
        DateCreated: "2025-02-25T10:30:00",
        DateModified: "2025-02-26T13:00:00",
        References: "https://www.exploit-db.com/exploits/8901",
        Status: "Published",
        WriteImage: "htb_004_image.png",
        TotalLikes: 50
    }
]

const projectData = [
    {
        ProjectID: 1,
        Title: "Cybersecurity Web App",
        Slug: "cybersecurity_web_app",
        Description: "A web app for cybersecurity learning.",
        StartDate: "2025-01-01",
        EndDate: "2025-06-01",
        Status: "In Progress",
        RepoURL: "https://github.com/project-repo",
        DemoURL: "https://project-demo.com",
        ProgressPercentage: 60,
        CoverImage: "cybersecurity_app.png",
        Author: {
            AuthorID: 2,
            Name: "TechGuru",
            Email: "techguru@example.com"
        },
        Category: {
            CategoryID: 3,
            Name: "Web Development"
        },
        Tags: [
            "Cybersecurity",
            "WebApp",
            "Learning"
        ],
        TotalLikes: 45
    },
    {
        ProjectID: 2,
        Title: "Penetration Testing Framework",
        Slug: "penetration_testing_framework",
        Description: "A framework for penetration testing automation.",
        StartDate: "2024-11-15",
        EndDate: "2025-05-30",
        Status: "Completed",
        RepoURL: "https://github.com/pen-testing-framework",
        DemoURL: "https://pen-test-demo.com",
        ProgressPercentage: 100,
        CoverImage: "pentest_framework.png",
        Author: {
            AuthorID: 1,
            Name: "SecurityExpert",
            Email: "securityexpert@example.com"
        },
        Category: {
            CategoryID: 1,
            Name: "Cybersecurity Tools"
        },
        Tags: [
            "PenTesting",
            "Automation",
            "Framework"
        ],
        TotalLikes: 120
    },
    {
        ProjectID: 3,
        Title: "AI in Cyber Defense",
        Slug: "ai_in_cyber_defense",
        Description: "Research project exploring AI's role in cybersecurity defense.",
        StartDate: "2024-12-01",
        EndDate: "2025-07-01",
        Status: "In Progress",
        RepoURL: "https://github.com/ai-cyber-defense",
        DemoURL: "https://ai-defense-demo.com",
        ProgressPercentage: 40,
        CoverImage: "ai_cyber_defense.webp",
        Author: {
            AuthorID: 3,
            Name: "AIResearcher",
            Email: "airesearcher@example.com"
        },
        Category: {
            CategoryID: 2,
            Name: "AI and Machine Learning"
        },
        Tags: [
            "AI",
            "CyberDefense",
            "MachineLearning"
        ],
        TotalLikes: 55
    }
]
const podcastData = [
    {
        PodcastID: 1,
        Title: "Since Morning",
        Slug: "since_morning",
        Description: "An early morning cybersecurity discussion on threat intelligence and daily routines of a cyber professional.",
        CoverImage: "morning_cyber_talk.jpg",
        Duration: "00:42:18",
        EpisodeNumber: 1,
        AudioURL: "/podcast/sincemorning.mp3",
        DatePublished: "2025-04-10T09:00:00",
        Status: "Published",
        Category: {
            CategoryID: 2,
            Name: "Cybersecurity Talk"
        },
        Speakers: [
            {
                SpeakerID: 1,
                Name: "Simple0x0",
                Bio: "Cybersecurity analyst, researcher and community builder. Passionate about simplifying tech.",
                ProfileURL: "https://example.com/speakers/simple0x0"
            },
            {
                SpeakerID: 2,
                Name: "CyberZen",
                Bio: "Infosec strategist and host of various cybersecurity podcasts.",
                ProfileURL: "https://example.com/speakers/cyberzen"
            }
        ]
    },
    {
        PodcastID: 2,
        Title: "Since Morning",
        Slug: "since_morning",
        Description: "An early morning cybersecurity discussion on threat intelligence and daily routines of a cyber professional.",
        CoverImage: "morning_cyber_talk.jpg",
        Duration: "00:42:18",
        EpisodeNumber: 2,
        AudioURL: "/podcast/sincemorning.mp3",
        DatePublished: "2025-04-10T09:00:00",
        Status: "Published",
        Category: {
            CategoryID: 2,
            Name: "Cybersecurity Talk"
        },
        Speakers: [
            {
                SpeakerID: 1,
                Name: "Simple0x0",
                Bio: "Cybersecurity analyst, researcher and community builder. Passionate about simplifying tech.",
                ProfileURL: "https://example.com/speakers/simple0x0"
            },
            {
                SpeakerID: 2,
                Name: "CyberZen",
                Bio: "Infosec strategist and host of various cybersecurity podcasts.",
                ProfileURL: "https://example.com/speakers/cyberzen"
            }
        ]
    },
    {
        PodcastID: 3,
        Title: "Since Morning",
        Slug: "since_morning",
        Description: "An early morning cybersecurity discussion on threat intelligence and daily routines of a cyber professional.",
        CoverImage: "morning_cyber_talk.jpg",
        Duration: "00:42:18",
        EpisodeNumber: 3,
        AudioURL: "/podcast/sincemorning.mp3",
        DatePublished: "2025-04-10T09:00:00",
        Status: "Published",
        Category: {
            CategoryID: 2,
            Name: "Cybersecurity Talk"
        },
        Speakers: [
            {
                SpeakerID: 1,
                Name: "Simple0x0",
                Bio: "Cybersecurity analyst, researcher and community builder. Passionate about simplifying tech.",
                ProfileURL: "https://example.com/speakers/simple0x0"
            },
            {
                SpeakerID: 2,
                Name: "CyberZen",
                Bio: "Infosec strategist and host of various cybersecurity podcasts.",
                ProfileURL: "https://example.com/speakers/cyberzen"
            }
        ]
    },
    {
        PodcastID: 4,
        Title: "Since Morning",
        Slug: "since_morning",
        Description: "An early morning cybersecurity discussion on threat intelligence and daily routines of a cyber professional.",
        CoverImage: "morning_cyber_talk.jpg",
        Duration: "00:42:18",
        EpisodeNumber: 4,
        AudioURL: "/podcast/sincemorning.mp3",
        DatePublished: "2025-04-10T09:00:00",
        Status: "Published",
        Category: {
            CategoryID: 2,
            Name: "Cybersecurity Talk"
        },
        Speakers: [
            {
                SpeakerID: 1,
                Name: "Simple0x0",
                Bio: "Cybersecurity analyst, researcher and community builder. Passionate about simplifying tech.",
                ProfileURL: "https://example.com/speakers/simple0x0"
            },
            {
                SpeakerID: 2,
                Name: "CyberZen",
                Bio: "Infosec strategist and host of various cybersecurity podcasts.",
                ProfileURL: "https://example.com/speakers/cyberzen"
            }
        ]
    }
    
]
const achievementsData = [
    {
      AchievementID: 2,
      Title: "Won HackThePort CTF",
      Description: "Team Simple secured 1st place at the HackThePort Capture The Flag event.",
      DateAchieved: "2025-04-01",
      Image: "ctf_winner.jpg",
      ReferenceURL: "#"
    },
    {
      AchievementID: 1,
      Title: "Top 5 Cybersecurity Clubs in West Africa",
      Description: "Team Simple was recognized among the top 5 cybersecurity clubs in West Africa.",
      DateAchieved: "2025-03-20",
      Image: "top_5_west_africa.jpg",
      ReferenceURL: "#"
    }
];
  
const latestContentData = [
    {
      LatestContentID: 1,
      ContentType: 'Blog',
      ContentID: 21,
      Image: '../sudohack.jpg',
      Summary: 'Insights into advanced sudo exploitation and mitigation techniques.'
    },
    {
      LatestContentID: 2,
      ContentType: 'Podcast',
      ContentID: 8,
      Image: 'morning_cyber_talk.jpg',
      Summary: 'A casual morning podcast on trending cybersecurity topics.'
    },
    {
      LatestContentID: 3,
      ContentType: 'WriteUp',
      ContentID: 35,
      Image: 'htb_001_image.png',
      Summary: 'Walkthrough of HTB’s retired machine covering privilege escalation.'
    },
    {
      LatestContentID: 4,
      ContentType: 'Achievement',
      ContentID: 3,
      Image: 'ctf_winner.jpg',
      Summary: 'Team Simple wins 1st place at regional Capture The Flag event.'
    },
    {
      LatestContentID: 5,
      ContentType: 'Project',
      ContentID: 14,
      Image: 'ai_cyber_defense.webp',
      Summary: 'Development of AI-driven defense system for threat detection.'
    }
  ];
  
const eventData = [
    {
      EventID: 1,
      EventID: 18,
      Image: '../cyber_week_conf2025.jpg',
      Summary: 'An annual cybersecurity week with talks, challenges, and networking.'
    },
    {
      EventID: 2,
      EventID: 17,
      Image: 'ctf_battle_spring.jpg',
      Summary: 'Spring edition of our team vs team Capture The Flag showdown.'
    },
    {
      EventID: 3,
      EventID: 16,
      Image: 'simple_meetup_dakar.jpg',
      Summary: 'Team Simple community meetup in Dakar for collaboration and tech sharing.'
    },
    {
      EventID: 4,
      EventID: 15,
      Image: 'infosec_training_day.jpg',
      Summary: 'One-day infosec training workshop for students and professionals.'
    },
    {
      EventID: 5,
      EventID: 14,
      Image: 'cyber-security-events.webp',
      Summary: 'Awareness program on cybersecurity for local high school students.'
    }
];
  
  



export default blogData;
export { writeupData, projectData, podcastData, achievementsData, latestContentData, eventData };